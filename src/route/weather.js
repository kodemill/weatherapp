import { LatestWeatherReport } from '../model';
// import fetchWeather from '../lib/fetch-weather';

export default router => {
  // router.get('/weather/fetch/city/:cityId', async ctx => {
  //   try {
  //     const weather = await fetchWeather(ctx.params.cityId);
  //     ctx.body = weather;
  //   } catch (err) {
  //     ctx.throw(constants.thirdParty);
  //   }
  // });
  // router.get('/weather/fetch/cities/:cityIds', async ctx => {
  //   try {
  //     const weather = await fetchWeather(ctx.params.cityIds);
  //     ctx.body = weather;
  //   } catch (err) {
  //     ctx.throw(constants.thirdParty);
  //   }
  // });
  router.get('/weather/city/:cityId', async ctx => {
    ctx.body = (await LatestWeatherReport
      .findOne({ city: ctx.params.cityId })
      .populate('weatherReport'))
      .weatherReport;
  });
  router.get('/weather/cities/:cityIds', async ctx => {
    ctx.body = (await LatestWeatherReport
      .find({ city: { $in: ctx.params.cityIds.split(',') } })
      .populate('weatherReport'))
      .map(latestWeatherReport => latestWeatherReport.weatherReport);
  });
};
