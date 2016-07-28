const apiRootUrl = '/api';
const cityRootUrl = `${apiRootUrl}/city`;
const criteriaRootUrl = `${apiRootUrl}/criteria`;
const authRootUrl = `${apiRootUrl}/auth`;
const userRootUrl = `${apiRootUrl}/user`;

const criteriaParamsToUrl = params =>
  `${criteriaRootUrl}/city/${params.cityId}/temperature/` +
  `${params.temperature}/predicate/${params.predicate || 'greater'}`;


const endpoints = {
  getCitiesByName: { url: `${cityRootUrl}/name` },
  getCityById: { url: cityRootUrl },
  getCityByLocation: {
    url: coords => `${cityRootUrl}/location/${coords.toString()}`,
  },
  register: {
    url: `${authRootUrl}/register`,
    method: 'POST',
    public: true,
  },
  saveUser: {
    url: `${userRootUrl}`,
    method: 'POST',
  },
  connectGithub: {
    url: token => `${authRootUrl}/github?jwt=${token}`,
  },
  connectFacebook: {
    url: token => `${authRootUrl}/facebook?jwt=${token}`,
  },
  whoAmI: { url: `${userRootUrl}/whoami` },
  createCriteria: {
    url: criteriaParamsToUrl,
    method: 'PUT',
  },
  updateCriteria: {
    url: criteriaParamsToUrl,
    method: 'POST',
  },
  deleteCriteria: {
    url: `${criteriaRootUrl}`,
    method: 'DELETE',
  },
  getCriteriaFulfilledNotAcknoweledged: {
    url: `${criteriaRootUrl}/fulfilled/notacknoweledged`,
  },
  getCriteriaUpdatedAfter: {
    url: updatedafter => `${criteriaRootUrl}/updatedafter/${updatedafter}`,
  },
  getCriteriaFulfilled: { url: `${criteriaRootUrl}/fulfilled` },
  getCriteriaPending: { url: `${criteriaRootUrl}/pending` },
  acknoweledgeNotifications: {
    url: criteriaIds => `${criteriaRootUrl}/acknoweledge/${criteriaIds.toString()}`,
    method: 'POST',
  },
  getLatestReports: {
    url: cityIds => `${apiRootUrl}/weather/cities/${cityIds.toString()}`,
  },
};

export default endpoints;
