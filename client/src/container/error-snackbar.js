import '../style/component/error-snackbar.scss';
import React, { Component, PropTypes } from 'react';
import Snackbar from 'material-ui/Snackbar';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { dismissErrorMessage } from '../redux/module/component/error-message';

const mapStateToProps = state => ({
  message: state.errorMessage,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  dismissErrorMessage,
}, dispatch);

@connect(mapStateToProps, mapDispatchToProps)
export default class ErrorSnackbar extends Component {

  static propTypes = {
    message: PropTypes.string,
    dismissErrorMessage: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.message) {
      this.setState({
        open: true,
      });
    }
  }

  onDismiss = () => {
    this.setState({
      open: false,
    });
    this.props.dismissErrorMessage();
  }

  render() {
    return (
      <Snackbar
        className="errorSnackbar"
        open={this.state.open}
        message={this.props.message || ''}
        action="dismiss"
        autoHideDuration={6789}
        onRequestClose={this.onDismiss}
        onActionTouchTap={this.onDismiss}
        bodyStyle={{ backgroundColor: '#D32F2F' }}
      />
    );
  }
}
