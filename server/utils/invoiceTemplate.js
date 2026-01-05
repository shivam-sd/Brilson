module.exports = (order) => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Invoice</title>

<style>
  body {
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    background: #f9fafb;
    padding: 40px;
    color: #111827;
  }

  .invoice-box {
    max-width: 900px;
    margin: auto;
    background: #ffffff;
    padding: 40px;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid #e5e7eb;
    padding-bottom: 20px;
  }

  .logo {
    font-size: 26px;
    font-weight: 800;
    color: #0ea5e9;
    letter-spacing: 1px;
  }

  .invoice-title {
    text-align: right;
  }

  .invoice-title h1 {
    margin: 0;
    font-size: 28px;
    color: #111827;
  }

  .invoice-title span {
    font-size: 13px;
    color: #6b7280;
  }

  .details {
    display: flex;
    justify-content: space-between;
    margin-top: 30px;
  }

  .details-box {
    font-size: 14px;
    line-height: 22px;
  }

  .details-box strong {
    color: #111827;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 35px;
  }

  table thead {
    background: #f3f4f6;
  }

  table th {
    padding: 12px;
    text-align: left;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: .5px;
    color: #374151;
  }

  table td {
    padding: 12px;
    font-size: 14px;
    border-bottom: 1px solid #e5e7eb;
  }

  table tr:last-child td {
    border-bottom: none;
  }

  .right {
    text-align: right;
  }

  .summary {
    margin-top: 30px;
    display: flex;
    justify-content: flex-end;
  }

  .summary-box {
    width: 300px;
    font-size: 15px;
  }

  .summary-row {
    display: flex;
    gap: 20px;
    padding: 8px 0;
    justify-content: flex-end;
  }

  .summary-row.total {
    font-size: 18px;
    font-weight: 700;
    border-top: 2px solid #111827;
    padding-top: 12px;
  }



  
table {
    border-collapse: collapse; 
    margin: 25px 0;
    font-size: 0.9em;
    font-family: sans-serif;
    min-width: 400px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
    width: 100%; 
}


th, td {
    border: 1px solid #dddddd;
    padding: 12px 15px; 
    text-align: left; 
}


thead tr {
    background-color: #009879;
    color: #ffffff;
    text-align: left;
}


tbody tr:nth-of-type(even) {
    background-color: #f3f3f3;
}



caption {
    padding: 10px;
    font-size: 1.2em;
    font-weight: bold;
}


  .footer {
    margin-top: 50px;
    text-align: center;
    font-size: 13px;
    color: #6b7280;
    border-top: 1px solid #e5e7eb;
    padding-top: 20px;
  }

</style>
</head>

<body>

<div class="invoice-box">

  <!-- HEADER -->
  <div class="header">
    <div class="logo">BRILSON</div>

    <div class="invoice-title">
      <h1>Invoice</h1>
      <span>Invoice Number #: ${order.invoice.number}</span><br/>
      <span>Order ID: ${order._id}</span>
    </div>
  </div>

  <!-- CUSTOMER & DATE -->
  <div class="details">
    <div class="details-box">
      <strong>Billed To:</strong><br/>
     Name:-  <b>${order.address.name}</b><br/>
      Email:- <b>${order.address.email}</b>
    </div>

    <div class="details-box">
      <strong>Invoice Date:</strong><br/>
      ${new Date(order.createdAt).toLocaleDateString()}<br/>
      <strong>Payment Status:</strong><br/>
      Paid
    </div>
  </div>

  <!-- ITEMS TABLE -->
  <table>
    <thead>
      <tr>
        <th>Product</th>
        <th class="right">Quantity</th>
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
        <span>Total Amount:</span>
        <span>₹${order.totalAmount}</span>
      </div>
    </div>
  </div>



<div>
<table>
        <caption>Billing Address</caption>
        <thead>
            <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone No</th>
                <th>City</th>
                <th>State</th>
                <th>Zip Code</th>
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
</div>


  <!-- FOOTER -->
  <div class="footer">
    Thank you for your purchase!<br/>
    This is a system generated invoice and does not require a signature.
  </div>

</div>

</body>
</html>
`;
