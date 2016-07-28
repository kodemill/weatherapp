'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _city = require('../model/city');

var _city2 = _interopRequireDefault(_city);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _readline = require('readline');

var _readline2 = _interopRequireDefault(_readline);

var _config = require('../../config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const importCities = () => new Promise((resolve, reject) => {
  const readStream = _fs2.default.createReadStream(_config.db.cityList);
  // https://docs.mongodb.com/manual/reference/method/db.collection.initializeUnorderedBulkOp
  let bulkOp = _city2.default.collection.initializeUnorderedBulkOp();
  const opLimit = 1000;
  let opCount = 0;
  let sumOpCount = 0;
  const rl = _readline2.default.createInterface({
    input: readStream,
    terminal: false
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
      coordinates: [city.coord.lon, city.coord.lat]
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
      bulkOp = _city2.default.collection.initializeUnorderedBulkOp();
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

exports.default = _asyncToGenerator(function* () {
  if ((yield _city2.default.collection.count()) === 0) {
    console.log('importing city list...');
    const start = Date.now();
    const importedCount = yield importCities();
    console.log(`imported ${ importedCount } cities in ${ (Date.now() - start) / 1000 }s`);
  }
});
//# sourceMappingURL=import-city-list.js.map