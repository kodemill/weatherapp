'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.providerHandler = exports.providerCallbackHandler = undefined;

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _koaPassport = require('koa-passport');

var _koaPassport2 = _interopRequireDefault(_koaPassport);

var _config = require('../../config');

var _passportGithub = require('passport-github');

var _passportFacebook = require('passport-facebook');

var _passportJwt = require('passport-jwt');

var _user = require('../model/user');

var _user2 = _interopRequireDefault(_user);

var _user3 = require('../controller/user');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const fetchEmailFromGithub = (() => {
  var _ref = _asyncToGenerator(function* (accessToken) {
    try {
      const response = yield (0, _nodeFetch2.default)('https://api.github.com/user/emails', {
        headers: {
          Authorization: `token ${ accessToken }`
        }
      });
      if (response.ok) {
        // [ { email: '', primary: true, verified: true } ]
        return (yield response.json()).filter(function (githubEmail) {
          return githubEmail.verified;
        }).map(function (githubEmail) {
          return githubEmail.email;
        });
      }
    } catch (err) {
      console.log(`getEmail@github err: ${ err.toString() } `);
    }
  });

  return function fetchEmailFromGithub(_x) {
    return _ref.apply(this, arguments);
  };
})();

const verifyCallback = (() => {
  var _ref2 = _asyncToGenerator(function* (social, req, accessToken, _, profile, done) {
    try {
      const socialIdKey = `${ social }Id`;
      const userId = req.query.state;
      if (userId) {
        // previous account
        const user = yield _user2.default.findById(userId);
        let emails;
        if (social === 'github') {
          emails = yield fetchEmailFromGithub(accessToken);
        } else if (profile.emails && profile.emails.length > 0) {
          emails = profile.emails.map(function (passportEmail) {
            return passportEmail.value;
          });
        }
        // save email
        if (emails) {
          emails.forEach(function (email) {
            return user.addEmail({
              address: email,
              trusted: true
            });
          });
        }
        // save username
        user.name = profile.displayName;
        // connect
        user[socialIdKey] = profile.id;
        // check if theres an existing account for this social
        const currentUser = yield _user2.default.findOne({ [socialIdKey]: profile.id });
        if (currentUser) {
          // keep the existing drop the previous (anonymus)
          (0, _user3.mergeAccounts)(currentUser, user);
          return done(null, currentUser);
        }
        yield user.save();
        return done(null, user);
      }
      return done(null, false);
    } catch (err) {
      return done(err);
    }
  });

  return function verifyCallback(_x2, _x3, _x4, _x5, _x6, _x7) {
    return _ref2.apply(this, arguments);
  };
})();

const providerCallbackHandler = strategy => (() => {
  var _ref3 = _asyncToGenerator(function* (ctx, next) {
    yield _koaPassport2.default.authenticate(strategy, function (user) {
      if (user) {
        ctx.redirect(`/user/${ user.token }`);
      } else {
        ctx.redirect('/');
      }
    })(ctx, next);
  });

  return function (_x8, _x9) {
    return _ref3.apply(this, arguments);
  };
})();

const providerHandler = strategy => (ctx, next) => _koaPassport2.default.authenticate(strategy, {
  session: false,
  scope: strategy === 'facebook' ? ['email'] : ['user:email'],
  state: ctx.user.id })(ctx, next);

_koaPassport2.default.use(new _passportGithub.Strategy({
  clientID: _config.auth.githubAppId,
  clientSecret: _config.auth.githubAppSecret,
  callbackURL: _config.auth.githubLoginCallback,
  passReqToCallback: true
}, verifyCallback.bind(null, 'github')));

_koaPassport2.default.use(new _passportFacebook.Strategy({
  clientID: _config.auth.facebookAppId,
  clientSecret: _config.auth.facebookAppSecret,
  callbackURL: _config.auth.facebookLoginCallback,
  profileFields: ['id', 'emails', 'name'],
  passReqToCallback: true
}, verifyCallback.bind(null, 'facebook')));

_koaPassport2.default.use(new _passportJwt.Strategy({
  secretOrKey: _config.auth.jwtSecret,
  jwtFromRequest: _passportJwt.ExtractJwt.fromExtractors([_passportJwt.ExtractJwt.fromAuthHeader(), _passportJwt.ExtractJwt.fromUrlQueryParameter('jwt')])
}, (payload, done) => _user2.default.findById(payload.id, done)));

_koaPassport2.default.use('email-jwt', new _passportJwt.Strategy({
  secretOrKey: _config.auth.jwtSecret,
  jwtFromRequest: _passportJwt.ExtractJwt.fromExtractors([_passportJwt.ExtractJwt.fromUrlQueryParameter('jwt')])
}, (() => {
  var _ref4 = _asyncToGenerator(function* (payload, done) {
    try {
      const user = yield _user2.default.findOne({
        _id: payload.id,
        'emails.address': payload.email
      });
      if (!user) {
        return done(null, false);
      }
      user.email = payload.email;
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  });

  return function (_x10, _x11) {
    return _ref4.apply(this, arguments);
  };
})()));

exports.default = _koaPassport2.default;
exports.providerCallbackHandler = providerCallbackHandler;
exports.providerHandler = providerHandler;
//# sourceMappingURL=passport.js.map