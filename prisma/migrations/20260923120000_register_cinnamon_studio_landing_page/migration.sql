-- Register the Cinnamon Studio campaign landing page for CRM attribution.
-- The campaign remains a pre-cadastro because the official material states
-- that the memorial of incorporation is not registered yet.
INSERT INTO "LandingPage" ("id", "name", "slug", "publicPath", "type", "status", "formKey", "publishedAt", "createdAt", "updatedAt")
VALUES (
  'landing-cinnamon-studio',
  'Cinnamon Studio',
  'cinnamon-studio',
  '/cinnamon-studio',
  'CAMPAIGN',
  'PUBLISHED',
  'development-interest',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;
