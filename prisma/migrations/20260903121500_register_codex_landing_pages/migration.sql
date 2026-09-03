-- Register pages created and published by Codex without linking them to the legacy Development model.
INSERT INTO "LandingPage" ("id", "name", "slug", "publicPath", "type", "status", "formKey", "publishedAt", "createdAt", "updatedAt")
VALUES
  ('landing-acordes', 'Acordes Tower by Tewal', 'acordes', '/acordes', 'CAMPAIGN', 'PUBLISHED', 'development-interest', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('landing-like-210', 'LIKE 210', 'like-210', '/like-210', 'CAMPAIGN', 'PUBLISHED', 'development-interest', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;
