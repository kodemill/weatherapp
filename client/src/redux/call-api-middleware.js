export const CALL_API = Symbol();

const createActionWith = (action, data) => {
  const finalAction = {
    ...action,
    ...data,
  };
  delete finalAction[CALL_API];
  return finalAction;
};

export default () => next => async action => {
  const properties = action[CALL_API];
  if (!properties) {
    return next(action);
  }
  const { types, fetchEndpoint } = properties;
  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error('provide an array of [REQUEST, SUCCESS, FAILURE] types');
  }
  if (!types.every(type => typeof type === 'string')) {
    throw new Error('actionType must be a string');
  }
  if (typeof fetchEndpoint !== 'function') {
    throw new Error('fetchEndpoint must be a function');
  }
  const [requestType, successType, failureType] = types;
  next(createActionWith(action, { type: requestType }));
  try {
    const rawResponse = await fetchEndpoint();
    const response = await rawResponse.json();
    if (rawResponse.ok) {
      return next(createActionWith(action, { type: successType, response }));
    }
    return next(createActionWith(action, {
      type: failureType,
      error: response.message || `server error: ${rawResponse.status}`,
    }));
  } catch (err) {
    return next(createActionWith(action, {
      error: // err.message ||
        'unknown error happened :(',
      type: failureType,
    }));
  }
};
