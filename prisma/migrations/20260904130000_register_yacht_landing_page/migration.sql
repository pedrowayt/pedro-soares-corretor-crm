-- Register the Yacht by Fama campaign landing page for CRM attribution.
INSERT INTO "LandingPage" ("id", "name", "slug", "publicPath", "type", "status", "formKey", "publishedAt", "createdAt", "updatedAt")
VALUES
  ('landing-yacht-by-fama', 'Yacht by Fama', 'yacht-by-fama', '/yacht-fama', 'CAMPAIGN', 'PUBLISHED', 'development-interest', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;
