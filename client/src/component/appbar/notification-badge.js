import React, { PropTypes } from 'react';
import Badge from 'material-ui/Badge';
import IconButton from 'material-ui/IconButton';
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';

const NotificationBadge = props => {
  const notificationCount = props.notifications.length;
  return (
    <div>
      <Badge
        badgeContent={notificationCount || ''}
        primary={!!notificationCount}
        secondary={!notificationCount}
        style={{ padding: '6px 1px 0 0' }}
        badgeStyle={{
          top: 12,
          right: 0,
          width: 18,
          height: 18,
        }}
      >
        <IconButton
          disabled={!notificationCount}
          onClick={props.openNotificationPopup}
        >
          <NotificationsIcon
            color="#CFD8DC"
          />
        </IconButton>
      </Badge>
    </div>
  );
};

NotificationBadge.propTypes = {
  notifications: PropTypes.array.isRequired,
  openNotificationPopup: PropTypes.func.isRequired,
};


export default NotificationBadge;
