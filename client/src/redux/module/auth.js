import fetchEndpoint from '../../util/fetch-endpoint';
import { getToken, setToken } from '../../util/token-provider';
import { CALL_API } from '../call-api-middleware';
import _ from 'lodash';

const ACQUIRE_TOKEN = 'ACQUIRE_TOKEN';
const ACQUIRE_TOKEN_SUCCESS = 'ACQUIRE_TOKEN_SUCCESS';
const ACQUIRE_TOKEN_FAILURE = 'ACQUIRE_TOKEN_FAILURE';
export const RECIEVE_USER = 'RECIEVE_USER';
const SAVE_USER = 'SAVE_USER';
const SAVE_USER_FAILURE = 'SAVE_USER_FAILURE';
// export const SAVE_USER_SUCCESS = 'SAVE_USER_SUCCESS';

const registerUser = async () => {
  const rawResponse = await fetchEndpoint.register()();
  const response = await rawResponse.json();
  setToken(response.token);
  return response.token;
};

const acquireToken = () => async dispatch => {
  // we cant use call-api-middleware here, coz that would make
  // reducer impure while storing the token later
  try {
    dispatch({ type: ACQUIRE_TOKEN });
    let token = getToken();
    if (token) {
      const rawResponse = await fetchEndpoint.whoAmI()();
      if (rawResponse.status === 401) {
        // unauthorized == bad token, np reg again
        token = await registerUser();
      } else if (rawResponse.ok) {
        const response = await rawResponse.json();
        dispatch({ type: RECIEVE_USER, response });
      } else throw Error();
    } else {
      token = await registerUser();
    }
    dispatch({ type: ACQUIRE_TOKEN_SUCCESS, token });
  } catch (error) {
    dispatch({
      type: ACQUIRE_TOKEN_FAILURE,
      error: 'unknown error happened :(' });
  }
};

const sentPropKeys = ['name', 'emails', 'options'];
const saveUser = () => (dispatch, getState) => {
  dispatch({
    [CALL_API]: {
      fetchEndpoint: fetchEndpoint.saveUser(null,
        JSON.stringify(_.pick(getState().settings, sentPropKeys))),
      types: [SAVE_USER, RECIEVE_USER, SAVE_USER_FAILURE],
    },
  });
};

const authInitialState = {
  fetching: false,
  facebookId: null,
  githubId: null,
  name: null,
  token: null,
};

const reducer = (state = authInitialState, action) => {
  switch (action.type) {
    case SAVE_USER:
    case ACQUIRE_TOKEN:
      return {
        ...state,
        fetching: true,
      };
    case SAVE_USER_FAILURE:
    case ACQUIRE_TOKEN_FAILURE:
      return {
        ...state,
        fetching: false,
      };
    case ACQUIRE_TOKEN_SUCCESS:
      return {
        ...state,
        fetching: false,
        token: action.token,
      };
    case RECIEVE_USER: {
      const { facebookId, githubId, name } = action.response;
      return {
        ...state,
        facebookId,
        githubId,
        name,
        fetching: false,
      };
    }
    default:
      return state;
  }
};

export default reducer;
export {
  acquireToken,
  saveUser,
};
