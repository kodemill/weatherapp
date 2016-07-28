'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _constants = require('../constants');

var _constants2 = _interopRequireDefault(_constants);

var _user = require('../model/user');

var _user2 = _interopRequireDefault(_user);

var _passport = require('../lib/passport');

var _middleware = require('../middleware');

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _config = require('../../config');

var _user3 = require('../controller/user');

var UserController = _interopRequireWildcard(_user3);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

// FIXME cleanup and/or better protection
const hackFilterByIp = false;

exports.default = router => {
  router.get('/auth/facebook', (0, _middleware.isAuthenticated)(), (0, _passport.providerHandler)('facebook'));
  router.get('/auth/facebook/callback', (0, _passport.providerCallbackHandler)('facebook'));
  router.get('/auth/github', (0, _middleware.isAuthenticated)(), (0, _passport.providerHandler)('github'));
  router.get('/auth/github/callback', (0, _passport.providerCallbackHandler)('github'));
  router.post('/auth/register', (() => {
    var _ref = _asyncToGenerator(function* (ctx) {
      // register anonym users and generate tokens for them
      const ip = ctx.ip;
      let user;
      if (hackFilterByIp && (user = yield _user2.default.findOne({ ip }))) {
        ctx.throw(403, _constants2.default.forbidden);
      }
      user = yield _user2.default.create({ ip });
      // only claim is id
      const token = _jsonwebtoken2.default.sign({ id: user.id }, _config.auth.jwtSecret);
      yield user.update({ token });
      ctx.body = { token };
    });

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  })());
  router.get('/auth/email/verify', (0, _middleware.isAuthenticated)(true), (() => {
    var _ref2 = _asyncToGenerator(function* (ctx) {
      yield UserController.verifyEmailForUserViaMail(ctx.user, ctx.email);
      // ctx.body = { message: 'email verified' };
      ctx.redirect('/settings');
    });

    return function (_x2) {
      return _ref2.apply(this, arguments);
    };
  })());
  router.get('/auth/email/unsubscribe', (0, _middleware.isAuthenticated)(true), (() => {
    var _ref3 = _asyncToGenerator(function* (ctx) {
      yield UserController.unsubscribeEmailForUserViaMail(ctx.user, ctx.email);
      ctx.body = { message: 'unsubscribe successful' };
      ctx.redirect('/settings');
    });

    return function (_x3) {
      return _ref3.apply(this, arguments);
    };
  })());
};
//# sourceMappingURL=auth.js.map