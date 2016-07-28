import User from '../model/user';
import * as UserController from '../controller/user';

export default router => {
  router.get('/user/whoami', async ctx => {
    ctx.body = await User.findById(ctx.user.id);
  });
  router.post('/user', async ctx => {
    ctx.body = await UserController.saveUserForUser(ctx.user, ctx.request.body);
  });
};
