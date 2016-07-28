import fs from 'fs';

const getInjectedScript = token => `<script>window.__token__='${token}';</script>`;
const endingBodyTag = '</body>';
const checkUrlAndMethod = ({ url, method }) =>
  method.match(/GET/i) && (url === '/' || url === '/index.html');

export default publicFolder => {
  const splitIndexHtml = fs.readFileSync(`${publicFolder}/index.html`, 'utf8').split(endingBodyTag);
  const indexHtmlTemplate = token => `${splitIndexHtml[0]}${getInjectedScript(token)}
    ${endingBodyTag}${splitIndexHtml[1]}`; // newline between tags is ok

  return (ctx, next) => {
    if (checkUrlAndMethod(ctx)) {
      const splitOriginalUrl = ctx.originalUrl.split('/');
      if (splitOriginalUrl.length === 3 && splitOriginalUrl[1] === 'user') {
        console.log('serveIndex - authenticated index served');
        ctx.body = indexHtmlTemplate(splitOriginalUrl[2]);
      } else {
        return next();
      }
    } else {
      return next();
    }
  };
};
