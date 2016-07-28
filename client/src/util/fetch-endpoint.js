import { getToken } from './token-provider';
import endpoints from './endpoints';

const fetchEndpoint = {};

Object.keys(endpoints).forEach(endpointKey => {
  const endpointValue = endpoints[endpointKey];
  const fetchOptions = {
    mode: endpointValue.noCors ? 'no-cors' : 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };
  if (endpointValue.method) {
    fetchOptions.method = endpointValue.method;
  }
  fetchEndpoint[endpointKey] = (param, body) => {
    // normalize params
    /* eslint-disable */
    if (param instanceof FormData) {
      body = param;
      param = null;
    }
    /* eslint-enable */
    if (!endpointValue.public) {
      fetchOptions.headers.Authorization = `JWT ${getToken()}`;
    }
    if (body) {
      fetchOptions.body = body;
    }
    let url;
    const type = typeof param;
    if (type === 'string' || type === 'number') {
      url = `${endpointValue.url}/${param}`;
    } else if (!param) {
      url = endpointValue.url;
    } else { // object
      url = endpointValue.url(param);
    }
    return () => fetch(url, fetchOptions);
  };
});

export default fetchEndpoint;
