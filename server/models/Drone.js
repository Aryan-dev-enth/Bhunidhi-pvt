import mongoose from 'mongoose';

const droneSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    region: { type: mongoose.Schema.Types.ObjectId, ref: 'Region' },
    surveyQueue: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Site' }],
    surveyedSites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Site' }],
    operationTime: { type: Date },
    status: { type: String, enum: ['active', 'flying', 'charging', 'service'], default: 'charging' },
  },
  { timestamps: true }
);

const Drone = mongoose.model('Drone', droneSchema);

export default Drone;
