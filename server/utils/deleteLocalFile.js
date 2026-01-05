const fs = require("fs-extra");

const deleteLocalFile = async (filePath) => {
  try {
    if (!filePath) return;
    await fs.remove(filePath);
    console.log("Local file deleted:", filePath);
  } catch (err) {
    console.error("Failed to delete local file:", err);
  }
};

module.exports = deleteLocalFile;
