const crypto = require("crypto");


const generateReferralCode = (name) => {
    const random = crypto.randomBytes(4).toString("hex");
    return `${name.substring(0,4).toUpperCase()}-${random}`;
}


module.exports = generateReferralCode;