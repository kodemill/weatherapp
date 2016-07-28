import '../style/app.scss';
import '../style/vendor/weather-icons.css';
import '../style/vendor/fontello-embedded.css';
import '../style/component/layout.scss';
import React, { PropTypes } from 'react';
import AppBar from './appbar';
import ErrorSnackbar from './error-snackbar';
import Snackbar from './snackbar';
import OkCancelDialog from './ok-cancel-dialog';
import Notification from './notification';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { blueGrey500, blueGrey700, blueGrey100, amber500,
  grey100, grey500, grey900, grey600, grey400 } from 'material-ui/styles/colors';

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: blueGrey500,
    primary2Color: blueGrey700,
    primary3Color: blueGrey100,
    accent1Color: amber500,
    accent2Color: grey100,
    accent3Color: grey500,
    textColor: grey900,
    secondaryTextColor: grey600,
    borderColor: grey400,
  },
});

const Layout = props =>
  <MuiThemeProvider muiTheme={muiTheme}>
    <div className="layout">
      <AppBar location={props.location} />
      <div className="content">
        {props.children}
      </div>
      <Notification />
      <ErrorSnackbar />
      <Snackbar />
      <OkCancelDialog />
    </div>
  </MuiThemeProvider>;

Layout.propTypes = {
  children: PropTypes.element.isRequired,
  location: PropTypes.object.isRequired,
};

export default Layout;
