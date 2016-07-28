const DISMISS_ERROR_MESSAGE = 'DISMISS_ERROR_MESSAGE';

const dismissErrorMessage = () => ({
  type: DISMISS_ERROR_MESSAGE,
});

const reducer = (state = null, action) => {
  if (action.type === DISMISS_ERROR_MESSAGE) {
    return null;
  } else if (action.error) {
    return action.error;
  }
  return state;
};

export default reducer;
export { dismissErrorMessage };
