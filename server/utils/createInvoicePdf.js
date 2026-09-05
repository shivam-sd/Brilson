const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const invoiceTemplate = require("./invoiceTemplate");
const InvoiceAddressModel = require("../models/InvoiceAddress.model");


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


      let InvoiceAddress; 
      InvoiceAddress = await InvoiceAddressModel.findOne(); 

      // console.log(InvoiceAddress)

    const invoicesDir = path.join(__dirname, "../invoices");
    if (!fs.existsSync(invoicesDir)) {
      fs.mkdirSync(invoicesDir, { recursive: true });
    }

    const pdfPath = path.join(invoicesDir, `${invoiceNumber}.pdf`);

 const browser = await puppeteer.launch({
  headless: true,
  args: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-dev-shm-usage",
    "--disable-gpu",
  ],
});

    const page = await browser.newPage();
console.log("order from createinvoice:", order);
    await page.setContent(invoiceTemplate(order, InvoiceAddress), {
      waitUntil: "domcontentloaded",
      timeout: 60000
    });

    await page.pdf({
      path: pdfPath,
      format: "A4",
      printBackground: true,
    });


    console.log("Order In Create PDF", order);

    await browser.close();

    return { pdfPath, invoiceNumber };
  } catch (err) {
    console.error("Invoice PDF Error:", err);
    throw err;
  }
};