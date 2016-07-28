import fetchEndpoint from '../../util/fetch-endpoint';
import { CALL_API } from '../call-api-middleware';
import { isAvailable, getLocationLonLat } from '../../util/geolocation';

export const SEARCH_CITY_BY_NAME = 'SEARCH_CITY_BY_NAME';
const SEARCH_CITY_BY_NAME_SUCCESS = 'SEARCH_CITY_BY_NAME_SUCCESS';
export const SEARCH_CITY_BY_LOCATION = 'SEARCH_CITY_BY_LOCATION';
const SEARCH_CITY_BY_LOCATION_SUCCESS = 'SEARCH_CITY_BY_LOCATION_SUCCESS';
const SEARCH_CITY_FAILURE = 'SEARCH_CITY_FAILURE';
const GET_GEOLOCATION = 'GET_GEOLOCATION';
const GET_GEOLOCATION_FAILURE = 'GET_GEOLOCATION_FAILURE';
const GET_GEOLOCATION_SUCCESS = 'GET_GEOLOCATION_SUCCESS';

const searchCityByName = (searchText, limit) => dispatch => {
  if (searchText.length === 0) {
    dispatch({
      type: SEARCH_CITY_BY_NAME_SUCCESS,
      searchText,
      response: {
        cities: [],
        truncated: false,
      },
    });
  } else {
    let param = searchText;
    if (limit > 0) {
      param += `?limit=${limit}`;
    }
    dispatch({
      searchText,
      [CALL_API]: {
        fetchEndpoint: fetchEndpoint.getCitiesByName(param),
        types: [SEARCH_CITY_BY_NAME, SEARCH_CITY_BY_NAME_SUCCESS, SEARCH_CITY_FAILURE],
      },
    });
  }
};

const searchCityByLocation = lonLat => dispatch => dispatch({
  lonLat,
  [CALL_API]: {
    fetchEndpoint: fetchEndpoint.getCityByLocation(lonLat),
    types: [SEARCH_CITY_BY_LOCATION, SEARCH_CITY_BY_LOCATION_SUCCESS, SEARCH_CITY_FAILURE],
  },
});

const searchCityByGeolocation = () => async (dispatch, getState) => {
  if (!isAvailable()) {
    return dispatch({ type: GET_GEOLOCATION_FAILURE, error: 'Not available on your browser' });
  }
  let lonLat = getState().searchCity.byLocation.geolocationLonLat;
  if (lonLat) {
    dispatch({ type: GET_GEOLOCATION_SUCCESS, lonLat });
  } else {
    dispatch({ type: GET_GEOLOCATION });
    try {
      lonLat = await getLocationLonLat();
      dispatch({ type: GET_GEOLOCATION_SUCCESS, lonLat });
    } catch (error) {
      return dispatch({ type: GET_GEOLOCATION_FAILURE, error: 'Could not acquire your location' });
    }
  }
  return dispatch(searchCityByLocation(lonLat));
};

const initialState = {
  fetching: false,
  byName: {
    searchText: '',
    cities: [],
    truncated: false,
  },
  byLocation: {
    geolocationLonLat: null,
    city: null,
    lonLat: null,
  },
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SEARCH_CITY_BY_LOCATION:
      return {
        ...state,
        fetching: true,
      };
    case SEARCH_CITY_BY_NAME:
      return {
        ...state,
        byName: initialState.byName,
        fetching: true,
      };
    case SEARCH_CITY_BY_NAME_SUCCESS: {
      const { truncated, cities } = action.response;
      return {
        ...state,
        byName: {
          searchText: action.searchText,
          cities,
          truncated,
        },
        fetching: false,
      };
    }
    case SEARCH_CITY_BY_LOCATION_SUCCESS:
      return {
        ...state,
        byLocation: {
          ...state.byLocation,
          city: action.response,
          lonLat: action.lonLat,
        },
        fetching: false,
      };
    case GET_GEOLOCATION_SUCCESS:
      return {
        ...state,
        byLocation: {
          ...state.byLocation,
          geolocationLonLat: action.lonLat,
        },
        fetching: false,
      };
    case SEARCH_CITY_FAILURE:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
export { searchCityByName, searchCityByLocation, searchCityByGeolocation };
