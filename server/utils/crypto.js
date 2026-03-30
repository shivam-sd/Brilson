const crypto = require("crypto");
const dotenv = require("dotenv").config();

const algorithm = "aes-256-cbc";

// Generate key from environment variable
const getKey = () => {
  if (!process.env.CONFIG_ENCRYPTION_KEY) {
    console.error("CONFIG_ENCRYPTION_KEY is not set in environment variables");
    throw new Error("Encryption key not configured");
  }
  return crypto.createHash("sha256")
    .update(process.env.CONFIG_ENCRYPTION_KEY)
    .digest();
};

const key = getKey();

exports.encrypt = (text) => {
  // Check if text is null, undefined, or empty
  if (text === null || text === undefined) {
    console.warn("Encryption called with null/undefined, returning empty string");
    return "";
  }
  
  if (text === "") {
    return "";
  }
  
  try {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(String(text), "utf8", "hex");
    encrypted += cipher.final("hex");
    return iv.toString("hex") + ":" + encrypted;
  } catch (error) {
    console.error("Encryption error:", error.message);
    throw new Error("Failed to encrypt data");
  }
};

exports.decrypt = (text) => {
  // Check if text is null, undefined, or empty
  if (text === null || text === undefined) {
    console.warn("Decryption called with null/undefined, returning empty string");
    return "";
  }
  
  if (text === "") {
    return "";
  }
  
  try {
    // Check if the text has the expected format (contains colon)
    if (!text.includes(":")) {
      console.warn("Invalid encrypted format (no colon), returning original text");
      return text;
    }
    
    const parts = text.split(":");
    if (parts.length !== 2) {
      console.warn("Invalid encrypted format (wrong number of parts), returning original text");
      return text;
    }
    
    const [ivHex, encrypted] = parts;
    
    // Validate IV length (16 bytes = 32 hex characters)
    if (!ivHex || ivHex.length !== 32) {
      console.warn("Invalid IV length, returning original text");
      return text;
    }
    
    const iv = Buffer.from(ivHex, "hex");
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (error) {
    console.error("Decryption error for field:", error.message);
    // Return original text if decryption fails (for backward compatibility)
    return text;
  }
};