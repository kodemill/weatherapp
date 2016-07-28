import { City, User, WeatherCriteria, WeatherReport } from '../src/model';
import WCC from '../src/controller/weather-criteria';
import { expect } from 'chai';

describe('WeatherCriteriaController', () => {
  let user;
  let testCity1;
  let testCity2;

  before(async () => {
    user = await User.create({});
    testCity1 = await City.create({ _id: 1, name: 'testCity1', country: 'eu' });
    testCity2 = await City.create({ _id: 2, name: 'testCity2', country: 'eu' });
  });

  after(async () => {
    await user.remove();
    await testCity1.remove();
    await testCity2.remove();
  });

  describe('#tryFulfillFromReports', () => {
    afterEach(done => WeatherReport.collection.drop(() => {
      WeatherCriteria.collection.drop(done);
    }));

    it('should set fulfilledAt only for fulfilled', async () => {
      const testReport1 = await WeatherReport
        .create({ city: testCity1, temperature: 0 });
      const testReport2 = await WeatherReport
        .create({ city: testCity2, temperature: 0 });
      const toBeFulfilledCriteria = await WeatherCriteria
        .create({ city: testCity1, temperature: -1, user });
      let toRemainPendingCriteria = await WeatherCriteria
        .create({ city: testCity2, temperature: 1, user });
      const fulfilledCriteria = await WCC.tryFulfillFromReports(
        [toBeFulfilledCriteria, toRemainPendingCriteria],
        [testReport2, testReport1]);
      expect(fulfilledCriteria).to.have.length(1);
      const fulfilled = fulfilledCriteria[0].toObject();
      expect(fulfilled).to.have.property('fulfilledAt');
      expect(fulfilled).to.deep.equal(toBeFulfilledCriteria.toObject());
      toRemainPendingCriteria = await WeatherCriteria.findOne({ city: 2 });
      expect(toRemainPendingCriteria.toObject()).not.to.have.property('fulfilledAt');
    });
  });
});
