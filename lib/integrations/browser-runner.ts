import chromium from "@sparticuz/chromium";
import puppeteer, { type Browser, type Page } from "puppeteer-core";
import type { CapturePortalProviderId } from "@/lib/integrations/olx-capture";

export type BrowserCapturedSearchItem = {
  sourceUrl: string;
  title: string;
  description: string;
  price: string;
  location: string;
  imageUrl: string;
  rawText: string;
  isPrivateSeller: boolean;
};

export type BrowserCapturedSearchResult = {
  requestedUrl: string;
  finalUrl: string;
  items: BrowserCapturedSearchItem[];
};

const BROWSER_USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36";
const BROWSER_RUNTIME_HELPERS = `
  Object.defineProperty(globalThis, "__name", { configurable: true, value: function(target) { return target; } });
`;

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
  await page.evaluateOnNewDocument(`${BROWSER_RUNTIME_HELPERS}
    Object.defineProperty(navigator, "webdriver", { get: () => false });
  `);
}

async function prepareRuntimeHelpers(page: Page) {
  await page.evaluate(BROWSER_RUNTIME_HELPERS);
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
    const details = message
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .slice(0, 8)
      .join(" | ")
      .slice(0, 900);
    return new Error(`Chromium não iniciou no servidor por dependência Linux ausente. Confirme o deploy do Dockerfile/nixpacks.toml. Detalhe: ${details || message}`);
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
    await prepareRuntimeHelpers(page);
    await autoScroll(page);

    const items = await page.evaluate(
      ({ limit: pageLimit, expectedProvider: pageProvider }) => {
        const seen = new Set<string>();
        const clean = (value: string | null | undefined) => (value ?? "").replace(/\u00a0/g, " ").replace(/[ \t\r\f]+/g, " ").trim();
        const compact = (value: string | null | undefined) => clean(value).replace(/\n+/g, " ");
        const parsePriceNumber = (value: string) => {
          const millionMatch = value.match(/R\$\s*([\d.,]+)\s*(?:milh[aã]o|milh[oõ]es)/i);
          if (millionMatch) {
            const normalized = millionMatch[1].includes(",")
              ? millionMatch[1].replace(/\./g, "").replace(",", ".")
              : millionMatch[1].replace(/\.(?=\d{3}(?:\D|$))/g, "");
            const parsed = Number(normalized);
            return Number.isFinite(parsed) ? parsed * 1_000_000 : 0;
          }

          const thousandMatch = value.match(/R\$\s*([\d.,]+)\s*mil\b/i);
          if (thousandMatch) {
            const normalized = thousandMatch[1].includes(",")
              ? thousandMatch[1].replace(/\./g, "").replace(",", ".")
              : thousandMatch[1].replace(/\.(?=\d{3}(?:\D|$))/g, "");
            const parsed = Number(normalized);
            return Number.isFinite(parsed) ? (parsed < 10_000 ? parsed * 1_000 : parsed) : 0;
          }

          const match = value.match(/R\$\s*[\d.,]+/i);
          if (!match) return 0;
          const numberText = match[0].replace(/[^\d,.]/g, "");
          const normalized = numberText.includes(",")
            ? numberText.replace(/\./g, "").replace(",", ".")
            : numberText.replace(/\.(?=\d{3}(?:\D|$))/g, "");
          const parsed = Number(normalized);
          return Number.isFinite(parsed) ? parsed : 0;
        };
        const choosePrice = (lines: string[], rawText: string) => {
          const candidates: Array<{ label: string; value: number; feeLike: boolean }> = [];
          for (const line of lines.length ? lines : [rawText]) {
            const matches = line.match(/R\$\s*[\d.,]+(?:\s*(?:mil\b|milh[aã]o|milh[oõ]es))?/gi) ?? [];
            const feeLike = /condom[ií]nio|iptu|taxa|seguro|m[²2]|por\s*m[²2]/i.test(line);
            for (const label of matches) {
              const value = parsePriceNumber(label);
              if (value > 0) candidates.push({ label: clean(label), value, feeLike });
            }
          }
          const preferred = candidates.filter((candidate) => !candidate.feeLike);
          const pool = preferred.length ? preferred : candidates;
          return pool.sort((first, second) => second.value - first.value)[0]?.label ?? "";
        };
        const isNoiseLine = (line: string) =>
          !line ||
          /^R\$/i.test(line) ||
          /condom[ií]nio|iptu|patrocinado|favorito|online|ver telefone|whatsapp|anunciante|publicado/i.test(line);
        const chooseTitle = (anchor: HTMLAnchorElement, lines: string[]) => {
          const anchorText = compact(anchor.innerText || anchor.getAttribute("aria-label") || anchor.getAttribute("title") || "");
          if (anchorText && !isNoiseLine(anchorText) && anchorText.length >= 3 && anchorText.length <= 180) return anchorText;
          return lines.find((line) => !isNoiseLine(line) && !/palmas|\bto\b|setor|jardim|centro/i.test(line)) ?? document.title;
        };
        const chooseDescription = (lines: string[], title: string, location: string) =>
          lines
            .filter((line) => line !== title && line !== location && !/^R\$/i.test(line) && !/favorito|patrocinado|online|ver telefone/i.test(line))
            .slice(0, 8)
            .join("\n")
            .slice(0, 1200);
        const firstImageUrl = (box: Element) => {
          const image = box.querySelector<HTMLImageElement>("img[src],img[srcset]");
          const raw =
            image?.currentSrc ||
            image?.src ||
            image?.getAttribute("data-src") ||
            image?.getAttribute("data-original") ||
            image?.srcset?.split(",")[0]?.trim().split(/\s+/)[0] ||
            "";
          if (!raw || raw.startsWith("data:")) return "";
          try {
            const url = new URL(raw, window.location.href);
            return ["http:", "https:"].includes(url.protocol) ? url.toString() : "";
          } catch {
            return "";
          }
        };
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
        const detectPrivateSeller = (text: string) => {
          const haystack = clean(text).toLowerCase();
          if (!haystack) return false;
          const brokerSignal =
            /imobili[aá]ria|im[oó]veis|corretor(?:a)?|creci|consultor(?:a)? imobili[aá]ri[oa]|remax|re\/max|lopes|ltda|neg[oó]cios imobili[aá]rios|anunciante profissional/.test(
              haystack
            );
          const privateSignal = /propriet[aá]ri[oa]|particular|direto com|direto c\/?|dono|venda direta/.test(haystack);
          return privateSignal || !brokerSignal;
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
              const rawBlockText = ((box as HTMLElement).innerText || anchor.textContent || "").replace(/\u00a0/g, " ");
              const lines = rawBlockText.split(/\n+/).map(clean).filter(Boolean);
              const rawText = lines.join("\n");
              const price = choosePrice(lines, rawText);
              const title = chooseTitle(anchor, lines);
              const location = lines.find((line) => /palmas|\bto\b|setor|plano diretor|jardim|centro/i.test(line)) ?? "";
              const imageUrl = firstImageUrl(box);
              const description = chooseDescription(lines, title, location);
              return [
                {
                  sourceUrl: url.href,
                  title: title.slice(0, 180),
                  description,
                  price,
                  location,
                  imageUrl,
                  rawText: rawText.slice(0, 1200),
                  isPrivateSeller: detectPrivateSeller(rawText)
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
