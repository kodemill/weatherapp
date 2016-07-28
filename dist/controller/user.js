'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unsubscribeEmailForUserViaMail = exports.verifyEmailForUserViaMail = exports.saveUserForUser = exports.mergeAccounts = undefined;

var _model = require('../model');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _sendEmail = require('../lib/send-email');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const mergeAccounts = (() => {
  var _ref = _asyncToGenerator(function* (into, from) {
    // merge criteria
    const criteria = yield _model.WeatherCriteria.find({ user: from });
    yield Promise.all(criteria.map(function (criterion) {
      criterion.user = into;
      return criterion.save();
    }));
    // merge emails
    if (from.emails) {
      from.emails.forEach(function (email) {
        return into.addEmail(email);
      });
    }
    // merge options
    if (into.options && from.options) {
      into.mergeOptions(from.options);
    }
    return yield from.remove();
  });

  return function mergeAccounts(_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();

// trust everything except 'trustedness' of emails
const saveUserForUser = (() => {
  var _ref2 = _asyncToGenerator(function* (user, changes) {
    // emails, options, name
    if (changes.emails) {
      const toRemove = _lodash2.default.differenceBy(user.emails, changes.emails, 'address');
      const toAdd = _lodash2.default.differenceBy(changes.emails, user.emails, 'address');
      const notificationChange = _lodash2.default.differenceBy(changes.emails, toAdd, 'address');
      // remove
      toRemove.forEach(function (email) {
        return email.remove();
      });
      // add new
      toAdd.forEach(function (email) {
        return user.addEmail(email);
      });
      yield Promise.all(toAdd.map(function (email) {
        return (0, _sendEmail.sendVerificationEmail)(user, email);
      }));
      // notification changes
      notificationChange.forEach(function (email) {
        user.findEmail(email).sendNotification = email.sendNotification;
      });
    }
    if (changes.name) {
      user.name = changes.name;
    }
    if (changes.options) {
      user.options = changes.options;
    }
    return yield user.save();
  });

  return function saveUserForUser(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
})();

const verifyEmailForUserViaMail = (() => {
  var _ref3 = _asyncToGenerator(function* (user, address) {
    const foundEmail = user.emails.find(function (email) {
      return email.address === address;
    });
    if (foundEmail) {
      foundEmail.trusted = true;
      yield user.save();
    }
  });

  return function verifyEmailForUserViaMail(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
})();

const unsubscribeEmailForUserViaMail = (() => {
  var _ref4 = _asyncToGenerator(function* (user, address) {
    const foundEmail = user.emails.find(function (email) {
      return email.address === address;
    });
    if (foundEmail) {
      foundEmail.sendNotification = false;
      yield user.save();
    }
  });

  return function unsubscribeEmailForUserViaMail(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
})();

exports.mergeAccounts = mergeAccounts;
exports.saveUserForUser = saveUserForUser;
exports.verifyEmailForUserViaMail = verifyEmailForUserViaMail;
exports.unsubscribeEmailForUserViaMail = unsubscribeEmailForUserViaMail;
//# sourceMappingURL=user.js.map