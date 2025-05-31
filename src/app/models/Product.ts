// src/app/models/Product.ts
import mongoose, { Schema, models } from "mongoose";

const ProductSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
      stock: { type: Number, required: true, min: 0 },
  image: { type: String, required: false},
  category: { type: String, required: true },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  cashDiscountEnabled: { type: Boolean, default: false },
  ratedBy: [Schema.Types.Mixed], // Permitir cualquier estructura dentro del array
}, { timestamps: true });

export default models.Product || mongoose.model("Product", ProductSchema);