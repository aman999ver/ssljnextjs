import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export const Category = mongoose.models.categories || mongoose.model("categories", CategorySchema);
