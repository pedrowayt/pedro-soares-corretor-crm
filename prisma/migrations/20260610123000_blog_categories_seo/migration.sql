-- CreateTable
CREATE TABLE "BlogCategory" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogCategory_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "BlogPost"
  ADD COLUMN "categoryId" TEXT,
  ADD COLUMN "seoTitle" TEXT,
  ADD COLUMN "seoDescription" TEXT,
  ADD COLUMN "seoKeyword" TEXT,
  ADD COLUMN "seoOgImageUrl" TEXT,
  ADD COLUMN "seoNoIndex" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "BlogCategory_slug_key" ON "BlogCategory"("slug");

-- CreateIndex
CREATE INDEX "BlogCategory_active_displayOrder_idx" ON "BlogCategory"("active", "displayOrder");

-- CreateIndex
CREATE INDEX "BlogPost_categoryId_idx" ON "BlogPost"("categoryId");

-- AddForeignKey
ALTER TABLE "BlogPost" ADD CONSTRAINT "BlogPost_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "BlogCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Seed baseline categories for existing and future editorial posts.
INSERT INTO "BlogCategory" ("id", "slug", "label", "description", "displayOrder", "updatedAt")
VALUES
  ('blog-cat-mercado-imobiliario', 'mercado-imobiliario', 'Mercado imobiliário', 'Notícias e análises gerais do mercado imobiliário em Palmas e Tocantins.', 10, CURRENT_TIMESTAMP),
  ('blog-cat-lancamentos', 'lancamentos', 'Lançamentos', 'Novos empreendimentos, pré-lançamentos e oportunidades na planta.', 20, CURRENT_TIMESTAMP),
  ('blog-cat-bairros-de-palmas', 'bairros-de-palmas', 'Bairros de Palmas', 'Guias e leituras sobre bairros, regiões e infraestrutura de Palmas.', 30, CURRENT_TIMESTAMP),
  ('blog-cat-leiloes', 'leiloes', 'Leilões', 'Conteúdos sobre imóveis em leilão, riscos, oportunidades e análise documental.', 40, CURRENT_TIMESTAMP),
  ('blog-cat-compra-e-venda', 'compra-e-venda', 'Compra e venda', 'Orientações práticas para compradores, vendedores e negociação imobiliária.', 50, CURRENT_TIMESTAMP),
  ('blog-cat-investimento', 'investimento', 'Investimento', 'Conteúdos sobre rentabilidade, liquidez, valorização e tomada de decisão.', 60, CURRENT_TIMESTAMP)
ON CONFLICT ("slug") DO NOTHING;

UPDATE "BlogPost"
SET "categoryId" = 'blog-cat-mercado-imobiliario'
WHERE "categoryId" IS NULL;
