'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _weather = require('../controller/weather');

var _weather2 = _interopRequireDefault(_weather);

var _notification = require('../controller/notification');

var _notification2 = _interopRequireDefault(_notification);

var _config = require('../../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const job = (() => {
  var _ref = _asyncToGenerator(function* () {
    console.log('periodic job start...');
    const start = Date.now();
    try {
      const fulfilledCriteriaWithReports = yield _weather2.default.fetchWeatherAndUpdateDocuments();
      yield _notification2.default.notificateUsers(...fulfilledCriteriaWithReports);
    } catch (error) {
      console.log(error);
    } finally {
      console.log(`periodic job finished in ${ Date.now() - start }ms`);
    }
  });

  return function job() {
    return _ref.apply(this, arguments);
  };
})();

let intervalId;

const stop = () => {
  clearInterval(intervalId);
  intervalId = null;
};

const start = (immediate, granularity) => {
  if (intervalId) {
    stop();
  }
  if (immediate) {
    job();
  }
  intervalId = setInterval(job, granularity || _config2.default.time.jobGranularity);
};

exports.default = {
  start,
  stop
};
//# sourceMappingURL=periodic-job.js.map