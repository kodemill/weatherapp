'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _user = require('../model/user');

var _user2 = _interopRequireDefault(_user);

var _user3 = require('../controller/user');

var UserController = _interopRequireWildcard(_user3);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

exports.default = router => {
  router.get('/user/whoami', (() => {
    var _ref = _asyncToGenerator(function* (ctx) {
      ctx.body = yield _user2.default.findById(ctx.user.id);
    });

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  })());
  router.post('/user', (() => {
    var _ref2 = _asyncToGenerator(function* (ctx) {
      ctx.body = yield UserController.saveUserForUser(ctx.user, ctx.request.body);
    });

    return function (_x2) {
      return _ref2.apply(this, arguments);
    };
  })());
};
//# sourceMappingURL=user.js.map