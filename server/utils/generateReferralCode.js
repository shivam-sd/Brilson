const crypto = require("crypto");

const generateReferralCode = (name = "") => {
  const prefix = name.substring(0, 3).toUpperCase().padEnd(4, "B");
  const random = crypto.randomBytes(2).toString("hex").substring(0, 3);
  return `${prefix}${random}`;
};

module.exports = generateReferralCode;
