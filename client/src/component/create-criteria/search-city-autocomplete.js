import React, { PropTypes, Component } from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import MenuItem from 'material-ui/MenuItem';
import _debounce from 'lodash/debounce';

export default class SearchCityAutocomplete extends Component {

  static propTypes = {
    // action creators
    searchCityByName: PropTypes.func.isRequired,
    selectCity: PropTypes.func,
    // state
    cities: PropTypes.array.isRequired,
    truncated: PropTypes.bool.isRequired,
    searchText: PropTypes.string.isRequired,
    // fetching: PropTypes.bool.isRequired,
    selectedCity: PropTypes.object,
    // other
    debounceTimeout: PropTypes.number.isRequired,
    cityLimit: PropTypes.number.isRequired,
  }

  static defaultProps = {
    debounceTimeout: 444,
    cityLimit: 42,
  }

  constructor(props) {
    super(props);
    this.debouncedSearchCityByName = _debounce(
      searchText => props.searchCityByName(searchText, props.cityLimit),
      props.debounceTimeout);
    this.state = {
      dataSource: [],
    };
    this.currentSearchText = '';
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.fetching && nextProps.searchText === this.currentSearchText) {
      this.setState({
        dataSource: this.createDataSource(nextProps),
      });
    }
  }

  handleUpdateInput = searchText => {
    this.currentSearchText = searchText;
    this.setState({ dataSource: [] });
    this.debouncedSearchCityByName(searchText);
  }

  handleItemSelected = (_, index) => {
    if (index < 0) {
      return;
    }
    let idx = index;
    if (this.props.truncated) { // 1st item is 'too many results..'
      idx--;
    }
    this.props.selectCity(this.props.cities[idx]);
  };

  createDataSource = props => {
    if (props.cities.length === 0 && props.searchText.length > 0) {
      return [{
        text: 'dummy',
        value: <MenuItem
          disabled
          primaryText={'No location found, try another term'}
          secondaryText="&#9785;"
        />,
      }];
    }
    const newDataSource = props.cities.map(city => ({
      text: city.name,
      value: <MenuItem primaryText={city.name} secondaryText={city.country} />,
    }));
    if (props.truncated) {
      newDataSource.splice(0, 0, {
        text: 'dummy',
        value: <MenuItem
          disabled
          primaryText={'Only the first couple locations are listed, please narrow the search'}
        />,
      });
    }
    return newDataSource;
  };

  render() {
    const searchText = this.props.selectedCity ?
      this.props.selectedCity.name : this.currentSearchText;
    return (
      <AutoComplete
        fullWidth
        menuProps={{ maxHeight: 444 }}
        menuStyle={{ overflowX: 'hidden', zIndex: 3333 }}
        floatingLabelText={'Location'}
        hintText={'Type here to start a search'}
        dataSource={this.state.dataSource}
        searchText={searchText}
        onNewRequest={this.handleItemSelected}
        onUpdateInput={this.handleUpdateInput}
        animated={false}
        openOnFocus
        filter={() => true}
      />
    );
  }
}
