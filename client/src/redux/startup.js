import { acquireToken } from './module/auth';
import { getRecentlyUpdated, getNotifications, getPendingCriteria,
  minTimeoutBetweenRequests } from './module/criteria';
import { getReports } from './module/report';

const pollInterval = minTimeoutBetweenRequests + 100;

const poll = async dispatch => {
  await dispatch(getRecentlyUpdated());
  dispatch(getReports());
};

const startup = async store => {
  await store.dispatch(acquireToken());
  store.dispatch(getNotifications());
  store.dispatch(getPendingCriteria());
  setInterval(poll.bind(null, store.dispatch), pollInterval);
};

export default startup;
