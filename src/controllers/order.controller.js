import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Order } from "../models/order.models.js";
import { Food } from "../models/food.models.js";

// Create a new order (buyer is the logged-in user)
const createOrder = asyncHandler(async (req, res) => {
  const { foods, paymentMethod } = req.body;

  // 1. Get buyer from authenticated user
  const buyer = req.user?._id;

  if (!buyer) {
    throw new ApiError(401, "Unauthorized: Buyer not found in request.");
  }

  // 2. Validate input
  if (!foods || !Array.isArray(foods) || foods.length === 0) {
    throw new ApiError(400, "Foods must be a non-empty array.");
  }

  // 3. Validate food items
  const foodDocs = await Food.find({ _id: { $in: foods } });
  if (foodDocs.length !== foods.length) {
    throw new ApiError(404, "One or more food items not found.");
  }

  // 4. Calculate total price
  const totalPrice = foodDocs.reduce((sum, food) => sum + food.price, 0);

  // 5. Create the order
  const order = await Order.create({
    foods,
    buyer,
    paymentMethod: paymentMethod || "cash",
    totalPrice,
  });

  // 6. Send response
  return res
    .status(201)
    .json(new ApiResponse(201, order, "Order created successfully"));
});

export { createOrder };
