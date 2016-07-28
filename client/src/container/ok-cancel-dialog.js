import React, { PropTypes } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { closeDialog } from '../redux/module/component/dialog';


const handleClose = props => () => {
  if (props.cancelHandler) {
    props.cancelHandler();
  }
  props.closeDialog();
};

const handleOk = props => () => {
  props.okHandler();
  props.closeDialog();
};

const handleCancel = props => () => {
  props.cancelHandler();
  props.closeDialog();
};

const OkCancelDialog = props => {
  const actions = [];
  if (props.cancelHandler) {
    actions.push(
      <FlatButton
        label={props.cancelText}
        primary
        onTouchTap={handleCancel(props)}
      />
    );
  }
  if (props.okHandler) {
    actions.push(
      <FlatButton
        label={props.okText}
        secondary
        onTouchTap={handleOk(props)}
      />
    );
  }
  return (
    <Dialog
      title={props.title}
      actions={actions}
      modal={(props.cancelHandler || props.okHandler) && props.modal}
      open={props.open}
      onRequestClose={handleClose(props)}
      style={{ zIndex: 4444 }}
    >
      {props.message}
    </Dialog>
  );
};

OkCancelDialog.propTypes = {
  okText: PropTypes.string.isRequired,
  cancelText: PropTypes.string.isRequired,
  okHandler: PropTypes.func,
  cancelHandler: PropTypes.func,
  message: PropTypes.node.isRequired,
  modal: PropTypes.bool.isRequired,
  title: PropTypes.string,
  open: PropTypes.bool.isRequired,
};

export default connect(
  state => ({ ...state.dialog }),
  dispatch => bindActionCreators({ closeDialog }, dispatch)
)(OkCancelDialog);
