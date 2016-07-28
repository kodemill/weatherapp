'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const CitySchema = new _mongoose2.default.Schema({
  _id: {
    type: Number,
    index: true,
    required: true
  },
  name: {
    type: String,
    required: true,
    index: true
  },
  nameLC: {
    type: String,
    index: true
  },
  country: {
    type: String,
    required: true
  },
  // GeoJSON Point
  location: {
    type: {
      enum: 'Point',
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  }
});

CitySchema.index({ location: '2dsphere' });

CitySchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = doc._id;
    delete ret._id;
    delete ret.nameLC;
  }
});

exports.default = _mongoose2.default.model('City', CitySchema);
//# sourceMappingURL=city.js.map