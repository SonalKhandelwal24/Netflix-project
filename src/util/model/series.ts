import mongoose from 'mongoose';

const seriesSchema = new mongoose.Schema({
  seriesid: { type: String },
  title: { type: String },
  description: { type: String },
  videoUrl: { type: String },
  thumbnailUrl: { type: String },
  genre: { type: String },
  duration: { type: String },
});

export const SeriesData = mongoose.models.series || mongoose.model('series', seriesSchema);
