import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  movieid: { type: String },
  title: { type: String },
  description: { type: String },
  videoUrl: { type: String },
  thumbnailUrl: { type: String },
  genre: { type: String },
  duration: { type: String },
});

export const MovieData = mongoose.models.movies || mongoose.model('movies', movieSchema);
