'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _passport = require('./lib/passport');

var _passport2 = _interopRequireDefault(_passport);

var _koaStatic = require('koa-static');

var _koaStatic2 = _interopRequireDefault(_koaStatic);

var _koaMount = require('koa-mount');

var _koaMount2 = _interopRequireDefault(_koaMount);

var _koaCompress = require('koa-compress');

var _koaCompress2 = _interopRequireDefault(_koaCompress);

var _koaBodyparser = require('koa-bodyparser');

var _koaBodyparser2 = _interopRequireDefault(_koaBodyparser);

var _kcors = require('kcors');

var _kcors2 = _interopRequireDefault(_kcors);

var _route = require('./route');

var _route2 = _interopRequireDefault(_route);

var _koaLogger = require('koa-logger');

var _koaLogger2 = _interopRequireDefault(_koaLogger);

var _middleware = require('./middleware');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = new _koa2.default();

// error handling and dev logger
app.use((0, _middleware.handleError)());
app.use((0, _koaLogger2.default)());

// cors headers
app.use((0, _kcors2.default)());

// I/O middlewares
app.use((0, _koaCompress2.default)());
app.use((0, _koaBodyparser2.default)());

// hack url for our SPA
app.use((0, _middleware.historySupport)());

// auth w/ passport
app.use(_passport2.default.initialize());

// serve authenticated index
app.use((0, _middleware.serveIndex)(_config2.default.app.publicFolder));
// serve pub files
// console.log(`serving /${config.app.publicPath} from directory ${config.app.publicFolder}`)
app.use((0, _koaMount2.default)(`${ _config2.default.app.publicPath }`, (0, _koaStatic2.default)(_config2.default.app.publicFolder)));

// routes
app.use((0, _route2.default)());

exports.default = app;
//# sourceMappingURL=app.js.map