'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _config = require('../../config');

var _uniq = require('lodash/uniq');

var _uniq2 = _interopRequireDefault(_uniq);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const baseUrl = 'http://api.openweathermap.org/data/2.5/';
const createGroupParam = cityIds => `group?id=${ cityIds.join(',') }`;
const createGroupQueryUrl = cityIds => `${ baseUrl }${ createGroupParam(cityIds) }&units=metric&appid=${ _config.auth.openWeatherMapApiKey }`;

const getGroup = (() => {
  var _ref = _asyncToGenerator(function* (cityIds) {
    const citiesToCheck = Array.isArray(cityIds) ? (0, _uniq2.default)(cityIds) : [cityIds];
    const response = yield (0, _nodeFetch2.default)(createGroupQueryUrl(citiesToCheck));
    if (response.ok) {
      return yield response.json();
    }
    throw new Error('smg went wrong during api call');
  });

  return function getGroup(_x) {
    return _ref.apply(this, arguments);
  };
})();

exports.default = getGroup;
//# sourceMappingURL=fetch-weather.js.map