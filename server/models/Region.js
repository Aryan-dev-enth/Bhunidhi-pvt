import mongoose from "mongoose";

const regionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    apiId: { type: String},
    boundaries: { type: String },
    geolocation: [{ type: Object, required: true }],
    drones: [{ type: mongoose.Schema.Types.ObjectId, ref: "Drone" }],
    sites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Site" }],
    reports: [{ type: mongoose.Schema.Types.ObjectId, ref: "Report" }],
  },
  { timestamps: true }
);

const Region = mongoose.model("Region", regionSchema);

export default Region;
