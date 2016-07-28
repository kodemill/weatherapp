import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AppBar from '../component/appbar';
import { openNotificationPopup } from '../redux/module/component/notification';

const handleActiveTab = tab =>
  browserHistory.push(tab.props['data-route']);

const mapStateToProps = state => ({
  fetching: state.searchCity.fetching
    || state.auth.fetching
    || state.createCriteria.fetching
    || state.criteria.fetching
    || state.report.fetching,
  name: state.auth.name,
  notifications: state.criteria.notifications,
  handleActiveTab,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ openNotificationPopup }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(AppBar);
