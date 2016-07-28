import WeatherController from '../controller/weather';
import NotificationController from '../controller/notification';
import config from '../../config';

const job = async () => {
  console.log('periodic job start...');
  const start = Date.now();
  try {
    const fulfilledCriteriaWithReports = await WeatherController.fetchWeatherAndUpdateDocuments();
    await NotificationController.notificateUsers(...fulfilledCriteriaWithReports);
  } catch (error) {
    console.log(error);
  } finally {
    console.log(`periodic job finished in ${Date.now() - start}ms`);
  }
};

let intervalId;

const stop = () => {
  clearInterval(intervalId);
  intervalId = null;
};

const start = (immediate, granularity) => {
  if (intervalId) {
    stop();
  }
  if (immediate) {
    job();
  }
  intervalId = setInterval(job, granularity || config.time.jobGranularity);
};

export default {
  start,
  stop,
};
