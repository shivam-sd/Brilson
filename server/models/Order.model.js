const mongoose = require("mongoose");
const crypto = require("crypto");

const generateOrderId = () => {
  const bytes = crypto.randomBytes(8);
  const value = bytes.readBigUInt64BE(0);
  const orderId = (value % 9000000000000000n) + 1000000000000000n;
  return orderId.toString();
};

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    productTitle: {
      type: String,
      required: true,
    },

  
    productImage: {
      type: String,
    },

    variantId: {
      type: mongoose.Schema.Types.ObjectId,
    },

    variantName: {
      type: String,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
],


    address: {
      name: {
        type: String,
        required: true,
      },

      phone: {
        type: String,
        required: true,
      },

      email: {
        type: String,
      },

      city: {
        type: String,
        required: true,
      },

      state: {
        type: String,
        required: true,
      },

      pincode: {
        type: Number,
        required: true,
      },
    },

    image: {
      type: String,
    },

    amount: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    cost: {
      type: Number,
      default: 0,
      min: 0,
    },

    profit: {
      type: Number,
      default: function () {
        return (
          Number(this.totalAmount || 0) -
          Number(this.cost || 0)
        );
      },
    },

    paymentGateway: {
      type: String,
      enum: ["razorpay", "cashfree", "payu"],
    },

    status: {
      type: String,
      enum: [
        "pending",
        "paid",
        "failed",
        "cancelled",
      ],
      default: "pending",
    },

    invoice: {
      number: String,
      pdfPath: String,
      pdfUrl: String,
      cloudinaryId: String,
      generatedAt: Date,
    },

    orderStatus: {
      type: String,
      enum: [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },

    discountAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    gstAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    shippingAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.index({ createdAt: -1 });

orderSchema.pre("validate", async function () {
  if (!this.isNew || this.orderId) return;

  let orderId;
  let exists = true;

  while (exists) {
    orderId = generateOrderId();
    exists = await this.constructor.exists({ orderId });
  }

  this.orderId = orderId;
});

module.exports = mongoose.model("Order", orderSchema);