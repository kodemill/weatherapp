import getFetchEndpoint from '../../util/fetch-endpoint';
import { CALL_API } from '../call-api-middleware';
import _ from 'lodash';
import { SAVE_CRITERIA_SUCCESS } from './component/create-criteria';

const GET_CRITERIA = 'GET_CRITERIA';
const GET_CRITERIA_FAILURE = 'GET_CRITERIA_FAILURE';
const GET_CRITERIA_SUCCESS = 'GET_CRITERIA_SUCCESS';

const DELETE_CRITERIA = 'DELETE_CRITERIA';
const DELETE_CRITERIA_SUCCESS = 'DELETE_CRITERIA_SUCCESS';
const DELETE_CRITERIA_FAILURE = 'DELETE_CRITERIA_FAILURE';

const ACKNOWELEDGE_NOTIFICATION = 'ACKNOWELEDGE_NOTIFICATION';
const ACKNOWELEDGE_NOTIFICATION_SUCCESS = 'ACKNOWELEDGE_NOTIFICATION_SUCCESS';
const ACKNOWELEDGE_NOTIFICATION_FAILURE = 'ACKNOWELEDGE_NOTIFICATION_FAILURE';

const FILTER_UPDATED_RECENTLY = 'FILTER_UPDATED_RECENTLY';
const FILTER_FULFILLED = 'FILTER_FULFILLED';
const FILTER_PENDING = 'FILTER_PENDING';
const FILTER_NOTIFICATIONS = 'FILTER_NOTIFICATIONS';

export const minTimeoutBetweenRequests = 1000 * 60 * 0.1;

const getCriteria = filter => (dispatch, getState) => {
  const { successfulFetchAt, gotAllPending, gotAllFulfilled } = getState().criteria;
  let fetchEndpoint = getFetchEndpoint.getCriteriaUpdatedAfter(successfulFetchAt);
  let actualFilter = FILTER_UPDATED_RECENTLY;
  if (filter === FILTER_PENDING && !gotAllPending) {
    fetchEndpoint = getFetchEndpoint.getCriteriaPending();
    actualFilter = FILTER_PENDING;
  } else if (filter === FILTER_FULFILLED && !gotAllFulfilled) {
    fetchEndpoint = getFetchEndpoint.getCriteriaFulfilled();
    actualFilter = FILTER_FULFILLED;
  } else if (filter === FILTER_NOTIFICATIONS) {
    fetchEndpoint = getFetchEndpoint.getCriteriaFulfilledNotAcknoweledged();
    actualFilter = FILTER_NOTIFICATIONS;
  }
  const now = new Date();
  if (successfulFetchAt && actualFilter === FILTER_UPDATED_RECENTLY &&
    now.getTime() - successfulFetchAt.getTime() < minTimeoutBetweenRequests) {
    return;
  }
  dispatch({
    filter: actualFilter,
    fetchedAt: now,
    [CALL_API]: {
      fetchEndpoint,
      types: [GET_CRITERIA, GET_CRITERIA_SUCCESS, GET_CRITERIA_FAILURE],
    },
  });
};

const getNotifications = getCriteria.bind(null, FILTER_NOTIFICATIONS);
const getFulfilledCriteria = getCriteria.bind(null, FILTER_FULFILLED);
const getPendingCriteria = getCriteria.bind(null, FILTER_PENDING);
const getRecentlyUpdated = getCriteria.bind(null, FILTER_UPDATED_RECENTLY);

const deleteCriteria = criteria => dispatch => dispatch({
  criteria,
  [CALL_API]: {
    types: [DELETE_CRITERIA, DELETE_CRITERIA_SUCCESS, DELETE_CRITERIA_FAILURE],
    fetchEndpoint: getFetchEndpoint.deleteCriteria(criteria.id),
  },
});

const acknoweledgeNotification = criteria => dispatch => {
  const criteriaArr = Array.isArray(criteria) ? criteria : [criteria];
  dispatch({
    criteria: criteriaArr,
    [CALL_API]: {
      fetchEndpoint: getFetchEndpoint.acknoweledgeNotifications(
        criteriaArr.map(criterion => criterion.id)),
      types: [
        ACKNOWELEDGE_NOTIFICATION,
        ACKNOWELEDGE_NOTIFICATION_SUCCESS,
        ACKNOWELEDGE_NOTIFICATION_FAILURE,
      ],
    },
  });
};

const initialState = {
  successfulFetchAt: null,
  fetching: false,
  list: [],
  gotAllPending: false,
  gotAllFulfilled: false,
  notifications: [],
};

const notificationFilter = criteriaList =>
  criteriaList.filter(criteria => criteria.fulfilledAt && !criteria.acknoweledgedAt);

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CRITERIA_SUCCESS: {
      const list = _.unionBy(action.response, state.list, 'id');
      return {
        ...state,
        list,
        notifications: notificationFilter(list),
        gotAllPending: state.gotAllPending || action.filter === FILTER_PENDING,
        gotAllFulfilled: state.gotAllFulfilled || action.filter === FILTER_FULFILLED,
        successfulFetchAt: action.fetchedAt,
        fetching: false,
      };
    }
    case ACKNOWELEDGE_NOTIFICATION_FAILURE:
    case DELETE_CRITERIA_FAILURE:
    case GET_CRITERIA_FAILURE:
      return {
        ...state,
        fetching: false,
      };
    case ACKNOWELEDGE_NOTIFICATION:
    case DELETE_CRITERIA:
    case GET_CRITERIA:
      return {
        ...state,
        fetching: true,
      };
    case DELETE_CRITERIA_SUCCESS: {
      const list = _.without(state.list, action.criteria);
      return {
        ...state,
        list,
        notifications: notificationFilter(list),
        fetching: false,
      };
    }
    case ACKNOWELEDGE_NOTIFICATION_SUCCESS: {
      const list = _.unionBy(action.response, state.list, 'id');
      return {
        ...state,
        list,
        notifications: notificationFilter(list),
        fetching: false,
      };
    }
    case SAVE_CRITERIA_SUCCESS:
      return {
        ...state,
        list: action.response.existingCriteria ? state.list : [...state.list, action.response],
      };
    default:
      return state;
  }
};

export default reducer;
export {
  getPendingCriteria,
  getFulfilledCriteria,
  getNotifications,
  getRecentlyUpdated,
  deleteCriteria,
  acknoweledgeNotification,
};
