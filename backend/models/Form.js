import mongoose from "mongoose";

const FieldSchema = new mongoose.Schema({
  type: String,
  label: String,
  placeholder: String,
  required: Boolean,
  options: [String],
  layout: String,
  fileTypes: [String],
  maxSizeMB: Number
});

const FormSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  fields: [FieldSchema],
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now }
});

export const FormModel = mongoose.model("Form", FormSchema);
