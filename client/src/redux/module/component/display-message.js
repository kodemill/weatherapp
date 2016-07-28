const DISPLAY_MESSAGE = 'DISPLAY_MESSAGE';
const CLEAR_MESSAGE = 'CLEAR_MESSAGE';

const displayMessage = message => dispatch => dispatch({
  type: DISPLAY_MESSAGE,
  message,
});

const clearMessage = () => dispatch => dispatch({
  type: CLEAR_MESSAGE,
});

const initialState = { open: false, message: null };

const reducer = (state = initialState, action) => {
  if (action.type === DISPLAY_MESSAGE) {
    return { message: action.message, open: true };
  } else if (action.type === CLEAR_MESSAGE) {
    return initialState;
  }
  return state;
};

export default reducer;
export { displayMessage, clearMessage };
