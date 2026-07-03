const express = require('express');
const router = express.Router();
const JSZip = require('jszip');
const Card = require('../models/CardProfile');
const puppeteer = require('puppeteer');
const QRCode = require('qrcode');

// ✅ Generate QR Code as Base64 with DOTS style (like NFCCardDesign - QRCodeStyling)
async function generateQRBase64(url, qrDotsColor, qrBgColor) {
  // Using QRCode with dots style options
  const qrOptions = {
    width: 500,
    margin: 2,
    color: {
      dark: qrDotsColor,
      light: qrBgColor === 'transparent' ? '#ffffff' : qrBgColor
    },
    errorCorrectionLevel: 'H'
  };
  
  const qrBuffer = await QRCode.toBuffer(url, qrOptions);
  return qrBuffer.toString('base64');
}

// ✅ Generate HTML - EXACT NFCCardDesign UI with SVG WiFi Icon
function generateCardHTML(card, colors) {
  const {
    cardBgColor = '#FFFFFF',
    cardTextColor = '#000000',
    qrDotsColor = '#000000',
    qrBgColor = '#ffffff'
  } = colors;

  const borderColor = cardTextColor === '#ffffff' ? '#333333' : cardTextColor;
  const displayCode = card.activationCode || '52V28-91S28-6B799';
  const profileName = card.owner?.name || card.profile?.name || '';

  // WiFi icon color
  const wifiColor = cardTextColor === '#ffffff' ? '#333333' : cardTextColor;

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Brilson NFC Card</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: transparent;
      font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
    }
    .card-wrapper {
      width: 1200px;
      height: 750px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .card {
      width: 100%;
      height: 100%;
      background: ${cardBgColor};
      border-radius: 32px;
      border: 2px solid ${borderColor};
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
      display: flex;
      overflow: hidden;
    }
    /* ===== LEFT SECTION ===== */
    .left-section {
      width: 50%;
      border-right: 2px solid ${borderColor};
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 32px;
      padding: 40px 20px;
    }
    .wifi-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
    }
    .wifi-svg {
      display: block;
      width: 120px;
      height: 90px;
    }
    .nfc-text {
      text-transform: uppercase;
      font-size: 35px;
      font-weight: 800;
      letter-spacing: 2px;
      color: ${cardTextColor === '#ffffff' ? '#333333' : cardTextColor};
      margin-top: 4px;
    }
    .brilson-title {
      font-size: 72px;
      font-weight: 800;
      color: ${cardTextColor === '#ffffff' ? '#1a1a2e' : cardTextColor};
      letter-spacing: -1px;
      line-height: 1;
    }
    .website-url {
      font-size: 28px;
      font-weight: 600;
      letter-spacing: 6px;
      color: ${cardTextColor === '#ffffff' ? '#666666' : cardTextColor};
      margin-top: 4px;
    }
    /* ===== RIGHT SECTION ===== */
    .right-section {
      width: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 35px;
      padding: 40px 20px;
    }
    .qr-box {
      padding: 22px;
      border: 3px solid ${borderColor};
      border-radius: 16px;
      background: ${qrBgColor === 'transparent' ? 'transparent' : qrBgColor};
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .qr-box img {
      width: 250px;
      height: 250px;
      display: block;
      border-radius: 8px;
    }
    .activation-label {
      font-size: 25px;
      letter-spacing: 5px;
      text-transform: uppercase;
      color: ${cardTextColor === '#ffffff' ? '#666666' : cardTextColor};
      font-weight: 600;
    }
    .activation-code {
      font-size: 38px;
      font-weight: 800;
      font-family: 'Courier New', monospace;
      border-radius: 12px;
      border: 2px solid ${borderColor};
      padding: 10px 28px;
      background: ${cardBgColor === '#ffffff' ? '#f5f5f5' : 'rgba(255,255,255,0.05)'};
      color: ${cardTextColor};
      margin-top: 2px;
      letter-spacing: 1px;
    }
    /* Profile Name (if exists) */
    .profile-name {
      font-size: 20px;
      font-weight: 500;
      color: ${cardTextColor === '#ffffff' ? '#888888' : cardTextColor};
      opacity: 0.7;
      margin-top: -10px;
    }
  </style>
</head>
<body>
  <div class="card-wrapper">
    <div class="card">
      <!-- LEFT SECTION -->
      <div class="left-section">
        <div class="wifi-container">
          <!-- WiFi SVG Icon - Exact same as NFCCardDesign -->
<svg class="wifi-svg" viewBox="0 0 120 90" fill="none">
 <svg width="120" height="90" viewBox="0 0 120 90" fill="none">
  <!-- Bar 1 (सबसे छोटा) -->
  <rect x="8" y="65" width="16" height="25" rx="3" fill="#000000" />
  <!-- Bar 2 -->
  <rect x="30" y="50" width="16" height="40" rx="3" fill="#000000" />
  <!-- Bar 3 -->
  <rect x="52" y="35" width="16" height="55" rx="3" fill="#000000" />
  <!-- Bar 4 (सबसे बड़ा) -->
  <rect x="74" y="20" width="16" height="70" rx="3" fill="#000000" />
</svg>
</svg>          <div class="nfc-text">NFC</div>
        </div>
        <div class="brilson-title">Brilson</div>
        <div class="website-url">www.brilson.in</div>
      </div>
      
      <!-- RIGHT SECTION -->
      <div class="right-section">
        <div class="qr-box">
          <img src="data:image/png;base64,{{QR_DATA}}" alt="QR Code" />
        </div>
        <div class="activation-label">Activation Key</div>
        <div class="activation-code">${displayCode}</div>
      </div>
    </div>
  </div>
</body>
</html>`;
}

// ✅ Bulk Download API
router.post('/cards/bulk-download', async (req, res) => {
  try {
    const { cardIds, colors } = req.body;
    
    const cards = await Card.find({ 
      _id: { $in: cardIds } 
    }).populate('owner profile');

    if (!cards || cards.length === 0) {
      return res.status(404).json({ error: 'No cards found' });
    }

    const zip = new JSZip();
    const folder = zip.folder('brilson-cards');

    const BATCH_SIZE = 5;
    let processed = 0;

    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    for (let i = 0; i < cards.length; i += BATCH_SIZE) {
      const batch = cards.slice(i, i + BATCH_SIZE);
      
      await Promise.all(batch.map(async (card) => {
        try {
          const profileUrl = `${process.env.VITE_DOMAIN || 'https://brilson.in'}/public/profile/${card.slug || card.activationCode}`;
          const qrBase64 = await generateQRBase64(profileUrl, colors.qrDotsColor, colors.qrBgColor);
          
          let html = generateCardHTML(card, colors);
          html = html.replace('{{QR_DATA}}', qrBase64);
          
          const page = await browser.newPage();
          await page.setViewport({ width: 1200, height: 750 });
          await page.setContent(html, { waitUntil: 'networkidle0' });
          
          const screenshot = await page.screenshot({
            type: 'png',
            fullPage: false,
            omitBackground: true
          });
          
          await page.close();
          
          const filename = `brilson-card-${card.activationCode}.png`;
          folder.file(filename, screenshot);
          processed++;
          
        } catch (error) {
          console.error(`Error generating card ${card.activationCode}:`, error);
        }
      }));
    }

    await browser.close();

    const zipBuffer = await zip.generateAsync({ 
      type: 'nodebuffer',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 }
    });

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename=brilson-cards-${Date.now()}.zip`);
    res.setHeader('X-Processed-Count', processed);
    res.send(zipBuffer);

  } catch (error) {
    console.error('Bulk download error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Single Card Download API
router.get('/cards/:id/download', async (req, res) => {
  try {
    const card = await Card.findById(req.params.id).populate('owner profile');
    
    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }

    const colors = {
      cardBgColor: req.query.cardBgColor || '#FFFFFF',
      cardTextColor: req.query.cardTextColor || '#000000',
      qrDotsColor: req.query.qrDotsColor || '#000000',
      qrBgColor: req.query.qrBgColor || '#ffffff'
    };

    const profileUrl = `${process.env.VITE_DOMAIN || 'https://brilson.in'}/public/profile/${card.slug || card.activationCode}`;
    const qrBase64 = await generateQRBase64(profileUrl, colors.qrDotsColor, colors.qrBgColor);
    
    let html = generateCardHTML(card, colors);
    html = html.replace('{{QR_DATA}}', qrBase64);
    
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 750 });
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    const screenshot = await page.screenshot({
      type: 'png',
      fullPage: false,
      omitBackground: true
    });
    
    await browser.close();
    
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', `attachment; filename=brilson-card-${card.activationCode}.png`);
    res.send(screenshot);

  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;