WeatherApp
==========

## Used technologies
* server
  * koa 2 for Promise based middleware awesomeness
  * mongoose
  * JWT for stateless api
  * passport.js to ease authentication w/ Github and Facebook
* client
  * react
  * redux
  * sass
  * material-ui
  * leaflet, moment
  * webpack

## Requirements
* `node v6` min
* `mongodb` running with a collection named `cities` filled with [OpenWeatherMap's city list](http://bulk.openweathermap.org/sample/) OR you can provide the city.list.json file locally to make the app read it on startup
* environment variables listed in `sample.env` set OR `.env` file in the project root, make sure you fill out
  * facebook and github API keys and secrets
  * OpenWeatherMap API key
  * secret for JWT
  * email/pass for sending emails (gmail)

### Install
`npm i`

### Develop
`npm run dev`

### Run tests
`npm t`

### Run Server
`npm start`
