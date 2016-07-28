import fetchEndpoint from '../../util/fetch-endpoint';
import { CALL_API } from '../call-api-middleware';

const GET_REPORTS = 'GET_REPORTS';
const GET_REPORTS_SUCCESS = 'GET_REPORTS_SUCCESS';
const GET_REPORTS_FAILURE = 'GET_REPORTS_FAILURE';

const getReports = () => (dispatch, getState) => {
  // const cities = getState().criteria.pending.map(criteria => criteria.city.id);
  const cities = getState().criteria.list.map(criteria => criteria.city.id);
  if (cities.length === 0) {
    return;
  }
  dispatch({
    [CALL_API]: {
      fetchEndpoint: fetchEndpoint.getLatestReports(cities),
      types: [
        GET_REPORTS,
        GET_REPORTS_SUCCESS,
        GET_REPORTS_FAILURE,
      ],
    },
  });
};

const initialState = {
  reports: [],
  fetching: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_REPORTS:
      return {
        ...state,
        fetching: true,
      };
    case GET_REPORTS_FAILURE:
      return {
        ...state,
        fetching: false,
      };
    case GET_REPORTS_SUCCESS:
      return {
        reports: action.response,
        fetching: false,
      };
    default: return state;
  }
};

export default reducer;
export { getReports };
