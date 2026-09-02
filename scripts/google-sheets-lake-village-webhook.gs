/**
 * Lake Village lead receiver for Google Apps Script.
 *
 * 1. Open the Lake Village spreadsheet.
 * 2. Extensions > Apps Script.
 * 3. Paste this file into the project.
 * 4. Add a Script Property named WEBHOOK_TOKEN with the same value used by
 *    GOOGLE_SHEETS_WEBHOOK_TOKEN on the website.
 * 5. Deploy as Web app, execute as you, and allow anyone with the link.
 * 6. Set the deployment URL as GOOGLE_SHEETS_WEBHOOK_URL on the website.
 */

const SHEET_NAME = "Sheet1";

function doPost(event) {
  const lock = LockService.getScriptLock();
  let lockAcquired = false;

  try {
    lock.waitLock(5000);
    lockAcquired = true;

    const expectedToken = PropertiesService.getScriptProperties().getProperty("WEBHOOK_TOKEN");
    const payload = JSON.parse(event.postData.contents || "{}");

    if (!expectedToken || payload.token !== expectedToken) {
      return jsonResponse({ success: false, error: "Unauthorized" }, 401);
    }

    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);

    if (!sheet) {
      return jsonResponse({ success: false, error: "Sheet not found" }, 404);
    }

    const row = [
      payload.submittedAt || new Date().toISOString(),
      payload.name || "",
      payload.whatsapp || "",
      payload.email || "",
      payload.interest || "",
      payload.groupConsent || "Não",
      payload.source || "Landing Lake Village",
      payload.status || "Novo",
      ""
    ];

    const normalizedPhone = String(payload.whatsapp || "").trim();
    const normalizedEmail = String(payload.email || "").trim().toLowerCase();
    const values = sheet.getDataRange().getValues();
    const existingRowIndex = values.slice(1).findIndex((existingRow) => {
      const existingPhone = String(existingRow[2] || "").trim();
      const existingEmail = String(existingRow[3] || "").trim().toLowerCase();
      return (normalizedPhone && existingPhone === normalizedPhone) ||
        (normalizedEmail && existingEmail === normalizedEmail);
    });

    if (existingRowIndex >= 0) {
      sheet.getRange(existingRowIndex + 2, 1, 1, row.length).setValues([row]);
    } else {
      sheet.appendRow(row);
    }

    return jsonResponse({ success: true, action: existingRowIndex >= 0 ? "updated" : "created" }, 200);
  } catch (error) {
    return jsonResponse({ success: false, error: String(error) }, 500);
  } finally {
    if (lockAcquired) {
      lock.releaseLock();
    }
  }
}

function jsonResponse(body, statusCode) {
  return ContentService
    .createTextOutput(JSON.stringify({ ...body, statusCode }))
    .setMimeType(ContentService.MimeType.JSON);
}
