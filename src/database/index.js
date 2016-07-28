import connect from './connect';
import importCityList from './import-city-list';

export default async () => {
  await connect();
  await importCityList();
};
