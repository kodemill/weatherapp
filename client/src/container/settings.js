import endpoints from '../util/endpoints';
import { connect } from 'react-redux';
import Settings from '../component/settings';
import * as settingsActionCreators from '../redux/module/component/settings';
import { saveUser } from '../redux/module/auth';
import { bindActionCreators } from 'redux';
import { displayMessage } from '../redux/module/component/display-message';

const { connectGithub, connectFacebook } = endpoints;

const mapStateToProps = state => {
  const { facebookId, githubId, token } = state.auth;
  return {
    githubConnected: !!githubId,
    facebookConnected: !!facebookId,
    connectGithubUrl: connectGithub.url(token),
    connectFacebookUrl: connectFacebook.url(token),
    ...state.settings,
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  ...settingsActionCreators,
  saveUser,
  displayMessage,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
