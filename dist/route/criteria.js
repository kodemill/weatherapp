'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _weatherCriteria = require('../controller/weather-criteria');

var _weatherCriteria2 = _interopRequireDefault(_weatherCriteria);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

exports.default = router => {
  router.put('/criteria/city/:cityId/temperature/:temperature/predicate/:predicate', (() => {
    var _ref = _asyncToGenerator(function* (ctx) {
      try {
        ctx.body = yield _weatherCriteria2.default.saveCriteria(_extends({}, ctx.params, {
          user: ctx.user
        }));
      } catch (err) {
        if (err.existingCriteria) {
          ctx.body = { existingCriteria: err.existingCriteria };
        } else {
          throw err;
        }
      }
    });

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  })());
  router.post('/criteria/city/:cityId/temperature/:temperature/predicate/:predicate', (() => {
    var _ref2 = _asyncToGenerator(function* (ctx) {
      ctx.body = yield _weatherCriteria2.default.saveCriteria(_extends({}, ctx.params, {
        user: ctx.user
      }), true);
    });

    return function (_x2) {
      return _ref2.apply(this, arguments);
    };
  })());
  router.get('/criteria', (() => {
    var _ref3 = _asyncToGenerator(function* (ctx) {
      ctx.body = yield _weatherCriteria2.default.getAllForUser(ctx.user);
    });

    return function (_x3) {
      return _ref3.apply(this, arguments);
    };
  })());
  router.del('/criteria/:criteriaId', (() => {
    var _ref4 = _asyncToGenerator(function* (ctx) {
      yield _weatherCriteria2.default.deleteForUser(ctx.user, ctx.params.criteriaId);
      ctx.body = { message: 'criteria delete success' };
    });

    return function (_x4) {
      return _ref4.apply(this, arguments);
    };
  })());
  router.get('/criteria/updatedafter/:date', (() => {
    var _ref5 = _asyncToGenerator(function* (ctx) {
      ctx.body = yield _weatherCriteria2.default.getAllUpdatedAfterForUser(ctx.user, ctx.params.date);
    });

    return function (_x5) {
      return _ref5.apply(this, arguments);
    };
  })());
  router.get('/criteria/fulfilled', (() => {
    var _ref6 = _asyncToGenerator(function* (ctx) {
      ctx.body = yield _weatherCriteria2.default.getAllFulfilledForUser(ctx.user);
    });

    return function (_x6) {
      return _ref6.apply(this, arguments);
    };
  })());
  router.get('/criteria/pending', (() => {
    var _ref7 = _asyncToGenerator(function* (ctx) {
      ctx.body = yield _weatherCriteria2.default.getAllPendingForUser(ctx.user);
    });

    return function (_x7) {
      return _ref7.apply(this, arguments);
    };
  })());
  router.get('/criteria/fulfilled/notacknoweledged', (() => {
    var _ref8 = _asyncToGenerator(function* (ctx) {
      ctx.body = yield _weatherCriteria2.default.getAllFulfilledNotAcknoweledgedForUser(ctx.user);
    });

    return function (_x8) {
      return _ref8.apply(this, arguments);
    };
  })());
  const acknoweledgeCriteria = (() => {
    var _ref9 = _asyncToGenerator(function* (ctx) {
      ctx.body = yield _weatherCriteria2.default.acknoweledgeAllForUser(ctx.user, ctx.params.criteriaIds.split(','));
    });

    return function acknoweledgeCriteria(_x9) {
      return _ref9.apply(this, arguments);
    };
  })();
  router.post('/criteria/acknoweledge/:criteriaIds', acknoweledgeCriteria);
  router.get('/criteria/acknoweledge/:criteriaIds', acknoweledgeCriteria);
};
//# sourceMappingURL=criteria.js.map