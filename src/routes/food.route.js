import { Router } from "express";
import {
  createFood,
  deleteFood,
  getAllFoods,
  getFoodByCode,
  updateFoodImage,
  updateFoodItem,
} from "../controllers/food.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();
router
  .route("/create")
  .post(
    verifyJWT,
    upload.fields([{ name: "imageUrl", maxCount: 1 }]),
    createFood
  );
router.route("/getAll").get(verifyJWT, getAllFoods);
router.route("/getFoodById/:code").get(verifyJWT, getFoodByCode);
router.route("/updateFoodItem/:code").put(verifyJWT, updateFoodItem);
router
  .route("/updateFoodImage/:code")
  .put(
    verifyJWT,
    upload.fields([{ name: "imageUrl", maxCount: 1 }]),
    updateFoodImage
  );
router.route("/deleteFoodItem/:code").delete(verifyJWT, deleteFood);

export default router;
