const express = require("express");
const router = express.Router();
const JSZip = require("jszip");
const Card = require("../models/CardProfile");
const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");

const QR_CODE_STYLING_BROWSER_BUNDLE =
  require.resolve("qr-code-styling/lib/qr-code-styling.js");

const PAGE_POOL_SIZE = Number(process.env.CARD_RENDER_CONCURRENCY) || 4;

// ✅ Visiting Card Size - Instagram Reel Style
const VISITING_CARD_VIEWPORT = { width: 500, height: 800 };

let cachedLogoDataUrl = null;

async function getLogoDataUrl() {
  if (cachedLogoDataUrl) return cachedLogoDataUrl;

  const localPath = path.join(__dirname, "..", "public", "B.png");
  if (fs.existsSync(localPath)) {
    cachedLogoDataUrl = `data:image/png;base64,${fs
      .readFileSync(localPath)
      .toString("base64")}`;
    return cachedLogoDataUrl;
  }

  try {
    const domain = process.env.VITE_DOMAIN || 'https://brilson.in';
    const response = await fetch(`${domain}/B.png`);
    const arrayBuffer = await response.arrayBuffer();
    cachedLogoDataUrl = `data:image/png;base64,${Buffer.from(
      arrayBuffer,
    ).toString("base64")}`;
    return cachedLogoDataUrl;
  } catch (err) {
    console.error("[visiting-cards] Could not load QR logo:", err.message);
    cachedLogoDataUrl = null;
    return null;
  }
}

// ✅ VISITING CARD FIXED COLORS
const VISITING_CARD_COLORS = {
  bgColor: "#0a0a1a",
  textColor: "#ffffff",
  qrDotsColor: "black",
  qrBgColor: "white",
  accentColor: "black"
};

