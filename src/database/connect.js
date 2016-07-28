import mongoose from 'mongoose';
mongoose.Promise = global.Promise;
import { db } from '../../config';

export default async () => {
  if (mongoose.connection.readyState === 1) {
    console.log('already connected to MongoDB');
    return;
  }
  try {
    console.log('connecting to MongoDB...');
    await mongoose.connect(db.mongoUri);
    console.log(`connected @ ${db.mongoUri}`);
    return;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
