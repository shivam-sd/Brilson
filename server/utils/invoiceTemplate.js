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

  .logo img {
    height: 45px;
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
</style>
</head>

<body>

<div class="invoice-wrapper">

  <!-- HEADER -->
  <div class="header">
    <div class="logo">
      // <img src="https://brilson.in/logo2.png" alt="Logo" />
      Brilson
    </div>
    <div class="invoice-title">
      <h1>Invoice</h1>
      <span>Invoice #: ${order.invoice.number}</span><br/>
      <span>Order ID: ${order._id}</span>
    </div>
  </div>

  <!-- CONTENT -->
  <div class="content">

    <!-- DETAILS -->
    <div class="details">
      <div class="details-box">
        <strong>Billed To</strong>
        ${order.address.name}<br/>
        ${order.address.email}
      </div>

      <div class="details-box">
        <strong>Invoice Details</strong>
        Date: ${new Date(order.createdAt).toLocaleDateString()}<br/>
        Status: <b style="color:#16a34a;">Paid</b>
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
        ${order.items.map(item => `
          <tr>
            <td>${item.productTitle}</td>
            <td class="right">${item.quantity}</td>
            <td class="right">₹${item.price}</td>
            <td class="right">₹${item.price * item.quantity}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>

    <!-- SUMMARY -->
    <div class="summary">
      <div class="summary-box">
        <div class="summary-row total">
          <span>Total Amount</span>
          <span>₹${order.totalAmount}</span>
        </div>
      </div>
    </div>

    <!-- BILLING ADDRESS -->
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
          <td>${order.address.name}</td>
          <td>${order.address.email}</td>
          <td>${order.address.phone}</td>
          <td>${order.address.city}</td>
          <td>${order.address.state}</td>
          <td>${order.address.pincode}</td>
        </tr>
      </tbody>
    </table>

    <!-- FOOTER -->
    <div class="footer">
      Thank you for your purchase 💙 <br/>
      This is a system-generated invoice and does not require a signature.
    </div>

  </div>
</div>

</body>
</html>
`;
