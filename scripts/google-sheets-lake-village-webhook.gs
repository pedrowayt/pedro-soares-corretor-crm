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
  try {
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

    sheet.appendRow([
      payload.submittedAt || new Date().toISOString(),
      payload.name || "",
      payload.whatsapp || "",
      payload.email || "",
      payload.interest || "",
      payload.groupConsent || "Não",
      payload.source || "Landing Lake Village",
      payload.status || "Novo",
      ""
    ]);

    return jsonResponse({ success: true }, 200);
  } catch (error) {
    return jsonResponse({ success: false, error: String(error) }, 500);
  }
}

function jsonResponse(body, statusCode) {
  return ContentService
    .createTextOutput(JSON.stringify({ ...body, statusCode }))
    .setMimeType(ContentService.MimeType.JSON);
}
