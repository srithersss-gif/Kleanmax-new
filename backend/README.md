# 🚀 Kleanmax Google Apps Script Backend Setup Guide

This guide will help you connect your Kleanmax website quotation forms directly to **Google Sheets** and **Instant Email Notifications** using Google Apps Script (100% free, zero server cost).

---

## 📋 Step 1: Create a Google Sheet
1. Go to [Google Sheets](https://sheets.new) and log in with your Google account.
2. Rename the spreadsheet to: `Kleanmax Leads 2026`.

---

## 💻 Step 2: Open Apps Script & Paste Backend Code
1. In your Google Sheet, click on **Extensions** > **Apps Script**.
2. Clear any default code in `Code.gs`.
3. Open `c:\Users\guna0\Downloads\kleanmax\backend\Code.gs`, copy the entire contents, and paste it into `Code.gs` in Apps Script.
4. Click the **Save** icon (💾) or press `Ctrl + S`.

---

## 🌐 Step 3: Deploy as Web App (CRITICAL STEP)
1. Click the blue **Deploy** button at the top right > select **New deployment**.
2. Click the gear icon (⚙️) next to *Select type* and select **Web app**.
3. Fill in the deployment details:
   - **Description**: `Kleanmax Lead Collector`
   - **Execute as**: `Me (your-email@gmail.com)`
   - **Who has access**: **`Anyone`** *(⚠️ IMPORTANT: Must be set to 'Anyone' so the website can send form entries without login!)*
4. Click **Deploy**.
5. Google will ask you to **Authorize access**:
   - Click **Authorize access** > Choose your Google account.
   - Click **Advanced** > Click **Go to Untitled project (unsafe)** > Click **Allow**.
6. Copy the generated **Web App URL** (looks like: `https://script.google.com/macros/s/AKfycbx.../exec`).

---

## ⚙️ Step 4: Paste URL into Website Code
1. Open `assets/js/main.js` in your editor.
2. On line 170, find:
   ```js
   const GOOGLE_APPS_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL';
   ```
3. Replace `'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL'` with your copied Web App URL:
   ```js
   const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx.../exec';
   ```
4. Save the file (`Ctrl + S`).

---

## 🎉 Done!
Now, whenever any client fills out a form on your website:
1. A new row is automatically appended to your **Google Sheet** with Name, Phone, Email, Facility Type, Service, Area, Location, and Message!
2. You automatically receive an **instant Email Alert** in your Gmail inbox!
3. The client sees a smooth, professional success message on the website!
