const crypto = require("crypto");
const dotenv = require("dotenv").config();
const algorithm = "aes-256-cbc";
const key = crypto.createHash("sha256")
  .update(process.env.CONFIG_ENCRYPTION_KEY)
  .digest();

exports.encrypt = (text) => {
  if (!text) throw new Error("Encryption text is required");
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(String(text), "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
};


exports.decrypt = (text) => {
  const [ivHex, encrypted] = text.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};
