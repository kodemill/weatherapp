import mongoose from 'mongoose';

const CitySchema = new mongoose.Schema({
  _id: {
    type: Number,
    index: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
    index: true,
  },
  nameLC: {
    type: String,
    index: true,
  },
  country: {
    type: String,
    required: true,
  },
  // GeoJSON Point
  location: {
    type: {
      enum: 'Point',
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      default: [0, 0],
    },
  },
});

CitySchema.index({ location: '2dsphere' });

CitySchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = doc._id;
    delete ret._id;
    delete ret.nameLC;
  },
});

export default mongoose.model('City', CitySchema);
