'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _model = require('../model');

var _constants = require('../constants');

var _constants2 = _interopRequireDefault(_constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const getAllPending = () => _model.WeatherCriteria.find({ fulfilledAt: null });

const getAllFulfilledNotAcknoweledged = () => _model.WeatherCriteria.find({
  fulfilledAt: { $ne: null },
  acknoweledgedAt: null
});

const fulfill = criteria => {
  criteria.fulfilledAt = Date.now();
  return criteria.save();
};

const tryFulfillFromReports = (() => {
  var _ref = _asyncToGenerator(function* (criteria, reports) {
    return yield Promise.all(criteria.filter(function (criterion) {
      const cityReport = reports.find(function (report) {
        return report.city === criterion.city;
      });
      return cityReport && criterion.isFulfilledWithTemperature(cityReport.temperature);
    }).map(fulfill));
  });

  return function tryFulfillFromReports(_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();

const saveCriteria = (() => {
  var _ref2 = _asyncToGenerator(function* (criteria, overwriteExisting) {
    if (criteria.predicate !== 'less' && criteria.predicate !== 'greater') {
      throw new Error('wrong predicate');
    }
    if (!criteria.user) {
      throw new Error('user not found');
    }
    const city = yield _model.City.findById(criteria.cityId);
    if (!city) {
      throw new Error('city not found');
    }
    const existingCriteria = yield _model.WeatherCriteria.findOne({
      user: criteria.user,
      city,
      predicate: criteria.predicate,
      fulfilledAt: null
    });
    if (existingCriteria) {
      if (!overwriteExisting) {
        const err = new Error('criteria already exists');
        err.existingCriteria = existingCriteria;
        throw err;
      } else {
        existingCriteria.temperature = criteria.temperature;
        return yield existingCriteria.save();
      }
    }
    return yield _model.WeatherCriteria.create({
      user: criteria.user,
      city,
      predicate: criteria.predicate,
      temperature: criteria.temperature
    });
  });

  return function saveCriteria(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
})();

const getAllUpdatedAfterForUser = (() => {
  var _ref3 = _asyncToGenerator(function* (user, updatedAfter) {
    return yield _model.WeatherCriteria.find({
      user,
      updatedAt: { $gte: new Date(updatedAfter) }
    }).limit(_constants2.default.listLimit).populate('city');
  });

  return function getAllUpdatedAfterForUser(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
})();

const getAllForUser = (() => {
  var _ref4 = _asyncToGenerator(function* (user) {
    return yield _model.WeatherCriteria.find({ user }).limit(_constants2.default.listLimit).populate('city');
  });

  return function getAllForUser(_x7) {
    return _ref4.apply(this, arguments);
  };
})();

const getAllPendingForUser = (() => {
  var _ref5 = _asyncToGenerator(function* (user) {
    return yield _model.WeatherCriteria.find({ user, fulfilledAt: null }).limit(_constants2.default.listLimit).populate('city');
  });

  return function getAllPendingForUser(_x8) {
    return _ref5.apply(this, arguments);
  };
})();

const getAllFulfilledForUser = (() => {
  var _ref6 = _asyncToGenerator(function* (user) {
    return yield _model.WeatherCriteria.find({ user, fulfilledAt: { $ne: null } }).limit(_constants2.default.listLimit).populate('city');
  });

  return function getAllFulfilledForUser(_x9) {
    return _ref6.apply(this, arguments);
  };
})();

const getAllFulfilledNotAcknoweledgedForUser = (() => {
  var _ref7 = _asyncToGenerator(function* (user) {
    return yield _model.WeatherCriteria.find({
      user,
      fulfilledAt: { $ne: null },
      acknoweledgedAt: null
    }).limit(_constants2.default.listLimit).populate('city');
  });

  return function getAllFulfilledNotAcknoweledgedForUser(_x10) {
    return _ref7.apply(this, arguments);
  };
})();

const acknoweledgeForUser = (() => {
  var _ref8 = _asyncToGenerator(function* (user, criteriaId) {
    const criteria = yield _model.WeatherCriteria.findOne({ user, _id: criteriaId }).populate('city');
    if (!criteria) {
      throw new Error('Not found');
    }
    if (!criteria.fulfilledAt) {
      throw new Error('Not fulfilled yet');
    }
    if (criteria.acknoweledgedAt) {
      return criteria;
    }
    criteria.acknoweledgedAt = new Date();
    return yield criteria.save();
  });

  return function acknoweledgeForUser(_x11, _x12) {
    return _ref8.apply(this, arguments);
  };
})();

const acknoweledgeAllForUser = (() => {
  var _ref9 = _asyncToGenerator(function* (user, criteriaIds) {
    return yield Promise.all(criteriaIds.map(function (id) {
      return acknoweledgeForUser(user, id);
    }));
  });

  return function acknoweledgeAllForUser(_x13, _x14) {
    return _ref9.apply(this, arguments);
  };
})();

const deleteForUser = (() => {
  var _ref10 = _asyncToGenerator(function* (user, criteriaId) {
    const criteria = yield _model.WeatherCriteria.findOne({
      user,
      _id: criteriaId
    });
    if (!criteria) {
      throw new Error('Not found');
    }
    yield criteria.remove();
  });

  return function deleteForUser(_x15, _x16) {
    return _ref10.apply(this, arguments);
  };
})();

exports.default = {
  getAllPending,
  getAllFulfilledNotAcknoweledged,
  tryFulfillFromReports,
  saveCriteria,
  getAllUpdatedAfterForUser,
  getAllForUser,
  getAllFulfilledForUser,
  getAllPendingForUser,
  getAllFulfilledNotAcknoweledgedForUser,
  acknoweledgeForUser,
  acknoweledgeAllForUser,
  deleteForUser
};
//# sourceMappingURL=weather-criteria.js.map