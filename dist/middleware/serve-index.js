'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getInjectedScript = token => `<script>window.__token__='${ token }';</script>`;
const endingBodyTag = '</body>';
const checkUrlAndMethod = ({ url, method }) => method.match(/GET/i) && (url === '/' || url === '/index.html');

exports.default = publicFolder => {
  const splitIndexHtml = _fs2.default.readFileSync(`${ publicFolder }/index.html`, 'utf8').split(endingBodyTag);
  const indexHtmlTemplate = token => `${ splitIndexHtml[0] }${ getInjectedScript(token) }
    ${ endingBodyTag }${ splitIndexHtml[1] }`; // newline between tags is ok

  return (ctx, next) => {
    if (checkUrlAndMethod(ctx)) {
      const splitOriginalUrl = ctx.originalUrl.split('/');
      if (splitOriginalUrl.length === 3 && splitOriginalUrl[1] === 'user') {
        console.log('serveIndex - authenticated index served');
        ctx.url = '/settings';
        ctx.body = indexHtmlTemplate(splitOriginalUrl[2]);
      } else {
        return next();
      }
    } else {
      return next();
    }
  };
};
//# sourceMappingURL=serve-index.js.map