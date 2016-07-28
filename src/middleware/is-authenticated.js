import { unauthorized } from '../constants';
import passport from '../lib/passport';

export default (email) => {
  const strategy = email ? 'email-jwt' : 'jwt';
  return async (ctx, next) => {
    await passport.authenticate(strategy, user => {
      if (user) {
        ctx.user = user;
        if (email) {
          ctx.email = user.email;
        }
      }
    })(ctx, next);
    if (ctx.user) {
      return next();
    }
    ctx.throw(unauthorized, 401);
  };
};
