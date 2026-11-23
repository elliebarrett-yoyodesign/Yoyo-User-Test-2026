# Yoyo website user test

A remote, unmoderated accessibility user test for https://yoyodesign.com/.

- `index.html` – the test page participants use
- `instructions.txt` – plain text copy of the instructions (linked from the page)
- `google-apps-script.gs` – receives answers and writes them to a Google Sheet

## 1. Connect the Google Sheet

1. Create a new Google Sheet (for example "Yoyo user test responses").
2. In the sheet, choose **Extensions > Apps Script**.
3. Delete the sample code, paste in everything from `google-apps-script.gs`, and save.
4. Choose **Deploy > New deployment**. Select type **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Press **Deploy**, approve the permissions, and copy the **Web app URL** (it ends in `/exec`).
6. In `index.html`, find `var SHEET_URL = 'PASTE_YOUR_WEB_APP_URL_HERE';` and paste the URL in.

Answers appear in a tab called **Responses**, one row per participant. The row
updates each time they press Next, and the **Progress** column shows how far
they got ("Finished" when complete).

If you change the script later, use **Deploy > Manage deployments > Edit >
New version** so the URL stays the same.

## 2. Publish with GitHub Pages

1. Create a GitHub repository and upload `index.html` and `instructions.txt`
   (the `.gs` file and this README are optional).
2. In the repository, go to **Settings > Pages**, set the source to the
   `main` branch and `/ (root)`, and save.
3. After a minute, the test is live at `https://<your-username>.github.io/<repo-name>/`.

## 3. Before launch

- Do a full run-through yourself and check a row arrives in the sheet.
- Test the page with a screen reader and a keyboard, as the plan requires.
- Participants' answers are kept in their own browser until they finish, so
  they can close the tab and come back. On a shared computer, the next person
  would see them, so ask participants to finish on the device they started on.
