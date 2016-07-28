import '../../style/component/app-bar.scss';
import React, { PropTypes } from 'react';
import MAppBar from 'material-ui/AppBar';
import { ToolbarTitle } from 'material-ui/Toolbar';
import { Tabs, Tab } from 'material-ui/Tabs';
import Paper from 'material-ui/Paper';
import CreateIcon from 'material-ui/svg-icons/content/create';
import ListIcon from 'material-ui/svg-icons/action/list';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import NotificationBadge from './notification-badge';
import LinearProgress from 'material-ui/LinearProgress';

const AppBar = props => {
  const progressStyle = {
    backgroundColor: '#607D8B',
    visibility: props.fetching ? 'visible' : 'hidden',
  };
  const username = props.name || 'Anonymus';
  let selectedTab = props.location.pathname;
  if (selectedTab === '/') {
    selectedTab = '/create';
  }
  return (
    <div className="appBar">
      <Paper zDepth={1}>
        <div className="progressWrapper">
          <LinearProgress
            color="#FFC107"
            mode="indeterminate"
            style={progressStyle}
            className="progress"
          />
        </div>
        <MAppBar
          title="Weather App"
          showMenuIconButton={false}
          zDepth={0}
        >
          <ToolbarTitle
            className="greeting"
            text={`Hello, ${username}`}
          />
          <NotificationBadge
            notifications={props.notifications}
            openNotificationPopup={props.openNotificationPopup}
          />
        </MAppBar>
        <Tabs className="tabs" value={selectedTab}>
          <Tab
            onActive={props.handleActiveTab}
            className="tab"
            label="create"
            icon={<CreateIcon />}
            data-route="/create"
            value="/create"
          />
          <Tab
            onActive={props.handleActiveTab}
            className="tab"
            icon={<ListIcon />}
            label="list"
            data-route="/list"
            value="/list"
          />
          <Tab
            onActive={props.handleActiveTab}
            className="tab"
            icon={<SettingsIcon />}
            label="settings"
            data-route="/settings"
            value="/settings"
          />
        </Tabs>
      </Paper>
    </div>
  );
};

AppBar.propTypes = {
  location: PropTypes.object.isRequired,
  fetching: PropTypes.bool.isRequired,
  name: PropTypes.string,
  notifications: PropTypes.array,
  handleActiveTab: PropTypes.func.isRequired,
  openNotificationPopup: PropTypes.func.isRequired,
};

export default AppBar;
