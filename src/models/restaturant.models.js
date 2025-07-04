import { Schema } from "mongoose";
import mongoose from "mongoose";

const restaurantSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    logoUrl: {
      type: String,
    },

    delevery: {
      type: Boolean,
      default: false,
    },

    rating: {
      type: Number,
      default: 1,
      min: 1,
      max: 5,
    },
    countRating: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Restaurant = mongoose.model("Restaurant", restaurantSchema);
