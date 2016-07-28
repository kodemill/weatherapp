const SHOW_DIALOG = 'SHOW_DIALOG';
const CLOSE_DIALOG = 'CLOSE_DIALOG';

const showDialog = options => dispatch => dispatch({ type: SHOW_DIALOG, options });

const closeDialog = () => dispatch => dispatch({ type: CLOSE_DIALOG });

const initialState = {
  modal: false,
  okHandler: null,
  cancelHandler: null,
  message: '',
  title: null,
  okText: 'ok',
  cancelText: 'cancel',
  open: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_DIALOG:
      if (state.open) {
        return state;
      }
      return {
        ...state,
        ...action.options,
        open: true,
      };
    case CLOSE_DIALOG: {
      return initialState;
    }
    default:
      return state;
  }
};

export default reducer;
export { showDialog, closeDialog };
