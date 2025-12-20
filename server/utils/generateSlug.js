const slugify = require("slugify");

module.exports = function generateSlug(name) {
  return slugify(name + "-" + Date.now(), {
    lower: true,
    strict: true
  });
};