// ✅ SVG Icons for Visiting Card
const getIcons = () => ({
  premium: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>`,
  eco: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>`,
  durable: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`,
  water: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C12 2 6 8 6 12C6 15.3137 8.68629 18 12 18C15.3137 18 18 15.3137 18 12C18 8 12 2 12 2Z"/><path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z"/></svg>`,
  tear: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18"/><line x1="8" y1="2" x2="8" y2="22"/><line x1="16" y1="2" x2="16" y2="22"/></svg>`,
  finish: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  connect: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
  qr: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="7" height="7"/><rect x="15" y="2" width="7" height="7"/><rect x="2" y="15" width="7" height="7"/><line x1="11" y1="11" x2="11" y2="15"/><line x1="13" y1="11" x2="13" y2="15"/><line x1="11" y1="13" x2="15" y2="13"/><line x1="15" y1="9" x2="15" y2="11"/></svg>`,
});

// ✅ Generate Visiting Card HTML - Image Style
function generateVisitingCardHTML(card, colors) {
  const {
    cardBgColor = "#0a0a1a",
    cardTextColor = "#ffffff",
    qrDotsColor = "black",
    qrBgColor = "white",
    accentColor = "white",
  } = colors;

//   const displayCode = card.activationCode || "VC-2024-001";
  const icons = getIcons();

return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Brilson Visiting Card</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    * { 
      margin: 0;
      padding: 0;
      box-sizing: border-box; 
    }
    body {
      margin: 0;
      padding: 0;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      background: #0a0a1a;
    }
    
    .card-wrapper {
      width: ${VISITING_CARD_VIEWPORT.width}px;
      height: ${VISITING_CARD_VIEWPORT.height}px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #0a0a1a;
      padding: 16px;
      position: relative;
      overflow: hidden;
    }
    
    /* ✅ Premium Animated Gradient Background */
    .card-wrapper::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: 
        radial-gradient(circle at 30% 20%, rgba(212, 168, 67, 0.20) 0%, transparent 50%),
        radial-gradient(circle at 70% 80%, rgba(212, 168, 67, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.05) 0%, transparent 70%);
      animation: rotate 40s linear infinite;
      z-index: 1;
    }
    
    @keyframes rotate {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    /* ✅ Glowing Orbs */
    .orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(100px);
      opacity: 0.20;
      z-index: 1;
    }
    .orb-1 {
      width: 350px;
      height: 350px;
      top: -80px;
      right: -80px;
      background: #d4a843;
      animation: float 8s ease-in-out infinite;
    }
    .orb-2 {
      width: 250px;
      height: 250px;
      bottom: -50px;
      left: -50px;
      background: #d4a843;
      animation: float 10s ease-in-out infinite reverse;
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0px) scale(1); }
      50% { transform: translateY(-25px) scale(1.08); }
    }
    
    /* ✅ Main Card Container - Premium Dark Theme */
    .card-container {
      position: relative;
      z-index: 2;
      width: 100%;
      height: 100%;
      background: linear-gradient(160deg, rgba(20, 20, 40, 0.95), rgba(10, 10, 26, 0.98));
      border-radius: 40px;
      padding: 28px 22px 22px 22px;
      display: flex;
      flex-direction: column;
      border: 1px solid rgba(212, 168, 67, 0.30);
      box-shadow: 
        0 30px 80px rgba(0,0,0,0.50),
        0 0 0 1px rgba(212, 168, 67, 0.15) inset,
        0 0 60px rgba(212, 168, 67, 0.05) inset;
      backdrop-filter: blur(20px);
      overflow: hidden;
    }
    
    /* ✅ Top Gold Accent Line */
    .gold-accent {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, transparent, #d4a843, #f5d77b, #d4a843, transparent);
      z-index: 10;
      animation: shimmer 3s ease-in-out infinite;
    }
    
    @keyframes shimmer {
      0%, 100% { opacity: 0.6; }
      50% { opacity: 1; }
    }
    
    /* ✅ Premium Badge */
    .premium-badge {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 5px 20px;
      background: linear-gradient(135deg, rgba(212, 168, 67, 0.25), rgba(212, 168, 67, 0.08));
      border: 1px solid rgba(212, 168, 67, 0.35);
      border-radius: 30px;
      align-self: center;
      margin-bottom: 8px;
    }
    
    .premium-badge svg {
      width: 16px;
      height: 16px;
      color: #d4a843;
    }
    
    .premium-badge span {
      font-size: 10px;
      font-weight: 800;
      color: #d4a843;
      letter-spacing: 3px;
      text-transform: uppercase;
    }
    
    /* ✅ Feature Grid */
    .feature-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 6px;
      margin: 25px 0 8px 0;
    }
    
    .feature-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 4px;
      padding: 8px 4px;
      background: rgba(255,255,255,0.05);
      border-radius: 16px;
      border: 1px solid rgba(255,255,255,0.06);
      transition: all 0.3s ease;
    }
    
    .feature-item svg {
      width: 32px;
      height: 32px;
      color: #d4a843;
    }
    
    .feature-item .label {
      font-size: 9px;
      font-weight: 700;
      color: rgba(255,255,255,0.70);
      letter-spacing: 0.5px;
      text-transform: uppercase;
      text-align: center;
      line-height: 1.2;
    }
    
    /* ✅ Main Title */
    .main-title {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      text-align: center;
      margin: 25px 0 2px 0;
    }
    
    .main-title h1 {
      font-size: 38px;
      font-weight: 900;
      color: #ffffff;
      letter-spacing: 6px;
      text-transform: uppercase;
      line-height: 1;
      text-shadow: 0 2px 30px rgba(212, 168, 67, 0.10);
    }
    
    .main-title span {
      font-size: 30px;
      font-weight: 900;
      color: #d4a843;
      letter-spacing: 8px;
      text-transform: uppercase;
      line-height: 1;
      text-shadow: 0 2px 30px rgba(212, 168, 67, 0.15);
    }
    
    /* ✅ Divider - Connect.Share.Inspire. */
    .inspire-divider {
      text-align: center;
      margin: 15px 0 8px 0;
      padding: 6px 0;
      border-top: 1px solid rgba(255,255,255,0.06);
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }
    
    .inspire-divider .inspire-text {
      font-size: 10px;
      font-weight: 700;
      color: rgba(255,255,255,0.40);
      letter-spacing: 5px;
      text-transform: uppercase;
    }
    
    /* ✅ Connection Divider */
    .connection-divider {
      display: flex;
      align-items: center;
      gap: 14px;
      margin: 4px 0 10px 0;
    }
    
    .connection-divider .line {
      flex: 1;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(212, 168, 67, 0.30), transparent);
    }
    
    .connection-divider .text {
      font-size: 9px;
      font-weight: 700;
      color: rgba(212, 168, 67, 0.60);
      letter-spacing: 2.5px;
      text-transform: uppercase;
      white-space: nowrap;
    }
    
    /* ✅ QR Section */
    .qr-section {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 20px 0 6px 0;
      padding: 12px;
      background: rgba(255,255,255,0.03);
      border-radius: 28px;
      border: 1px solid rgba(255,255,255,0.05);
    }
    
    .qr-container {
      width: 280px;
      height: 280px;
      flex-shrink: 0;
      border-radius: 22px;
      overflow: hidden;
      background: #ffffff;
      padding: 10px;
      box-shadow: 
        0 10px 40px rgba(0,0,0,0.30),
        0 0 0 1px rgba(212, 168, 67, 0.20) inset;
    }
    
    .qr-image {
      width: 100%;
      height: 100%;
      display: block;
    }
    
    /* ✅ Footer Section */
    .footer-section {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 5px;
      padding-top: 12px;
      border-top: 1px solid rgba(255,255,255,0.05);
      width: 100%;
    }
    
    .footer-text {
      font-size: 10px;
      font-weight: 700;
      color: rgba(255,255,255,0.30);
      letter-spacing: 4px;
      text-transform: uppercase;
    }
    
    .footer-connect {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px 20px;
      background: linear-gradient(135deg, rgba(212, 168, 67, 0.15), rgba(212, 168, 67, 0.05));
      border-radius: 22px;
      border: 1px solid rgba(212, 168, 67, 0.15);
    }
    
    .footer-connect svg {
      width: 14px;
      height: 14px;
      color: #d4a843;
    }
    
    .footer-connect span {
      font-size: 9px;
      font-weight: 700;
      color: #d4a843;
      letter-spacing: 2.5px;
      text-transform: uppercase;
    }
  </style>
</head>
<body>
  <div class="card-wrapper">
    <!-- Glow Orbs -->
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>
    
    <div class="card-container">
      <!-- Gold Accent -->
      <div class="gold-accent"></div>
      
      <!-- Premium Badge -->
      <div class="premium-badge">
        ${icons.premium}
        <span>Premium Quality</span>
      </div>
      
      <!-- Main Title -->
      <div class="main-title">
        <h1>Brilson</h1>
        <span>Visiting Card</span>
      </div>
      
      <!-- Feature Grid -->
      <div class="feature-grid">
        <div class="feature-item">
          ${icons.eco}
          <span class="label">Eco<br>Friendly</span>
        </div>
        <div class="feature-item">
          ${icons.durable}
          <span class="label">Durable<br>& Long</span>
        </div>
        <div class="feature-item">
          ${icons.water}
          <span class="label">Water &<br>Tear</span>
        </div>
        <div class="feature-item">
          ${icons.finish}
          <span class="label">Premium<br>Finish</span>
        </div>
      </div>
      
      <!-- Divider -->
      <div class="inspire-divider">
        <span class="inspire-text">Connect • Share • Inspire</span>
      </div>
      
      <!-- Connection Divider -->
      <div class="connection-divider">
        <span class="line"></span>
        <span class="text">Make Every Connection Count</span>
        <span class="line"></span>
      </div>
      
      <!-- QR Section -->
      <div class="qr-section">
        <div class="qr-container">
          <img class="qr-image" src="data:image/png;base64,{{QR_DATA}}" alt="QR Code" />
        </div>
      </div>
      
      <!-- Footer -->
      <div class="footer-section">
        <div class="footer-text">Tap • Scan • Connect</div>
        <div class="footer-connect">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12.55a11 11 0 0 1 14.08 0"/>
            <path d="M1.42 9a16 16 0 0 1 21.16 0"/>
            <path d="M8.53 16.11a6 6 0 0 1 6.94 0"/>
            <circle cx="12" cy="20" r="1.5"/>
          </svg>
          <span>Smarter Way to Network</span>
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
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--font-render-hinting=none",
      "--disable-web-security",
      "--disable-features=IsolateOrigins,site-per-process",
    ],
  });
  browserInstance.on("disconnected", () => {
    browserInstance = null;
  });
  return browserInstance;
}

async function createPreparedPage(browser, logoDataUrl) {
  const page = await browser.newPage();
  await page.setViewport(VISITING_CARD_VIEWPORT);
  await page.setContent(
    "<!DOCTYPE html><html><head></head><body></body></html>",
  );

  await page.addScriptTag({ path: QR_CODE_STYLING_BROWSER_BUNDLE });

  await page.evaluate((logo) => {
    window.__QR_LOGO__ = logo;
  }, logoDataUrl);

  return page;
}

async function renderQrBase64(page, { url, qrDotsColor, qrBgColor }) {
  return page.evaluate(
    async ({ url, qrDotsColor, qrBgColor }) => {
      const qrCode = new window.QRCodeStyling({
        width: 380,
        height: 380,
        type: "svg",
        data: url,
        image: window.__QR_LOGO__ || undefined,
        dotsOptions: {
          margin: 10,
          type: "dots",
          color: "black",
        },
        backgroundOptions: {
          color: "white",
        },
        imageOptions: {
          crossOrigin: "anonymous",
          imageSize: 0.3,
          margin: 8,
        },
        cornersDotOptions: {
          type: "rounded",
          color: "black",
        },
        cornersSquareOptions: {
          type: "extra-rounded",
          color: "black",
        },
      });

      const blob = await qrCode.getRawData("png");
      const arrayBuffer = await blob.arrayBuffer();

      let binary = "";
      const bytes = new Uint8Array(arrayBuffer);
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return btoa(binary);
    },
    { url, qrDotsColor, qrBgColor },
  );
}

async function renderVisitingCardPng(page, { card, colors }) {
  const profileUrl = `${process.env.BASE_URL1 || "https://brilson.in"}/c/card/${card.activationCode}`;

  const qrBase64 = await renderQrBase64(page, {
    url: profileUrl,
    qrDotsColor: colors.qrDotsColor || "#d4a843",
    qrBgColor: colors.qrBgColor || "#ffffff",
  });

  const html = generateVisitingCardHTML(card, colors).replace(
    "{{QR_DATA}}",
    qrBase64,
  );

  await page.setContent(html, {
    waitUntil: "networkidle0",
    timeout: 30000,
  });

  // Wait for fonts
  await page.evaluate(async () => {
    await document.fonts.ready;
  });

  await page.waitForSelector(".qr-image", { timeout: 10000 });
  await page.evaluate(() => {
    const img = document.querySelector(".qr-image");
    if (img.complete && img.naturalWidth > 0) return;
    return new Promise((resolve) => {
      img.onload = resolve;
      img.onerror = resolve;
    });
  });

  const cardHandle = await page.$(".card-container");
  if (!cardHandle) {
    throw new Error("Visiting card element not found");
  }

  const screenshot = await cardHandle.screenshot({
    type: "png",
    omitBackground: true,
    encoding: "binary",
  });

  await cardHandle.dispose();

  return screenshot;
}

async function runWithPagePool(browser, items, poolSize, workerFn) {
  const logoDataUrl = await getLogoDataUrl();

  const pages = await Promise.all(
    Array.from({ length: Math.min(poolSize, items.length) }, () =>
      createPreparedPage(browser, logoDataUrl),
    ),
  );

  const results = new Array(items.length);
  let cursor = 0;

  async function worker(page) {
    while (cursor < items.length) {
      const index = cursor++;
      const item = items[index];
      try {
        results[index] = {
          ok: true,
          index,
          item,
          buffer: await workerFn(page, item),
        };
      } catch (err) {
        results[index] = { ok: false, index, item, error: err.message };
      }
    }
  }

  await Promise.all(pages.map((page) => worker(page)));
  await Promise.all(pages.map((page) => page.close().catch(() => {})));

  return results;
}

// ✅ BULK DOWNLOAD - Visiting Cards
router.post("/visiting-cards/bulk-download", async (req, res) => {
  try {
    const { cardIds, colors } = req.body;

    if (!Array.isArray(cardIds) || cardIds.length === 0) {
      return res
        .status(400)
        .json({ error: "`cardIds` must be a non-empty array." });
    }

    const MAX_CARDS_PER_REQUEST = 50;
    if (cardIds.length > MAX_CARDS_PER_REQUEST) {
      return res.status(400).json({
        error: `Max ${MAX_CARDS_PER_REQUEST} cards per request. Split into batches.`,
      });
    }

    const cards = await Card.find({ _id: { $in: cardIds } }).populate(
      "owner profile",
    );

    if (!cards || cards.length === 0) {
      return res.status(404).json({ error: "No cards found" });
    }

    const browser = await getBrowser();

    const items = cards.map((card) => ({ card, colors: colors || {} }));

    const results = await runWithPagePool(
      browser,
      items,
      PAGE_POOL_SIZE,
      renderVisitingCardPng,
    );

    const failed = results.filter((r) => !r.ok);
    if (failed.length > 0) {
      console.error(
        `[visiting-cards-bulk] ${failed.length}/${cards.length} cards failed:`,
        failed.map((f) => ({
          index: f.index,
          activationCode: f.item.card.activationCode,
          error: f.error,
        })),
      );
    }

    const zip = new JSZip();
    const folder = zip.folder("brilson-visiting-cards");

    results.forEach((r) => {
      if (!r.ok) return;
      const filename = `visiting-card-${r.item.card.activationCode}.png`;
      folder.file(filename, r.buffer);
    });

    if (failed.length > 0) {
      folder.file(
        "FAILED_CARDS.json",
        JSON.stringify(
          failed.map((f) => ({
            activationCode: f.item.card.activationCode,
            error: f.error,
          })),
          null,
          2,
        ),
      );
    }

    const successfulCount = results.length - failed.length;

    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=brilson-visiting-cards-${Date.now()}.zip`,
    );
    res.setHeader("X-Processed-Count", successfulCount);
    res.setHeader("X-Failed-Count", failed.length);

    const zipBuffer = await zip.generateAsync({
      type: "nodebuffer",
      compression: "DEFLATE",
      compressionOptions: { level: 9 },
    });

    res.send(zipBuffer);
  } catch (error) {
    console.error("Bulk download error:", error);
    if (!res.headersSent) res.status(500).json({ error: error.message });
  }
});

