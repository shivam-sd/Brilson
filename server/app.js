const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const path = require("path");
// const rateLimit = require("express-rate-limit");
const PORT = process.env.PORT || 4000;
const DBConnection = require("./DB/DB.Connection");
const UserRouter = require("./routes/User.routes");
const AdminRouter = require("./routes/Admin.routes");
const CartRouter = require("./routes/Cart.routes");
const ReferralRouter = require("./routes/referral.routes");
const OrderRouter = require("./routes/Order.routes");
const PaymentRouter = require("./routes/payment.routes");
// card profile
const getCardProfiles = require("./routes/CardProfile.routes");
// category
const categoryRouter = require("./routes/category.routes");
// badges
const badgesRouter = require("./routes/badge.routes");


DBConnection();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(morgan("combined"));
app.use(helmet());
app.use(bodyParser.json());


app.use(cors({
    origin:process.env.BASE_URL,
    credentials:true,
       methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
}));


app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.use("/api/users", UserRouter);
app.use("/api/admin", AdminRouter);
app.use("/api/cart", CartRouter);
app.use("/api", ReferralRouter);
app.use("/api", OrderRouter);
app.use("/api/payment", PaymentRouter);
// card profiles
app.use("/api", getCardProfiles);
app.use("/api/category", categoryRouter);
app.use("/api/badges", badgesRouter);



app.get("/", (req,res) => {
    res.status(200).json({message:"Welcome To Brilson"});
});


app.listen(PORT, () => {
    console.log(`Server Running On PORT ${PORT}`);
});

