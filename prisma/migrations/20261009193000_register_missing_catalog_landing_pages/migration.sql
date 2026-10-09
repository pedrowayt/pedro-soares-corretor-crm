-- Register public landing pages that already exist in the codebase but were
-- missing from the CRM attribution registry.
INSERT INTO "LandingPage" (
  "id", "name", "slug", "publicPath", "type", "status", "formKey",
  "publishedAt", "createdAt", "updatedAt"
)
VALUES
  (
    'landing-comodoro-by-fama',
    'Comodoro by Fama',
    'comodoro-by-fama',
    '/comodoro',
    'CAMPAIGN',
    'PUBLISHED',
    'development-interest',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    'landing-maestria-urban-design',
    'Maestria Urban Design',
    'maestria-urban-design',
    '/maestria',
    'CAMPAIGN',
    'PUBLISHED',
    'development-interest',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    'landing-palmas-lake',
    'Palmas Lake',
    'palmas-lake',
    '/palmas-lake',
    'CAMPAIGN',
    'PUBLISHED',
    'development-interest',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  )
ON CONFLICT ("slug") DO UPDATE SET
  "name" = EXCLUDED."name",
  "publicPath" = EXCLUDED."publicPath",
  "type" = EXCLUDED."type",
  "status" = EXCLUDED."status",
  "formKey" = EXCLUDED."formKey",
  "publishedAt" = COALESCE("LandingPage"."publishedAt", CURRENT_TIMESTAMP),
  "updatedAt" = CURRENT_TIMESTAMP;
