import { Router } from "express";

import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategoryImage,
  updateCategoryTitle,
} from "../controllers/category.controller.js";

const router = Router();
router
  .route("/create")
  .post(
    verifyJWT,
    upload.fields([{ name: "imageUrl", maxCount: 1 }]),
    createCategory
  );
router.route("/getAll").get(getAllCategories);
router
  .route("/updateImage/:categoryId")
  .patch(
    verifyJWT,
    upload.fields([{ name: "imageUrl", maxCount: 1 }]),
    updateCategoryImage
  );
router.route("/updateTitle/:categoryId").patch(verifyJWT, updateCategoryTitle);
router.route("/delete/:categoryId").delete(verifyJWT, deleteCategory);

export default router;
