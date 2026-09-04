-- Register the Gestão Exclusiva seller-capture landing page for CRM attribution.
INSERT INTO "LandingPage" (
  "id", "name", "slug", "publicPath", "type", "status", "formKey", "publishedAt", "createdAt", "updatedAt"
)
VALUES (
  'landing-gestao-exclusiva',
  'Gestão Exclusiva de Venda',
  'gestao-exclusiva',
  '/gestao-exclusiva',
  'CAPTURE',
  'PUBLISHED',
  'seller-capture',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;
