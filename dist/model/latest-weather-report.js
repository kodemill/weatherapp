'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const LatestWeatherReportSchema = new _mongoose.Schema({
  city: {
    type: Number,
    ref: 'City',
    required: true,
    index: true,
    unique: true
  },
  weatherReport: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'WeatherReport',
    required: true
  },
  updatedAt: {
    type: Date,
    required: true,
    default: Date.now
  }
});

LatestWeatherReportSchema.pre('save', function (next) {
  if (this.isModified('latestWeatherReport')) {
    this.updatedAt = Date.now();
  }
  next();
});

exports.default = _mongoose2.default.model('LatestWeatherReport', LatestWeatherReportSchema);
//# sourceMappingURL=latest-weather-report.js.map