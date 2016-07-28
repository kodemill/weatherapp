/* eslint no-unused-expressions: 0 */
import { City, User, WeatherCriteria, WeatherReport } from '../src/model';
import WeatherController from '../src/controller/weather';
import nock from 'nock';
import { expect } from 'chai';


const weatherApiUrl = 'http://api.openweathermap.org/data/2.5';
const weatherApiPath = '/group';

describe('WeatherController', () => {
  let testUser;
  let testCity1;
  let testCity2;

  before(async function() {
    testUser = await User.create({ username: 'test' });
    testCity1 = await City.create({ _id: 1, name: 'testCity1', country: 'eu' });
    testCity2 = await City.create({ _id: 2, name: 'testCity2', country: 'eu' });
  });

  after(done => {
    nock.cleanAll();
    User.collection.drop(() => {
      City.collection.drop(() => {
        WeatherCriteria.collection.drop(done);
      });
    });
  });

  describe('#fetchWeatherAndUpdateDocuments()', () => {
    context('OpenWeatherApi is not ok', () => {
      beforeEach(() => {
        nock(weatherApiUrl)
          .get(weatherApiPath)
          .query(true)
          .reply(500);
      });

      after(() => nock.cleanAll());

      it('should not create reports', async () => {
        const reportCount = await WeatherReport.count();
        try {
          await WeatherController.fetchWeatherAndUpdateDocuments();
        } catch (err) {
          expect(await WeatherReport.count()).to.equal(reportCount);
        }
      });
    });

    context('OpenWeatherApi works fine', () => {
      afterEach(() => {
        nock.cleanAll();
      });

      it('should update only fulfilled conditions', async () => {
        nock(weatherApiUrl)
          .get(weatherApiPath)
          .query(true)
          .reply(200, { list: [
            { id: 1, main: { temp: 10 } },
            { id: 2, main: { temp: -1 } },
          ] });
        let condition1 = await WeatherCriteria.create(
          { user: testUser, city: testCity1, temperature: 42 });
        let condition2 = await WeatherCriteria.create(
          { user: testUser, city: testCity1, temperature: 43 });
        let condition3 = await WeatherCriteria.create(
          { user: testUser, city: testCity2, temperature: -100 });

        await WeatherController.fetchWeatherAndUpdateDocuments();

        condition1 = await WeatherCriteria.findById(condition1.id);
        condition2 = await WeatherCriteria.findById(condition2.id);
        condition3 = await WeatherCriteria.findById(condition3.id);
        expect(condition1.fulfilledAt).to.be.undefined;
        expect(condition2.fulfilledAt).to.be.undefined;
        expect(condition3.fulfilledAt).to.not.be.undefined;
        expect(condition3.fulfilledAt).to.be.a('date');
      });
    });
  });
});
