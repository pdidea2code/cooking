const { successResponse, queryErrorRelatedResponse } = require("../../helper/sendResponse");
const Ingredient = require("../../models/Ingredient");
const Recipe = require("../../models/Recipe");
const Shopinglist = require("../../models/Shopinglist");
const ShoppingListItem = require("../../models/ShoppingListItem");

const addShopingist = async (req, res, next) => {
  try {
    const shopinglist = await Shopinglist.create({
      userid: req.user._id,
      recipeid: req.body.id,
      person: req.body.person,
    });

    const ingredient = await Ingredient.find({ recipeid: req.body.id });
    const data = await Promise.all(
      ingredient.map(async (data) => {
        const shopinglistitem = await ShoppingListItem.create({
          shopping_list_id: shopinglist._id,
          ingredient_id: data._id,
          userid: req.user._id,
          recipe_id: req.body.id,
          unit: data.unit,
          amount: data.amount,
          name: data.name,
        });
      })
    );

    successResponse(res, "Recipe add shoping list successfully");
  } catch (error) {
    next(error);
  }
};

const shopingList = async (req, res, next) => {
  try {
    const shopingList = await Shopinglist.find({ userid: req.user._id });

    const data = await Promise.all(
      shopingList.map(async (data) => {
        const recipe = await Recipe.findById(data.recipeid);
        const ingredient = await ShoppingListItem.find({ shopping_list_id: data._id }).populate("unit");
        const check = await ShoppingListItem.countDocuments({ shopping_list_id: data._id, is_checked: true });
        const ingredients = ingredient.map((data) => {
          return {
            _id: data._id,
            name: data.name,
            amount: data.amount,
            unit: data.unit?.name,
            is_checked: data.is_checked,
          };
        });
        return {
          _id: data._id,
          recipe_id: recipe._id,
          image: recipe.image,
          total: ingredient.length,
          check: check,
          title: recipe.title,
          person: data.person,
          ingredient: ingredients,
        };
      })
    );
    successResponse(res, data);
  } catch (error) {
    next(error);
  }
};

const toggleIngredientcheck = async (req, res, next) => {
  try {
    const shopinglistitem = await ShoppingListItem.findById(req.body.id);
    if (!shopinglistitem) queryErrorRelatedResponse(req, res, 404, "Not Found");

    shopinglistitem.is_checked = !shopinglistitem.is_checked;
    await shopinglistitem.save();

    successResponse(res, "Change status Successfully");
  } catch (error) {
    next(error);
  }
};

const deleteShopinglist = async (req, res, next) => {
  try {
    const shopinglist = await Shopinglist.findById(req.params.id);
    if (!shopinglist) return queryErrorRelatedResponse(req, res, 404, "Not Found");

    await Shopinglist.deleteOne({ _id: req.params.id });
    await ShoppingListItem.deleteMany({ shopping_list_id: req.params.id });
    successResponse(res, "Delete Successfully");
  } catch (error) {
    next(error);
  }
};

const changePerson = async (req, res, next) => {
  try {
    const shopingList = await Shopinglist.findById(req.body.id);
    if (!Shopinglist) queryErrorRelatedResponse(req, res, 404, "Shoping List Not Found");

    shopingList.person = req.body.person;

    await shopingList.save();
    successResponse(res, "Update Successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addShopingist,
  shopingList,
  deleteShopinglist,
  toggleIngredientcheck,
  changePerson,
};
