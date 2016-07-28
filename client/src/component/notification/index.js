import '../../style/component/criteria-list.scss';
import React, { PropTypes } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import NotificationListItem from './notification-list-item';

const NotificationPopup = props => {
  const acknoweledgeAll = () => {
    props.closeNotificationPopup();
    props.acknoweledgeNotification(props.notifications);
  };
  const actions = [
    <FlatButton
      label="cancel"
      primary
      onTouchTap={props.closeNotificationPopup}
    />,
    <FlatButton
      label="dismiss all"
      secondary
      onTouchTap={acknoweledgeAll}
    />,
  ];
  const children = props.notifications.map((criteria, idx) =>
    <NotificationListItem
      key={idx}
      criteria={criteria}
      acknoweledgeNotification={props.acknoweledgeNotification}
    />
  );
  return (
    <Dialog
      className="criteriaListWrapper"
      title="Notifications"
      open={props.popupOpen && props.notifications.length > 0}
      onRequestClose={props.closeNotificationPopup}
      actions={actions}
      modal={false}
      autoScrollBodyContent
      style={{ zIndex: 6666 }}
      contentStyle={{ padding: 0 }}
      bodyStyle={{ padding: 0 }}
    >
      <div className="criteriaList">
        {children}
      </div>
    </Dialog>
  );
};

NotificationPopup.propTypes = {
  popupOpen: PropTypes.bool.isRequired,
  acknoweledgeNotification: PropTypes.func.isRequired,
  notifications: PropTypes.array.isRequired,
  closeNotificationPopup: PropTypes.func.isRequired,
};

export default NotificationPopup;
