import constants from '../constants';
import User from '../model/user';
import { providerHandler, providerCallbackHandler } from '../lib/passport';
import { isAuthenticated } from '../middleware';
import jwt from 'jsonwebtoken';
import { auth } from '../../config';
import * as UserController from '../controller/user';

// FIXME cleanup and/or better protection
const hackFilterByIp = false;

export default router => {
  router.get('/auth/facebook',
    isAuthenticated(),
    providerHandler('facebook'));
  router.get('/auth/facebook/callback',
    providerCallbackHandler('facebook'));
  router.get('/auth/github',
    isAuthenticated(),
    providerHandler('github'));
  router.get('/auth/github/callback',
    providerCallbackHandler('github'));
  router.post('/auth/register', async ctx => {
    // register anonym users and generate tokens for them
    const ip = ctx.ip;
    let user;
    if (hackFilterByIp && (user = await User.findOne({ ip }))) {
      ctx.throw(403, constants.forbidden);
    }
    user = await User.create({ ip });
    // only claim is id
    const token = jwt.sign({ id: user.id }, auth.jwtSecret);
    await user.update({ token });
    ctx.body = { token };
  });
  router.get('/auth/email/verify', isAuthenticated(true), async ctx => {
    await UserController.verifyEmailForUserViaMail(ctx.user, ctx.email);
    // ctx.body = { message: 'email verified' };
    ctx.redirect('/settings');
  });
  router.get('/auth/email/unsubscribe', isAuthenticated(true), async ctx => {
    await UserController.unsubscribeEmailForUserViaMail(ctx.user, ctx.email);
    ctx.body = { message: 'unsubscribe successful' };
    ctx.redirect('/settings');
  });
};
