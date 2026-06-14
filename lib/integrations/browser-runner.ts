import chromium from "@sparticuz/chromium";
import puppeteer, { type Browser, type Page } from "puppeteer-core";
import type { CapturePortalProviderId } from "@/lib/integrations/olx-capture";

export type BrowserCapturedSearchItem = {
  sourceUrl: string;
  title: string;
  price: string;
  location: string;
  rawText: string;
};

export type BrowserCapturedSearchResult = {
  requestedUrl: string;
  finalUrl: string;
  items: BrowserCapturedSearchItem[];
};

const BROWSER_USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36";

function providerFromUrl(urlValue: string): CapturePortalProviderId | null {
  try {
    const hostname = new URL(urlValue).hostname.toLowerCase();
    if (hostname.includes("olx.com.br")) return "olx";
    if (hostname.includes("zapimoveis.com.br")) return "zap";
    if (hostname.includes("imovelweb.com.br")) return "imovelweb";
    if (hostname.includes("chavesnamao.com.br")) return "chaves-na-mao";
    if (hostname.includes("facebook.com")) return "facebook-marketplace";
  } catch {
    return null;
  }
  return null;
}

async function launchBrowser() {
  const executablePath = await chromium.executablePath();
  return puppeteer.launch({
    args: [
      ...chromium.args,
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-blink-features=AutomationControlled",
      "--disable-dev-shm-usage",
      "--disable-features=IsolateOrigins,site-per-process"
    ],
    defaultViewport: { width: 1365, height: 900 },
    executablePath,
    headless: true,
    userDataDir: "/tmp/chromium-profile"
  });
}

async function preparePage(page: Page) {
  await page.setUserAgent(BROWSER_USER_AGENT);
  await page.setExtraHTTPHeaders({
    "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7"
  });
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => false });
  });
}

async function autoScroll(page: Page) {
  for (let index = 0; index < 4; index += 1) {
    await page.evaluate(() => window.scrollBy(0, Math.floor(window.innerHeight * 0.9)));
    await new Promise((resolve) => setTimeout(resolve, 700));
  }
}

function normalizeBrowserError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  if (/Failed to launch the browser process|error while loading shared libraries|libnss3|libnspr4/i.test(message)) {
    const firstLine = message.split("\n").map((line) => line.trim()).find(Boolean);
    return new Error(`Chromium não iniciou no servidor por dependência Linux ausente. Confirme o deploy do nixpacks.toml. Detalhe: ${firstLine ?? message}`);
  }

  return error;
}

export async function scrapePortalSearchWithBrowser(
  searchUrl: string,
  maxResults: number,
  providerId?: string | null
): Promise<BrowserCapturedSearchResult> {
  const expectedProvider = providerId ?? providerFromUrl(searchUrl);
  const limit = Math.max(1, Math.min(60, Math.round(maxResults || 12)));
  let browser: Browser | null = null;

  try {
    browser = await launchBrowser();
    const page = await browser.newPage();
    await preparePage(page);
    await page.goto(searchUrl, { waitUntil: "domcontentloaded", timeout: 45_000 });
    await page.waitForNetworkIdle({ idleTime: 900, timeout: 15_000 }).catch(() => null);
    await autoScroll(page);

    const items = await page.evaluate(
      ({ limit: pageLimit, expectedProvider: pageProvider }) => {
        const seen = new Set<string>();
        const clean = (value: string | null | undefined) => (value ?? "").replace(/\s+/g, " ").trim();
        const detectProvider = (url: URL) => {
          const host = url.hostname.toLowerCase();
          if (host.includes("olx.com.br")) return "olx";
          if (host.includes("zapimoveis.com.br")) return "zap";
          if (host.includes("imovelweb.com.br")) return "imovelweb";
          if (host.includes("chavesnamao.com.br")) return "chaves-na-mao";
          if (host.includes("facebook.com")) return "facebook-marketplace";
          return "";
        };
        const isAd = (url: URL) => {
          const provider = detectProvider(url);
          if (pageProvider && provider !== pageProvider) return false;
          const path = decodeURIComponent(url.pathname);
          if (provider === "olx") return /(?:-|\/)\d{5,}/.test(path);
          if (provider === "zap") return /\/imovel\/|\/imoveis\/|id-\d{5,}|-\d{7,}/.test(path);
          if (provider === "imovelweb") return /\/propriedades\/|\/imovel\/|-\d{7,}/.test(path);
          if (provider === "chaves-na-mao") return /\/imovel\/|\/imoveis\/|\/casa-|\/apartamento-|\/terreno-|\/sobrado-|\/chacara|-?\d{5,}/.test(path);
          if (provider === "facebook-marketplace") return /\/marketplace\/item\/\d+/.test(path);
          return false;
        };

        return Array.from(document.querySelectorAll<HTMLAnchorElement>("a[href]"))
          .flatMap((anchor) => {
            try {
              const url = new URL(anchor.href, window.location.href);
              url.hash = "";
              url.search = "";
              if (!isAd(url) || seen.has(url.href)) return [];
              seen.add(url.href);
              const box = anchor.closest("article,li,section,div") ?? anchor;
              const rawText = clean((box as HTMLElement).innerText || anchor.textContent || "");
              const lines = rawText.split(/\n+/).map(clean).filter(Boolean);
              const price = rawText.match(/R\$\s*[\d.]+(?:,\d{2})?/i)?.[0] ?? "";
              const title =
                clean(anchor.innerText) ||
                lines.find((line) => line && !/^R\$/i.test(line) && !/patrocinado|favorito|online/i.test(line)) ||
                document.title;
              const location = lines.find((line) => /palmas|\bto\b|setor|plano diretor|jardim|centro/i.test(line)) ?? "";
              return [
                {
                  sourceUrl: url.href,
                  title: title.slice(0, 180),
                  price,
                  location,
                  rawText: rawText.slice(0, 1200)
                }
              ];
            } catch {
              return [];
            }
          })
          .slice(0, pageLimit);
      },
      { limit, expectedProvider }
    );

    return {
      requestedUrl: searchUrl,
      finalUrl: page.url(),
      items
    };
  } catch (error) {
    throw normalizeBrowserError(error);
  } finally {
    if (browser) await browser.close().catch(() => null);
  }
}
