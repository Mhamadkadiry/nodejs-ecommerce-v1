const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");

exports.deleteOne = (Model, modelType) =>
  asyncHandler(async (req, res, next) => {
    let document = null;
    const { id } = req.params;
    if (modelType === "user") {
      document = await Model.findByIdAndUpdate(
        req.params.id,
        { active: false },
        {
          new: true,
        }
      );
    } else {
      document = await Model.findOneAndDelete(id);
    }
    if (!document) {
      return next(new ApiError("No model found!", 404));
    }
    // Trigger "deleteOne" event when delete document
    document.deleteOne();
    res.status(204).json();
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!document) {
      return next(new ApiError("No model found!", 404));
    }
    // Trigger "save" event when editing document
    document.save();
    res.status(200).json({ data: document });
  });

exports.createOne = (Model) =>
  asyncHandler(async (req, res) => {
    await Model.create(req.body).then((document) =>
      res.status(201).json({ data: document })
    );
  });

exports.getOne = (Model, populationOpt) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    let query = Model.findById(id);
    if (populationOpt) {
      query = query.populate(populationOpt);
    }
    const document = await query;
    if (!document) {
      return next(new ApiError("No document found!", 404));
    }
    res.status(200).json({ data: document });
  });

exports.getAll = (Model, modelName) =>
  asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }
    const documentsCounts = await Model.countDocuments();
    const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
      .paginate(documentsCounts)
      .filter()
      .search(modelName)
      .limitFields()
      .sort();
    //execute query
    const { mongooseQuery, paginationResult } = apiFeatures;
    const documents = await mongooseQuery;

    res
      .status(200)
      .json({ results: documents.length, paginationResult, data: documents });
  });
