import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export const Product = mongoose.models.products || mongoose.model("products", ProductSchema);
