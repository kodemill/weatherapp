import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as searchCityActionCreators from '../redux/module/search-city';
import * as createCriteriaActionCreators from '../redux/module/component/create-criteria';
import * as temperatureSliderActionCreators from '../redux/module/component/temperature-slider';
import { showDialog } from '../redux/module/component/dialog';
import { displayMessage } from '../redux/module/component/display-message';

import CreateCriteria from '../component/create-criteria';

const mapStateToProps = state => ({
  searchCityProps: state.searchCity,
  temperature: state.temperatureSlider,
  ...state.createCriteria,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  ...searchCityActionCreators,
  ...temperatureSliderActionCreators,
  ...createCriteriaActionCreators,
  showDialog,
  displayMessage,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(CreateCriteria);
