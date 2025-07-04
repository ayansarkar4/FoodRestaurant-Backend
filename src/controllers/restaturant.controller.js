import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { Restaurant } from "../models/restaturant.models.js";
import ApiResponse from "../utils/ApiResponse.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

const createRestaurant = asyncHandler(async (req, res) => {
  const {
    title,
    description,

    delevery,

    rating,
    countRating,
  } = req.body;
  if (!title || !description) {
    throw new ApiError(400, "All fields are required");
  }
  const existingRestaurant = await Restaurant.findOne({ title });
  if (existingRestaurant) {
    throw new ApiError(400, "Restaurant with this title already exists");
  }
  //upload image and logo
  const imageUrlLocalPath = req.files?.imageUrl[0]?.path;
  const logoUrlLocalPath = req.files?.logoUrl[0]?.path;

  if (!imageUrlLocalPath || !logoUrlLocalPath) {
    throw new ApiError(400, "Image and logo are required");
  }
  //upload on cloudinary
  const image = await uploadOnCloudinary(imageUrlLocalPath);
  const logo = await uploadOnCloudinary(logoUrlLocalPath);
  if (!image || !logo) {
    throw new ApiError(500, "Failed to upload images");
  }

  const restaurant = await Restaurant.create({
    title,
    description,
    imageUrl: image.url,
    logoUrl: logo.url,

    delevery,

    rating,
    countRating,
  });
  if (!restaurant) {
    throw new ApiError(500, "Failed to create restaurant");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, restaurant, "Restaurant created successfully"));
});
//get all restaurants
const getAllRestaturants = asyncHandler(async (req, res) => {
  const restaturants = await Restaurant.find({});
  if (!restaturants || restaturants.length === 0) {
    throw new ApiError(404, "No restaurants found");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { totalCount: restaturants.length, data: restaturants },
        "Restaurants fetched successfully"
      )
    );
});
//get restaturant by id
const getRestaturantById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new ApiError(400, "Restaurant ID is required");
  }
  const restaturant = await Restaurant.findById(id);
  if (!restaturant) {
    throw new ApiError(404, "Restaurant not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, restaturant, "Restaurant fetched successfully"));
});
//delete restaturant by id
const deleteRestaturantById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new ApiError(400, "Restaurant ID is required");
  }
  const restaturant = await Restaurant.findByIdAndDelete(id);
  if (!restaturant) {
    throw new ApiError(404, "Restaurant not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Restaurant deleted successfully"));
});

export {
  createRestaurant,
  getAllRestaturants,
  getRestaturantById,
  deleteRestaturantById,
};
