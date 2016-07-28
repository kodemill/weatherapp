import Leaflet from 'leaflet';
import iconSrc from '../../style/vendor/images/marker-icon.png';

export default Leaflet.icon({
  iconUrl: iconSrc,
  // shadowUrl: 'leaf-shadow.png',

  iconSize: [48, 48], // size of the icon
  // shadowSize:   [50, 64], // size of the shadow
  iconAnchor: [24, 48], // point of the icon which will correspond to marker's location
  // shadowAnchor: [4, 62],  // the same for the shadow
  // popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});
