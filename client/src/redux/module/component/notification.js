import { isAvailable, requestPermission, displayNotification } from '../../../util/notification';

const OPEN_NOTIFICATIONS_POPUP = 'OPEN_NOTIFICATIONS_POPUP';
const CLOSE_NOTIFICATIONS_POPUP = 'CLOSE_NOTIFICATIONS_POPUP';
// const DISPLAY_NATIVE_NOTIFICATION = 'DISPLAY_NATIVE_NOTIFICATION';
const REQUEST_NATIVE_NOTIFICATION_PERMISSION = 'REQUEST_NATIVE_NOTIFICATION_PERMISSION';
const REQUEST_NATIVE_NOTIFICATION_PERMISSION_SUCCESS =
  'REQUEST_NATIVE_NOTIFICATION_PERMISSION_SUCCESS';

const openNotificationPopup = () => dispatch => dispatch({
  type: OPEN_NOTIFICATIONS_POPUP,
});

const closeNotificationPopup = () => dispatch => dispatch({
  type: CLOSE_NOTIFICATIONS_POPUP,
});

const requestNativeNotificationPermission = () => async dispatch => {
  if (!isAvailable()) {
    return dispatch({ type: REQUEST_NATIVE_NOTIFICATION_PERMISSION_SUCCESS, permission: 'denied' });
  }
  dispatch({ type: REQUEST_NATIVE_NOTIFICATION_PERMISSION });
  const permission = await requestPermission();
  return dispatch({ type: REQUEST_NATIVE_NOTIFICATION_PERMISSION_SUCCESS, permission });
};

const displayNativeNotification = text => async (dispatch, getState) => {
  if (!getState().notification.nativePermission) {
    await dispatch(requestNativeNotificationPermission());
  }
  if (getState().notification.nativePermission === 'granted') {
    displayNotification(text);
  }
};

const initialState = {
  fetching: false,
  popupOpen: false,
  nativePermission: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case OPEN_NOTIFICATIONS_POPUP:
      return {
        ...state,
        popupOpen: true,
      };
    case CLOSE_NOTIFICATIONS_POPUP:
      return {
        ...state,
        popupOpen: false,
      };
    case REQUEST_NATIVE_NOTIFICATION_PERMISSION:
      return {
        ...state,
        fetching: true,
      };
    case REQUEST_NATIVE_NOTIFICATION_PERMISSION_SUCCESS:
      return {
        ...state,
        fetching: false,
        nativePermission: action.permission,
      };
    default:
      return state;
  }
};

export default reducer;
export {
  openNotificationPopup,
  closeNotificationPopup,
  requestNativeNotificationPermission,
  displayNativeNotification,
};
