import config from '../config';
import Koa from 'koa';
import passport from './lib/passport';
import serve from 'koa-static';
import mount from 'koa-mount';
import compress from 'koa-compress';
import bodyParser from 'koa-bodyparser';
import cors from 'kcors';
import routes from './route';
import logger from 'koa-logger';
import { handleError, historySupport, serveIndex } from './middleware';

const app = new Koa();

// error handling and dev logger
app.use(handleError());
app.use(logger());

// cors headers
app.use(cors());

// I/O middlewares
app.use(compress());
app.use(bodyParser());

// hack url for our SPA
app.use(historySupport());

// auth w/ passport
app.use(passport.initialize());

// serve authenticated index
app.use(serveIndex(config.app.publicFolder));
// serve pub files
// console.log(`serving /${config.app.publicPath} from directory ${config.app.publicFolder}`)
app.use(mount(`${config.app.publicPath}`, serve(config.app.publicFolder)));

// routes
app.use(routes());

export default app;
