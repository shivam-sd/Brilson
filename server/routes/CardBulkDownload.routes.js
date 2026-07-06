const express = require('express');
const router = express.Router();
const JSZip = require('jszip');
const Card = require('../models/CardProfile');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

// -----------------------------------------------------------------------
// WHAT WAS WRONG BEFORE (for reference, not used anymore):
//   const QRCodeStyling = require('qr-code-styling');   <-- runs in Node
//   qrCode.getRawData('png', (blob) => { new FileReader() ... })
// `FileReader` and `window` don't exist in Node. qr-code-styling is a
// browser-only library. It must run inside a Puppeteer page, never here.
// -----------------------------------------------------------------------

// Browser-context bundle of qr-code-styling. We only ever use this path
// string in Node (to find the file on disk) — the code inside it only
// executes once injected into a Chromium page via addScriptTag.
const QR_CODE_STYLING_BROWSER_BUNDLE = require.resolve(
  'qr-code-styling/lib/qr-code-styling.js'
);

// How many Chromium pages to keep alive & reuse concurrently per batch.
const PAGE_POOL_SIZE = Number(process.env.CARD_RENDER_CONCURRENCY) || 6;

// Card render viewport — matches your card-wrapper's fixed 1200x750 design.
const CARD_VIEWPORT = { width: 1200, height: 750 };

// -----------------------------------------------------------------------
// LOGO LOADING (cached once, reused for every card/page — no per-card I/O)
// -----------------------------------------------------------------------
let cachedLogoDataUrl = null;

