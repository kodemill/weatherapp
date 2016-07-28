/* eslint no-unused-expressions: 0 */
import { City, WeatherReport, LatestWeatherReport } from '../src/model';
import WRC from '../src/controller/weather-report';
import { expect } from 'chai';

describe('WeatherReportController', () => {
  let testCity1;

  before(async () => {
    testCity1 = await City.create({ _id: 1, name: 'SuchCity', country: 'NEVERLAND' });
  });

  after(async () => {
    await testCity1.remove();
  });

  describe('#saveWeatherReport', () => {
    const rawReport = {
      main: { temp: 2 },
      id: 1,
    };

    afterEach(done => {
      WeatherReport.collection.drop(() => {
        LatestWeatherReport.collection.drop(done);
      });
    });

    it('should create a WeatherReport and return it', async () => {
      expect(await WRC.saveWeatherReport(rawReport)).not.to.be.undefined;
      const reports = await WeatherReport.find({ city: 1 });
      expect(reports).to.have.length(1);
      expect(reports[0].temperature).to.equal(2);
    });

    it('should create relevant LatestWeatherReport', async () => {
      let report = await WRC.saveWeatherReport(rawReport);
      let latestReport = await LatestWeatherReport.findOne({ city: 1 }).populate('weatherReport');
      expect(latestReport).not.to.be.undefined;
      expect(latestReport.weatherReport).not.to.be.undefined;
      expect(latestReport.weatherReport.toObject()).to.deep.equal(report.toObject());

      report = await WRC.saveWeatherReport(rawReport);
      latestReport = await LatestWeatherReport.findOne({ city: 1 });
      expect(latestReport.report).to.equal(report.toObject().id);
    });
  });
});
