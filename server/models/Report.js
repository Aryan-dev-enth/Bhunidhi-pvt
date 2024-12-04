import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    site: { type: mongoose.Schema.Types.ObjectId, ref: 'Site', required: true },
    image: [{ type: String }],
    description: { type: String },
    status: { type: String, enum: ['open', 'in progress', 'resolved', 'closed'], default: 'open' },
    statusUpdate: { type: Date },
    isAnonymous: { type: Boolean, default: false },
    upVotes: { type: Number, default: 0 },
    downVotes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Report = mongoose.model('Report', reportSchema);

export default Report;
