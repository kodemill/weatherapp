'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendNotificationEmail = exports.sendVerificationEmail = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _nodemailer = require('nodemailer');

var _nodemailer2 = _interopRequireDefault(_nodemailer);

var _config = require('../../config');

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const generateTokenForEmail = (id, email) => _jsonwebtoken2.default.sign({ id, email }, _config.auth.jwtSecret);

const htmlEmailTemplate = body => `<!DOCTYPE html>
<html lang="en-US">
 <head>
     <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
 </head>
 <body>
     ${ body }
 </body>
</html>`;

const apiUrl = `${ _config.app.url }/api`;
const notificationEmailTemplate = (token, criteria, report) =>
/* eslint-disable */
`Hello ${ criteria.user.name },
<br><br>
The temperature is ${ criteria.predicate } than ${ criteria.temperature }℃ in ${ criteria.city.name } (${ criteria.city.country }),
our latest report was ${ report.temperature }℃ for that location.<br>
To acknoweledge that <a href="${ apiUrl }/criteria/acknoweledge/${ criteria.id }?jwt=${ criteria.user.token }">click here</a>.
<br><br>
If you don't want to receive more emails <a href="${ apiUrl }/auth/email/unsubscribe?jwt=${ token }">unsubscribe here</a>.`;
/* eslint-enable */

const verificationEmailTemplate = token =>
/* eslint-disable */
`Hello there,
<br>
If you know why you have received this email <a href="${ apiUrl }/auth/email/verify?jwt=${ token }">click here</a>
 to confirm that the address is yours.
<br>
Otherwise, just ignore it.
<br>
<br>
Sincerely,
a concerned spammer`;
/* eslint-enable */

let transporter;
const createTransporter = () => {
  transporter = _nodemailer2.default.createTransport(`smtps://${ _config.email.account }:${ _config.email.password }@smtp.gmail.com`);
};

const defaultMailOptions = {
  from: 'WeatherApp noreply',
  subject: 'WeatherApp notification'
};

const sendMail = mailOptions => new Promise((resolve, reject) => {
  if (!transporter) {
    createTransporter();
  }
  const options = _extends({}, defaultMailOptions, mailOptions);
  transporter.sendMail(options, (error, info) => {
    if (error) {
      reject(error);
    } else {
      resolve(info);
    }
  });
});

const sendVerificationEmail = (user, email) => sendMail({
  subject: 'WeatherApp email verification',
  html: verificationEmailTemplate(generateTokenForEmail(user.id, email.address)),
  to: email.address
});

const sendNotificationEmail = (criteria, report) => {
  const emails = criteria.user.getNotificationEmails().map(email => email.address);
  const tokens = emails.map(email => generateTokenForEmail(criteria.user.id, email));
  return Promise.all(emails.map((email, idx) => sendMail({
    html: htmlEmailTemplate(notificationEmailTemplate(tokens[idx], criteria, report)),
    to: email
  })));
};

exports.sendVerificationEmail = sendVerificationEmail;
exports.sendNotificationEmail = sendNotificationEmail;
exports.default = sendMail;
//# sourceMappingURL=send-email.js.map