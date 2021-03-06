import mongoose, { Schema } from 'mongoose';

const WeatherCriteriaSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  city: {
    type: Number,
    ref: 'City',
    required: true,
    index: true,
  },
  temperature: {
    type: Number,
    required: true,
  },
  predicate: {
    type: String,
    enum: ['greater', 'less'],
    default: 'greater',
    required: true,
  },
  fulfilledAt: {
    type: Date,
  },
  acknoweledgedAt: {
    type: Date,
  },
}, {
  // createdAt and updatedAt
  timestamps: true,
});

WeatherCriteriaSchema.methods.isFulfilledWithTemperature = function (temperature) {
  switch (this.predicate) {
    case 'greater':
      return temperature >= this.temperature;
    case 'less':
      return temperature <= this.temperature;
    default: return false;
  }
};

WeatherCriteriaSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = doc._id;
    delete ret._id;
    delete ret.__v;
  },
});


export default mongoose.model('WeatherCriteria', WeatherCriteriaSchema);
