import { runActiveBrowserCaptureAlerts } from "../lib/data/capture-automation";
import { prisma } from "../lib/prisma";

function toPositiveInt(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.round(parsed);
}

async function main() {
  const maxAlerts = toPositiveInt(process.env.CAPTURE_WORKER_MAX_ALERTS, 5);
  const startedAt = new Date();

  console.log(`[capture-worker] started ${startedAt.toISOString()} maxAlerts=${maxAlerts}`);

  const result = await runActiveBrowserCaptureAlerts({ maxAlerts });
  const totals = result.results.reduce(
    (acc, item) => ({
      found: acc.found + item.foundCount,
      imported: acc.imported + item.importedCount,
      skipped: acc.skipped + item.skippedCount,
      failed: acc.failed + item.failedCount
    }),
    { found: 0, imported: 0, skipped: 0, failed: 0 }
  );

  for (const item of result.results) {
    console.log(
      [
        `[capture-worker] alert=${item.alert.id}`,
        `status=${item.alert.lastRunStatus ?? "unknown"}`,
        `found=${item.foundCount}`,
        `imported=${item.importedCount}`,
        `skipped=${item.skippedCount}`,
        `failed=${item.failedCount}`,
        `message=${item.alert.lastRunMessage ?? ""}`
      ].join(" ")
    );
  }

  console.log(
    [
      `[capture-worker] completed ${new Date().toISOString()}`,
      `alerts=${result.results.length}`,
      `found=${totals.found}`,
      `imported=${totals.imported}`,
      `skipped=${totals.skipped}`,
      `failed=${totals.failed}`
    ].join(" ")
  );
}

main()
  .catch((error) => {
    console.error("[capture-worker] failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect().catch(() => null);
  });
