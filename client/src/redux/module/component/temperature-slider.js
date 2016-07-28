const TEMPERATURE_SLIDER_SET_VALUE = 'TEMPERATURE_SLIDER_SET_VALUE';

const setValue = value => dispatch => dispatch({ type: TEMPERATURE_SLIDER_SET_VALUE, value });

const reducer = (state = 18, action) => {
  if (action.type === TEMPERATURE_SLIDER_SET_VALUE) {
    return action.value;
  }
  return state;
};

export default reducer;
export { setValue };
