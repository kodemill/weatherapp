import React, { PropTypes } from 'react';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import VerifiedIcon from 'material-ui/svg-icons/action/verified-user';
import IconButton from 'material-ui/IconButton';

const EmailListItem = props => {
  const { sendNotification, address, trusted } = props.email;
  let errorText = (props.editing && !props.validEmail) ?
    props.errorText || 'Provide a valid email' : '';
  let actions;
  if (props.editing) {
    actions = [
      <FlatButton
        className="rowItem" key={0} secondary label="cancel" style={{ marginRight: '13px' }}
        onClick={() => props.editEmailCancel()}
      />,
      <FlatButton
        className="rowItem" key={1} primary label="done" style={{ marginRight: '13px' }}
        disabled={!props.validEmail} onClick={() => props.editEmailFinish()}
      />,
    ];
  } else {
    if (trusted) {
      actions = [
        <IconButton
          key={0} tooltip="email is verified" tooltipStyles={{ zIndex: 66669 }} disableTouchRipple
        >
          <VerifiedIcon color="#FFC107" />
        </IconButton>];
    } else {
      actions = [
        <FlatButton
          key={0} label="edit" className="rowItem" style={{ marginRight: '13px' }}
          disabled={props.disableActions} onClick={() => props.editEmailStart(address)}
        />,
      ];
    }
    actions.push(
      <IconButton
        key={2} tooltip="delete email" onClick={() => props.removeEmail(address)}
        disabled={props.disableActions}
      >
        <DeleteIcon
          color="#727272" hoverColor="#212121"
          key={1} className="deleteIcon"
        />
      </IconButton>);
  }
  return (
    <div className="emailListItem">
      <Checkbox
        className="checkbox rowItem"
        iconStyle={{ marginRight: '4px' }}
        style={{ width: 'auto' }}
        labelStyle={{ width: 'auto' }}
        checked={sendNotification}
        onCheck={(_, value) => props.sendNotificationChange(value, address)}
        label="send notifications"
        disabled={!props.globalCheck || props.disableActions || props.editing}
      />
      <TextField
        className="email rowItem"
        name="address"
        style={{ width: 'auto' }}
        disabled={!props.editing}
        value={props.editing ? props.editingText : address || ''}
        hintText={address ? '' : 'your.email@here.com'}
        type="email"
        onChange={(_, value) => props.editEmail(value)}
        onKeyDown={e => e.keyCode === 13 && props.validEmail && props.editEmailFinish()}
        fullWidth
        errorText={errorText}
      />
      {actions}
    </div>
  );
};

EmailListItem.propTypes = {
  email: PropTypes.object,
  globalCheck: PropTypes.bool,
  editing: PropTypes.bool,
  disableActions: PropTypes.bool,
  validEmail: PropTypes.bool,
  errorText: PropTypes.string,
  sendNotificationChange: PropTypes.func.isRequired,
  removeEmail: PropTypes.func.isRequired,
  editEmail: PropTypes.func.isRequired,
  editEmailStart: PropTypes.func.isRequired,
  editEmailFinish: PropTypes.func.isRequired,
  editEmailCancel: PropTypes.func.isRequired,
};

const EmailList = props => {
  const globalCheck = props.options && props.options.notificateViaEmail;
  const emailListItems = props.emails ? props.emails.map((email, idx) =>
    <EmailListItem
      key={idx}
      email={email}
      globalCheck={globalCheck}
      editing={props.editingEmailIndex === idx}
      disableActions={props.editingEmailIndex >= 0 && props.editingEmailIndex !== idx}
      {...props}
    />
  ) : [];
  return (
    <div className="emailList">
      {emailListItems.length === 0 ? 'You have no emails.' : emailListItems}
      <RaisedButton
        className="addNewButton"
        label="add email"
        disabled={props.editingEmailIndex >= 0}
        onClick={props.addEmail}
      />
    </div>
  );
};

EmailList.propTypes = {
  emails: PropTypes.array,
  options: PropTypes.object,
  editingEmailIndex: PropTypes.number,
  addEmail: PropTypes.func.isRequired,
  sendNotificationChange: PropTypes.func.isRequired,
};

export default EmailList;
