import fetchEndpoint from '../../../util/fetch-endpoint';
import { CALL_API } from '../../call-api-middleware';

import { SEARCH_CITY_BY_NAME, SEARCH_CITY_BY_LOCATION } from '../search-city';
const SAVE_CRITERIA = 'SAVE_CRITERIA';
const CANCEL_SAVE_CRITERIA = 'CANCEL_SAVE_CRITERIA';
const SAVE_CRITERIA_FAILURE = 'SAVE_CRITERIA_FAILURE';
export const SAVE_CRITERIA_SUCCESS = 'SAVE_CRITERIA_SUCCESS';
const SELECT_CITY = 'SELECT_CITY';

const saveCriteria = (overwrite, city, temperature, predicate = 'greater') =>
  (dispatch, getState) => {
    if (getState().createCriteria.fetching) {
      return;
    }
    const endpointProp = overwrite ? 'updateCriteria' : 'createCriteria';
    dispatch({
      overwrite,
      city,
      temperature,
      predicate,
      [CALL_API]: {
        fetchEndpoint: fetchEndpoint[endpointProp]({ cityId: city.id, temperature, predicate }),
        types: [SAVE_CRITERIA, SAVE_CRITERIA_SUCCESS, SAVE_CRITERIA_FAILURE],
      },
    });
  };

const cancelSaveCriteria = () => dispatch => dispatch({ type: CANCEL_SAVE_CRITERIA });

const selectCity = city => dispatch => dispatch({ type: SELECT_CITY, city });

const initialState = {
  fetching: false,
  existingCriteria: null,
  selectedCity: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SAVE_CRITERIA:
      return {
        ...state,
        fetching: true,
        existingCriteria: null,
      };
    case SAVE_CRITERIA_SUCCESS: {
      const { existingCriteria } = action.response;
      if (existingCriteria && !existingCriteria.city.name) {
        existingCriteria.city = action.city;
      }
      return {
        ...state,
        fetching: false,
        existingCriteria,
      };
    }
    case SEARCH_CITY_BY_LOCATION:
    case SEARCH_CITY_BY_NAME:
      return {
        ...state,
        selectedCity: null,
      };
    case SELECT_CITY:
      return {
        ...state,
        selectedCity: action.city,
      };
    case SAVE_CRITERIA_FAILURE:
    case CANCEL_SAVE_CRITERIA:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
export { saveCriteria, cancelSaveCriteria, selectCity };
