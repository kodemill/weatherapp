'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _config = require('../../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; } // const fileExtensionRegex = /.(html|js|css|eot|svg|ttf|woff|woff2)$/;


const fileRequest = /\.\w{1,5}$/;
const apiRequest = new RegExp(`^\/${ _config2.default.app.apiPath }/`);

exports.default = () => (() => {
  var _ref = _asyncToGenerator(function* (ctx, next) {
    if (ctx.method.match(/GET/i) && !fileRequest.test(ctx.url) && !apiRequest.test(ctx.url)) {
      console.log(`historySupport - url set from ${ ctx.url } to /index.html`);
      ctx.url = '/index.html';
    }
    yield next();
  });

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();
//# sourceMappingURL=history-support.js.map