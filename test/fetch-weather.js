/* eslint no-unused-expressions: 0 */
import fetchWeather from '../src/lib/fetch-weather';
import nock from 'nock';
import { expect } from 'chai';

const weatherApiUrl = 'http://api.openweathermap.org/data/2.5';
const weatherApiPath = '/group';

describe('fetchWeather', () => {
  afterEach(nock.cleanAll);
  it('should throw error if api is unavailable', () => {
    nock(weatherApiUrl)
      .get(weatherApiPath)
      .query(true)
      .reply(500);
    return expect(fetchWeather(1)).to.be.rejected;
  });
  it('should group cityIds - no duplicates', async () => {
    nock(weatherApiUrl).get(weatherApiPath)
      .query(query => {
        const ids = query.id.split(',').map(Number);
        return ids.length === 2 &&
          ids.every(id => id === 1 || id === 2);
      })
      .reply(200, { valid_json: true });
    await fetchWeather([1, 2, 1, 1, 2]);
    expect(nock.isDone()).to.be.true;
  });
  it('should parse response correctly', async () => {
    const response = {
      key1: 'ix',
      key2: ['kax', 2],
      kolme: { nel: 2 },
    };
    nock(weatherApiUrl).get(weatherApiPath)
      .query(true)
      .reply(200, response);
    expect(await fetchWeather(1))
      .to.to.deep.equal(response);
  });
});
