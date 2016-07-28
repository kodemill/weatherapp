import '../../style/vendor/leaflet.css';
import '../../style/component/map.scss';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Leaflet from 'leaflet';
import Paper from 'material-ui/Paper';
import MarkerIcon from './marker-icon';
import _xorBy from 'lodash/xorBy';

export default class Map extends Component {

  static propTypes = {
    mapboxAccesToken: PropTypes.string.isRequired,
    minZoom: PropTypes.number.isRequired,
    maxZoom: PropTypes.number.isRequired,
    visible: PropTypes.bool.isRequired,
    info: PropTypes.string,
    onMapClick: PropTypes.func,
    markers: PropTypes.array,
    zoomToFit: PropTypes.bool,
  }

  static defaultProps = {
    mapboxAccesToken: 'pk.eyJ1IjoibWlrbG9zc3V2ZWdlcyIsImEiOiJjaXF6NnFsbGMwMDVtaTRuamFwNHMxbHh0In0.OZjdp5ZyQWoTqmDjz9vIJw', // eslint-disable-line
    minZoom: 2,
    maxZoom: 14,
    zoomToFit: true,
  }

  constructor(props) {
    super(props);
    this.map = null;
    this.tileLayer = Leaflet.tileLayer(
      `https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=${props.mapboxAccesToken}`, {
        minZoom: props.minZoom,
        maxZoom: props.maxZoom,
        // continuousWorld: false,
      }
    );
    this.firstShow = true;
    this.markers = [];
  }

  componentDidMount() {
    const rootEl = ReactDOM.findDOMNode(this);
    this.map = Leaflet.map(rootEl, {
      minZoom: this.props.minZoom,
      maxZoom: this.props.maxZoom,
      layers: [this.tileLayer],
      attribution: 'Map data &copy <a href="https://www.openstreetmap.org/">OSM</a>, Imagery &copy <a href="https://www.mapbox.com/">Mapbox</a>',
      attributionControl: false,
      zoomControl: false,
    });
    if (this.props.onMapClick) {
      this.map.on('click', event => {
        const { lat, lng } = event.latlng.wrap();
        this.props.onMapClick(lng, lat);
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (_xorBy(this.markers, nextProps.markers, 'id').length > 0) {
      this.refreshMarkers(nextProps.markers);
    }
  }

  componentWillUnmount() {
    this.map = null;
  }

  onTransitionEnd = () => {
    if (this.firstShow && this.props.visible) {
      this.firstShow = false;
      this.map.invalidateSize();
      if (this.markers.length === 0) {
        this.map.fitWorld();
      }
    }
  }

  refreshMarkers(markers) {
    if (this.markerGroup) {
      this.map.removeLayer(this.markerGroup);
      this.markerGroup = null;
    }
    this.markers = markers;
    if (this.markers.length > 0) {
      this.markerGroup = Leaflet.featureGroup(this.markers.map(marker =>
        Leaflet.marker([marker.location.coordinates[1], marker.location.coordinates[0]], {
          icon: MarkerIcon,
        })
      ));
      this.map.addLayer(this.markerGroup);
      if (this.props.zoomToFit) {
        this.map.fitBounds(this.markerGroup.getBounds(), {
          maxZoom: Math.max(this.map.getZoom(), 5),
          animate: true,
        });
      }
    }
  }

  render() {
    return (
      <div
        id="mapContainer"
        className={this.props.visible ? 'visible' : 'hidden'}
        onTransitionEnd={this.onTransitionEnd}
      >
        <Paper className="info">
        {this.props.info}
        </Paper>
      </div>
    );
  }
}
