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
    width: 380px;
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

  /* DISCOUNT BADGE */
  .discount-badge {
    display: inline-block;
    background: #10b981;
    color: white;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 600;
    margin-left: 5px;
  }

  /* GST BADGE */
  .gst-badge {
    display: inline-block;
    background: #3b82f6;
    color: white;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 600;
    margin-left: 5px;
  }

  /* STATUS BADGES */
  .status-paid {
    color: #16a34a;
    font-weight: 600;
  }
  
  .status-pending {
    color: #f59e0b;
    font-weight: 600;
  }
  
  .status-failed {
    color: #dc2626;
    font-weight: 600;
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
    <div class="branding">
      <div class="brand-name">Brilson</div>
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
        ${order.address?.email || 'customer@example.com'}<br/>
        ${order.address?.phone || ''}
      </div>

      <div class="details-box">
        <strong>Invoice Details</strong>
        Date: ${new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN')}<br/>
        Status: <span class="${order.status === 'paid' ? 'status-paid' : order.status === 'pending' ? 'status-pending' : 'status-failed'}">${order.status?.toUpperCase() || 'PAID'}</span><br/>
        Order Status: ${order.orderStatus || 'Processing'}
      </div>
    </div>

    <!-- ITEMS TABLE -->
    <table>
      <thead>
        <tr>
          <th>Product</th>
          <th class="right">Qty</th>
          <th class="right">Price</th>
        </tr>
      </thead>
      <tbody>
        ${order.items?.map(item => {
          const itemPrice = item.price || item.amount || 0;
          const itemQuantity = item.quantity || 1;
          const itemTotal = itemPrice * itemQuantity;
          
          return `
          <tr>
            <td>${item.productTitle || item.productId?.name || 'Product'}</td>
            <td class="right">${itemQuantity}</td>
            <td class="right">₹${itemTotal.toFixed(2)}</td>
          </tr>
        `}).join("") || '<tr><td colspan="4" style="text-align:center;">No items found</td></tr>'}
      </tbody>
    </table>

    <!-- SUMMARY -->
    <div class="summary">
      <div class="summary-box">
        <!-- Items Total -->
        <div class="summary-row">
          <span>Items Price</span>
          <span>₹${order.amount?.toFixed(2) || (order.items?.reduce((sum, item) => sum + ((item.price || item.amount || 0) * (item.quantity || 1)), 0) || 0).toFixed(2)}</span>
        </div>
        
        <!-- Discount -->
        ${order.discountAmount > 0 ? `
        <div class="summary-row">
          <span>Discount Applied</span>
          <span style="color:#10b981; font-weight:600;">-${order.discountAmount.toFixed(2)}%</span>
        </div>
        ` : ''}
        
        <!-- GST -->
        ${order.gstAmount > 0 ? `
        <div class="summary-row">
          <span>GST</span>
          <span style="color:#3b82f6; font-weight:600;">+${order.gstAmount.toFixed(2)}%</span>
        </div>
        ` : ''}
        
        <!-- Shipping Cost -->
        ${order.cost > 0 ? `
        <div class="summary-row">
          <span>Shipping Cost</span>
          <span>+₹${order.cost.toFixed(2)}</span>
        </div>
        ` : `
        <div class="summary-row">
          <span>Shipping Cost</span>
          <span style="color:#10b981;">Free</span>
        </div>
        `}
        
        <!-- Total Amount -->
        <div class="summary-row total">
          <span>Total Amount</span>
          <span>₹${order.totalAmount?.toFixed(2) || 0}</span>
        </div>
      </div>
    </div>

    <!-- BILLING ADDRESS -->
    ${order.address ? `
    <div style="margin-top: 50px;">
      <h3 style="color:#475569; font-size:16px; margin-bottom:12px;">Billing & Shipping Address</h3>
      <div style="background:#f8fafc; padding:20px; border-radius:8px; border:1px solid #e2e8f0;">
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
          <div>
            <strong style="display:block; color:#475569; font-size:13px; margin-bottom:4px;">Name</strong>
            ${order.address.name || 'N/A'}
          </div>
          <div>
            <strong style="display:block; color:#475569; font-size:13px; margin-bottom:4px;">Email</strong>
            ${order.address.email || 'N/A'}
          </div>
          <div>
            <strong style="display:block; color:#475569; font-size:13px; margin-bottom:4px;">Phone</strong>
            ${order.address.phone || 'N/A'}
          </div>
          <div>
            <strong style="display:block; color:#475569; font-size:13px; margin-bottom:4px;">City</strong>
            ${order.address.city || 'N/A'}
          </div>
          <div>
            <strong style="display:block; color:#475569; font-size:13px; margin-bottom:4px;">State</strong>
            ${order.address.state || 'N/A'}
          </div>
          <div>
            <strong style="display:block; color:#475569; font-size:13px; margin-bottom:4px;">Pincode</strong>
            ${order.address.pincode || 'N/A'}
          </div>
        </div>
      </div>
    </div>
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