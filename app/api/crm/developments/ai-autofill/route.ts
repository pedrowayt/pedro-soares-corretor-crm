import { z } from "zod";
import { PDFParse } from "pdf-parse";
import { fail, ok, parseJsonSafely } from "@/lib/api/http";
import { requireCrmWriteAccess } from "@/lib/auth/permissions";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_SOURCE_CHARS = 120_000;
const MAX_PDF_BYTES = 20 * 1024 * 1024;
const MAX_PDF_PAGES = 40;
const MIN_PDF_TEXT_CHARS = 80;
const OPENAI_MODEL = process.env.OPENAI_AUTOFILL_MODEL || process.env.OPENAI_MODEL || "gpt-5.4-mini";

const propertyTypeValues = ["APARTAMENTO", "CASA", "LOTE", "SALA_COMERCIAL", "STUDIO", "COBERTURA"] as const;
const stageValues = [
  "PRE_LAUNCH",
  "LAUNCH",
  "SALES",
  "FOUNDATION_COMPLETED",
  "CONSTRUCTION",
  "ADVANCED_STRUCTURE",
  "FINISHING",
  "READY_TO_MOVE",
  "DELIVERED"
] as const;
const publicationStatusValues = ["DRAFT", "REVIEW", "PUBLISHED", "ARCHIVED"] as const;
const unitCategoryValues = [
  "STUDIO",
  "UM_QUARTO",
  "DOIS_QUARTOS",
  "TRES_QUARTOS",
  "QUATRO_QUARTOS",
  "GARDEN",
  "COBERTURA",
  "DUPLEX",
  "SALA_COMERCIAL"
] as const;
const appreciationPotentialValues = ["BAIXO", "MEDIO", "ALTO", "MUITO_ALTO"] as const;

const nullableString = z.string().nullable();
const nullableNumber = z.number().nullable();
const nullableBoolean = z.boolean().nullable();

const aiAutofillFieldsSchema = z.object({
  title: nullableString,
  slug: nullableString,
  summary: nullableString,
  tagline: nullableString,
  description: nullableString,
  propertyType: z.enum(propertyTypeValues).nullable(),
  stage: z.enum(stageValues).nullable(),
  status: z.enum(publicationStatusValues).nullable(),
  city: nullableString,
  district: nullableString,
  neighborhood: nullableString,
  address: nullableString,
  postalCode: nullableString,
  latitude: nullableNumber,
  longitude: nullableNumber,
  developerName: nullableString,
  builderName: nullableString,
  builderId: nullableString,
  deliveryDate: nullableString,
  constructionProgressPct: nullableNumber,
  appreciationPotential: z.enum(appreciationPotentialValues).nullable(),
  buyerProfile: nullableString,
  opportunityText: nullableString,
  showInvestmentPotentialBlock: nullableBoolean,
  startingPrice: nullableNumber,
  priceMax: nullableNumber,
  areaFromM2: nullableNumber,
  areaToM2: nullableNumber,
  landAreaM2: nullableNumber,
  bedroomsFrom: nullableNumber,
  bedroomsTo: nullableNumber,
  suitesFrom: nullableNumber,
  suitesTo: nullableNumber,
  bathroomsFrom: nullableNumber,
  bathroomsTo: nullableNumber,
  parkingFrom: nullableNumber,
  parkingTo: nullableNumber,
  towersCount: nullableNumber,
  floorsCount: nullableNumber,
  elevatorsCount: nullableNumber,
  totalUnits: nullableNumber,
  availableUnits: nullableNumber,
  incorporationRegistry: nullableString,
  hasPatrimonyOfAffectation: nullableBoolean,
  amenitiesText: nullableString,
  differentialsText: nullableString,
  projectText: nullableString,
  apartmentsText: nullableString,
  locationText: nullableString,
  locationHighlights: nullableString,
  referencePoints: nullableString,
  regionLiquidityNotes: nullableString,
  mapEmbedUrl: nullableString,
  tablePdfUrl: nullableString,
  whatsappMessageTemplate: nullableString,
  ctaPrimaryLabel: nullableString,
  ctaPrimaryUrl: nullableString,
  ctaSecondaryLabel: nullableString,
  ctaSecondaryUrl: nullableString,
  seoTitle: nullableString,
  seoDescription: nullableString,
  seoOgImageUrl: nullableString,
  seoKeyword: nullableString,
  seoNoIndex: nullableBoolean,
  isFeatured: nullableBoolean,
  displayOrder: nullableNumber,
  showPrice: nullableBoolean,
  showMap: nullableBoolean,
  showBuilder: nullableBoolean,
  showFloorplanTable: nullableBoolean,
  showWhatsappButton: nullableBoolean,
  isPublished: nullableBoolean
});

