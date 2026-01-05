const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const invoiceTemplate = require("./invoiceTemplate");

module.exports = async (order) => {
  try {
    const invoiceNumber = `INV-${new Date().getFullYear()}-${order._id
      .toString()
      .slice(-6)}`;

      // set invoice number in order first becouse it give undefined in template
      order.invoice = {
        number: invoiceNumber
      };

      await order.save();


    const invoicesDir = path.join(__dirname, "../invoices");
    if (!fs.existsSync(invoicesDir)) {
      fs.mkdirSync(invoicesDir, { recursive: true });
    }

    const pdfPath = path.join(invoicesDir, `${invoiceNumber}.pdf`);

    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
console.log("order from createinvoice:", order);
    await page.setContent(invoiceTemplate(order), {
      waitUntil: "domcontentloaded",
      timeout: 60000
    });

    await page.pdf({
      path: pdfPath,
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    return { pdfPath, invoiceNumber };
  } catch (err) {
    console.error("Invoice PDF Error:", err);
    throw err;
  }
};
