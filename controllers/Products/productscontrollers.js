
const { validationResult } = require("express-validator");
const Asncwrapper = require("../../middleware/Asncwrapper");
const { Success, Error, Fail } = require("../../utilits/HttpsStatus");
const AppError = require("../..//utilits/AppError");
const imagekit = require("../../utilits/imagekit");
const Product=require("../../models/Productmodels")


const Createproduct = Asncwrapper(async (req, res, next) => {
  // 1- validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      AppError.createError({ data: errors.array() }, 400, "Fail")
    );
  }

  // 2- get body data (Express way)
  const { name, description, price, stock , oldPrice} = req.body;

  const parsedPrice = Number(price);
  const parsedStock = Number(stock || 0);
  

  if (isNaN(parsedPrice) || parsedPrice < 0) {
    return next(AppError.createError("Invalid price", 400, "Fail"));
  }

  if (isNaN(parsedStock) || parsedStock < 0) {
    return next(AppError.createError("Invalid stock", 400, "Fail"));
  }

  // 3- check images
  if (!req.files || req.files.length === 0) {
    return next(AppError.createError("Image is required", 400, "Fail"));
  }

  // 4- upload images
  let uploadedImages = [];

  for (const file of req.files) {
    const upload = await imagekit.upload({
      file: file.buffer,
      fileName: Date.now() + "-" + file.originalname,
      folder: "/bazaars",
    });

    uploadedImages.push(upload.url);
  }

  // 5- create product
  const product = await Product.create({
    name: JSON.parse(name),
    description: JSON.parse(description),
    price: parsedPrice,
    stock: parsedStock,
    oldPrice: oldPrice ? Number(oldPrice) : null,
    images: uploadedImages,
  });

  // 6- response
  res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: product,
  });
});
const getproducts = Asncwrapper(async (req, res, next) => {
  
  const products = await Product.find().sort({ createdAt: -1 });

  return res.status(200).json({
    status: Success,
    message: "Products fetched successfully",
    data: products,
  });

});
const getproductbyid = Asncwrapper (async (req, res, next) => {

    const id = req.params.id;

    const product = await Product.findById(id);

    if (!product) {
      return next(
        AppError.createError({ data: "product not found" }, 404)
      );
    }

    res.status(200).json({
      status: "success",
      msg: "product fetched successfully",
      data: product,
    });
  
});
const deleteproduct =  Asncwrapper (async (req, res, next) => {

    const id = req.params.id;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return next(
        AppError.createError({ data: "product not found" }, 404)
      );
    }

    res.status(200).json({
      status: "success",
      msg: "produc  deleted successfully",
      data: [],
    });
  
});
const parseIfNeeded = (data) => {
  if (!data) return null;

  if (typeof data === "string") {
    try {
      return JSON.parse(data);
    } catch (err) {
      return null;
    }
  }

  return data;
};

const updateProduct = Asncwrapper(async (req, res, next) => {
  const { id } = req.params;



  const product = await Product.findById(id);

  if (!product) {
    return next(AppError.createError("Product not found", 404, "Fail"));
  }

  if (req.body?.name) {
    const name = parseIfNeeded(req.body.name);

    if (name && typeof name === "object") {
      if ("ar" in name) product.name.ar = name.ar;
      if ("en" in name) product.name.en = name.en;
    }
  }

  if (req.body?.description) {
    const description = parseIfNeeded(req.body.description);

    if (description && typeof description === "object") {
      if ("ar" in description) product.description.ar = description.ar;
      if ("en" in description) product.description.en = description.en;
    }
  }

  // =========================
  // 5- PRICE
  // =========================
  if (req.body?.price !== undefined) {
    const price = Number(req.body.price);

    if (isNaN(price) || price < 0) {
      return next(AppError.createError("Invalid price", 400, "Fail"));
    }

    product.price = price;
  }
  if (req.body?.oldPrice !== undefined) {
  product.oldPrice = Number(req.body.oldPrice);
}

  // =========================
  // 6- STOCK
  // =========================
  if (req.body?.stock !== undefined) {
    const stock = Number(req.body.stock);

    if (isNaN(stock) || stock < 0) {
      return next(AppError.createError("Invalid stock", 400, "Fail"));
    }

    product.stock = stock;
  }

  // =========================
  // 7- IMAGES (REPLACE MODE)
  // =========================
  if (req.files && req.files.length > 0) {
    let uploadedImages = [];

    for (const file of req.files) {
      const upload = await imagekit.upload({
        file: file.buffer,
        fileName: Date.now() + "-" + file.originalname,
        folder: "/bazaars",
      });

      uploadedImages.push(upload.url);
    }

    // replace old images completely
    product.images = uploadedImages;
  }

  // =========================
  // 8- SAVE
  // =========================
  const updatedProduct = await product.save();

  // =========================
  // 9- RESPONSE
  // =========================
  res.status(200).json({
    status: "Success",
    message: "Product updated successfully",
    data: updatedProduct,
  });
});


module.exports={
  Createproduct,
  getproducts,
  getproductbyid,
  deleteproduct,
  updateProduct
}