const aiAutofillUnitTypeSchema = z.object({
  name: z.string().nullable(),
  unitCategory: z.enum(unitCategoryValues).nullable(),
  bedrooms: nullableNumber,
  suites: nullableNumber,
  bathrooms: nullableNumber,
  parkingSpaces: nullableNumber,
  areaPrivateM2: nullableNumber,
  areaTotalM2: nullableNumber,
  initialPrice: nullableNumber,
  isAvailable: nullableBoolean,
  description: nullableString,
  position: nullableNumber
});

const aiAutofillResultSchema = z.object({
  fields: aiAutofillFieldsSchema,
  unitTypes: z.array(aiAutofillUnitTypeSchema),
  notes: z.array(z.string())
});

const stringFieldKeys = [
  "title",
  "slug",
  "summary",
  "tagline",
  "description",
  "city",
  "district",
  "neighborhood",
  "address",
  "postalCode",
  "developerName",
  "builderName",
  "builderId",
  "deliveryDate",
  "buyerProfile",
  "opportunityText",
  "incorporationRegistry",
  "amenitiesText",
  "differentialsText",
  "projectText",
  "apartmentsText",
  "locationText",
  "locationHighlights",
  "referencePoints",
  "regionLiquidityNotes",
  "mapEmbedUrl",
  "tablePdfUrl",
  "whatsappMessageTemplate",
  "ctaPrimaryLabel",
  "ctaPrimaryUrl",
  "ctaSecondaryLabel",
  "ctaSecondaryUrl",
  "seoTitle",
  "seoDescription",
  "seoOgImageUrl",
  "seoKeyword"
] as const;

const numberFieldKeys = [
  "latitude",
  "longitude",
  "constructionProgressPct",
  "startingPrice",
  "priceMax",
  "areaFromM2",
  "areaToM2",
  "landAreaM2",
  "bedroomsFrom",
  "bedroomsTo",
  "suitesFrom",
  "suitesTo",
  "bathroomsFrom",
  "bathroomsTo",
  "parkingFrom",
  "parkingTo",
  "towersCount",
  "floorsCount",
  "elevatorsCount",
  "totalUnits",
  "availableUnits",
  "displayOrder"
] as const;

const booleanFieldKeys = [
  "showInvestmentPotentialBlock",
  "hasPatrimonyOfAffectation",
  "seoNoIndex",
  "isFeatured",
  "showPrice",
  "showMap",
  "showBuilder",
  "showFloorplanTable",
  "showWhatsappButton",
  "isPublished"
] as const;

const enumFieldSchemas = {
  propertyType: { type: ["string", "null"], enum: [...propertyTypeValues, null] },
  stage: { type: ["string", "null"], enum: [...stageValues, null] },
  status: { type: ["string", "null"], enum: [...publicationStatusValues, null] },
  appreciationPotential: { type: ["string", "null"], enum: [...appreciationPotentialValues, null] }
} as const;

