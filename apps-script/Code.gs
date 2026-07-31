/**
 * AWBS Landing — Lead form -> Google Sheets
 *
 * Setup:
 * 1. Buka https://sheet.new untuk membuat Google Sheet baru (atau pakai yang sudah ada).
 * 2. Di sheet itu, buka menu Extensions -> Apps Script.
 * 3. Hapus isi default, tempel seluruh isi file ini, lalu Save (Ctrl/Cmd+S).
 * 4. Klik Deploy -> New deployment -> pilih tipe "Web app".
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Klik Deploy, izinkan permission yang diminta, lalu salin "Web app URL".
 * 6. Tempel URL itu ke konstanta LEAD_FORM_ENDPOINT di js/form.js.
 */

const SHEET_NAME = "Leads";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = getOrCreateSheet();

    sheet.appendRow([
      new Date(),
      (data.name || "").toString().trim(),
      (data.email || "").toString().trim(),
      (data.website || "").toString().trim(),
      (data.lang || "").toString().trim(),
    ]);

    return jsonResponse({ ok: true });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) });
  }
}

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(["Timestamp", "Nama", "Email", "Website", "Bahasa"]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
