import _ from 'lodash';
import { RECIEVE_USER } from '../auth';

// http://emailregex.com/
const emailRegex = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i; //eslint-disable-line

const EDIT_EMAIL = 'EDIT_EMAIL';
const EDIT_EMAIL_START = 'EDIT_EMAIL_START';
const EDIT_EMAIL_FINISH = 'EDIT_EMAIL_FINISH';
const EDIT_EMAIL_CANCEL = 'EDIT_EMAIL_CANCEL';
const ADD_EMAIL = 'ADD_EMAIL';
const SEND_NOTIFICATION_CHANGE = 'SEND_NOTIFICATION_CHANGE';
const NATIVE_NOTIFICATION_CHANGE = 'NATIVE_NOTIFICATION_CHANGE';
const POPUP_NOTIFICATION_CHANGE = 'POPUP_NOTIFICATION_CHANGE';
const DISCARD_CHANGES = 'DISCARD_CHANGES';
const REMOVE_EMAIL = 'REMOVE_EMAIL';

const discardChanges = () => dispatch => dispatch({ type: DISCARD_CHANGES });
const sendNotificationChange = (value, email) => dispatch =>
  dispatch({ type: SEND_NOTIFICATION_CHANGE, value, email });
const nativeNotificationChange = value => dispatch =>
  dispatch({ type: NATIVE_NOTIFICATION_CHANGE, value });
const popupNotificationChange = value => dispatch =>
  dispatch({ type: POPUP_NOTIFICATION_CHANGE, value });
const editEmailStart = email => dispatch => dispatch({ type: EDIT_EMAIL_START, email });
const editEmail = email => dispatch => dispatch({ type: EDIT_EMAIL, email });
const addEmail = () => dispatch => dispatch({ type: ADD_EMAIL });
const editEmailFinish = () => dispatch => dispatch({ type: EDIT_EMAIL_FINISH });
const editEmailCancel = () => dispatch => dispatch({ type: EDIT_EMAIL_CANCEL });
const removeEmail = email => dispatch => dispatch({ type: REMOVE_EMAIL, email });

const validateEmail = (address, state) => {
  let validEmail = true;
  let errorText = null;
  if (emailRegex.test(address)) {
    if (_.without(state.emails, state.emails[state.editingEmailIndex])
      .find(email => email.address === address)) {
      validEmail = false;
      errorText = 'email already exists';
    }
  } else {
    validEmail = false;
    errorText = 'Invalid email format';
  }
  return { validEmail, errorText };
};

const normalizeEmail = email => {
  const { address = '', sendNotification = false, trusted = false } = email;
  return { address, sendNotification, trusted };
};

const normalizeOptions = options => {
  const { notificateViaNative = false, notificateViaEmail = false } = options;
  return { notificateViaEmail, notificateViaNative };
};

const normalizeOriginalObject = original => {
  let { emails = [], name = '', options = {} } = original; //eslint-disable-line
  emails = emails.map(normalizeEmail);
  options = normalizeOptions(options);
  return { emails, options, name };
};

const hasChanged = (originalState, changedState) => {
  let changed = false;
  if (changedState.emails) {
    changed = !_.isEqual(originalState.emails, changedState.emails);
  }
  if (!changed && changedState.options) {
    changed = !_.isEqual(originalState.options, changedState.options);
  }
  if (!changed && changedState.name) {
    changed = originalState.original !== changedState.name;
  }
  return changed;
};

const initialState = {
  emails: [],
  name: '',
  options: {},

  original: normalizeOriginalObject({}),
  changed: false,

  beforeEditText: null,
  editingText: null,
  validEmail: true,
  errorText: null,
  editingEmailIndex: -1,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case NATIVE_NOTIFICATION_CHANGE: {
      const options = { ...state.options, notificateViaNative: action.value };
      return {
        ...state,
        options,
        changed: hasChanged(state.original, { options }),
      };
    }
    case POPUP_NOTIFICATION_CHANGE: {
      const options = { ...state.options, notificateViaPopup: action.value };
      return {
        ...state,
        options,
        changed: hasChanged(state.original, { options }),
      };
    }
    case REMOVE_EMAIL: {
      const emails = _.without(state.emails,
        state.emails.find(email => email.address === action.email));
      return {
        ...state,
        emails,
        changed: hasChanged(state.original, { emails }),
      };
    }
    case ADD_EMAIL:
      return {
        ...state,
        emails: [...state.emails, { address: '' }],
        editingEmailIndex: state.emails.length,
        validEmail: false,
      };
    case EDIT_EMAIL: {
      const { errorText, validEmail } = validateEmail(action.email, state);
      return {
        ...state,
        validEmail,
        errorText,
        editingText: action.email,
      };
    }
    case EDIT_EMAIL_START:
      return {
        ...state,
        editingEmailIndex: state.emails.findIndex(email => email.address === action.email),
        beforeEditText: action.email,
        editingText: action.email,
      };
    case EDIT_EMAIL_FINISH:
    case EDIT_EMAIL_CANCEL: {
      const beforeItems = state.emails.slice(0, state.editingEmailIndex);
      const afterItems = state.emails.slice(state.editingEmailIndex + 1);
      const changedMail = state.emails[state.editingEmailIndex];
      let emails;
      if (action.type === EDIT_EMAIL_FINISH) {
        emails = [...beforeItems, { ...changedMail, address: state.editingText }, ...afterItems];
      } else if (action.type === EDIT_EMAIL_CANCEL
          && state.beforeEditText && state.beforeEditText.length > 0) {
        emails = [...beforeItems, { ...changedMail, address: state.beforeEditText }, ...afterItems];
      } else { // new email cancel
        emails = [...beforeItems, ...afterItems];
      }
      return {
        ...state,
        emails,
        validEmail: true,
        editingText: null,
        beforeEditText: null,
        errorText: null,
        editingEmailIndex: -1,
        changed: hasChanged(state.original, { emails }),
      };
    }
    case SEND_NOTIFICATION_CHANGE: {
      let emails = state.emails;
      let options = state.options;
      if (action.email) {
        const index = state.emails.findIndex(email => email.address === action.email);
        if (index >= 0) {
          emails = [
            ...emails.slice(0, index),
            { ...state.emails[index], sendNotification: action.value },
            ...emails.slice(index + 1),
          ];
        }
      } else {
        options = { ...state.options, notificateViaEmail: action.value };
      }
      return {
        ...state,
        emails,
        options,
        changed: hasChanged(state.original, { emails, options }),
      };
    }
    case RECIEVE_USER: {
      const original = normalizeOriginalObject(action.response);
      return {
        ...state,
        ...original,
        original,
        changed: false,
      };
    }
    case DISCARD_CHANGES:
      return {
        ...state,
        ...state.original,
        changed: false,
      };
    default:
      return state;
  }
};

export { addEmail, editEmail, editEmailFinish, editEmailCancel, editEmailStart,
  sendNotificationChange, discardChanges, removeEmail,
  nativeNotificationChange, popupNotificationChange };
