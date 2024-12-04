import mongoose from 'mongoose';

const siteSchema = new mongoose.Schema(
  {
    geolocation: { type: Object, required: true },
    isSurveyed: { type: Boolean, default: false },
    surveyTime: { type: Date },
    surveyedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Drone' }],
    surveyedImage: [{ type: String }],
    metaData: [{ type: Object }],
    permitInfo: [{ type: Object }],
    suspectType: { type: String, enum: ['system', 'user'], default: 'user triggered' },
    region: { type: mongoose.Schema.Types.ObjectId, ref: 'Region' },
    reports: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Report' }],
  },
  { timestamps: true }
);

const Site = mongoose.model('Site', siteSchema);

export default Site;
