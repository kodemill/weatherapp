/* eslint no-unused-expressions: 0 */
import WeatherCriteria from '../src/model/weather-criteria';
import { expect } from 'chai';

describe('WeatherCriteriaSchema.methods.isFulfilledWithTemperature ', () => {
  const weatherCriteria = new WeatherCriteria({
    user: 1,
    city: 2,
    temperature: 42,
  });

  it('predicate: greater -> return true if greater temperature passed', () => {
    expect(weatherCriteria.isFulfilledWithTemperature(43)).to.be.true;
    expect(weatherCriteria.isFulfilledWithTemperature(111.22)).to.be.true;
  });

  it('predicate: greater -> return false if less temperature passed', () => {
    expect(weatherCriteria.isFulfilledWithTemperature(41)).to.be.false;
    expect(weatherCriteria.isFulfilledWithTemperature(-42)).to.be.false;
  });
});
