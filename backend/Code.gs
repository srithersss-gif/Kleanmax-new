/**
 * Kleanmax Commercial Cleaning - Universal Robust Google Apps Script Backend
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  
  try {
    // Connect directly to "Kleanmax Neww 2026" sheet using its ID
    var sheetId = "1MKSy8fhBw12Udav_Lb7sgPJiCaQwp_c7Aw9M64vN1BI";
    var sheet = SpreadsheetApp.openById(sheetId).getActiveSheet();
    
    // Auto-create headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Full Name",
        "Phone Number",
        "Email Address",
        "Facility Type",
        "Service Required",
        "Area (Sq.Ft)",
        "Location / Address",
        "Message / Requirements",
        "Page URL"
      ]);
      sheet.getRange(1, 1, 1, 10).setFontWeight("bold").setBackground("#102646").setFontColor("#ffffff").setHorizontalAlignment("center");
    }
    
    var data = {};
    if (e && e.parameter) {
      for (var p in e.parameter) {
        data[p] = e.parameter[p];
      }
    }
    if (e && e.postData && e.postData.contents) {
      var raw = e.postData.contents;
      try {
        var parsed = JSON.parse(raw);
        for (var k in parsed) { data[k] = parsed[k]; }
      } catch (jsonErr) {
        var pairs = raw.split('&');
        for (var i = 0; i < pairs.length; i++) {
          var pair = pairs[i].split('=');
          if (pair.length === 2) {
            data[decodeURIComponent(pair[0].replace(/\+/g, ' '))] = decodeURIComponent(pair[1].replace(/\+/g, ' '));
          }
        }
      }
    }
    
    var timestamp = new Date();
    var fullName = data.fullName || data.name || data.fullname || "N/A";
    var phone = data.phone || data.mobile || data.tel || data.phoneNo || "N/A";
    var email = data.email || "N/A";
    var facilityType = data.facilityType || data.facility || "N/A";
    var service = data.service || data.serviceRequired || "N/A";
    var areaSqft = data.area || data.areaSqft || "N/A";
    var location = data.location || data.address || "N/A";
    var message = data.message || data.comments || "N/A";
    var pageUrl = data.pageUrl || data.url || "N/A";
    
    // Append lead to Google Sheet
    sheet.appendRow([
      timestamp,
      fullName,
      phone,
      email,
      facilityType,
      service,
      areaSqft,
      location,
      message,
      pageUrl
    ]);
    
    // Center align the newly added row
    sheet.getRange(sheet.getLastRow(), 1, 1, 10).setHorizontalAlignment("center");
    
    // Send Instant Email Notification to the Sheet Owner
    try {
      var adminEmail = Session.getActiveUser().getEmail();
      var targetEmail = "info@kleanmax.com" + (adminEmail ? "," + adminEmail : "");
      if (targetEmail) {
        var emailSubject = "🚨 New Commercial Cleaning Inquiry - " + fullName;
        var emailBody = 
          "New Website Lead Received:\n\n" +
          "👤 Name: " + fullName + "\n" +
          "📞 Phone: " + phone + "\n" +
          "✉️ Email: " + email + "\n" +
          "🏢 Facility: " + facilityType + "\n" +
          "🧹 Service: " + service + "\n" +
          "📐 Area: " + areaSqft + "\n" +
          "📍 Location: " + location + "\n" +
          "📝 Message: " + message + "\n" +
          "🔗 Page URL: " + pageUrl + "\n\n" +
          "Timestamp: " + timestamp.toString();
          
        MailApp.sendEmail(targetEmail, emailSubject, emailBody);
      }
    } catch (mailErr) {
      Logger.log("Email notification error: " + mailErr.toString());
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "success", "message": "Lead saved successfully" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "error", "error": err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ "status": "active", "service": "Kleanmax Form Backend" }))
    .setMimeType(ContentService.MimeType.JSON);
}
