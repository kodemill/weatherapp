import City from '../model/city';
import fs from 'fs';
import readline from 'readline';
import { db } from '../../config';

const importCities = () => new Promise((resolve, reject) => {
  const readStream = fs.createReadStream(db.cityList);
  // https://docs.mongodb.com/manual/reference/method/db.collection.initializeUnorderedBulkOp
  let bulkOp = City.collection.initializeUnorderedBulkOp();
  const opLimit = 1000;
  let opCount = 0;
  let sumOpCount = 0;
  const rl = readline.createInterface({
    input: readStream,
    terminal: false,
  });
  rl.on('line', line => {
    const city = JSON.parse(line);
    // lowercase for faster regex search
    city.nameLC = city.name.toLowerCase();
    // convert location into valid GeoJSON Point:
    // input: "coord":{"lon":34.283333,"lat":44.549999}}
    // WGS84: 'Coordinate-axis order is longitude, latitude'
    // output "location":{"type":"Point","coordinates":[34.283333,44.549999]}
    city.location = {
      type: 'Point',
      coordinates: [city.coord.lon, city.coord.lat],
    };
    delete city.coord;
    bulkOp.insert(city);
    if (++opCount === opLimit) {
      bulkOp.execute(err => {
        if (err) {
          reject(err);
        }
      });
      sumOpCount += opCount;
      opCount = 0;
      bulkOp = City.collection.initializeUnorderedBulkOp();
    }
  });
  rl.on('close', () => {
    sumOpCount += opCount;
    if (opCount !== 0) {
      bulkOp.execute(err => {
        if (err) {
          reject(err);
        } else {
          resolve(sumOpCount);
        }
      });
    } else {
      resolve(sumOpCount);
    }
  });
});

export default async () => {
  if (await City.collection.count() === 0) {
    console.log('importing city list...');
    const start = Date.now();
    const importedCount = await importCities();
    console.log(`imported ${importedCount} cities in ${(Date.now() - start) / 1000}s`);
  }
};
