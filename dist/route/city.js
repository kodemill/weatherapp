'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _city = require('../model/city');

var _city2 = _interopRequireDefault(_city);

var _constants = require('../constants');

var _constants2 = _interopRequireDefault(_constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

exports.default = router => {
  router.get('/city/:id', (() => {
    var _ref = _asyncToGenerator(function* (ctx) {
      const id = Number(ctx.params.id);
      let city;
      if (Number.isInteger(id)) {
        city = yield _city2.default.findById(ctx.params.id);
      }
      if (city) {
        ctx.body = city;
      } else {
        ctx.throw(_constants2.default.notFound, 404);
      }
    });

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  })());
  router.get('/city/name/:name', (() => {
    var _ref2 = _asyncToGenerator(function* (ctx) {
      let limit = _constants2.default.listLimit;
      const reqLimit = Number(ctx.request.query.limit);
      if (Number.isInteger(reqLimit) && reqLimit < limit) {
        limit = reqLimit;
      }
      const cityNameLC = ctx.params.name.toLowerCase();
      // hack to check if theres more
      const cities = yield _city2.default.find({
        nameLC: {
          $regex: `^${ cityNameLC }`,
          $options: ''
        }
      }).limit(limit + 1);
      let truncated = false;
      if (cities.length > limit) {
        cities.length = limit;
        truncated = true;
      }
      const count = cities.length;
      ctx.body = {
        truncated,
        count,
        cities
      };
    });

    return function (_x2) {
      return _ref2.apply(this, arguments);
    };
  })());
  router.get('/city/location/:coordinates', (() => {
    var _ref3 = _asyncToGenerator(function* (ctx) {
      const coords = ctx.params.coordinates.split(',').map(Number);
      if (coords.length !== 2) {
        ctx.throw(_constants2.default.malformedQuery, 400);
      }
      ctx.body = yield _city2.default.findOne({
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [coords[0], coords[1]]
            }
          }
        }
      });
    });

    return function (_x3) {
      return _ref3.apply(this, arguments);
    };
  })());
};
//# sourceMappingURL=city.js.map