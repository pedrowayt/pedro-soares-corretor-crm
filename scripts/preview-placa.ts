/**
 * Local preview for the property sign ("placa") PDF.
 *
 * Generates one PDF per size (residencial, terreno, premium) with mock data
 * so you can iterate on the layout without DB, auth, or even running the dev
 * server. The PDFs are written to /tmp and opened in Preview on macOS.
 *
 * Usage:
 *   npm run placa:preview
 *   npm run placa:preview -- --size residencial   # only one size
 *   npm run placa:preview -- --price              # show price instead of "Consulte valor"
 */

import { writeFile, readFile } from "node:fs/promises";
import { execSync } from "node:child_process";
import path from "node:path";
import { pdf } from "@react-pdf/renderer";
import QRCode from "qrcode";
import { Placa, type PlacaCorretor, type PlacaProperty } from "../lib/placa/Placa";
import { PLACA_SIZES, type PlacaSize } from "../lib/placa/templates";

const args = process.argv.slice(2);
const showPrice = args.includes("--price");
const sizeArg = args[args.indexOf("--size") + 1];
const scenarioArg = args[args.indexOf("--scenario") + 1];
const sizes: PlacaSize[] =
  sizeArg && sizeArg in PLACA_SIZES ? [sizeArg as PlacaSize] : (Object.keys(PLACA_SIZES) as PlacaSize[]);

type Scenario = "default" | "long" | "lote" | "minimal";
const ALL_SCENARIOS: Scenario[] = ["default", "long", "lote", "minimal"];
const scenarios: Scenario[] =
  scenarioArg === "all"
    ? ALL_SCENARIOS
    : scenarioArg && (ALL_SCENARIOS as string[]).includes(scenarioArg)
      ? [scenarioArg as Scenario]
      : ["default"];

const MOCK_CORRETOR: PlacaCorretor = {
  name: "Pedro Soares",
  creci: "5861-TO",
  phone: "(63) 98484-5101",
  instagramHandle: "pedrosoarespmw",
  site: "www.pedrosoarescorretor.com.br"
};

function mockProperty(scenario: Scenario): PlacaProperty {
  switch (scenario) {
    case "long":
      // Stress test: very long title, long location, all specs, two badges.
      return {
        title: "Casa moderna alto padrão com 4 suítes, piscina aquecida e vista panorâmica para o lago em condomínio fechado",
        type: "CASA",
        purpose: "VENDA",
        city: "São Sebastião do Caí",
        district: "Setor Aeroporto Industrial Centro Sul",
        bedrooms: 4,
        suites: 4,
        bathrooms: 5,
        parkingSpaces: 4,
        areaM2: 480,
        landAreaM2: 1200,
        priceFormatted: showPrice ? "R$ 4.890.000" : null,
        badges: ["OPORTUNIDADE", "LANÇAMENTO"]
      };
    case "lote":
      // Land: no bedroom/suite/bathroom, only area + land.
      return {
        title: "Lote comercial esquina",
        type: "LOTE",
        purpose: "VENDA",
        city: "Palmas",
        district: "Plano Diretor Sul",
        bedrooms: null,
        suites: null,
        bathrooms: null,
        parkingSpaces: null,
        areaM2: null,
        landAreaM2: 800,
        priceFormatted: showPrice ? "R$ 380.000" : null,
        badges: []
      };
    case "minimal":
      // Sparse data: only a couple of fields populated.
      return {
        title: "Apartamento",
        type: "APARTAMENTO",
        purpose: "LOCACAO",
        city: "Goiânia",
        district: "Centro",
        bedrooms: 2,
        suites: null,
        bathrooms: 1,
        parkingSpaces: 1,
        areaM2: 65,
        landAreaM2: null,
        priceFormatted: showPrice ? "R$ 1.800" : null,
        badges: []
      };
    case "default":
    default:
      return {
        title: "Casa moderna 3 suítes em Setor Bueno",
        type: "CASA",
        purpose: "VENDA",
        city: "Goiânia",
        district: "Setor Bueno",
        bedrooms: 3,
        suites: 3,
        bathrooms: 4,
        parkingSpaces: 2,
        areaM2: 240,
        landAreaM2: 360,
        priceFormatted: showPrice ? "R$ 1.250.000" : null,
        badges: ["OPORTUNIDADE"]
      };
  }
}

async function bufferToArrayBuffer(buf: Buffer): Promise<ArrayBuffer> {
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
}

async function streamToBuffer(stream: NodeJS.ReadableStream | Buffer): Promise<Buffer> {
  if (Buffer.isBuffer(stream)) return stream;
  const chunks: Buffer[] = [];
  for await (const chunk of stream as AsyncIterable<Buffer | string>) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

async function main() {
  const logoBuffer = await readFile(path.join(process.cwd(), "public/brand/logo-home-2026.png"));

  // Tries the test photo first (drop a PNG here to preview your real portrait),
  // then falls back to the bundled pedro-portrait files.
  const portraitCandidates = [
    "public/brand/eu.png",
    "public/brand/placa-corretor.png",
    "public/brand/pedro-portrait-1.png",
    "public/brand/pedro-portrait-2.png",
    "public/brand/pedro-portrait-3.png"
  ];
  let corretorPhotoBuffer: Buffer | null = null;
  for (const candidate of portraitCandidates) {
    try {
      corretorPhotoBuffer = await readFile(path.join(process.cwd(), candidate));
      console.log(`  using corretor photo: ${candidate}`);
      break;
    } catch {
      /* try next */
    }
  }

  const qrSrc = await QRCode.toDataURL("https://www.pedrosoarescorretor.com.br/imoveis/exemplo", {
    margin: 1,
    errorCorrectionLevel: "M",
    width: 600
  });

  for (const size of sizes) {
    for (const scenario of scenarios) {
      const meta = PLACA_SIZES[size];
      console.log(`→ rendering ${size} / ${scenario} (${meta.widthMm}×${meta.heightMm} mm)…`);

      const pdfStream = await pdf(
        Placa({
          size,
          property: mockProperty(scenario),
          corretor: MOCK_CORRETOR,
          logoSrc: logoBuffer,
          corretorPhotoSrc: corretorPhotoBuffer,
          qrSrc
        })
      ).toBuffer();

      const buffer = await streamToBuffer(pdfStream);
      const ab = await bufferToArrayBuffer(buffer);

      const outPath = `/tmp/placa-preview-${size}-${scenario}${showPrice ? "-com-preco" : ""}.pdf`;
      await writeFile(outPath, Buffer.from(ab));
      console.log(`  ✓ ${outPath}`);

      if (process.platform === "darwin") {
        try {
          execSync(`open "${outPath}"`);
        } catch {
          /* ignore */
        }
      }
    }
  }

  console.log("done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
