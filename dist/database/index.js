'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _connect = require('./connect');

var _connect2 = _interopRequireDefault(_connect);

var _importCityList = require('./import-city-list');

var _importCityList2 = _interopRequireDefault(_importCityList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

exports.default = _asyncToGenerator(function* () {
  yield (0, _connect2.default)();
  yield (0, _importCityList2.default)();
});
//# sourceMappingURL=index.js.map