const storageTokenKey = 'id_token';
const globalTokenKey = '__token__';

const setToken = localStorage.setItem.bind(localStorage, storageTokenKey);

let tokenExtractedFromGlobal = false;
const getToken = () => {
  if (!tokenExtractedFromGlobal && window[globalTokenKey]) {
    setToken(window[globalTokenKey]);
    delete window[globalTokenKey];
    tokenExtractedFromGlobal = true;
  }
  return localStorage.getItem(storageTokenKey);
};

export {
  getToken,
  setToken,
};
