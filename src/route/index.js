import Router from 'koa-router';
import compose from 'koa-compose';
import auth from './auth';
import city from './city';
import user from './user';
import weather from './weather';
import config from '../../config';
import criteria from './criteria';
import { isAuthenticated } from '../middleware';

const router = new Router({
  prefix: `/${config.app.apiPath}`,
});
auth(router);

const authenticatedRouter = new Router({
  prefix: `/${config.app.apiPath}`,
});
authenticatedRouter.use(isAuthenticated());
city(authenticatedRouter);
weather(authenticatedRouter);
criteria(authenticatedRouter);
user(authenticatedRouter);

export default () => compose([
  router.routes(),
  router.allowedMethods(),
  authenticatedRouter.routes(),
  authenticatedRouter.allowedMethods(),
]);
