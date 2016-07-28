import { WeatherCriteria, City } from '../model';
import constants from '../constants';

const getAllPending = () => WeatherCriteria
  .find({ fulfilledAt: null });

const getAllFulfilledNotAcknoweledged = () =>
  WeatherCriteria.find({
    fulfilledAt: { $ne: null },
    acknoweledgedAt: null,
  });

const fulfill = criteria => {
  criteria.fulfilledAt = Date.now();
  return criteria.save();
};

const tryFulfillFromReports = async (criteria, reports) =>
  await Promise.all(
    criteria.filter(criterion => {
      const cityReport = reports.find(report => report.city === criterion.city);
      return cityReport && criterion.isFulfilledWithTemperature(cityReport.temperature);
    })
    .map(fulfill)
  );

const saveCriteria = async (criteria, overwriteExisting) => {
  if (criteria.predicate !== 'less' && criteria.predicate !== 'greater') {
    throw new Error('wrong predicate');
  }
  if (!criteria.user) {
    throw new Error('user not found');
  }
  const city = await City.findById(criteria.cityId);
  if (!city) {
    throw new Error('city not found');
  }
  const existingCriteria = await WeatherCriteria.findOne({
    user: criteria.user,
    city,
    predicate: criteria.predicate,
    fulfilledAt: null,
  });
  if (existingCriteria) {
    if (!overwriteExisting) {
      const err = new Error('criteria already exists');
      err.existingCriteria = existingCriteria;
      throw err;
    } else {
      existingCriteria.temperature = criteria.temperature;
      return await existingCriteria.save();
    }
  }
  return await WeatherCriteria.create({
    user: criteria.user,
    city,
    predicate: criteria.predicate,
    temperature: criteria.temperature,
  });
};

const getAllUpdatedAfterForUser = async (user, updatedAfter) =>
  await WeatherCriteria.find({
    user,
    updatedAt: { $gte: new Date(updatedAfter) },
  }).limit(constants.listLimit)
  .populate('city');

const getAllForUser = async user =>
  await WeatherCriteria.find({ user }).limit(constants.listLimit).populate('city');

const getAllPendingForUser = async user =>
  await WeatherCriteria.find({ user, fulfilledAt: null })
    .limit(constants.listLimit)
    .populate('city');

const getAllFulfilledForUser = async user =>
  await WeatherCriteria.find({ user, fulfilledAt: { $ne: null } })
  .limit(constants.listLimit)
  .populate('city');

const getAllFulfilledNotAcknoweledgedForUser = async user =>
  await WeatherCriteria.find({
    user,
    fulfilledAt: { $ne: null },
    acknoweledgedAt: null,
  }).limit(constants.listLimit)
  .populate('city');

const acknoweledgeForUser = async (user, criteriaId) => {
  const criteria = await WeatherCriteria.findOne({ user, _id: criteriaId }).populate('city');
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
  return await criteria.save();
};

const acknoweledgeAllForUser = async (user, criteriaIds) =>
  await Promise.all(criteriaIds.map(id => acknoweledgeForUser(user, id)));

const deleteForUser = async (user, criteriaId) => {
  const criteria = await WeatherCriteria.findOne({
    user,
    _id: criteriaId,
  });
  if (!criteria) {
    throw new Error('Not found');
  }
  await criteria.remove();
};

export default {
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
  deleteForUser,
};
