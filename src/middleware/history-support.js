// const fileExtensionRegex = /.(html|js|css|eot|svg|ttf|woff|woff2)$/;
import config from '../../config';

const fileRequest = /\.\w{1,5}$/;
const apiRequest = new RegExp(`^\/${config.app.apiPath}/`);

export default () => async (ctx, next) => {
  if (ctx.method.match(/GET/i) && !fileRequest.test(ctx.url) && !apiRequest.test(ctx.url)) {
    console.log(`historySupport - url set from ${ctx.url} to /index.html`);
    ctx.url = '/index.html';
  }
  await next();
};
