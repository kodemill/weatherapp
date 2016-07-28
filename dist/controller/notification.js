'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _model = require('../model');

var _sendEmail = require('../lib/send-email');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const notificateUsers = (() => {
  var _ref = _asyncToGenerator(function* (fulfilledCriteria, reports) {
    if (!fulfilledCriteria || fulfilledCriteria.length === 0) {
      return;
    }
    const criteria = yield _model.WeatherCriteria.populate(fulfilledCriteria, 'city user');
    const criteriaReportPairs = criteria.filter(function (criterion) {
      return criterion.user.getNotificationEmails();
    }).map(function (criterion) {
      return [criterion, reports.find(function (report) {
        return criterion.city.id === report.city.toString();
      })];
    });
    // console.log(criteriaReportPairs);
    const sentMailInfos = yield Promise.all(criteriaReportPairs.map(function (pair) {
      return (0, _sendEmail.sendNotificationEmail)(pair[0], pair[1]);
    }));

    console.log(sentMailInfos);
  });

  return function notificateUsers(_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();

exports.default = { notificateUsers };
//# sourceMappingURL=notification.js.map