import WCC from '../controller/weather-criteria';
import WRC from '../controller/weather-report';
import fetchWeather from '../lib/fetch-weather';

const fetchWeatherAndUpdateDocuments = async () => {
  const pendingCriteria = await WCC.getAllPending();
  const weatherResponse = await fetchWeather(
    pendingCriteria.map(criteria => criteria.city));
  const weatherReports = await WRC.saveAllFromResponse(weatherResponse);
  return [await WCC.tryFulfillFromReports(pendingCriteria, weatherReports), weatherReports];
};

export default {
  fetchWeatherAndUpdateDocuments,
};
