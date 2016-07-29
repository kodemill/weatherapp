import { acquireToken } from './module/auth';
import { getRecentlyUpdated, getNotifications, getPendingCriteria } from './module/criteria';
import { getReports } from './module/report';

const pollInterval = 2 * 60 * 1000;

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
