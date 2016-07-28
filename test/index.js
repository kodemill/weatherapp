import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import mongoose from 'mongoose';
mongoose.Promise = Promise;

chai.use(chaiAsPromised);

const mongoUrl = 'mongodb://127.0.0.1/weatherapp-test';

before(async function () {
  this.timeout(4000);
  await mongoose.connect(mongoUrl);
});

after(done => mongoose.connection.db.dropDatabase(done));
