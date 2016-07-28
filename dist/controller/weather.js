'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _weatherCriteria = require('../controller/weather-criteria');

var _weatherCriteria2 = _interopRequireDefault(_weatherCriteria);

var _weatherReport = require('../controller/weather-report');

var _weatherReport2 = _interopRequireDefault(_weatherReport);

var _fetchWeather = require('../lib/fetch-weather');

var _fetchWeather2 = _interopRequireDefault(_fetchWeather);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const fetchWeatherAndUpdateDocuments = (() => {
  var _ref = _asyncToGenerator(function* () {
    const pendingCriteria = yield _weatherCriteria2.default.getAllPending();
    const weatherResponse = yield (0, _fetchWeather2.default)(pendingCriteria.map(function (criteria) {
      return criteria.city;
    }));
    const weatherReports = yield _weatherReport2.default.saveAllFromResponse(weatherResponse);
    return [yield _weatherCriteria2.default.tryFulfillFromReports(pendingCriteria, weatherReports), weatherReports];
  });

  return function fetchWeatherAndUpdateDocuments() {
    return _ref.apply(this, arguments);
  };
})();

exports.default = {
  fetchWeatherAndUpdateDocuments
};
//# sourceMappingURL=weather.js.map