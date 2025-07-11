import { Schema } from "mongoose";
import mongoose from "mongoose";

const categorySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
export const Category = mongoose.model("Category", categorySchema);
