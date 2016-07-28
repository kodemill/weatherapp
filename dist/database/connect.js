'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _config = require('../../config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

_mongoose2.default.Promise = global.Promise;
exports.default = _asyncToGenerator(function* () {
  if (_mongoose2.default.connection.readyState === 1) {
    console.log('already connected to MongoDB');
    return;
  }
  try {
    console.log('connecting to MongoDB...');
    yield _mongoose2.default.connect(_config.db.mongoUri);
    console.log(`connected @ ${ _config.db.mongoUri }`);
    return;
  } catch (err) {
    console.log(err);
    throw err;
  }
});
//# sourceMappingURL=connect.js.map