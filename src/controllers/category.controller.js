import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { Category } from "../models/category.models.js";
import ApiResponse from "../utils/ApiResponse.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import deleteFromCloudinary from "../utils/deleteFromCloudinary.js";

const createCategory = asyncHandler(async (req, res) => {
  const { title } = req.body;

  if (!title) {
    throw new ApiError(400, "Title is required");
  }

  const existingCategory = await Category.findOne({ title });
  if (existingCategory) {
    throw new ApiError(400, "Category with this title already exists");
  }
  const imageUrlLocalPath = req.files?.imageUrl?.[0]?.path;
  if (!imageUrlLocalPath) {
    throw new ApiError(400, "Image is required");
  }
  const image = await uploadOnCloudinary(imageUrlLocalPath);
  if (!image || !image.url) {
    throw new ApiError(500, "Failed to upload image");
  }
  const category = await Category.create({
    title,
    imageUrl: image.url,
  });
  if (!category) {
    throw new ApiError(500, "Failed to create category");
  }
  return res
    .status(201)
    .json(new ApiResponse(201, category, "Category created successfully"));
});
//get all categories

const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({});
  if (!categories || categories.length === 0) {
    throw new ApiError(404, "No categories found");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { totalCategory: categories.length, data: categories },
        "Categories fetched successfully"
      )
    );
});

//update the imageUrl of a category
const updateCategoryImage = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const imageUrlLocalPath = req.files?.imageUrl?.[0]?.path;

  if (!imageUrlLocalPath) {
    throw new ApiError(400, "Image is required");
  }

  // Check if category exists first
  const category = await Category.findById(categoryId);
  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  // Upload new image
  const image = await uploadOnCloudinary(imageUrlLocalPath);
  if (!image || !image.url) {
    throw new ApiError(500, "Failed to upload image");
  }

  // Update DB
  const updatedCategory = await Category.findByIdAndUpdate(
    categoryId,
    { imageUrl: image.url },
    { new: true }
  );

  // Delete old image
  await deleteFromCloudinary(category.imageUrl);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedCategory,
        "Category image updated successfully"
      )
    );
});
//change the category  title
const updateCategoryTitle = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const { title } = req.body;
  if (!title) {
    throw new ApiError(400, "Title is required");
  }
  // Check if category exists first
  const category = await Category.findById(categoryId);
  if (!category) {
    throw new ApiError(404, "Category not found");
  }
  // Check if category with the new title already exists
  const existingCategory = await Category.findOne({ title });
  if (existingCategory && existingCategory._id.toString() !== categoryId) {
    throw new ApiError(400, "Category with this title already exists");
  }
  // Update DB
  const updatedCategory = await Category.findByIdAndUpdate(
    categoryId,
    { title },
    { new: true }
  );
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedCategory,
        "Category title updated successfully"
      )
    );
});

//delete a category by id

const deleteCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  // Check if category exists first
  const category = await Category.findById(categoryId);
  if (!category) {
    throw new ApiError(404, "Category not found");
  }
  // Delete the category
  const deletedCategory = await Category.findByIdAndDelete(categoryId);
  if (!deletedCategory) {
    throw new ApiError(500, "Failed to delete category");
  }
  // Delete the image from Cloudinary
  await deleteFromCloudinary(category.imageUrl);
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Category deleted successfully"));
});

export {
  createCategory,
  getAllCategories,
  updateCategoryImage,
  updateCategoryTitle,
  deleteCategory,
};
