import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import NotificationPopup from '../component/notification';
import * as notificationActionCreators from '../redux/module/component/notification';
import { acknoweledgeNotification } from '../redux/module/criteria';
import _ from 'lodash';

const mapStateToProps = state => {
  const { notificateViaNative, notificateViaPopup } = state.settings.options;
  return {
    notifications: state.criteria.notifications,
    popupOpen: state.notification.popupOpen,
    notificateViaNative,
    notificateViaPopup,
  };
};

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
    notificateViaPopup: PropTypes.bool,
    notificateViaNative: PropTypes.bool,
  }

  componentWillReceiveProps(nextProps) {
    const diff = _.differenceBy(nextProps.notifications, this.props.notifications, 'id');
    if (diff.length > 0) {
      if (nextProps.notificateViaPopup) {
        nextProps.openNotificationPopup();
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
