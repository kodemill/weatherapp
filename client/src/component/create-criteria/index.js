import '../../style/component/create-criteria.scss';
import React, { Component, PropTypes } from 'react';
import SearchCityAutocomplete from './search-city-autocomplete';
import TemperatureSlider from './temperature-slider';
import Map from '../map';
import { Card, CardTitle, CardText, CardMedia, CardActions } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

export default class CreateCriteria extends Component {

  static propTypes = {
    displayMessage: PropTypes.func.isRequired,
    showDialog: PropTypes.func.isRequired,
    saveCriteria: PropTypes.func.isRequired,
    cancelSaveCriteria: PropTypes.func.isRequired,
    searchCityByGeolocation: PropTypes.func.isRequired,
    searchCityByName: PropTypes.func.isRequired,
    searchCityByLocation: PropTypes.func.isRequired,
    selectCity: PropTypes.func.isRequired,
    selectedCity: PropTypes.object,
    existingCriteria: PropTypes.object,
    fetching: PropTypes.bool.isRequired,
    // children only props
    temperature: PropTypes.number,
    setValue: PropTypes.func.isRequired,
    searchCityProps: PropTypes.object.isRequired,
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      mapOpen: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.existingCriteria) {
      const criteria = nextProps.existingCriteria;
      this.props.showDialog({
        title: 'Existing Criteria',
        message:
          <div>
            <p>
            {`You already have an existing criteria in ${criteria.city.name} ` +
            `(${criteria.city.country}) for temperature ${criteria.predicate} ` +
            `than ${criteria.temperature}℃`}
            </p>
            {'Would you like to update it?'}
          </div>,
        okText: 'update',
        okHandler: () => this.handleSave(true),
        cancelHandler: this.props.cancelSaveCriteria,
      });
    } else if (!nextProps.fetching && this.props.fetching) {
      this.props.displayMessage('Criteria saved successfully');
    } else if (!nextProps.searchCityProps.fetching && this.props.searchCityProps.fetching
      && nextProps.searchCityProps.byLocation.city !== this.props.searchCityProps.byLocation.city) {
      this.props.selectCity(nextProps.searchCityProps.byLocation.city);
    }
  }

  handleSave = update => {
    if (!this.props.selectedCity) {
      return;
    }
    this.props.saveCriteria(update, this.props.selectedCity, this.props.temperature);
  }

  handleExpandChange = mapOpen => {
    this.setState({ mapOpen });
  }

  handleMapClick = (lon, lat) => {
    this.props.searchCityByLocation([lon, lat]);
  }

  render() {
    const { selectCity, selectedCity, searchCityByName } = this.props;
    const serchCityAutocompleteProps = {
      ...this.props.searchCityProps.byName,
      selectedCity,
      selectCity,
      searchCityByName,
    };
    const markers = selectedCity ? [selectedCity] : [];
    return (
      <Card className="createCriteria" >
        <CardTitle
          title={"Create Criteria"}
          subtitle={"you can search location by name or using the map & set temperature using the slider"}//eslint-disable-line
        />
        <CardText>
          <SearchCityAutocomplete {...serchCityAutocompleteProps} />
          <TemperatureSlider
            temperature={this.props.temperature}
            setValue={this.props.setValue}
          />
        </CardText>
        <CardMedia>
          <Map
            visible={this.state.mapOpen}
            info="Click on the map and we will find a location nearby!"
            markers={markers}
            onMapClick={this.handleMapClick}
          />
        </CardMedia>
        <CardActions className="actionButtonContainer">
          <FlatButton
            className="myLocationButton actionButton"
            label="use my location"
            primary
            style={{ margin: '' }}
            onClick={this.props.searchCityByGeolocation}
          />
          <FlatButton
            className="showMapButton actionButton"
            label={`${this.state.mapOpen ? 'hide' : 'show'} map`}
            primary
            style={{ margin: '' }}
            onClick={() => this.handleExpandChange(!this.state.mapOpen)}
          />
          <RaisedButton
            className="saveButton actionButton"
            onClick={() => this.handleSave(false)}
            label="save"
            primary
            style={{ margin: '' }}
            disabled={this.props.fetching || !selectedCity}
          />
        </CardActions>
      </Card>
    );
  }
}
