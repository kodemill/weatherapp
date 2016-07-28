import database from './database';
import app from './app';
import config from '../config';
import job from './lib/periodic-job';

const startApp = async () => {
  try {
    await database();
    await app.listen(config.app.port);
    console.log(`server listening on port ${config.app.port}`);
    job.start(true);
  } catch (err) {
    console.log(err);
    process.exit(42);
  }
};
startApp();
