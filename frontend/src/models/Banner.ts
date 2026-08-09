import mongoose from "mongoose";

const BannerSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

export const Banner = mongoose.models.banners || mongoose.model("banners", BannerSchema);
