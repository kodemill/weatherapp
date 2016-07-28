require('dotenv').load();

const config = module.exports = {};

config.apiUrl = process.env.API_URL || 'http://localhost:3000';
config.devPort = process.env.DEV_PORT || '8080';
config.devHost = process.env.DEV_HOST || 'localhost';
config.devUrl = `http://${config.devHost}:${config.devPort}`;
