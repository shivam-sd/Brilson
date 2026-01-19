const express = require("express");
const app = express();
require("dotenv").config();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const fileUpload = require("express-fileupload");

const PORT = process.env.PORT || 4000;

// DB
const DBConnection = require("./DB/DB.Connection");

// Routes
const UserRouter = require("./routes/User.routes");
const AdminRouter = require("./routes/Admin.routes");
const CartRouter = require("./routes/Cart.routes");
const ReferralRouter = require("./routes/referral.routes");
const OrderRouter = require("./routes/Order.routes");
const PaymentRouter = require("./routes/payment.routes");
const getCardProfiles = require("./routes/CardProfile.routes");
const categoryRouter = require("./routes/category.routes");
const badgesRouter = require("./routes/badge.routes");
const ConfigRouter = require("./routes/AdminConfig");
const adminSalesRouter = require("./routes/adminSales.route");
const invoiceRouter = require("./routes/invoice.routes");
const adminAllInvoicesRouter = require("./routes/adminInvoices.routes");
const HomepageContentRouter = require("./routes/LandingPage/HomeContent.routes");
const PowerfulFeaturesRouter = require("./routes/LandingPage/PowerfullFeatures.routes");

// Runtime config
const { loadConfig, getConfig } = require("./config/runTimeConfigLoader");

(async function bootstrap() {
  await DBConnection();

  await loadConfig();
//   console.log("Runtime Config Loaded:", getConfig());

  // Cloudinary runtime setup
  if (getConfig().cloudinary) {
    cloudinary.config({
      cloud_name: getConfig().cloudinary.cloudName,
      api_key: getConfig().cloudinary.apiKey,
      api_secret: getConfig().cloudinary.apiSecret,
    });
  }

  // Middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(morgan("combined"));
  app.use(helmet());
  app.use(bodyParser.json());

  app.use(
    cors({
      origin: process.env.BASE_URL,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    })
  );

  app.use("/uploads", express.static(path.join(__dirname, "uploads")));

  app.use(
    fileUpload({
      useTempFiles: true,
      tempFileDir: "/brilson/",
    })
  );

  // Routes
  app.use("/api/users", UserRouter);
  app.use("/api/admin", AdminRouter);
  app.use("/api/cart", CartRouter);
  app.use("/api", ReferralRouter);
  app.use("/api", OrderRouter);
  app.use("/api/payment", PaymentRouter);
  app.use("/api", getCardProfiles);
  app.use("/api/category", categoryRouter);
  app.use("/api/badges", badgesRouter);
  app.use("/api/config", ConfigRouter);
  app.use("/api/admin", adminSalesRouter);
  app.use("/api/invoice", invoiceRouter);
  app.use("/api/admin/invoices", adminAllInvoicesRouter);
  app.use("/api/admin", HomepageContentRouter);
  app.use("/api/admin", PowerfulFeaturesRouter);
  

  app.get("/", (req, res) => {
    res.status(200).json({ message: "Welcome To Brilson" });
  });

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})();