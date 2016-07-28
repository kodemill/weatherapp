import mongoose, { Schema } from 'mongoose';

const LatestWeatherReportSchema = new Schema({
  city: {
    type: Number,
    ref: 'City',
    required: true,
    index: true,
    unique: true,
  },
  weatherReport: {
    type: Schema.Types.ObjectId,
    ref: 'WeatherReport',
    required: true,
  },
  updatedAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

LatestWeatherReportSchema.pre('save', function (next) {
  if (this.isModified('latestWeatherReport')) {
    this.updatedAt = Date.now();
  }
  next();
});

export default mongoose.model('LatestWeatherReport', LatestWeatherReportSchema);
