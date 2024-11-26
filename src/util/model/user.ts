import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  userid: { type: Number, unique: true },
  username: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favoriteIds: { type: [String] },
},
  { timestamps: true }
);

export const UserData = mongoose.models.users || mongoose.model('users', userSchema);
