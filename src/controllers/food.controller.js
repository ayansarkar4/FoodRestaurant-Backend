import { Food } from "../models/food.models.js";
import { Category } from "../models/category.models.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import deleteFromCloudinary from "../utils/deleteFromCloudinary.js";
import { Restaurant } from "../models/restaturant.models.js";

//create food
const createFood = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    price,
    category,
    restaurant,
    code,
    isAvailable,
    rating,
    countRating,
  } = req.body;
  if (
    [title, description, price, category, restaurant, code].includes(undefined)
  ) {
    throw new ApiError(400, "All fields are required");
  }
  const categoryExists = await Category.findById(category);
  if (!categoryExists) {
    throw new ApiError(404, "Category not found");
  }
  const restaurantExists = await Restaurant.findById(restaurant);
  if (!restaurantExists) {
    throw new ApiError(404, "Restaurant not found");
  }
  const imageUrl = req.files?.imageUrl[0]?.path;
  if (!imageUrl) {
    throw new ApiError(400, "Image is required");
  }
  const image = await uploadOnCloudinary(imageUrl);
  if (!image) {
    throw new ApiError(500, "Image upload failed");
  }
  const food = await Food.create({
    title,
    description,
    imageUrl: image.url,
    price,
    category,
    restaurant,
    code,
    isAvailable: isAvailable || true,
    rating: rating || 1,
    countRating: countRating || 5,
  });
  return res
    .status(201)
    .json(new ApiResponse(201, food, "Food created successfully"));
});
//get all foods
const getAllFoods = asyncHandler(async (req, res) => {
  const foods = await Food.find({})
    .populate("category", "title imageUrl")
    .populate("restaurant", "title imageUrl logoUrl");
  if (!foods || foods.length === 0) {
    throw new ApiError(404, "No foods found");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { totalFoods: foods.length, data: foods },
        "Foods fetched successfully"
      )
    );
});
//get food by its code
const getFoodByCode = asyncHandler(async (req, res) => {
  const { code } = req.params;
  if (!code) {
    throw new ApiError(400, "Code is required");
  }
  const food = await Food.findOne({ code })
    .populate("category", "title imageUrl")
    .populate("restaurant", "title imageUrl logoUrl");
  if (!food) {
    throw new ApiError(404, "Food not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, food, "Food fetched successfully"));
});
//update food item not image
const updateFoodItem = asyncHandler(async (req, res) => {
  const { code } = req.params;

  if (!code) {
    throw new ApiError(400, "Code is required");
  }

  const food = await Food.findOne({ code });
  if (!food) {
    throw new ApiError(404, "Food not found");
  }

  const updates = req.body;

  // Validate category if provided
  if (updates.hasOwnProperty("category") && updates.category !== null) {
    const categoryExists = await Category.findById(updates.category);
    if (!categoryExists) {
      throw new ApiError(404, "Category not found");
    }
  }

  // Validate restaurant if provided
  if (updates.hasOwnProperty("restaurant") && updates.restaurant !== null) {
    const restaurantExists = await Restaurant.findById(updates.restaurant);
    if (!restaurantExists) {
      throw new ApiError(404, "Restaurant not found");
    }
  }

  const updatedFood = await Food.findOneAndUpdate(
    { code },
    { $set: updates },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedFood, "Food updated successfully"));
});

//update food item image
const updateFoodImage = asyncHandler(async (req, res) => {
  const { code } = req.params;
  if (!code) {
    throw new ApiError(400, "Code is required");
  }
  const food = await Food.findOne({ code });
  if (!food) {
    throw new ApiError(404, "Food not found");
  }
  const imageUrl = req.files?.imageUrl[0]?.path;
  if (!imageUrl) {
    throw new ApiError(400, "Image is required");
  }
  const image = await uploadOnCloudinary(imageUrl);
  if (!image) {
    throw new ApiError(500, "Image upload failed");
  }
  //update food image

  const updatedFood = await Food.findOneAndUpdate(
    { code },
    {
      $set: {
        imageUrl: image.url,
      },
    },

    { new: true }
  );
  if (!updatedFood) {
    throw new ApiError(404, "Food not found");
  }
  //delete old image from cloudinary
  await deleteFromCloudinary(food.imageUrl);

  return res
    .status(200)
    .json(new ApiResponse(200, updatedFood, "Food image updated successfully"));
});
//delete food by code
const deleteFood = asyncHandler(async (req, res) => {
  const { code } = req.params;
  if (!code) {
    throw new ApiError(400, "Code is required");
  }
  const food = await Food.findOne({ code });
  if (!food) {
    throw new ApiError(404, "Food not found");
  }
  await Food.findOneAndDelete({ code });

  //delete image from cloudinary
  await deleteFromCloudinary(food.imageUrl);
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Food deleted successfully"));
});

export {
  createFood,
  getAllFoods,
  getFoodByCode,
  updateFoodItem,
  updateFoodImage,
  deleteFood,
};
