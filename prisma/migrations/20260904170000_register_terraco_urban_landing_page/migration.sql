-- Register the Terraço Urban campaign landing page for CRM attribution.
-- The legacy Development record is intentionally not linked until its official
-- units, pricing and publication data are entered in the CRM.
INSERT INTO "LandingPage" ("id", "name", "slug", "publicPath", "type", "status", "formKey", "publishedAt", "createdAt", "updatedAt")
VALUES (
  'landing-terraco-urban',
  'Terraço Urban',
  'terraco-urban',
  '/terraco-urban',
  'CAMPAIGN',
  'PUBLISHED',
  'development-interest',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;
