"use client";

const WATERMARK_SRC = "/brand/watermark-logo.png";
const DEFAULT_OPACITY = 0.32;
const DEFAULT_QUALITY = 0.9;

type WatermarkOptions = {
  fileName?: string;
  opacity?: number;
};

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Não foi possível carregar a imagem."));
    image.src = src;
  });
}

async function loadImageFromBlob(blob: Blob) {
  const objectUrl = URL.createObjectURL(blob);
  try {
    return await loadImage(objectUrl);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function getOutputType(inputType: string) {
  return inputType === "image/png" ? "image/png" : "image/jpeg";
}

function getOutputName(inputName: string, outputType: string) {
  if (outputType === "image/png") {
    return inputName.replace(/\.(jpe?g|webp)$/i, ".png");
  }

  return inputName.replace(/\.(png|webp)$/i, ".jpg");
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
          return;
        }
        reject(new Error("Não foi possível gerar a imagem com marca d'água."));
      },
      type,
      DEFAULT_QUALITY
    );
  });
}

export async function applyWatermarkToImage(input: File | Blob, options: WatermarkOptions = {}) {
  if (input.type && !input.type.startsWith("image/")) {
    throw new Error("Arquivo inválido para marca d'água.");
  }

  const [sourceImage, watermarkImage] = await Promise.all([
    loadImageFromBlob(input),
    loadImage(WATERMARK_SRC)
  ]);

  const canvas = document.createElement("canvas");
  canvas.width = sourceImage.naturalWidth;
  canvas.height = sourceImage.naturalHeight;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Não foi possível preparar a imagem com marca d'água.");
  }

  context.drawImage(sourceImage, 0, 0, canvas.width, canvas.height);

  const maxWatermarkWidth = canvas.width * 0.38;
  const desiredWatermarkWidth = Math.min(canvas.width * 0.24, 420);
  const watermarkWidth = Math.max(
    Math.min(desiredWatermarkWidth, maxWatermarkWidth),
    Math.min(90, maxWatermarkWidth)
  );
  const watermarkHeight = watermarkWidth * (watermarkImage.naturalHeight / watermarkImage.naturalWidth);
  const padding = Math.max(Math.min(canvas.width, canvas.height) * 0.035, 18);
  const x = Math.max(canvas.width - watermarkWidth - padding, padding);
  const y = Math.max(canvas.height - watermarkHeight - padding, padding);

  context.save();
  context.globalAlpha = options.opacity ?? DEFAULT_OPACITY;
  context.drawImage(watermarkImage, x, y, watermarkWidth, watermarkHeight);
  context.restore();

  const outputType = getOutputType(input.type);
  const outputBlob = await canvasToBlob(canvas, outputType);
  const inputName = options.fileName ?? ("name" in input ? input.name : "imagem.png");
  const outputName = getOutputName(inputName, outputType);

  return new File([outputBlob], outputName, {
    type: outputType,
    lastModified: Date.now()
  });
}
