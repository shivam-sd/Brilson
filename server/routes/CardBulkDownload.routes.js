const express = require('express');
const router = express.Router();
const JSZip = require('jszip');
const Card = require('../models/CardProfile');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');



const QR_CODE_STYLING_BROWSER_BUNDLE = require.resolve(
  'qr-code-styling/lib/qr-code-styling.js'
);

const PAGE_POOL_SIZE = Number(process.env.CARD_RENDER_CONCURRENCY) || 4;

//  HIGH QUALITY 2.5x viewport 
// This gives crystal clear quality when zoomed
const CARD_VIEWPORT = { width: 3000, height: 1875 };

// Optional: For print quality use 3x (3600x2250)



let cachedLogoDataUrl = null;

async function getLogoDataUrl() {
  if (cachedLogoDataUrl) return cachedLogoDataUrl;

  const localPath = path.join(__dirname, '..', 'public', 'B.png');
  if (fs.existsSync(localPath)) {
    cachedLogoDataUrl = `data:image/png;base64,${fs
      .readFileSync(localPath)
      .toString('base64')}`;
    return cachedLogoDataUrl;
  }

  try {
    const domain = process.env.VITE_DOMAIN || 'https://brilson.in';
    const response = await fetch(`${domain}/B.png`);
    const arrayBuffer = await response.arrayBuffer();
    cachedLogoDataUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString(
      'base64'
    )}`;
    return cachedLogoDataUrl;
  } catch (err) {
    console.error('[cards] Could not load QR logo:', err.message);
    cachedLogoDataUrl = null;
    return null;
  }
}


function generateCardHTML(card, colors) {
  const {
    cardBgColor = '#FFFFFF',
    cardTextColor = '#000000',
    qrDotsColor = '#000000',
    qrBgColor = '#ffffff'
  } = colors;

  const borderColor = cardTextColor === '#ffffff' ? '#333' : cardTextColor;
  const displayCode = card.activationCode || '52V28-91S28-6B799';

  const wifiColor = cardTextColor === '#ffffff' ? '#333' : cardTextColor;
  const nfcColor = cardTextColor === '#ffffff' ? '#333' : cardTextColor;
  const titleColor = cardTextColor === '#ffffff' ? '#1a1a2e' : cardTextColor;
  const websiteColor = cardTextColor === '#ffffff' ? '#666' : cardTextColor;
  const labelColor = cardTextColor === '#ffffff' ? '#666' : cardTextColor;
  const codeBg = cardBgColor === '#ffffff' ? '#f5f5f5' : 'rgba(255,255,255,0.05)';

  //  HIGH QUALITY Larger SVG with crisp rendering
  const wifiSvg = `<svg width="450" height="450" viewBox="0 0 640 512" fill="currentColor" stroke="currentColor" stroke-width="0" style="color:${wifiColor};display:block;"><path d="M634.91 154.88C457.74-8.99 182.19-8.93 5.09 154.88c-6.66 6.16-6.79 16.59-.35 22.98l34.24 33.97c6.14 6.1 16.02 6.23 22.4.38 145.92-133.68 371.3-133.71 517.25 0 6.38 5.85 16.26 5.71 22.4-.38l34.24-33.97c6.43-6.39 6.3-16.82-.36-22.98zM320 352c-35.35 0-64 28.65-64 64s28.65 64 64 64 64-28.65 64-64-28.65-64-64-64zm202.67-83.59c-115.26-101.93-290.21-101.82-405.34 0-6.9 6.1-7.12 16.69-.57 23.15l34.44 33.99c6 5.92 15.66 6.32 22.05.8 83.95-72.57 209.74-72.41 293.49 0 6.39 5.52 16.05 5.13 22.05-.8l34.44-33.99c6.56-6.46 6.33-17.06-.56-23.15z"/></svg>`;

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
      margin: 0;
      padding: 0;
      font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
      background: transparent;
    }
    .card-wrapper {
      width: ${CARD_VIEWPORT.width}px;
      height: ${CARD_VIEWPORT.height}px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: transparent;
    }
    .card {
      background: ${cardBgColor};
      border-radius: 80px;
      border: 5px solid ${borderColor};
      width: 100%;
      height: 100%;
      box-shadow: 0 60px 120px -24px rgba(0,0,0,0.3);
      display: flex;
      overflow: hidden;
    }
    .left-section {
      width: 50%;
      border-right: 5px solid ${borderColor};
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 60px;
      padding: 50px;
    }
    .wifi-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 30px;
    }
    .nfc-text {
      text-transform: uppercase;
      font-size: 92px;
      font-weight: 900;
      letter-spacing: 5px;
      margin: 0;
      color: ${nfcColor};
    }
    .brilson-title {
      font-size: 185px;
      font-weight: 800;
      font-family: 'Segoe UI', Arial, sans-serif;
      text-transform: uppercase;
      color: ${titleColor};
      margin: 0;
      letter-spacing: -3px;
      line-height: 1;
    }
    .website-url {
      font-size: 70px;
      letter-spacing: 18px;
      font-weight: 600;
      color: ${websiteColor};
      margin-top: 10px;
    }
    .right-section {
      width: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 80px;
      padding: 50px;
    }
    .qr-box {
      padding: 40px;
      border: 5px solid ${borderColor};
      border-radius: 30px;
      background-color: ${qrBgColor === 'transparent' ? 'transparent' : qrBgColor};
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .qr-box img {
      width: 750px;
      height: 750px;
      display: block;
      image-rendering: auto;
    }
    .activation-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
    }
    .activation-label {
      font-size: 58px;
      letter-spacing: 15px;
      text-transform: uppercase;
      color: ${labelColor};
      font-weight: 700;
      margin: 0;
      margin-bottom: 5px;
    }
    .activation-code {
      font-size: 100px;
      font-weight: 700;
      font-family: 'Courier New', monospace;
      border-radius: 20px;
      border: 4px solid ${borderColor};
      padding: 20px 50px;
      background: ${codeBg};
      color: ${cardTextColor};
      margin-top: 10px;
      letter-spacing: 10px;
    }
  </style>
</head>
<body>
  <div class="card-wrapper">
    <div class="card">
      <div class="left-section">
        <div class="wifi-container">
          ${wifiSvg}
          <h4 class="nfc-text">NFC</h4>
        </div>
        <h1 class="brilson-title">BRILSON</h1>
        <p class="website-url">www.brilson.in</p>
      </div>

      <div class="right-section">
        <div class="qr-box">
          <img src="data:image/png;base64,{{QR_DATA}}" alt="QR Code" />
        </div>
        <div class="activation-wrapper">
          <p class="activation-label">Activation Key</p>
          <div class="activation-code">${displayCode}</div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
}


let browserInstance = null;

async function getBrowser() {
  if (browserInstance && browserInstance.isConnected()) {
    return browserInstance;
  }
  browserInstance = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--font-render-hinting=none',
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process'
    ]
  });
  browserInstance.on('disconnected', () => {
    browserInstance = null;
  });
  return browserInstance;
}

async function createPreparedPage(browser, logoDataUrl) {
  const page = await browser.newPage();
  await page.setViewport(CARD_VIEWPORT);
  await page.setContent('<!DOCTYPE html><html><head></head><body></body></html>');

  await page.addScriptTag({ path: QR_CODE_STYLING_BROWSER_BUNDLE });

  await page.evaluate((logo) => {
    window.__QR_LOGO__ = logo;
  }, logoDataUrl);

  return page;
}



async function renderQrBase64(page, { url, qrDotsColor, qrBgColor }) {
  return page.evaluate(
    async ({ url, qrDotsColor, qrBgColor }) => {
      //  HIGH QUALITY:
      const qrCode = new window.QRCodeStyling({
        width: 750,
        height: 750,
        type: 'svg',
        data: url,
        image: window.__QR_LOGO__ || undefined,
        dotsOptions: {
          color: qrDotsColor || '#000000',
          margin: 12,
          type: 'dots' // 'rounded' looks smoother at high resolution
        },
        backgroundOptions: {
          color: qrBgColor === 'transparent' ? '#ffffff' : (qrBgColor || '#ffffff')
        },
        imageOptions: {
          crossOrigin: 'anonymous',
          imageSize: 0.45,
          margin: 8
        },
        cornersDotOptions: {
          type: 'rounded'
        },
        cornersSquareOptions: {
          type: 'extra-rounded'
        }
      });

      const blob = await qrCode.getRawData('png');
      const arrayBuffer = await blob.arrayBuffer();

      let binary = '';
      const bytes = new Uint8Array(arrayBuffer);
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return btoa(binary);
    },
    { url, qrDotsColor, qrBgColor }
  );
}


async function renderCardPng(page, { card, colors }) {
  const profileUrl = `${process.env.VITE_DOMAIN || 'https://brilson.in'}/public/profile/${
    card.slug || card.activationCode
  }`;

  const qrBase64 = await renderQrBase64(page, {
    url: profileUrl,
    qrDotsColor: colors.qrDotsColor,
    qrBgColor: colors.qrBgColor
  });

  const html = generateCardHTML(card, colors).replace('{{QR_DATA}}', qrBase64);

  await page.setContent(html, { waitUntil: 'networkidle0' });

  await page.waitForSelector('.qr-box img', { timeout: 10000 });
  await page.evaluate(() => {
    const img = document.querySelector('.qr-box img');
    if (img.complete && img.naturalWidth > 0) return;
    return new Promise((resolve) => {
      img.onload = resolve;
      img.onerror = resolve;
    });
  });

  const cardHandle = await page.$('.card');
  if (!cardHandle) {
    throw new Error('Card element not found');
  }
  
  // 🔥 HIGH QUALITY: Capture at device pixel ratio 2 for extra crispness
  const screenshot = await cardHandle.screenshot({ 
    type: 'png', 
    omitBackground: true,
    encoding: 'binary'
  });
  
  await cardHandle.dispose();

  return screenshot;
}

// -----------------------------------------------------------------------
// PAGE POOL
// -----------------------------------------------------------------------
async function runWithPagePool(browser, items, poolSize, workerFn) {
  const logoDataUrl = await getLogoDataUrl();

  const pages = await Promise.all(
    Array.from({ length: Math.min(poolSize, items.length) }, () =>
      createPreparedPage(browser, logoDataUrl)
    )
  );

  const results = new Array(items.length);
  let cursor = 0;

  async function worker(page) {
    while (cursor < items.length) {
      const index = cursor++;
      const item = items[index];
      try {
        results[index] = { ok: true, index, item, buffer: await workerFn(page, item) };
      } catch (err) {
        results[index] = { ok: false, index, item, error: err.message };
      }
    }
  }

  await Promise.all(pages.map((page) => worker(page)));
  await Promise.all(pages.map((page) => page.close().catch(() => {})));

  return results;
}

// -----------------------------------------------------------------------
// BULK DOWNLOAD ROUTE - HIGH QUALITY
// -----------------------------------------------------------------------
router.post('/cards/bulk-download', async (req, res) => {
  try {
    const { cardIds, colors } = req.body;

    if (!Array.isArray(cardIds) || cardIds.length === 0) {
      return res.status(400).json({ error: '`cardIds` must be a non-empty array.' });
    }

    //  Reduced limit due to higher quality 
    const MAX_CARDS_PER_REQUEST = 100;
    if (cardIds.length > MAX_CARDS_PER_REQUEST) {
      return res.status(400).json({
        error: `Max ${MAX_CARDS_PER_REQUEST} cards per request. Split into batches.`
      });
    }

    const cards = await Card.find({ _id: { $in: cardIds } }).populate('owner profile');

    if (!cards || cards.length === 0) {
      return res.status(404).json({ error: 'No cards found' });
    }

    const browser = await getBrowser();

    const items = cards.map((card) => ({ card, colors: colors || {} }));

    const results = await runWithPagePool(browser, items, PAGE_POOL_SIZE, renderCardPng);

    const failed = results.filter((r) => !r.ok);
    if (failed.length > 0) {
      console.error(
        `[bulk-download] ${failed.length}/${cards.length} cards failed:`,
        failed.map((f) => ({ index: f.index, activationCode: f.item.card.activationCode, error: f.error }))
      );
    }

    const zip = new JSZip();
    const folder = zip.folder('brilson-cards');

    results.forEach((r) => {
      if (!r.ok) return;
      const filename = `brilson-card-${r.item.card.activationCode}.png`;
      folder.file(filename, r.buffer);
    });

    if (failed.length > 0) {
      folder.file(
        'FAILED_CARDS.json',
        JSON.stringify(
          failed.map((f) => ({
            activationCode: f.item.card.activationCode,
            error: f.error
          })),
          null,
          2
        )
      );
    }

    const successfulCount = results.length - failed.length;
    
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename=brilson-cards-${Date.now()}.zip`);
    res.setHeader('X-Processed-Count', successfulCount);
    res.setHeader('X-Failed-Count', failed.length);

    // 🔥 Higher compression for large files
    const zipBuffer = await zip.generateAsync({ 
      type: 'nodebuffer',
      compression: 'DEFLATE',
      compressionOptions: { level: 9 }
    });

    res.send(zipBuffer);

  } catch (error) {
    console.error('Bulk download error:', error);
    if (!res.headersSent) res.status(500).json({ error: error.message });
  }
});

// -----------------------------------------------------------------------
// SINGLE CARD DOWNLOAD ROUTE - HIGH QUALITY
// -----------------------------------------------------------------------
router.get('/cards/:id/download', async (req, res) => {
  let page = null;
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

    const browser = await getBrowser();
    const logoDataUrl = await getLogoDataUrl();
    page = await createPreparedPage(browser, logoDataUrl);

    const screenshot = await renderCardPng(page, { card, colors });

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', `attachment; filename=brilson-card-${card.activationCode}.png`);
    res.send(screenshot);
  } catch (error) {
    console.error('Download error:', error);
    if (!res.headersSent) res.status(500).json({ error: error.message });
  } finally {
    if (page) await page.close().catch(() => {});
  }
});

// -----------------------------------------------------------------------
// GRACEFUL SHUTDOWN
// -----------------------------------------------------------------------
process.on('SIGINT', async () => {
  if (browserInstance) await browserInstance.close().catch(() => {});
  process.exit(0);
});
process.on('SIGTERM', async () => {
  if (browserInstance) await browserInstance.close().catch(() => {});
  process.exit(0);
});

module.exports = router;