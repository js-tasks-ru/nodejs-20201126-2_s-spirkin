const Category = require('../models/Category');

module.exports.categoryList = async function categoryList(ctx, next) {
  const categories = await Category.find({}).exec();
  categories.map((c) => c.toJSON());

  ctx.body = {categories};
};
