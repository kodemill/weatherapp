'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _weatherReport = require('../model/weather-report');

var _weatherReport2 = _interopRequireDefault(_weatherReport);

var _latestWeatherReport = require('../model/latest-weather-report');

var _latestWeatherReport2 = _interopRequireDefault(_latestWeatherReport);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const getLatestReportForCityId = (() => {
  var _ref = _asyncToGenerator(function* (cityId) {
    return yield _latestWeatherReport2.default.findOne({ city: cityId });
  });

  return function getLatestReportForCityId(_x) {
    return _ref.apply(this, arguments);
  };
})();

const saveWeatherReport = (() => {
  var _ref2 = _asyncToGenerator(function* (rawReport) {
    const cityId = rawReport.id;
    const newReport = yield _weatherReport2.default.create({
      city: cityId,
      temperature: rawReport.main.temp,
      rawReport
    });
    let latestReportForCity = yield getLatestReportForCityId(cityId);
    if (latestReportForCity) {
      latestReportForCity.weatherReport = newReport;
    } else {
      latestReportForCity = new _latestWeatherReport2.default({
        city: cityId,
        weatherReport: newReport
      });
    }
    yield latestReportForCity.save();
    return newReport;
  });

  return function saveWeatherReport(_x2) {
    return _ref2.apply(this, arguments);
  };
})();

const saveAllFromResponse = weatherResponse => Promise.all(weatherResponse.list.map(saveWeatherReport));

exports.default = {
  saveWeatherReport,
  saveAllFromResponse,
  getLatestReportForCityId
};
//# sourceMappingURL=weather-report.js.map