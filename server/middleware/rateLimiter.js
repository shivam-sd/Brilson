// const rateLimit = require("express-rate-limit");

// /*  USER AUTH (LOGIN / REGISTER) */


// const authLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 5, // 5 attempts
//   message: {
//     success: false,
//     message: "Too many attempts. Please try again after 15 minutes.",
//   },
//   standardHeaders: true,
//   legacyHeaders: false,
// });

// /*  NORMAL USER APIs Like- getallProduct, addtocard*/


// const apiLimiter = rateLimit({
//   windowMs: 1 * 60 * 1000, // 1 minute
//   max: 60, // 60 requests
//   message: {
//     success: false,
//     message: "Too many requests. Please slow down.",
//   },
//   standardHeaders: true,
//   legacyHeaders: false,
// });

// /*  ADMIN APIs  Like- productCreate, productUpdate All form Admin Side */


// const adminLimiter = rateLimit({
//   windowMs: 1 * 60 * 1000, // 1 minute
//   max: 30, // Admin is trusted but limited
//   message: {
//     success: false,
//     message: "Admin rate limit exceeded.",
//   },
//   standardHeaders: true,
//   legacyHeaders: false,
// });

// module.exports = {
//   authLimiter,
//   apiLimiter,
//   adminLimiter,
// };
