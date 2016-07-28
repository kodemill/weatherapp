'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _model = require('../model');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

// import fetchWeather from '../lib/fetch-weather';

exports.default = router => {
  // router.get('/weather/fetch/city/:cityId', async ctx => {
  //   try {
  //     const weather = await fetchWeather(ctx.params.cityId);
  //     ctx.body = weather;
  //   } catch (err) {
  //     ctx.throw(constants.thirdParty);
  //   }
  // });
  // router.get('/weather/fetch/cities/:cityIds', async ctx => {
  //   try {
  //     const weather = await fetchWeather(ctx.params.cityIds);
  //     ctx.body = weather;
  //   } catch (err) {
  //     ctx.throw(constants.thirdParty);
  //   }
  // });
  router.get('/weather/city/:cityId', (() => {
    var _ref = _asyncToGenerator(function* (ctx) {
      ctx.body = (yield _model.LatestWeatherReport.findOne({ city: ctx.params.cityId }).populate('weatherReport')).weatherReport;
    });

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  })());
  router.get('/weather/cities/:cityIds', (() => {
    var _ref2 = _asyncToGenerator(function* (ctx) {
      ctx.body = (yield _model.LatestWeatherReport.find({ city: { $in: ctx.params.cityIds.split(',') } }).populate('weatherReport')).map(function (latestWeatherReport) {
        return latestWeatherReport.weatherReport;
      });
    });

    return function (_x2) {
      return _ref2.apply(this, arguments);
    };
  })());
};
//# sourceMappingURL=weather.js.map