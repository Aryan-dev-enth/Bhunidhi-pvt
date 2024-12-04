import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String},
    reports: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Report' }],
    address: {
      lat: { type: Number, required: true },
      lon: { type: Number, required: true },
    },
    canNotify: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
