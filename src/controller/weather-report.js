import WeatherReport from '../model/weather-report';
import LatestWeatherReport from '../model/latest-weather-report';

const getLatestReportForCityId = async cityId =>
  await LatestWeatherReport.findOne({ city: cityId });

const saveWeatherReport = async rawReport => {
  const cityId = rawReport.id;
  const newReport = await WeatherReport.create({
    city: cityId,
    temperature: rawReport.main.temp,
    rawReport,
  });
  let latestReportForCity = await getLatestReportForCityId(cityId);
  if (latestReportForCity) {
    latestReportForCity.weatherReport = newReport;
  } else {
    latestReportForCity = new LatestWeatherReport({
      city: cityId,
      weatherReport: newReport,
    });
  }
  await latestReportForCity.save();
  return newReport;
};

const saveAllFromResponse = weatherResponse =>
  Promise.all(weatherResponse.list.map(saveWeatherReport));

export default {
  saveWeatherReport,
  saveAllFromResponse,
  getLatestReportForCityId,
};
