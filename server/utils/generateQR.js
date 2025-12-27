const QRCodeStyling = require("qr-code-styling");
const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const generateStyledQR = async (data, cardId) => {
  try {
    // Create QR instance with styling
    const qr = new QRCodeStyling({
      width: 300,
      height: 300,
      data: data,
      type: 'png',
      dotsOptions: {
        color: "#000000",
        type: "dots",
      },
      cornersSquareOptions: {
        type: "extra-rounded",
      },
      cornersDotOptions: {
        type: "dot",
      },
      backgroundOptions: {
        color: "#ffffff",
      },
      imageOptions: {
        crossOrigin: "anonymous",
        margin: 5,
        imageSize: 0.2
      },
      // Use your logo if available, otherwise skip
      image: fs.existsSync(path.join(__dirname, '../../public/G.png')) 
        ? path.join(__dirname, '../../public/G.png') 
        : undefined,
    });

    // Create canvas and get buffer
    const canvas = createCanvas(300, 300);
    
    // Use alternative method since append might not work with node-canvas
    const qrCanvas = qr._canvas;
    if (qrCanvas) {
      const ctx = canvas.getContext('2d');
      // Copy QR to canvas
      ctx.drawImage(qrCanvas, 0, 0, 300, 300);
    } else {
      // Fallback: create simple QR
      const QRCode = require('qrcode');
      const qrDataUrl = await QRCode.toDataURL(data, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      const img = new (require('canvas').Image)();
      img.src = qrDataUrl;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, 300, 300);
    }
    
    // Convert canvas to buffer
    const buffer = canvas.toBuffer('image/png');
    
    // Create filename
    const qrFileName = `qr_${cardId}_${Date.now()}.png`;
    const qrFilePath = path.join(__dirname, '../../public/qrcodes', qrFileName);
    
    // Ensure directory exists
    const qrDir = path.join(__dirname, '../../public/qrcodes');
    if (!fs.existsSync(qrDir)) {
      fs.mkdirSync(qrDir, { recursive: true });
    }
    
    // Save file
    fs.writeFileSync(qrFilePath, buffer);
    
    // Return relative path
    return `/qrcodes/${qrFileName}`;
    
  } catch (error) {
    console.error('QR Generation Error:', error);
    
    // Fallback to simple QR generation
    try {
      const QRCode = require('qrcode');
      const qrFileName = `qr_${cardId}_${Date.now()}.png`;
      const qrFilePath = path.join(__dirname, '../../public/qrcodes', qrFileName);
      
      // Ensure directory exists
      const qrDir = path.join(__dirname, '../../public/qrcodes');
      if (!fs.existsSync(qrDir)) {
        fs.mkdirSync(qrDir, { recursive: true });
      }
      
      await QRCode.toFile(qrFilePath, data, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      return `/qrcodes/${qrFileName}`;
    } catch (fallbackError) {
      console.error('Fallback QR Generation Error:', fallbackError);
      throw new Error('QR generation failed');
    }
  }
};

module.exports = { generateStyledQR };