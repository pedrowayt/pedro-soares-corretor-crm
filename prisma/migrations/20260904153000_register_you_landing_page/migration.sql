-- Register the YOU by Fama campaign landing page for CRM attribution.
INSERT INTO "LandingPage" (
  "id", "name", "slug", "publicPath", "type", "status", "formKey", "publishedAt", "createdAt", "updatedAt"
)
VALUES (
  'landing-you-by-fama',
  'YOU by Fama',
  'you-by-fama',
  '/you',
  'CAMPAIGN',
  'PUBLISHED',
  'development-interest',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;
