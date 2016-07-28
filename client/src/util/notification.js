const isAvailable = () => 'Notification' in window;

const requestPermission = () => Notification.requestPermission();

const displayNotification = message => new Notification('WeatherApp', {
  body: message,
});

export {
  isAvailable,
  requestPermission,
  displayNotification,
};
