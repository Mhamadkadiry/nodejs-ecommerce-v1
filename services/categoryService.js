const CategoryModel = require("../models/categoryModel");
const slugify = require("slugify");

exports.getCategories = (req, res) => {
  //   const name = req.body.name;
  //   console.log(name);
  res.send();
};

exports.createCategory = (req, res) => {
  const name = req.body.name;
  CategoryModel.create({ name, slug: slugify(name) })
    .then((category) => res.status(201).json({ data: category }))
    .catch((err) => res.status(400).send(err));
  //   const newCategory = new CategoryModel({ name });
  //   newCategory
  //     .save()
  //     .then((doc) => {
  //       res.json(doc);
  //     })
  //     .catch((err) => {
  //       res.json(err);
  //     });
};
