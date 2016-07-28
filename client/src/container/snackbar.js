import React, { PropTypes } from 'react';
import MSnackbar from 'material-ui/Snackbar';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { clearMessage } from '../redux/module/component/display-message';

const Snackbar = props =>
  <MSnackbar
    open={props.open}
    message={props.message || ''}
    autoHideDuration={2425}
    onRequestClose={props.clearMessage}
  />;

Snackbar.propTypes = {
  message: PropTypes.string,
  open: PropTypes.bool.isRequired,
  clearMessage: PropTypes.func.isRequired,
};

export default connect(
  state => ({ ...state.displayMessage }),
  dispatch => bindActionCreators({ clearMessage }, dispatch),
)(Snackbar);
