module.exports = (order) => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Invoice</title>

<style>
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 40px;
    background: #f1f5f9;
    font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    color: #0f172a;
  }

  .invoice-wrapper {
    max-width: 900px;
    margin: auto;
    background: #ffffff;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 25px 50px rgba(0,0,0,0.08);
  }

  /* HEADER */
  .header {
    background: linear-gradient(135deg, #0ea5e9, #0284c7);
    padding: 32px 40px;
    color: #ffffff;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .branding {
    display: flex;
    flex-direction: column;
  }

  .brand-name {
    font-size: 28px;
    font-weight: 800;
    letter-spacing: -0.5px;
    margin-bottom: 4px;
  }

  .brand-tagline {
    font-size: 14px;
    opacity: 0.9;
    font-weight: 400;
  }

  .invoice-title h1 {
    margin: 0;
    font-size: 32px;
    font-weight: 700;
  }

  .invoice-title span {
    font-size: 13px;
    opacity: 0.9;
  }

  /* BODY */
  .content {
    padding: 40px;
  }

  .details {
    display: flex;
    justify-content: space-between;
    margin-bottom: 40px;
    gap: 40px;
  }

  .details-box {
    font-size: 14px;
    line-height: 1.7;
  }

  .details-box strong {
    display: block;
    margin-bottom: 6px;
    font-size: 13px;
    color: #475569;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  /* TABLE */
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }

  thead {
    background: #f8fafc;
  }

  th {
    padding: 14px;
    text-align: left;
    font-size: 13px;
    color: #475569;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 1px solid #e2e8f0;
  }

  td {
    padding: 14px;
    font-size: 14px;
    border-bottom: 1px solid #e2e8f0;
  }

  td.right, th.right {
    text-align: right;
  }

  tbody tr:hover {
    background: #f8fafc;
  }

  /* SUMMARY */
  .summary {
    margin-top: 30px;
    display: flex;
    justify-content: flex-end;
  }

  .summary-box {
    width: 320px;
    background: #f8fafc;
    border-radius: 12px;
    padding: 20px;
  }

  .summary-row {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    font-size: 14px;
  }

  .summary-row.total {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 2px solid #0f172a;
    font-size: 18px;
    font-weight: 700;
  }

  /* ADDRESS TABLE */
  .address-table {
    margin-top: 50px;
  }

  .address-table caption {
    text-align: left;
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 12px;
  }

  .address-table th {
    background: #0ea5e9;
    color: #ffffff;
  }

  .address-table td {
    background: #f8fafc;
  }

  /* FOOTER */
  .footer {
    margin-top: 50px;
    padding-top: 20px;
    border-top: 1px solid #e2e8f0;
    text-align: center;
    font-size: 13px;
    color: #64748b;
  }

  /* BRILSON SPECIFIC STYLING */
  .brilson-logo {
    font-family: 'Arial Rounded MT Bold', 'Arial', sans-serif;
    color: #ffffff;
  }

  .brilson-highlight {
    color: #0ea5e9;
  }

  .brilson-bg {
    background: linear-gradient(135deg, #0f172a, #1e293b);
  }
</style>
</head>

<body>

<div class="invoice-wrapper">

  <!-- HEADER -->
  <div class="header">
    <div class="branding">
      <div class="brand-name brilson-logo">Brilson</div>
      <div class="brand-tagline">Premium Products & Services</div>
    </div>
    <div class="invoice-title">
      <h1>Invoice</h1>
      <span>Invoice #: ${order.invoice?.number || `INV-${new Date().getFullYear()}-${order._id.toString().slice(-6)}`}</span><br/>
      <span>Order ID: ${order._id}</span>
    </div>
  </div>

  <!-- CONTENT -->
  <div class="content">

    <!-- DETAILS -->
    <div class="details">
      <div class="details-box">
        <strong>Billed To</strong>
        ${order.address?.name || 'Customer Name'}<br/>
        ${order.address?.email || 'customer@example.com'}
      </div>

      <div class="details-box">
        <strong>Invoice Details</strong>
        Date: ${new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN')}<br/>
        Status: <b style="color:#16a34a;">${order.status?.toUpperCase() || 'PAID'}</b>
      </div>
    </div>

    <!-- ITEMS TABLE -->
    <table>
      <thead>
        <tr>
          <th>Product</th>
          <th class="right">Qty</th>
          <th class="right">Price</th>
          <th class="right">Total</th>
        </tr>
      </thead>
      <tbody>
        ${order.items?.map(item => `
          <tr>
            <td>${item.productTitle || item.productId?.name || 'Product'}</td>
            <td class="right">${item.quantity || 1}</td>
            <td class="right">₹${item.price || 0}</td>
            <td class="right">₹${(item.price || 0) * (item.quantity || 1)}</td>
          </tr>
        `).join("") || '<tr><td colspan="4" style="text-align:center;">No items found</td></tr>'}
      </tbody>
    </table>

    <!-- SUMMARY -->
    <div class="summary">
      <div class="summary-box">
        <div class="summary-row">
          <span>Subtotal</span>
          <span>₹${order.totalAmount || 0}</span>
        </div>
        <div class="summary-row">
          <span>Shipping</span>
          <span>₹0</span>
        </div>
        <div class="summary-row">
          <span>Tax</span>
          <span>₹0</span>
        </div>
        <div class="summary-row total">
          <span>Total Amount</span>
          <span>₹${order.totalAmount || 0}</span>
        </div>
      </div>
    </div>

    <!-- BILLING ADDRESS -->
    ${order.address ? `
    <table class="address-table">
      <caption>Billing Address</caption>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>City</th>
          <th>State</th>
          <th>Zip</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>${order.address.name || 'N/A'}</td>
          <td>${order.address.email || 'N/A'}</td>
          <td>${order.address.phone || 'N/A'}</td>
          <td>${order.address.city || 'N/A'}</td>
          <td>${order.address.state || 'N/A'}</td>
          <td>${order.address.pincode || 'N/A'}</td>
        </tr>
      </tbody>
    </table>
    ` : ''}

    <!-- FOOTER -->
    <div class="footer">
      <div style="margin-bottom: 15px;">
        <strong style="color: #0f172a; font-size: 14px;">Brilson Enterprises</strong><br/>
        <span>contact@brilson.in | +91 12345 67890</span><br/>
        <span>123 Business Street, City, State - 123456</span>
      </div>
      Thank you for choosing Brilson! 💙<br/>
      This is a system-generated invoice and does not require a signature.
    </div>

  </div>
</div>

</body>
</html>
`;