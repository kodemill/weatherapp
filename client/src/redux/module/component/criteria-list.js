import _ from 'lodash';

const OPEN_INFO = 'OPEN_INFO';
const CLOSE_INFO = 'CLOSE_INFO';

const openInfo = criteria => dispatch => dispatch({ type: OPEN_INFO, criteria });
const closeInfo = criteria => dispatch => dispatch({ type: CLOSE_INFO, criteria });

const initialState = {
  open: [],
};


export default (state = initialState, action) => {
  const { type, criteria } = action;
  if (type === OPEN_INFO) {
    return {
      open: _.union(state.open, [criteria.id]),
    };
  } else if (type === CLOSE_INFO) {
    return {
      open: _.without(state.open, criteria.id),
    };
  }
  return state;
};

export { openInfo, closeInfo };
