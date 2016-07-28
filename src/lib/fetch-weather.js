import fetch from 'node-fetch';
import { auth } from '../../config';
import uniq from 'lodash/uniq';

const baseUrl = 'http://api.openweathermap.org/data/2.5/';
const createGroupParam = cityIds => `group?id=${cityIds.join(',')}`;
const createGroupQueryUrl = cityIds =>
  `${baseUrl}${createGroupParam(cityIds)}&units=metric&appid=${auth.openWeatherMapApiKey}`;

const getGroup = async cityIds => {
  const citiesToCheck = Array.isArray(cityIds) ? uniq(cityIds) : [cityIds];
  const response = await fetch(createGroupQueryUrl(citiesToCheck));
  if (response.ok) {
    return await response.json();
  }
  throw new Error('smg went wrong during api call');
};

export default getGroup;
