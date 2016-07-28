console.warn = () => {};

let splashScreen;
require.ensure(['./splash-screen'], require => {
  splashScreen = require('./splash-screen').default;
  splashScreen.create();
});

require.ensure(['./app'], require => {
  const app = require('./app').default;
  setTimeout(app, 42);
  splashScreen.destroy();
});
