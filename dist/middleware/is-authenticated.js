'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _constants = require('../constants');

var _passport = require('../lib/passport');

var _passport2 = _interopRequireDefault(_passport);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

exports.default = email => {
  const strategy = email ? 'email-jwt' : 'jwt';
  return (() => {
    var _ref = _asyncToGenerator(function* (ctx, next) {
      yield _passport2.default.authenticate(strategy, function (user) {
        if (user) {
          ctx.user = user;
          if (email) {
            ctx.email = user.email;
          }
        }
      })(ctx, next);
      if (ctx.user) {
        return next();
      }
      ctx.throw(_constants.unauthorized, 401);
    });

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  })();
};
//# sourceMappingURL=is-authenticated.js.map