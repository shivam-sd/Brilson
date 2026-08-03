const express = require('express');
const router = express.Router();
const JSZip = require('jszip');
const Card = require('../models/AddParkingTag.model');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const QR_CODE_STYLING_BROWSER_BUNDLE = require.resolve(
  'qr-code-styling/lib/qr-code-styling.js'
);

const PAGE_POOL_SIZE = Number(process.env.CARD_RENDER_CONCURRENCY) || 4;

// 1500 × 900 viewport
const PARKING_TAG_VIEWPORT = { width: 1500, height: 900 };

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
    console.error('[parking-tags] Could not load QR logo:', err.message);
    cachedLogoDataUrl = null;
    return null;
  }
}

// SVG Icons as inline strings - SAME AS FRONTEND
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
    cardBgColor = '#FFFFFF',
    cardTextColor = '#000000',
    qrDotsColor = '#000000',
    qrBgColor = '#ffffff'
  } = colors;

  const displayCode = card.activationCode || '52V28-91S28-6B799';
  const icons = getIcons();

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Brilson Parking Tag</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Playfair+Display:wght@400;700;800&family=Noto+Sans+Devanagari:wght@400;600;700&display=swap" rel="stylesheet">
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
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    .tag-wrapper {
      width: ${PARKING_TAG_VIEWPORT.width}px;
      height: ${PARKING_TAG_VIEWPORT.height}px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: transparent;
      padding: 20px;
    }
    .tag-container {
      background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
      border-radius: 60px;
      border: 2px solid rgba(255,255,255,0.3);
      width: 100%;
      height: 100%;
      box-shadow: 0 40px 80px -25px rgba(0,0,0,0.3), 0 0 0 2px rgba(255,215,0,0.1) inset;
      display: flex;
      overflow: hidden;
      position: relative;
    }
    .gold-accent {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 8px;
      background: linear-gradient(90deg, #d4a843, #f5d77b, #d4a843);
      z-index: 10;
    }
    .left-section {
      width: 50%;
      background: linear-gradient(160deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 28px;
      padding: 35px 30px;
      position: relative;
    }
    .pattern-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: radial-gradient(circle at 20% 50%, rgba(212,168,67,0.05) 0%, transparent 50%);
      pointer-events: none;
    }
    .brand-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
      z-index: 2;
    }
    .brand-logo {
      display: flex;
      align-items: center;
      justify-content:center;
      flex-direction:column;
      gap: 10px;
    }
    .brand-icon {
      // width: 70px;
      // height: 70px;
      // background: linear-gradient(135deg, #d4a843, #f5d77b);
      border-radius: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 80px;
      font-weight: 900;
      color: #0a0a0a;
      // box-shadow: 0 15px 30px -10px rgba(212,168,67,0.3);
    }
    .brand-name {
      font-size: 48px;
      font-weight: 800;
      letter-spacing: 12px;
      color: #f5d77b;
      font-family: 'Playfair Display', serif;
      margin: 0;
      line-height: 1;
      text-shadow: 0 4px 20px rgba(212,168,67,0.2);
    }
    .brand-divider {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 28px;
      margin-top: 6px;
      width: 100%;
    }
    .divider-line {
      width: 120px;
      height: 4px;
      border-radius: 2px;
    }
    .divider-line-left {
      background: linear-gradient(90deg, transparent, #d4a843);
    }
    .divider-line-right {
      background: linear-gradient(90deg, #d4a843, transparent);
    }
    .divider-icon svg {
      color: #d4a843;
      width: 35px;
      height: 35px;
    }

    .tagline-box {
      text-align: center;
      position: relative;
      z-index: 2;
      background: rgba(212,168,67,0.08);
      padding: 24px 48px;
      border-radius: 32px;
      border: 2px solid rgba(212,168,67,0.15);
      backdrop-filter: blur(10px);
    }
    .tagline-sparkle {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 28px;
      margin-bottom: 12px;
    }
    .sparkle-line {
      width: 60px;
      height: 2px;
      border-radius: 1px;
    }
    .sparkle-line-left {
      background: linear-gradient(90deg, transparent, rgba(212,168,67,0.5));
    }
    .sparkle-line-right {
      background: linear-gradient(90deg, rgba(212,168,67,0.5), transparent);
    }
    .sparkle-icon svg {
      color: #d4a843;
      width: 35px;
      height: 35px;
    }
    .tagline-title {
      font-size: 40px;
      font-weight: 700;
      letter-spacing: 18px;
      color: #ffffff;
      margin: 0;
      text-transform: uppercase;
    }
    .tagline-sub {
      font-size: 22px;
      font-weight: 500;
      letter-spacing: 6px;
      color: #d4a843;
      margin: 10px 0 0 0;
      opacity: 0.9;
    }

    .hindi-box {
      background: linear-gradient(135deg, rgba(212,168,67,0.15), rgba(212,168,67,0.05));
      border-radius: 28px;
      border: 2px solid rgba(212,168,67,0.2);
      padding: 22px 40px;
      max-width: 90%;
      position: relative;
      z-index: 2;
      backdrop-filter: blur(10px);
    }
    .hindi-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 32px;
    }
    .hindi-icon {
      background: linear-gradient(135deg, #d4a843, #f5d77b);
      padding: 14px;
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #0a0a0a;
      flex-shrink: 0;
    }
    .hindi-icon svg {
      width: 38px;
      height: 38px;
    }
    .hindi-text {
      font-size: 28px;
      font-weight: 600;
      color: #e0e0e0;
      letter-spacing: 1.5px;
      margin: 0;
      line-height: 1.4;
      font-family: 'Noto Sans Devanagari', sans-serif;
    }

    .website-box {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 20px;
      position: relative;
      z-index: 2;
      padding: 14px 40px;
      border-radius: 50px;
      background: rgba(255,255,255,0.05);
      border: 2px solid rgba(255,255,255,0.08);
    }
    .website-icon svg {
      color: #d4a843;
      width: 30px;
      height: 30px;
    }
    .website-text {
      font-size: 22px;
      font-weight: 500;
      color: #ffffff;
      letter-spacing: 8px;
      margin: 0;
      font-family: 'Playfair Display', serif;
      opacity: 0.9;
    }

    .right-section {
      width: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 30px;
      background: linear-gradient(160deg, #fafafa 0%, #f0f0f0 100%);
      padding: 40px 35px;
      position: relative;
    }

    .qr-container {
      padding: 32px;
      background: linear-gradient(135deg, #ffffff, #fafafa);
      border-radius: 40px;
      box-shadow: 0 25px 60px -15px rgba(0,0,0,0.12), 0 0 0 2px rgba(212,168,67,0.18) inset;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      position: relative;
    }
    .corner-accent {
      position: absolute;
      width: 32px;
      height: 32px;
      border: 5px solid #d4a843;
    }
    .corner-tl {
      top: -5px;
      left: -5px;
      border-right: none;
      border-bottom: none;
      border-radius: 8px 0 0 0;
    }
    .corner-tr {
      top: -5px;
      right: -5px;
      border-left: none;
      border-bottom: none;
      border-radius: 0 8px 0 0;
    }
    .corner-bl {
      bottom: -5px;
      left: -5px;
      border-right: none;
      border-top: none;
      border-radius: 0 0 0 8px;
    }
    .corner-br {
      bottom: -5px;
      right: -5px;
      border-left: none;
      border-top: none;
      border-radius: 0 0 8px 0;
    }
    .qr-image {
      width: 440px;
      height: 440px;
      display: block;
      image-rendering: auto;
      position: relative;
      z-index: 2;
    }

    .scan-badge {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-top: 18px;
      padding: 10px 28px;
      background: linear-gradient(135deg, #d4a843, #f5d77b);
      border-radius: 32px;
      color: #0a0a0a;
      font-size: 18px;
      font-weight: 700;
      letter-spacing: 4px;
      text-transform: uppercase;
    }
    .scan-badge svg {
      width: 20px;
      height: 20px;
    }

    .activation-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      width: 100%;
    }
    .activation-label {
      display: flex;
      align-items: center;
      gap: 14px;
      opacity: 0.6;
      font-size: 14px;
      font-weight: 600;
      letter-spacing: 5px;
      color: #666;
      text-transform: uppercase;
    }
    .label-line {
      width: 45px;
      height: 2px;
      background: #ccc;
    }
    .activation-code {
      font-size: 32px;
      font-weight: 700;
      color: #1a1a1a;
      letter-spacing: 5px;
      margin: 0;
      font-family: 'Inter', monospace;
      background: linear-gradient(135deg, #1a1a1a, #333);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .secure-badge {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-top: 6px;
    }
    .secure-badge svg {
      color: #d4a843;
      width: 18px;
      height: 18px;
    }
    .secure-text {
      font-size: 12px;
      color: #666;
      letter-spacing: 2px;
      font-weight: 500;
    }
      /* Quick Action Section Styles */
.quick-action {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  padding: 12px 20px;
  margin-top: 8px;
  width: 100%;
  position: relative;
  z-index: 2;
  border-top: 1px solid rgba(212, 168, 67, 0.12);
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.action-item:hover {
  transform: translateY(-2px);
}

.action-item:hover .action-icon-wrapper {
  background: linear-gradient(135deg, rgba(212, 168, 67, 0.25), rgba(212, 168, 67, 0.1));
  border-color: rgba(212, 168, 67, 0.4);
  box-shadow: 0 8px 25px -8px rgba(212, 168, 67, 0.2);
}

.action-icon-wrapper {
  width: 56px;
  height: 56px;
  border: 2px solid rgba(255, 255, 255, 0.12);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(212, 168, 67, 0.06);
  transition: all 0.3s ease;
  position: relative;
}

.action-icon-wrapper::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: 50%;
  padding: 2px;
  background: linear-gradient(135deg, rgba(212, 168, 67, 0.3), transparent);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.action-item:hover .action-icon-wrapper::before {
  opacity: 1;
}

.action-icon {
  width: 28px;
  height: 28px;
  color: #d4a843;
  transition: all 0.3s ease;
}

.action-item:hover .action-icon {
  transform: scale(1.1);
  color: #f5d77b;
}

.action-label {
  font-size: 11px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 2px;
  text-transform: uppercase;
  text-align: center;
  transition: all 0.3s ease;
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
  line-height: 1.2;
}

.action-item:hover .action-label {
  color: #d4a843;
}

/* Active/Selected State */
.action-item.active .action-icon-wrapper {
  background: linear-gradient(135deg, rgba(212, 168, 67, 0.2), rgba(212, 168, 67, 0.08));
  border-color: #d4a843;
  box-shadow: 0 0 30px rgba(212, 168, 67, 0.15);
}

.action-item.active .action-label {
  color: #d4a843;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .quick-action {
    gap: 20px;
    padding: 8px 12px;
    flex-wrap: wrap;
  }
  
  .action-icon-wrapper {
    width: 48px;
    height: 48px;
  }
  
  .action-icon {
    width: 24px;
    height: 24px;
  }
  
  .action-label {
    font-size: 9px;
    letter-spacing: 1.5px;
  }
}

@media (max-width: 480px) {
  .quick-action {
    gap: 12px;
    padding: 6px 8px;
  }
  
  .action-icon-wrapper {
    width: 40px;
    height: 40px;
  }
  
  .action-icon {
    width: 20px;
    height: 20px;
  }
  
  .action-label {
    font-size: 8px;
    letter-spacing: 1px;
  }
}

/* Dark Theme Support */
.dark .action-icon-wrapper {
  border-color: rgba(255, 255, 255, 0.08);
  background: rgba(212, 168, 67, 0.04);
}

.dark .action-label {
  color: rgba(255, 255, 255, 0.4);
}

.dark .action-item:hover .action-label {
  color: #d4a843;
}

/* Animation */
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(212, 168, 67, 0.2);
  }
  100% {
    box-shadow: 0 0 0 10px rgba(212, 168, 67, 0);
  }
}

.action-item:focus-visible .action-icon-wrapper {
  animation: pulse 1.5s ease-out;
  outline: 2px solid #d4a843;
  outline-offset: 2px;
}

/* Tooltip on Hover (Optional) */
.action-item .tooltip {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%) scale(0.8);
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.5px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
  /* Car Icon - Bigger Size */
.action-item.car .action-icon-wrapper {
  width: 80px !important;
  height: 80px !important;
  border-color: rgba(212, 168, 67, 0.3) !important;
  background: rgba(212, 168, 67, 0.1) !important;
}

.action-item.car .action-icon {
  width: 50px !important;
  height: 50px !important;
}

.action-item.car .action-label {
  font-size: 13px !important;
  color: rgba(255, 255, 255, 0.8) !important;
}
  </style>
</head>
<body>
  <div class="tag-wrapper">
    <div class="tag-container">
      <div class="gold-accent"></div>

      <!-- LEFT SECTION -->
      <div class="left-section">
        <div class="pattern-overlay"></div>

        <div class="brand-section">
          <div class="brand-logo">
            <div class="brand-icon">

 <div class="action-item car">
    <div class="action-icon-wrapper car-wrapper">
      <svg 
        class="action-icon car-icon" 
        viewBox="0 0 65 65" 
        width="65" 
        height="65" 
        fill="none" 
        stroke="currentColor" 
        stroke-width="2" 
        stroke-linecap="round" 
        stroke-linejoin="round"
      >
        <path d="M12 44h36M12 44a5 5 0 0 1-5-5v-10l6-12A5 5 0 0 1 18 12h24a5 5 0 0 1 5 5l6 12v10a5 5 0 0 1-5 5M12 44a5 5 0 1 0 10 0M48 44a5 5 0 1 0-10 0"/>
        <circle cx="17" cy="38" r="4" fill="currentColor" fill-opacity="0.2"/>
        <circle cx="43" cy="38" r="4" fill="currentColor" fill-opacity="0.2"/>
        <path d="M17 24h26" stroke-width="4"/>
        <rect x="19" y="14" width="22" height="10" rx="3" fill="currentColor" fill-opacity="0.1"/>
        <!-- Windshield -->
        <path d="M24 14l-6 8h28l-6-8H24z" fill="currentColor" fill-opacity="0.05"/>
        <!-- Headlights -->
        <circle cx="9" cy="32" r="3" fill="currentColor" fill-opacity="0.15"/>
        <circle cx="51" cy="32" r="3" fill="currentColor" fill-opacity="0.15"/>
      </svg>
    </div>
  </div>

</div>
            <h1 class="brand-name">PARKING TAG</h1>
          </div>
          <div class="brand-divider">
            <div class="divider-line divider-line-left"></div>
            <div class="divider-icon">${icons.swirl}</div>
            <div class="divider-line divider-line-right"></div>
          </div>
        </div>

        <div class="tagline-box">
          <div class="tagline-sparkle">
            <div class="sparkle-line sparkle-line-left"></div>
            <div class="sparkle-icon">${icons.sparkle}</div>
            <div class="sparkle-line sparkle-line-right"></div>
          </div>
          <h2 class="tagline-title">SCAN THIS TAG</h2>
          <p class="tagline-sub">To Contact Vehicle Owner</p>
        </div>

        <div class="hindi-box">
          <div class="hindi-content">
            <div class="hindi-icon">${icons.phone}</div>
            <p class="hindi-text">वाहन स्वामी से संपर्क करने के लिए इस टैग को स्कैन करें।</p>
          </div>
        </div>

        <div class="website-box">
          <div class="website-icon">${icons.world}</div>
          <p class="website-text">www.brilson.in</p>
        </div>




        <!-- Quick Action Section -->
<div class="quick-action flex items-center justify-center gap-8">
  <!-- Owner Info -->
  <div class="action-item owner">
    <div class="action-icon-wrapper">
      <svg class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    </div>
    <span class="action-label">OWNER INFO</span>
  </div>

  <!-- Instant Call -->
  <div class="action-item call">
    <div class="action-icon-wrapper">
      <svg class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
    </div>
    <span class="action-label">INSTANT CALL</span>
  </div>

  <!-- Location -->
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

      <!-- RIGHT SECTION -->
      <div class="right-section">
        <div class="qr-container">
          <div class="corner-accent corner-tl"></div>
          <div class="corner-accent corner-tr"></div>
          <div class="corner-accent corner-bl"></div>
          <div class="corner-accent corner-br"></div>
          <img class="qr-image" src="data:image/png;base64,{{QR_DATA}}" alt="QR Code" />
          <div class="scan-badge">
            ${icons.qr}
            <span>Scan to Connect</span>
          </div>
        </div>

        <div class="activation-wrapper">
          <div class="activation-label">
            <div class="label-line"></div>
            <span>Activation Code</span>
            <div class="label-line"></div>
          </div>
          <div class="activation-code">${displayCode}</div>
          <div class="secure-badge">
            ${icons.shield}
            <span class="secure-text">SECURE • VERIFIED</span>
          </div>
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
  await page.setViewport(PARKING_TAG_VIEWPORT);
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
      const qrCode = new window.QRCodeStyling({
        width: 420,
        height: 420,
        type: 'svg',
        data: url,
        image: window.__QR_LOGO__ || undefined,
        dotsOptions: {
          margin: 10,
          type: 'dots',
          color: qrDotsColor || '#1a1a1a',
        },
        backgroundOptions: {
          color: qrBgColor === 'transparent' ? '#ffffff' : (qrBgColor || '#ffffff'),
        },
        imageOptions: {
          crossOrigin: 'anonymous',
          imageSize: 0.4,
          margin: 8,
        },
        cornersDotOptions: {
          type: 'rounded',
          color: '#d4a843',
        },
        cornersSquareOptions: {
          type: 'extra-rounded',
          color: '#1a1a1a',
        },
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

async function renderParkingTagPng(page, { card, colors }) {
  const profileUrl = `${process.env.VITE_DOMAIN || 'https://brilson.in'}/c/parking-tag/${
    card.slug || card.activationCode
  }`;

  const qrBase64 = await renderQrBase64(page, {
    url: profileUrl,
    qrDotsColor: colors.qrDotsColor || '#1a1a1a',
    qrBgColor: colors.qrBgColor || '#ffffff'
  });

  const html = generateParkingTagHTML(card, colors).replace('{{QR_DATA}}', qrBase64);

  await page.setContent(html, { 
    waitUntil: 'networkidle0',
    timeout: 30000 
  });

  // Wait for fonts to load
  await page.evaluate(async () => {
    await document.fonts.ready;
  });

  await page.waitForSelector('.qr-image', { timeout: 10000 });
  await page.evaluate(() => {
    const img = document.querySelector('.qr-image');
    if (img.complete && img.naturalWidth > 0) return;
    return new Promise((resolve) => {
      img.onload = resolve;
      img.onerror = resolve;
    });
  });

  const tagHandle = await page.$('.tag-container');
  if (!tagHandle) {
    throw new Error('Parking tag element not found');
  }
  
  const screenshot = await tagHandle.screenshot({ 
    type: 'png', 
    omitBackground: true,
    encoding: 'binary'
  });
  
  await tagHandle.dispose();

  return screenshot;
}

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

// BULK DOWNLOAD ROUTE - Parking Tags
router.post('/parking-tags/bulk-download', async (req, res) => {
  try {
    const { cardIds, colors } = req.body;

    if (!Array.isArray(cardIds) || cardIds.length === 0) {
      return res.status(400).json({ error: '`cardIds` must be a non-empty array.' });
    }

    const MAX_TAGS_PER_REQUEST = 100;
    if (cardIds.length > MAX_TAGS_PER_REQUEST) {
      return res.status(400).json({
        error: `Max ${MAX_TAGS_PER_REQUEST} tags per request. Split into batches.`
      });
    }

    const cards = await Card.find({ _id: { $in: cardIds } }).populate('owner profile');

    if (!cards || cards.length === 0) {
      return res.status(404).json({ error: 'No cards found' });
    }

    const browser = await getBrowser();

    const items = cards.map((card) => ({ card, colors: colors || {} }));

    const results = await runWithPagePool(browser, items, PAGE_POOL_SIZE, renderParkingTagPng);

    const failed = results.filter((r) => !r.ok);
    if (failed.length > 0) {
      console.error(
        `[parking-tags-bulk-download] ${failed.length}/${cards.length} tags failed:`,
        failed.map((f) => ({ index: f.index, activationCode: f.item.card.activationCode, error: f.error }))
      );
    }

    const zip = new JSZip();
    const folder = zip.folder('brilson-parking-tags');

    results.forEach((r) => {
      if (!r.ok) return;
      const filename = `parking-tag-${r.item.card.activationCode}.png`;
      folder.file(filename, r.buffer);
    });

    if (failed.length > 0) {
      folder.file(
        'FAILED_TAGS.json',
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
    res.setHeader('Content-Disposition', `attachment; filename=brilson-parking-tags-${Date.now()}.zip`);
    res.setHeader('X-Processed-Count', successfulCount);
    res.setHeader('X-Failed-Count', failed.length);

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

// SINGLE PARKING TAG DOWNLOAD ROUTE
router.get('/parking-tags/:id/download', async (req, res) => {
  let page = null;
  try {
    const card = await Card.findById(req.params.id).populate('owner profile');

    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }

    const colors = {
      cardBgColor: req.query.cardBgColor || '#FFFFFF',
      cardTextColor: req.query.cardTextColor || '#000000',
      qrDotsColor: req.query.qrDotsColor || '#1a1a1a',
      qrBgColor: req.query.qrBgColor || '#ffffff'
    };

    const browser = await getBrowser();
    const logoDataUrl = await getLogoDataUrl();
    page = await createPreparedPage(browser, logoDataUrl);

    const screenshot = await renderParkingTagPng(page, { card, colors });

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', `attachment; filename=parking-tag-${card.activationCode}.png`);
    res.send(screenshot);
  } catch (error) {
    console.error('Download error:', error);
    if (!res.headersSent) res.status(500).json({ error: error.message });
  } finally {
    if (page) await page.close().catch(() => {});
  }
});

// GRACEFUL SHUTDOWN
process.on('SIGINT', async () => {
  if (browserInstance) await browserInstance.close().catch(() => {});
  process.exit(0);
});
process.on('SIGTERM', async () => {
  if (browserInstance) await browserInstance.close().catch(() => {});
  process.exit(0);
});

module.exports = router;