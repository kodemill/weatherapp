import '../../style/component/settings.scss';
import React, { PropTypes } from 'react';
import { Card, CardText, CardTitle, CardActions } from 'material-ui/Card';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import EmailList from './emails';
import Toggle from 'material-ui/Toggle';

const getSocialButtonText = (props, social) => {
  let connected;
  if (social === 'facebook') {
    connected = props.facebookConnected;
  } else {
    connected = props.githubConnected;
  }
  return connected ? `${social} connected` : `connect ${social}`;
};

let saveStarted = false;
const Settings = props => {
  const sendEmailsEnabled = props.options && props.options.notificateViaEmail;
  const nativeNotificationsEnabled = props.options && props.options.notificateViaNative;
  const popupNotificationsEnabled = props.options && props.options.notificateViaPopup;
  const editing = props.editingEmailIndex >= 0;
  if (saveStarted && !props.changed) {
    props.displayMessage('changes saved successfully');
    saveStarted = false;
  }
  return (
    <Card className="settings">
      <CardTitle
        title="Settings"
        subtitle="Change notification settings & connect with social providers, make sure you save the changes you make" //eslint-disable-line
      />
      <CardText>
        <Toggle
          style={{ paddingBottom: '5px' }}
          disabled={!props.emails || props.emails.length === 0}
          checked={sendEmailsEnabled}
          onToggle={(_, value) => props.sendNotificationChange(value)}
          labelPosition="right"
          label={`${sendEmailsEnabled ? '' : 'dis'}allow sending notification emails`}
        />
        <Toggle
          style={{ paddingBottom: '5px' }}
          checked={nativeNotificationsEnabled}
          onToggle={(_, value) => props.nativeNotificationChange(value)}
          labelPosition="right"
          label={`${nativeNotificationsEnabled ? '' : 'dis'}allow native notifications`}
        />
        <Toggle
          style={{ paddingBottom: '5px' }}
          checked={popupNotificationsEnabled}
          onToggle={(_, value) => props.popupNotificationChange(value)}
          labelPosition="right"
          label={`${popupNotificationsEnabled ? '' : 'dis'}allow popup notifications`}
        />
      </CardText>
      <CardTitle title="Emails" style={{ paddingBottom: 0 }} />
      <CardText>
        <p>After you add a new address you'll have to prove that it's yours.
        In order to do that just click on the link in the email we send you in a minute.
          Check your spam folder if you can't find it.<br />
        Emails we get from social providers are automatically trusted.
        </p>
        <EmailList
          {...props}
        />
      </CardText>
      <CardTitle title="Social providers" style={{ paddingBottom: 0 }} />
      <CardText>
        <p>If you want to use this app from other devices,
          make sure you connect via social providers.
        </p>
      </CardText>
      <CardText className="actions">
        <RaisedButton
          style={{ margin: '5px' }} className="actionButton"
          href={props.connectGithubUrl}
          label={getSocialButtonText(props, 'github')}
          labelPosition="before"
          primary
          icon={<FontIcon className="icon-github-squared" />}
          disabled={props.isFetching || editing || props.githubConnected}
        />
        <RaisedButton
          style={{ margin: '5px' }} className="actionButton"
          href={props.connectFacebookUrl}
          label={getSocialButtonText(props, 'facebook')}
          labelPosition="before"
          primary
          icon={<FontIcon className="icon-facebook-squared" />}
          disabled={props.isFetching || editing || props.facebookConnected}
        />
      </CardText>
      <CardActions className="actions">
        <FlatButton
          style={{ margin: '5px' }} className="actionButton"
          onClick={props.discardChanges} disabled={props.isFetching || editing || !props.changed}
          label="discard changes"
        />
        <RaisedButton
          style={{ margin: '5px' }}
          onClick={() => {
            saveStarted = true;
            props.saveUser();
          }} className="actionButton"
          disabled={props.isFetching || editing || !props.changed} label="save changes" primary
        />
      </CardActions>
    </Card>
  );
};

Settings.propTypes = {
  githubConnected: PropTypes.bool.isRequired,
  facebookConnected: PropTypes.bool.isRequired,
  connectFacebookUrl: PropTypes.string.isRequired,
  connectGithubUrl: PropTypes.string.isRequired,
  emails: PropTypes.array,
  options: PropTypes.object,
  changed: PropTypes.bool,
  editingEmailIndex: PropTypes.number,
  sendNotificationChange: PropTypes.func.isRequired,
  nativeNotificationChange: PropTypes.func.isRequired,
  popupNotificationChange: PropTypes.func.isRequired,
  discardChanges: PropTypes.func.isRequired,
  saveUser: PropTypes.func.isRequired,
  isFetching: PropTypes.bool,
};

export default Settings;
