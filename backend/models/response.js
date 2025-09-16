import mongoose from "mongoose";

const ResponseSchema = new mongoose.Schema({
  form: { type: mongoose.Schema.Types.ObjectId, ref: "Form", required: true },
  values: { type: Map, of: mongoose.Schema.Types.Mixed },
},{
    timestamps: true
});

export const ResponseModel = mongoose.model("Response", ResponseSchema);