const aiFieldJsonProperties = {
  ...Object.fromEntries(stringFieldKeys.map((key) => [key, { type: ["string", "null"] }])),
  ...Object.fromEntries(numberFieldKeys.map((key) => [key, { type: ["number", "null"] }])),
  ...Object.fromEntries(booleanFieldKeys.map((key) => [key, { type: ["boolean", "null"] }])),
  ...enumFieldSchemas
};

const aiOutputJsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fields: {
      type: "object",
      additionalProperties: false,
      properties: aiFieldJsonProperties,
      required: Object.keys(aiFieldJsonProperties)
    },
    unitTypes: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          name: { type: ["string", "null"] },
          unitCategory: { type: ["string", "null"], enum: [...unitCategoryValues, null] },
          bedrooms: { type: ["number", "null"] },
          suites: { type: ["number", "null"] },
          bathrooms: { type: ["number", "null"] },
          parkingSpaces: { type: ["number", "null"] },
          areaPrivateM2: { type: ["number", "null"] },
          areaTotalM2: { type: ["number", "null"] },
          initialPrice: { type: ["number", "null"] },
          isAvailable: { type: ["boolean", "null"] },
          description: { type: ["string", "null"] },
          position: { type: ["number", "null"] }
        },
        required: [
          "name",
          "unitCategory",
          "bedrooms",
          "suites",
          "bathrooms",
          "parkingSpaces",
          "areaPrivateM2",
          "areaTotalM2",
          "initialPrice",
          "isAvailable",
          "description",
          "position"
        ]
      }
    },
    notes: {
      type: "array",
      items: { type: "string" }
    }
  },
  required: ["fields", "unitTypes", "notes"]
} as const;

function normalizeSourceText(input: string) {
  return input.replace(/\r\n/g, "\n").trim();
}

function isPdfFile(file: File, fileName: string) {
  return file.type === "application/pdf" || fileName.endsWith(".pdf");
}

function isTextFile(file: File, fileName: string) {
  return file.type.startsWith("text/") || fileName.endsWith(".txt");
}

function extractResponseText(payload: unknown) {
  if (!payload || typeof payload !== "object") return "";

  const direct = (payload as { output_text?: unknown }).output_text;
  if (typeof direct === "string") return direct;

  const output = (payload as { output?: unknown }).output;
  if (!Array.isArray(output)) return "";

  for (const item of output) {
    if (!item || typeof item !== "object") continue;
    const content = (item as { content?: unknown }).content;
    if (!Array.isArray(content)) continue;

    for (const contentItem of content) {
      if (!contentItem || typeof contentItem !== "object") continue;
      const text = (contentItem as { text?: unknown }).text;
      if (typeof text === "string" && text.trim()) return text;
    }
  }

  return "";
}

function buildPrompt(sourceText: string) {
  return `
Extraia e normalize os dados de um empreendimento imobiliario a partir do texto abaixo.

Regras:
- Responda em pt-BR.
- Use null quando o texto nao trouxer uma informacao factual.
- Nao invente endereco, preco, area, registro de incorporacao, prazo, coordenadas ou quantidade de unidades.
- Pode redigir summary, description, projectText, apartmentsText, locationText, locationHighlights, regionLiquidityNotes, seoTitle, seoDescription e seoKeyword a partir dos fatos do texto.
- Campos numericos devem vir como numero, sem "R$", "m2", pontos de milhar ou texto.
- O texto pode ter vindo de PDF, com quebras de linha, tabulacoes e colunas fora de ordem. Preserve fatos, mas normalize a estrutura.
- deliveryDate deve ser "YYYY-MM" quando houver mes/ano ou apenas ano claro; caso contrario use null.
- referencePoints deve ser uma string com uma linha por ponto no formato "Nome | Distancia | Tipo".
- amenitiesText e differentialsText devem ser strings com um item por linha.
- status deve ser "DRAFT" e isPublished deve ser false, salvo se o texto pedir publicacao imediata de forma explicita.
- builderId deve ser null; a interface tentara vincular pelo nome da construtora.
- Em unitTypes, inclua plantas, tipologias e faixas de preco detectadas. Se nao houver planta clara, retorne array vazio.

Texto:
${sourceText}
`.trim();
}