async function getLogoDataUrl() {
  if (cachedLogoDataUrl) return cachedLogoDataUrl;

  // Try local file first (fastest, no network dependency).
  const localPath = path.join(__dirname, '..', 'public', 'B.png');
  if (fs.existsSync(localPath)) {
    cachedLogoDataUrl = `data:image/png;base64,${fs
      .readFileSync(localPath)
      .toString('base64')}`;
    return cachedLogoDataUrl;
  }

  // Fallback: fetch it once from the live frontend domain and cache in memory.
  try {
    const domain = process.env.VITE_DOMAIN || 'https://brilson.in';
    const response = await fetch(`${domain}/B.png`);
    const arrayBuffer = await response.arrayBuffer();
    cachedLogoDataUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString(
      'base64'
    )}`;
    return cachedLogoDataUrl;
  } catch (err) {
    console.error('[cards] Could not load QR logo (B.png), continuing without it:', err.message);
    cachedLogoDataUrl = null;
    return null;
  }
}

// -----------------------------------------------------------------------
// HTML/CSS — rebuilt to mirror NFCCardDesign.jsx's inline styles exactly,
// property for property. No Font Awesome / CDN dependency: the WiFi icon
// below is the literal SVG path react-icons' <FaWifi /> renders (verified
// against the installed react-icons package), so it's pixel-identical
// instead of an approximation.
// -----------------------------------------------------------------------
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

  // Exact SVG path used by react-icons' <FaWifi />, viewBox 0 0 640 512.
  const wifiSvg = `<svg width="180" height="180" viewBox="0 0 640 512" fill="currentColor" stroke="currentColor" stroke-width="0" style="color:${wifiColor};display:block;"><path d="M634.91 154.88C457.74-8.99 182.19-8.93 5.09 154.88c-6.66 6.16-6.79 16.59-.35 22.98l34.24 33.97c6.14 6.1 16.02 6.23 22.4.38 145.92-133.68 371.3-133.71 517.25 0 6.38 5.85 16.26 5.71 22.4-.38l34.24-33.97c6.43-6.39 6.3-16.82-.36-22.98zM320 352c-35.35 0-64 28.65-64 64s28.65 64 64 64 64-28.65 64-64-28.65-64-64-64zm202.67-83.59c-115.26-101.93-290.21-101.82-405.34 0-6.9 6.1-7.12 16.69-.57 23.15l34.44 33.99c6 5.92 15.66 6.32 22.05.8 83.95-72.57 209.74-72.41 293.49 0 6.39 5.52 16.05 5.13 22.05-.8l34.44-33.99c6.56-6.46 6.33-17.06-.56-23.15z"/></svg>`;

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
    }
    /* ===== outer ref wrapper (matches root div in NFCCardDesign.jsx) ===== */
    .card-wrapper {
      width: 1200px;
      height: 750px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .card {
      background: ${cardBgColor};
      border-radius: 32px;
      border: 2px solid ${borderColor};
      width: 100%;
      height: 100%;
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
      display: flex;
      overflow: hidden;
    }
    .left-section {
      width: 50%;
      border-right: 2px solid ${borderColor};
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 32px;
      padding: 20px;
    }
    .wifi-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
    }
    .nfc-text {
      text-transform: uppercase;
      font-size: 35px;
      font-weight: 800;
      letter-spacing: 2px;
      color: ${nfcColor};
      margin: 0;
    }
    .brilson-title {
      font-size: 72px;
      font-weight: 800;
      color: ${titleColor};
      margin: 0;
      letter-spacing: -1px;
    }
    .website-url {
      font-size: 28px;
      letter-spacing: 6px;
      font-weight: 600;
      color: ${websiteColor};
      margin: 6px 0 0 0;
    }
    .right-section {
      width: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 40px;
      padding: 20px;
    }
    .qr-box {
      padding: 22px;
      border: 3px solid ${borderColor};
      border-radius: 16px;
      background-color: ${qrBgColor === 'transparent' ? 'transparent' : qrBgColor};
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .qr-box img {
      width: 250px;
      height: 250px;
      display: block;
    }
    .activation-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }
    .activation-label {
      font-size: 25px;
      letter-spacing: 5px;
      text-transform: uppercase;
      color: ${labelColor};
      font-weight: 600;
      margin: 0;
    }
    .activation-code {
      font-size: 38px;
      font-weight: 800;
      font-family: 'Courier New', monospace;
      border-radius: 12px;
      border: 2px solid ${borderColor};
      padding: 8px 24px;
      background: ${codeBg};
      color: ${cardTextColor};
      margin-top: 5px;
    }
  </style>
</head>
<body>
  <div class="card-wrapper">
    <div class="card">
      <!-- LEFT SECTION -->
      <div class="left-section">
        <div class="wifi-container">
          ${wifiSvg}
          <h4 class="nfc-text">NFC</h4>
        </div>
        <h1 class="brilson-title">BRILSON</h1>
        <p class="website-url">www.brilson.in</p>
      </div>

      <!-- RIGHT SECTION -->
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

// -----------------------------------------------------------------------
// BROWSER SINGLETON (reused across requests, not relaunched per call)
// -----------------------------------------------------------------------
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
      '--font-render-hinting=none'
    ]
  });
  browserInstance.on('disconnected', () => {
    browserInstance = null;
  });
  return browserInstance;
}

/**
 * Creates a page pre-loaded with the qr-code-styling bundle and the cached
 * logo, so each card rendered on this page only needs one evaluate() call.
 */
async function createPreparedPage(browser, logoDataUrl) {
  const page = await browser.newPage();
  await page.setViewport(CARD_VIEWPORT);
  await page.setContent('<!DOCTYPE html><html><head></head><body></body></html>');

  // Injects window.QRCodeStyling inside THIS page only. Never touches Node.
  await page.addScriptTag({ path: QR_CODE_STYLING_BROWSER_BUNDLE });

  await page.evaluate((logo) => {
    window.__QR_LOGO__ = logo;
  }, logoDataUrl);

  return page;
}

/**
 * Renders the styled QR entirely inside the browser context and returns a
 * base64 PNG string. `getRawData('png')` is awaited INSIDE the page — that
 * promise only resolves once dots, corner-squares, corner-dots, and the
 * embedded logo have fully finished drawing. This is what eliminates the
 * "missing QR" / race-condition problem you were hitting.
 */
async function renderQrBase64(page, { url, qrDotsColor, qrBgColor }) {
  return page.evaluate(
    async ({ url, qrDotsColor, qrBgColor }) => {
      // Mirrors the QRCodeStyling options in NFCCardDesign.jsx exactly —
      // same width/height (300), same dotsOptions/cornersOptions, same
      // imageOptions (no margin key, since the real component doesn't set
      // one). `type: "svg"` is kept purely for fidelity with the frontend;
      // internally getRawData('png') always rasterizes via its own canvas
      // pass regardless of this field, so it doesn't change the output.
      const qrCode = new window.QRCodeStyling({
        width: 300,
        height: 300,
        type: 'svg',
        data: url,
        image: window.__QR_LOGO__ || undefined,
        dotsOptions: {
          color: qrDotsColor || '#000000',
          margin: 10,
          type: 'dots'
        },
        backgroundOptions: {
          color: qrBgColor === 'transparent' ? '#ffffff' : (qrBgColor || '#ffffff')
        },
        imageOptions: {
          crossOrigin: 'anonymous',
          imageSize: 0.45
        },
        cornersDotOptions: {
          type: 'rounded'
        },
        cornersSquareOptions: {
          type: 'extra-rounded'
        }
      });

      // Resolves only once rendering (incl. logo) is fully complete.
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

/**
 * Full per-card pipeline: render QR -> inject HTML -> wait for image load
 * -> screenshot the .card element only (pixel-exact crop, no wrapper margin).
 */
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

  // Guard: make sure the QR <img> itself is fully decoded before screenshot.
  await page.waitForSelector('.qr-box img', { timeout: 5000 });
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
  const screenshot = await cardHandle.screenshot({ type: 'png', omitBackground: true });
  await cardHandle.dispose();

  return screenshot;
}

// -----------------------------------------------------------------------
// CONCURRENCY-LIMITED PAGE POOL (reuses pages, bounded parallelism)
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
// BULK DOWNLOAD ROUTE
// -----------------------------------------------------------------------
router.post('/cards/bulk-download', async (req, res) => {
  try {
    const { cardIds, colors } = req.body;

    if (!Array.isArray(cardIds) || cardIds.length === 0) {
      return res.status(400).json({ error: '`cardIds` must be a non-empty array.' });
    }

    const MAX_CARDS_PER_REQUEST = 1000;
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
    
    // Send response headers before streaming
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename=brilson-cards-${Date.now()}.zip`);
    res.setHeader('X-Processed-Count', successfulCount);
    res.setHeader('X-Failed-Count', failed.length);

    // Generate ZIP as buffer (simpler and more reliable)
    const zipBuffer = await zip.generateAsync({ 
      type: 'nodebuffer',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 }
    });

    res.send(zipBuffer);

  } catch (error) {
    console.error('Bulk download error:', error);
    if (!res.headersSent) res.status(500).json({ error: error.message });
  }
});

// -----------------------------------------------------------------------
// SINGLE CARD DOWNLOAD ROUTE
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
// GRACEFUL SHUTDOWN — close the shared browser when the server stops
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