// ✅ SINGLE VISITING CARD DOWNLOAD
router.get("/visiting-cards/:id/download", async (req, res) => {
  let page = null;
  try {
    const card = await Card.findById(req.params.id).populate("owner profile");

    if (!card) {
      return res.status(404).json({ error: "Card not found" });
    }

    const colors = {
      cardBgColor: req.query.cardBgColor || "#0a0a1a",
      cardTextColor: req.query.cardTextColor || "#ffffff",
      qrDotsColor: req.query.qrDotsColor || "#d4a843",
      qrBgColor: req.query.qrBgColor || "#ffffff",
      accentColor: req.query.accentColor || "#d4a843",
    };

    const browser = await getBrowser();
    const logoDataUrl = await getLogoDataUrl();
    page = await createPreparedPage(browser, logoDataUrl);

    const screenshot = await renderVisitingCardPng(page, { card, colors });

    res.setHeader("Content-Type", "image/png");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=visiting-card-${card.activationCode}.png`,
    );
    res.send(screenshot);
  } catch (error) {
    console.error("Download error:", error);
    if (!res.headersSent) res.status(500).json({ error: error.message });
  } finally {
    if (page) await page.close().catch(() => {});
  }
});

// ✅ GRACEFUL SHUTDOWN
process.on("SIGINT", async () => {
  if (browserInstance) await browserInstance.close().catch(() => {});
  process.exit(0);
});
process.on("SIGTERM", async () => {
  if (browserInstance) await browserInstance.close().catch(() => {});
  process.exit(0);
});

module.exports = router;