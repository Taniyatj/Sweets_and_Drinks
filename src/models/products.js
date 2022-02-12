const mongoose = require("mongoose");
const res = require("express/lib/response");

const productSchema = new mongoose.Schema({
  productn: { type: "string", required: "true", unique: "true" },
  productimg: {data: "Buffer", contentType: "String"},
  pdescr : {type: "string"},
  anzahl : {type: "number", required: "true"}
});

const Product = new mongoose.model("Product", productSchema);


module.exports = Product;