const express = require("express");
const app = express();
require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");

const PORT = process.env.PORT || 4000;
const DBConnection = require("./DB/DB.Connection");

const UserRouter = require("./routes/User.routes");
const AdminRouter = require("./routes/Admin.routes");
const CartRouter = require("./routes/Cart.routes");
const ReferralRouter = require("./routes/referral.routes");
const OrderRouter = require("./routes/Order.routes");
const PaymentRouter = require("./routes/payment.routes");
const getCardProfiles = require("./routes/CardProfile.routes");

DBConnection();

/*  MIDDLEWARES  */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("combined"));
app.use(helmet());

/*  CORS  */

const allowedOrigins = [
  process.env.BASE_URL,
  process.env.BASE_URL1,
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

/*  ROUTES  */

app.use("/api/users", UserRouter);
app.use("/api/admin", AdminRouter);
app.use("/api/cart", CartRouter);
app.use("/api", ReferralRouter);
app.use("/api", OrderRouter);
app.use("/api/payment", PaymentRouter);
app.use("/api", getCardProfiles);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome" });
});

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
