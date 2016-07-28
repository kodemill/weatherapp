'use strict';

var _database = require('./database');

var _database2 = _interopRequireDefault(_database);

var _app = require('./app');

var _app2 = _interopRequireDefault(_app);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _periodicJob = require('./lib/periodic-job');

var _periodicJob2 = _interopRequireDefault(_periodicJob);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const startApp = (() => {
  var _ref = _asyncToGenerator(function* () {
    try {
      yield (0, _database2.default)();
      yield _app2.default.listen(_config2.default.app.port);
      console.log(`server listening on port ${ _config2.default.app.port }`);
      _periodicJob2.default.start(true);
    } catch (err) {
      console.log(err);
      process.exit(42);
    }
  });

  return function startApp() {
    return _ref.apply(this, arguments);
  };
})();
startApp();
//# sourceMappingURL=index.js.map