import '../../style/component/temperature-slider.scss';
import React, { Component, PropTypes } from 'react';
import Slider from 'material-ui/Slider';
import _debounce from 'lodash/debounce';
// import FontIcon from 'material-ui/FontIcon';

export default class TemperatureSlider extends Component {
  static propTypes = {
    setValue: PropTypes.func.isRequired,
    minIcon: PropTypes.string,
    maxIcon: PropTypes.string,
    minTemperature: PropTypes.number,
    maxTemperature: PropTypes.number,
    temperature: PropTypes.number,
    step: PropTypes.number,
    debounceTimeout: PropTypes.number.isRequired,
  };

  static defaultProps = {
    minIcon: 'wi-snowflake-cold',
    maxIcon: 'wi-day-sunny',
    minTemperature: -30,
    maxTemperature: 40,
    temperature: 18,
    debounceTimeout: 111,
    step: 0.1,
  };

  constructor(props) {
    super(props);
    this.state = {};
    this.setValue = _debounce(props.setValue, props.debounceTimeout);
  }

  handleChange = (_, value) => {
    this.setState({ value });
    this.setValue(value);
  }

  render() {
    const temperature = Number(this.state.value || this.props.temperature).toFixed(1);
    return (
      <div className="temperatureSlider">
        <div className="currentTemperature">
          <span className="temperature">{temperature}</span>
          <span className="celsiusDegree">℃</span>
        </div>
        <div className="sliderWrapper">
          <div className={`intervalIcon minIcon wi ${this.props.minIcon}`}></div>
          <Slider
            sliderStyle={{ height: '10px' }}
            min={this.props.minTemperature}
            max={this.props.maxTemperature}
            step={this.props.step}
            defaultValue={this.props.temperature}
            onChange={this.handleChange}
            onDragStop={this.handleSetValue}
            className="slider"
          />
          <div className={`intervalIcon maxIcon wi ${this.props.maxIcon}`}></div>
        </div>
      </div>
    );
  }
}