async function extractPdfText(file: File) {
  if (file.size > MAX_PDF_BYTES) {
    throw new Error("O PDF é muito grande para este preenchimento. Envie um arquivo de até 20 MB.");
  }

  const parser = new PDFParse({
    data: new Uint8Array(await file.arrayBuffer())
  });

  try {
    const result = await parser.getText({
      first: MAX_PDF_PAGES,
      pageJoiner: "\n\n--- página page_number de total_number ---\n\n"
    });
    const extractedText = normalizeSourceText(result.text);

    if (extractedText.length < MIN_PDF_TEXT_CHARS) {
      throw new Error("Não encontrei texto suficiente nesse PDF. Ele pode ser escaneado ou composto por imagens.");
    }

    const pageNote =
      result.total > MAX_PDF_PAGES
        ? `Texto extraído das primeiras ${MAX_PDF_PAGES} páginas de ${result.total} páginas do PDF.`
        : `Texto extraído de ${result.total} página(s) do PDF.`;

    return `${pageNote}\n\n${extractedText}`;
  } finally {
    await parser.destroy();
  }
}

async function readSourceText(request: Request) {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const pastedText = normalizeSourceText(String(formData.get("text") ?? ""));
    const uploaded = formData.get("file");
    let fileText = "";

    if (uploaded instanceof File && uploaded.size > 0) {
      const fileName = uploaded.name.toLowerCase();

      if (isPdfFile(uploaded, fileName)) {
        fileText = await extractPdfText(uploaded);
      } else if (isTextFile(uploaded, fileName)) {
        fileText = normalizeSourceText(await uploaded.text());
      } else {
        throw new Error("Envie um arquivo .txt, .pdf textual ou cole o texto do material.");
      }
    }

    return normalizeSourceText([pastedText, fileText].filter(Boolean).join("\n\n"));
  }

  const body = await request.json().catch(() => null);
  return normalizeSourceText(typeof body?.text === "string" ? body.text : "");
}

export async function POST(request: Request) {
  const { denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  if (!process.env.OPENAI_API_KEY) {
    return fail("OPENAI_API_KEY não configurada no ambiente do servidor.", 500);
  }

  let sourceText = "";
  try {
    sourceText = await readSourceText(request);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Arquivo inválido.", 400);
  }

  if (!sourceText) {
    return fail("Envie um texto ou arquivo .txt para preenchimento.", 400);
  }

  if (sourceText.length > MAX_SOURCE_CHARS) {
    return fail("O texto é muito grande para este preenchimento. Envie um arquivo menor ou divida o material.", 413);
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      input: [
        {
          role: "system",
          content:
            "Voce e um especialista em CRM imobiliario no Brasil. Extraia dados de empreendimentos com prudencia, mantendo campos factuais vazios quando nao houver evidencia no texto."
        },
        {
          role: "user",
          content: buildPrompt(sourceText)
        }
      ],
      text: {
        format: {
          type: "json_schema",
          name: "crm_development_autofill",
          schema: aiOutputJsonSchema,
          strict: true
        }
      },
      max_output_tokens: 7000
    })
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      typeof data?.error?.message === "string"
        ? data.error.message
        : "Falha ao consultar a IA para preenchimento.";
    return fail(message, response.status);
  }

  const responseText = extractResponseText(data);
  const json = parseJsonSafely<unknown>(responseText);

  if (!json) {
    return fail("A IA não retornou um JSON válido para o preenchimento.", 502);
  }

  const parsed = aiAutofillResultSchema.safeParse(json);
  if (!parsed.success) {
    return fail("A IA retornou campos fora do formato esperado.", 502, parsed.error.flatten());
  }

  return ok({ autofill: parsed.data });
}
