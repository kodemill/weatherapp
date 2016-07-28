
const isAvailable = () => 'geolocation' in window.navigator;

const getLocationLonLat = () => new Promise((resolve, reject) =>
  navigator.geolocation.getCurrentPosition(result => {
    if (result && result.coords) {
      resolve([result.coords.longitude, result.coords.latitude]);
    } else reject();
  }, reject));

export {
  isAvailable,
  getLocationLonLat,
};
