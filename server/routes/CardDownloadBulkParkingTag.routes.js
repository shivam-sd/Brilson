const express = require("express");
const router = express.Router();
const JSZip = require("jszip");
const Card = require("../models/AddParkingTag.model");
const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");

const QR_CODE_STYLING_BROWSER_BUNDLE =
  require.resolve("qr-code-styling/lib/qr-code-styling.js");

const PAGE_POOL_SIZE = Number(process.env.CARD_RENDER_CONCURRENCY) || 4;

// 2.5" × 4" @ 300 DPI (Portrait Orientation)
const PARKING_TAG_VIEWPORT = { width: 750, height: 1200 };

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
    const domain = process.env.VITE_DOMAIN || "https://brilson.in";
    const response = await fetch(`${domain}/B.png`);
    const arrayBuffer = await response.arrayBuffer();
    cachedLogoDataUrl = `data:image/png;base64,${Buffer.from(
      arrayBuffer,
    ).toString("base64")}`;
    return cachedLogoDataUrl;
  } catch (err) {
    console.error("[parking-tags] Could not load QR logo:", err.message);
    cachedLogoDataUrl = null;
    return null;
  }
}

// SVG Icons as inline strings
const getIcons = () => ({
  swirl: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#d4a843" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>`,
  sparkle: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#d4a843" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1 6 6-1-4 4 4 6-6-4-4 6-4-6-6 4 4-6-4-4 6 1z"/></svg>`,
  phone: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12" y2="18"/></svg>`,
  world: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#d4a843" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
  shield: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#d4a843" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>`,
  qr: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="7" height="7"/><rect x="15" y="2" width="7" height="7"/><rect x="2" y="15" width="7" height="7"/><line x1="11" y1="11" x2="11" y2="15"/><line x1="13" y1="11" x2="13" y2="15"/><line x1="11" y1="13" x2="15" y2="13"/><line x1="15" y1="9" x2="15" y2="11"/></svg>`,
});

function generateParkingTagHTML(card, colors) {
  const {
    cardBgColor = "#FFFFFF",
    cardTextColor = "#000000",
    qrDotsColor = "#000000",
    qrBgColor = "#ffffff",
  } = colors;

  const displayCode = card.activationCode || "52V28-91S28-6B799";
  const icons = getIcons();

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Brilson Parking Tag</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@400;600;700;800;900&family=Noto+Sans+Devanagari:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;600;700&display=swap');

    * { 
      margin: 0;
      padding: 0;
      box-sizing: border-box; 
    }
    body {
      margin: 0;
      padding: 0;
      font-family: 'Libre Franklin', 'Noto Sans Devanagari', sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      background: transparent;
    }
    .tag-wrapper {
      width: ${PARKING_TAG_VIEWPORT.width}px;
      height: ${PARKING_TAG_VIEWPORT.height}px;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 12px;
      background: transparent;
      }
      .tag-container {
        background: #FEE11B;
        border-radius: 36px;
        overflow: hidden;
        width: 100%;
        height: 100%;
        display: flex;
        padding-top:14px;
        padding-bottom:14px;
      flex-direction: column;
      position: relative;
      border: 2px solid rgba(26,26,26,0.1);
      box-shadow: 0 20px 50px -15px rgba(0,0,0,0.25);
    }

    /* ===== TOP HEADER SECTION (Brand + Car Icon) ===== */
    .header-section {
      width: 100%;
      padding: 18px 24px 12px 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
      border-bottom: 1px solid rgba(26,26,26,0.15);
    }
    .brand-logo {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction:column;
      gap: 14px;
    }
    .brand-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid black;
      border-radius:50%;
      padding:3px;
    }
    .brand-icon svg {
      width: 75px;
      height: 75px;
      color: #1a1a1a;
    }
    .brand-name {
      font-size: 80px;
      font-weight: 800;
      letter-spacing: 6px;
      color: #1a1a1a;
      font-family: 'Libre Franklin', sans-serif;
      margin: 0;
      line-height: 1;
      text-transform: uppercase;
    }

    /* ===== TAGLINE SECTION ===== */
    .tagline-section {
      width: 100%;
      padding: 12px 20px;
      display: flex;
      flex-direction: column;
      margin-top:4px;
      align-items: center;
      justify-content: center;
      text-align: center;
      border-bottom: 1px solid rgba(26,26,26,0.15);
    }
    .tagline-title {
      font-size: 45px;
      font-weight: 600;
      letter-spacing: 8px;
      color: #1a1a1a;
      text-transform: uppercase;
      line-height: 1.1;
    }
    .tagline-sub {
      font-size: 20px;
      font-weight: 600;
      letter-spacing: 3px;
      color: rgba(26,26,26,0.7);
      margin: 6px 0 0 0;
      text-transform: uppercase;
    }

    /* ===== QR CODE SECTION  ===== */
    .qr-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 14px 24px;
      position: relative;
      border-bottom: 1px solid rgba(26,26,26,0.15);
    }
    .qr-container {
      padding: 14px;
      background: #ffffff;
      border-radius: 24px;
      box-shadow: 0 10px 30px -10px rgba(0,0,0,0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      position: relative;
    }
    .corner-accent {
      position: absolute;
      width: 20px;
      height: 20px;
      border: 3px solid #1a1a1a;
    }
    .corner-tl {
      top: -3px;
      left: -3px;
      border-right: none;
      border-bottom: none;
      border-radius: 8px 0 0 0;
    }
    .corner-tr {
      top: -3px;
      right: -3px;
      border-left: none;
      border-bottom: none;
      border-radius: 0 8px 0 0;
    }
    .corner-bl {
      bottom: -3px;
      left: -3px;
      border-right: none;
      border-top: none;
      border-radius: 0 0 0 8px;
    }
    .corner-br {
      bottom: -3px;
      right: -3px;
      border-left: none;
      border-top: none;
      border-radius: 0 0 8px 0;
    }
    .qr-image {
      width: 520px;
      height:520px;
      display: block;
      image-rendering: auto;
      position: relative;
      z-index: 2;
    }

    /* ===== BOTTOM ACTIONS SECTION ===== */
    .actions-section {
      width: 100%;
      padding: 16px 20px 14px 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
    }
    .quick-action {
      display: flex;
      align-items: flex-start;
      justify-content: space-around;
      width: 100%;
      gap: 10px;
    }
    .action-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      transition: all 0.3s ease;
      flex: 1;
    }
    .action-item:hover {
      transform: translateY(-2px);
    }
    .action-icon-wrapper {
      width: 52px;
      height: 52px;
      border: 1.5px solid #1a1a1a;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255,255,255,0.3);
      transition: all 0.3s ease;
      position: relative;
    }
    .action-icon {
      width: 26px;
      height: 26px;
      color: #1a1a1a;
      transition: all 0.3s ease;
    }
    .action-label {
      font-size: 11px;
      font-weight: 800;
      color: #1a1a1a;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      text-align: center;
      font-family: 'Libre Franklin', sans-serif;
      line-height: 1.2;
    }

    /* ===== WEBSITE + ACTIVATION FOOTER ===== */
    .footer-section {
      width: 100%;
      padding: 10px 20px 14px 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    .website-box {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      border:1px solid black;
      border-radius:30px;
      margin-top:10px;
      padding:2px 8px;
    }
    .website-icon svg {
      color: black;
      width: 16px;
      height: 16px;
    }
    .website-text {
      font-size: 18px;
      font-weight: 500;
      color: #1a1a1a;
      letter-spacing: 3px;
      margin: 0;
      font-family: 'Libre Franklin', sans-serif;
    }
    .activation-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      width: 100%;
    }
    .activation-label {
      display: flex;
      align-items: center;
      gap: 8px;
      opacity: 0.6;
      font-size: 19px;
      font-weight: 700;
      letter-spacing: 3px;
      color: #1a1a1a;
      text-transform: uppercase;
    }
    .label-line {
      width: 25px;
      height: 1px;
      background: #1a1a1a;
      opacity: 0.4;
    }
    .activation-code {
      font-size: 18px;
      font-weight: 700;
      color: #1a1a1a;
      letter-spacing: 3px;
      margin: 0;
      font-family: 'Libre Franklin', monospace;
    }
    .secure-badge {
    width:100%;
      display: flex;
      align-items: center;
         justify-content: center;
      gap: 5px;
      padding:3px;
      margin-top: 3px;
    }
    .secure-badge svg {
      color: #1a1a1a;
      width: 14px;
      height: 14px;
    }
    .secure-text {
      font-size: 15px;
      color: #1a1a1a;
      letter-spacing: 1.5px;
      font-weight: 700;
      opacity: 0.7;
    }
  </style>
</head>
<body>
  <div class="tag-wrapper">
    <div class="tag-container">

      <!-- TOP HEADER: Brand + Car Icon -->
      <div class="header-section">
        <div class="brand-logo">
          <div class="brand-icon">
            <svg viewBox="0 0 65 65" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 44h36M12 44a5 5 0 0 1-5-5v-10l6-12A5 5 0 0 1 18 12h24a5 5 0 0 1 5 5l6 12v10a5 5 0 0 1-5 5M12 44a5 5 0 1 0 10 0M48 44a5 5 0 1 0-10 0"/>
              <circle cx="17" cy="38" r="4" fill="currentColor" fill-opacity="0.2"/>
              <circle cx="43" cy="38" r="4" fill="currentColor" fill-opacity="0.2"/>
              <path d="M17 24h26" stroke-width="4"/>
              <rect x="19" y="14" width="22" height="10" rx="3" fill="currentColor" fill-opacity="0.1"/>
              <path d="M24 14l-6 8h28l-6-8H24z" fill="currentColor" fill-opacity="0.05"/>
              <circle cx="9" cy="32" r="3" fill="currentColor" fill-opacity="0.15"/>
              <circle cx="51" cy="32" r="3" fill="currentColor" fill-opacity="0.15"/>
            </svg>
          </div>
          <h1 class="brand-name">PARKING TAG</h1>
        </div>
      </div>

      <!-- TAGLINE: Scan This Tag -->
      <div class="tagline-section">
        <h2 class="tagline-title">SCAN THIS TAG</h2>
        <p class="tagline-sub">To Contact Vehicle Owner</p>
      </div>

      <!-- QR CODE: Main Focus -->
      <div class="qr-section">
        <div class="qr-container">
          <div class="corner-accent corner-tl"></div>
          <div class="corner-accent corner-tr"></div>
          <div class="corner-accent corner-bl"></div>
          <div class="corner-accent corner-br"></div>
          <img class="qr-image" src="data:image/png;base64,{{QR_DATA}}" alt="QR Code" />
        </div>
      </div>


      <div class="footer-section">
       


        <div class="activation-wrapper">
          <div class="activation-label">
            <div class="label-line"></div>
            <span>Activation Code</span>
            <div class="label-line"></div>
          </div>
          <div class="activation-code">${displayCode}</div>

           <div class="website-box">
          <div class="website-icon">${icons.world}</div>
          <p class="website-text">www.brilson.in</p>
        </div>

        </div>
      </div>



      <!-- QUICK ACTIONS: Owner, Call, Location -->
      <div class="actions-section">
        <div class="quick-action">
          <div class="action-item owner">
            <div class="action-icon-wrapper">
              <svg class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <span class="action-label">OWNER</span>
          </div>

          <div class="action-item call">
            <div class="action-icon-wrapper">
              <svg class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </div>
            <span class="action-label">CALL</span>
          </div>

          <div class="action-item location">
            <div class="action-icon-wrapper">
              <svg class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <span class="action-label">LOCATION</span>
          </div>
        </div>
      </div>

      <!-- FOOTER: Website + Activation Code -->
       <div class="secure-badge">
            ${icons.shield}
            <span class="secure-text">SECURE • VERIFIED</span>
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
  await page.setViewport(PARKING_TAG_VIEWPORT);
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
        width: 320,
        height: 320,
        type: "svg",
        data: url,
        image: window.__QR_LOGO__ || undefined,
        dotsOptions: {
          margin: 10,
          type: "dots",
          color: qrDotsColor || "#1a1a1a",
        },
        backgroundOptions: {
          color:
            qrBgColor === "transparent" ? "#ffffff" : qrBgColor || "#ffffff",
        },
        imageOptions: {
          crossOrigin: "anonymous",
          imageSize: 0.4,
          margin: 8,
        },
        cornersDotOptions: {
          type: "rounded",
          color: "#d4a843",
        },
        cornersSquareOptions: {
          type: "extra-rounded",
          color: "#1a1a1a",
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

async function renderParkingTagPng(page, { card, colors }) {
  const profileUrl = `${process.env.VITE_DOMAIN || "https://brilson.in"}/c/parking-tag/${
    card.slug || card.activationCode
  }`;

  const qrBase64 = await renderQrBase64(page, {
    url: profileUrl,
    qrDotsColor: colors.qrDotsColor || "#1a1a1a",
    qrBgColor: colors.qrBgColor || "#ffffff",
  });

  const html = generateParkingTagHTML(card, colors).replace(
    "{{QR_DATA}}",
    qrBase64,
  );

  await page.setContent(html, {
    waitUntil: "networkidle0",
    timeout: 30000,
  });

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

  const tagHandle = await page.$(".tag-container");
  if (!tagHandle) {
    throw new Error("Parking tag element not found");
  }

  const screenshot = await tagHandle.screenshot({
    type: "png",
    omitBackground: true,
    encoding: "binary",
  });

  await tagHandle.dispose();

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

// BULK DOWNLOAD ROUTE - Parking Tags
router.post("/parking-tags/bulk-download", async (req, res) => {
  try {
    const { cardIds, colors } = req.body;

    if (!Array.isArray(cardIds) || cardIds.length === 0) {
      return res
        .status(400)
        .json({ error: "`cardIds` must be a non-empty array." });
    }

    const MAX_TAGS_PER_REQUEST = 100;
    if (cardIds.length > MAX_TAGS_PER_REQUEST) {
      return res.status(400).json({
        error: `Max ${MAX_TAGS_PER_REQUEST} tags per request. Split into batches.`,
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
      renderParkingTagPng,
    );

    const failed = results.filter((r) => !r.ok);
    if (failed.length > 0) {
      console.error(
        `[parking-tags-bulk-download] ${failed.length}/${cards.length} tags failed:`,
        failed.map((f) => ({
          index: f.index,
          activationCode: f.item.card.activationCode,
          error: f.error,
        })),
      );
    }

    const zip = new JSZip();
    const folder = zip.folder("brilson-parking-tags");

    results.forEach((r) => {
      if (!r.ok) return;
      const filename = `parking-tag-${r.item.card.activationCode}.png`;
      folder.file(filename, r.buffer);
    });

    if (failed.length > 0) {
      folder.file(
        "FAILED_TAGS.json",
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
      `attachment; filename=brilson-parking-tags-${Date.now()}.zip`,
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

// SINGLE PARKING TAG DOWNLOAD ROUTE
router.get("/parking-tags/:id/download", async (req, res) => {
  let page = null;
  try {
    const card = await Card.findById(req.params.id).populate("owner profile");

    if (!card) {
      return res.status(404).json({ error: "Card not found" });
    }

    const colors = {
      cardBgColor: req.query.cardBgColor || "#FFFFFF",
      cardTextColor: req.query.cardTextColor || "#000000",
      qrDotsColor: req.query.qrDotsColor || "#1a1a1a",
      qrBgColor: req.query.qrBgColor || "#ffffff",
    };

    const browser = await getBrowser();
    const logoDataUrl = await getLogoDataUrl();
    page = await createPreparedPage(browser, logoDataUrl);

    const screenshot = await renderParkingTagPng(page, { card, colors });

    res.setHeader("Content-Type", "image/png");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=parking-tag-${card.activationCode}.png`,
    );
    res.send(screenshot);
  } catch (error) {
    console.error("Download error:", error);
    if (!res.headersSent) res.status(500).json({ error: error.message });
  } finally {
    if (page) await page.close().catch(() => {});
  }
});

// GRACEFUL SHUTDOWN
process.on("SIGINT", async () => {
  if (browserInstance) await browserInstance.close().catch(() => {});
  process.exit(0);
});
process.on("SIGTERM", async () => {
  if (browserInstance) await browserInstance.close().catch(() => {});
  process.exit(0);
});

module.exports = router;