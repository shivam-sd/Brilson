const QRCode = require("qrcode");

const generateQR = async (cardId) => {
  const url = `${process.env.BASE_URL}/c/card/${cardId}`;

  const QRDataURL = await QRCode.toDataURL(url, {
    errorCorrectionLevel: "H",
    type: "image/png",
    margin: 2,
    width: 300,
    color: {
      dark: "#000000",
      light: "#FFFFFF",
    },
  });

  return QRDataURL; 

};


module.exports = generateQR;