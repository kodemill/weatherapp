'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _koaCompose = require('koa-compose');

var _koaCompose2 = _interopRequireDefault(_koaCompose);

var _auth = require('./auth');

var _auth2 = _interopRequireDefault(_auth);

var _city = require('./city');

var _city2 = _interopRequireDefault(_city);

var _user = require('./user');

var _user2 = _interopRequireDefault(_user);

var _weather = require('./weather');

var _weather2 = _interopRequireDefault(_weather);

var _config = require('../../config');

var _config2 = _interopRequireDefault(_config);

var _criteria = require('./criteria');

var _criteria2 = _interopRequireDefault(_criteria);

var _middleware = require('../middleware');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = new _koaRouter2.default({
  prefix: `/${ _config2.default.app.apiPath }`
});
(0, _auth2.default)(router);

const authenticatedRouter = new _koaRouter2.default({
  prefix: `/${ _config2.default.app.apiPath }`
});
authenticatedRouter.use((0, _middleware.isAuthenticated)());
(0, _city2.default)(authenticatedRouter);
(0, _weather2.default)(authenticatedRouter);
(0, _criteria2.default)(authenticatedRouter);
(0, _user2.default)(authenticatedRouter);

exports.default = () => (0, _koaCompose2.default)([router.routes(), router.allowedMethods(), authenticatedRouter.routes(), authenticatedRouter.allowedMethods()]);
//# sourceMappingURL=index.js.map