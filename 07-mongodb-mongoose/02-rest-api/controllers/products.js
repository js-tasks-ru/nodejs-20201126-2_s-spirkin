const mongoose = require('mongoose');
const Product = require('../models/Product');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const {subcategory} = ctx.query;
  const products = await Product.find({}).where('subcategory').equals(subcategory).exec();

  ctx.body = {products};
  await next();
};

module.exports.productList = async function productList(ctx, next) {
  const {subcategory} = ctx.query;

  if (subcategory == null) {
    const products = await Product.find({}).exec();
    ctx.body = {products};
  }

  await next();
};

module.exports.productById = async function productById(ctx, next) {
  const {id} = ctx.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    ctx.body = {error: 'Invalid id'};
    ctx.status = 400;
  } else {
    const product = await Product.findById(id).exec();

    if (product != null) {
      ctx.body = {product};
    } else {
      ctx.body = {error: 'Product not found'};
      ctx.status = 404;
    }
  }

  await next();
};
