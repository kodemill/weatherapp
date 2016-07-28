import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import NotificationPopup from '../component/notification';
import * as notificationActionCreators from '../redux/module/component/notification';
import { acknoweledgeNotification } from '../redux/module/criteria';
import _ from 'lodash';

const mapStateToProps = state => ({
  notifications: state.criteria.notifications,
  popupOpen: state.notification.popupOpen,
  notificateViaNative: state.settings.notificateViaNative,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  ...notificationActionCreators,
  acknoweledgeNotification,
}, dispatch);

@connect(mapStateToProps, mapDispatchToProps)
export default class NotificationController extends Component {

  static propTypes = {
    notifications: PropTypes.array.isRequired,
    openNotificationPopup: PropTypes.func.isRequired,
    displayNativeNotification: PropTypes.func.isRequired,
    requestNativeNotificationPermission: PropTypes.func.isRequired,
  }

  componentWillReceiveProps(nextProps) {
    const diff = _.differenceBy(nextProps.notifications, this.props.notifications);
    if (diff.length > 0) {
      if (nextProps.notificateViaPopup) {
        this.props.openNotificationPopup();
      }
      if (nextProps.notificateViaNative) {
        diff.forEach(criteria => this.displayNotification(criteria));
      }
    }
  }

  displayNotification(notification) {
    this.props.displayNativeNotification(`The temperature in ${notification.city.name} (${notification.city.country}) has reached ${notification.temperature}℃.`); //eslint-disable-line
  }

  render() {
    return <NotificationPopup {...this.props} />;
  }
}
