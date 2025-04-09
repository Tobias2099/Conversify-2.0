import mongoose from "mongoose";

const userSettingsSchema = new mongoose.Schema({
  language: {
    type: String,
    required: true,
  },
  proficiency: {
    type: String,
    required: true,
  },
  conversationSetting: {
    type: String,
    required: false,
  }
}, { timestamps: true });

export default mongoose.model("UserSettings", userSettingsSchema);