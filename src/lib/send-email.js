import nodemailer from 'nodemailer';
import { email as emailConfig, app, auth } from '../../config';
import jwt from 'jsonwebtoken';

const generateTokenForEmail = (id, email) => jwt.sign({ id, email }, auth.jwtSecret);

const htmlEmailTemplate = body =>
`<!DOCTYPE html>
<html lang="en-US">
 <head>
     <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
 </head>
 <body>
     ${body}
 </body>
</html>`;

const apiUrl = `${app.url}/api`;
const notificationEmailTemplate = (token, criteria, report) =>
/* eslint-disable */
`Hello ${criteria.user.name},
<br><br>
The temperature is ${criteria.predicate} than ${criteria.temperature}℃ in ${criteria.city.name} (${criteria.city.country}),
our latest report was ${report.temperature}℃ for that location.<br>
To acknoweledge that <a href="${apiUrl}/criteria/acknoweledge/${criteria.id}?jwt=${criteria.user.token}">click here</a>.
<br><br>
If you don't want to receive more emails <a href="${apiUrl}/auth/email/unsubscribe?jwt=${token}">unsubscribe here</a>.`;
/* eslint-enable */

const verificationEmailTemplate = token =>
/* eslint-disable */
`Hello there,
<br>
If you know why you have received this email <a href="${apiUrl}/auth/email/verify?jwt=${token}">click here</a>
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
  transporter = nodemailer.createTransport(`smtps://${emailConfig.account}:${emailConfig.password}@smtp.gmail.com`);
};

const defaultMailOptions = {
  from: 'WeatherApp noreply',
  subject: 'WeatherApp notification',
};

const sendMail = mailOptions => new Promise((resolve, reject) => {
  if (!transporter) {
    createTransporter();
  }
  const options = {
    ...defaultMailOptions,
    ...mailOptions,
  };
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
  to: email.address,
});

const sendNotificationEmail = (criteria, report) => {
  const emails = criteria.user.getNotificationEmails().map(email => email.address);
  const tokens = emails.map(email => generateTokenForEmail(criteria.user.id, email));
  return Promise.all(emails.map((email, idx) => sendMail({
    html: htmlEmailTemplate(notificationEmailTemplate(tokens[idx], criteria, report)),
    to: email,
  })));
};

export { sendVerificationEmail, sendNotificationEmail };
export default sendMail;
