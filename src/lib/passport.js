import fetch from 'node-fetch';
import passport from 'koa-passport';
import { auth } from '../../config';
import { Strategy as GithubStrategy } from 'passport-github';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../model/user';
import { mergeAccounts } from '../controller/user';

const fetchEmailFromGithub = async accessToken => {
  try {
    const response = await fetch('https://api.github.com/user/emails', {
      headers: {
        Authorization: `token ${accessToken}`,
      },
    });
    if (response.ok) {
      // [ { email: '', primary: true, verified: true } ]
      return (await response.json())
        .filter(githubEmail => githubEmail.verified)
        .map(githubEmail => githubEmail.email);
    }
  } catch (err) {
    console.log(`getEmail@github err: ${err.toString()} `);
  }
};

const verifyCallback = async (social, req, accessToken, _, profile, done) => {
  try {
    const socialIdKey = `${social}Id`;
    const userId = req.query.state;
    if (userId) {
      // previous account
      const user = await User.findById(userId);
      let emails;
      if (social === 'github') {
        emails = await fetchEmailFromGithub(accessToken);
      } else if (profile.emails && profile.emails.length > 0) {
        emails = profile.emails.map(passportEmail => passportEmail.value);
      }
      // save email
      if (emails) {
        emails.forEach(email => user.addEmail({
          address: email,
          trusted: true,
        }));
      }
      // save username
      user.name = profile.displayName;
      // connect
      user[socialIdKey] = profile.id;
      // check if theres an existing account for this social
      const currentUser = await User.findOne({ [socialIdKey]: profile.id });
      if (currentUser) {
        // keep the existing drop the previous (anonymus)
        mergeAccounts(currentUser, user);
        return done(null, currentUser);
      }
      await user.save();
      return done(null, user);
    }
    return done(null, false);
  } catch (err) {
    return done(err);
  }
};

const providerCallbackHandler = strategy => async (ctx, next) => {
  await passport.authenticate(strategy, user => {
    if (user) {
      ctx.redirect(`/user/${user.token}`);
    } else {
      ctx.redirect('/');
    }
  })(ctx, next);
};

const providerHandler = strategy => (ctx, next) =>
  passport.authenticate(strategy, {
    session: false,
    scope: strategy === 'facebook' ? ['email'] : ['user:email'],
    state: ctx.user.id, // story userId
  })(ctx, next);

passport.use(new GithubStrategy({
  clientID: auth.githubAppId,
  clientSecret: auth.githubAppSecret,
  callbackURL: auth.githubLoginCallback,
  passReqToCallback: true,
}, verifyCallback.bind(null, 'github')));

passport.use(new FacebookStrategy({
  clientID: auth.facebookAppId,
  clientSecret: auth.facebookAppSecret,
  callbackURL: auth.facebookLoginCallback,
  profileFields: ['id', 'emails', 'name'],
  passReqToCallback: true,
}, verifyCallback.bind(null, 'facebook')));

passport.use(new JwtStrategy({
  secretOrKey: auth.jwtSecret,
  jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromAuthHeader(),
    ExtractJwt.fromUrlQueryParameter('jwt'),
  ]),
}, (payload, done) => User.findById(payload.id, done)));

passport.use('email-jwt', new JwtStrategy({
  secretOrKey: auth.jwtSecret,
  jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromUrlQueryParameter('jwt'),
  ]),
}, async (payload, done) => {
  try {
    const user = await User.findOne({
      _id: payload.id,
      'emails.address': payload.email,
    });
    if (!user) {
      return done(null, false);
    }
    user.email = payload.email;
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

export default passport;
export { providerCallbackHandler, providerHandler };
