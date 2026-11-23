/**
 * Yoyo website user test – receives answers from index.html and writes them
 * to the "Responses" tab of this Google Sheet.
 *
 * One row per participant session. Each time the participant presses Next,
 * their row is updated, so partial answers are kept if they stop early.
 *
 * Setup: see README.md, "Connect the Google Sheet".
 */

var SHEET_NAME = 'Responses';
var MAX_ANSWER_LENGTH = 5000;
var FIXED_HEADERS = ['Session ID', 'First saved', 'Last saved', 'Progress'];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    var data = JSON.parse(e.postData.contents);
    if (!data || typeof data.sessionId !== 'string' || typeof data.answers !== 'object') {
      return respond({ ok: false, error: 'Bad request' });
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

    // Make sure every question has a column, in page order.
    var headers = sheet.getLastColumn() > 0
      ? sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
      : [];
    var wanted = FIXED_HEADERS.concat(Array.isArray(data.order) ? data.order : Object.keys(data.answers));
    wanted.forEach(function (h) {
      h = String(h).slice(0, 200);
      if (headers.indexOf(h) === -1) headers.push(h);
    });
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
    sheet.setFrozenRows(1);

    // Find this participant's row, or add a new one.
    var lastRow = sheet.getLastRow();
    var row = -1;
    if (lastRow > 1) {
      var ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
      for (var i = 0; i < ids.length; i++) {
        if (ids[i][0] === data.sessionId) { row = i + 2; break; }
      }
    }

    var now = new Date();
    var values;
    if (row === -1) {
      row = lastRow + 1;
      values = headers.map(function () { return ''; });
      values[1] = now;
    } else {
      values = sheet.getRange(row, 1, 1, headers.length).getValues()[0];
    }
    values[0] = data.sessionId;
    values[2] = now;
    values[3] = clean(data.step);

    Object.keys(data.answers).forEach(function (key) {
      var col = headers.indexOf(key);
      if (col > -1 && FIXED_HEADERS.indexOf(key) === -1) values[col] = clean(data.answers[key]);
    });

    sheet.getRange(row, 1, 1, headers.length).setValues([values]);
    return respond({ ok: true });
  } catch (err) {
    return respond({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return ContentService.createTextOutput('The Yoyo user test endpoint is running.');
}

// Stop answers being read as spreadsheet formulas, and cap their length.
function clean(value) {
  var text = String(value == null ? '' : value).slice(0, MAX_ANSWER_LENGTH);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function respond(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
