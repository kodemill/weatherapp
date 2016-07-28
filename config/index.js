require('dotenv').config();
const path = require('path');
// const uuid = require('uuid');

const config = module.exports = {};

config.app = {
  port: process.env.APP_PORT || 3000,
  protocol: process.env.APP_PROTOCOL || 'http',
  host: process.env.APP_HOST || '127.0.0.1',
  publicFolder: path.resolve(__dirname, '../', process.env.PUBLIC_FOLDER || 'public'),
  publicPath: process.env.PUBLIC_PATH || '',
  apiPath: process.env.API_PATH || 'api',
};

config.app.url = process.env.APP_PUBLIC_URL || `${config.app.protocol}://${config.app.host}:${config.app.port}`;

config.auth = {
  facebookLoginCallback: `${config.app.url}/api/auth/facebook/callback`,
  githubLoginCallback: `${config.app.url}/api/auth/github/callback`,
  facebookAppId: process.env.FACEBOOK_APP_ID,
  facebookAppSecret: process.env.FACEBOOK_APP_SECRET,
  githubAppId: process.env.GITHUB_APP_ID,
  githubAppSecret: process.env.GITHUB_APP_SECRET,
  openWeatherMapApiKey: process.env.OPEN_WEATHER_MAP_API_KEY,
  jwtSecret: process.env.JWT_SECRET ||
    'cf7cc37b-83dd-40ee-bbaa-aae29ddc4f91-fair-dice-roll-much-security',
};

config.db = {
  mongoUri: process.env.MONGO_URI,
  cityList: path.resolve(__dirname, '../', process.env.CITY_LIST),
};

config.time = {
  jobGranularity: process.env.JOB_GRANULARITY || 11 * 60 * 1000, // 11m
};

config.email = {
  account: process.env.EMAIL_ACCOUNT,
  password: process.env.EMAIL_PASSWORD,
};

config.isProduction = process.env.NODE_ENV === 'production';
