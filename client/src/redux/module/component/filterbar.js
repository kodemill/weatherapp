import { getPendingCriteria, getFulfilledCriteria } from '../criteria';

export const FILTER_PENDING = 'FILTER_PENDING';
export const FILTER_FULFILLED = 'FILTER_FULFILLED';
export const FILTER_ALL = 'FILTER_ALL';
export const SORT_BY_CITY = 'SORT_BY_CITY';
export const SORT_BY_TEMPERATURE = 'SORT_BY_TEMPERATURE';
export const SORT_BY_CREATED = 'SORT_BY_CREATED';
export const SORT_ASCENDING = 'SORT_ASCENDING';
export const SORT_DESCENDING = 'SORT_DESCENDING';

const SET_SORT_TYPE = 'SET_SORT_TYPE';
const SET_SORT_ORDER = 'SET_SORT_ORDER';
const SET_FILTER = 'SET_FILTER';

const setFilter = filterType => dispatch => {
  dispatch({ type: SET_FILTER, filterType });
  if (filterType === FILTER_PENDING) {
    dispatch(getPendingCriteria());
  } else {
    setTimeout(dispatch(getFulfilledCriteria()));
  }
};

const setSortType = sortType => dispatch => dispatch({ type: SET_SORT_TYPE, sortType });

const setSortOrder = sortOrder => dispatch => dispatch({ type: SET_SORT_ORDER, sortOrder });

const initialState = {
  filter: FILTER_PENDING,
  sortType: SORT_BY_CREATED,
  sortOrder: SORT_DESCENDING,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_FILTER:
      return {
        ...state,
        filter: action.filterType,
      };
    case SET_SORT_ORDER:
      return {
        ...state,
        sortOrder: action.sortOrder,
      };
    case SET_SORT_TYPE:
      return {
        ...state,
        sortType: action.sortType,
      };
    default:
      return state;
  }
};

export { setFilter, setSortOrder, setSortType };
