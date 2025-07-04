import { Router } from "express";
import {
  createRestaurant,
  deleteRestaturantById,
  getAllRestaturants,
  getRestaturantById,
} from "../controllers/restaturant.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/create").post(
  upload.fields([
    { name: "imageUrl", maxCount: 1 },
    { name: "logoUrl", maxCount: 1 },
  ]),
  createRestaurant
);
router.route("/getAll").get(getAllRestaturants);
router.route("/get/:id").get(getRestaturantById);
router.route("/delete/:id").delete(deleteRestaturantById); // Assuming you want to delete by ID

export default router;
