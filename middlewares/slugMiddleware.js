const slugify = require("slugify");

const slugMiddleware = (req, res, next) => {
  req.body.slug = slugify(req.body.title ?? req.body.name);
  next();
};

module.exports = slugMiddleware;
