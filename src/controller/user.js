import { WeatherCriteria } from '../model';
import _ from 'lodash';
import { sendVerificationEmail } from '../lib/send-email';

const mergeAccounts = async (into, from) => {
  // merge criteria
  const criteria = await WeatherCriteria.find({ user: from });
  await Promise.all(criteria.map(criterion => {
    criterion.user = into;
    return criterion.save();
  }));
  // merge emails
  if (from.emails) {
    from.emails.forEach(email => into.addEmail(email));
  }
  // merge options
  if (into.options && from.options) {
    into.mergeOptions(from.options);
  }
  return await from.remove();
};

// trust everything except 'trustedness' of emails
const saveUserForUser = async (user, changes) => {
  // emails, options, name
  if (changes.emails) {
    const toRemove = _.differenceBy(user.emails, changes.emails, 'address');
    const toAdd = _.differenceBy(changes.emails, user.emails, 'address');
    const notificationChange = _.differenceBy(changes.emails, toAdd, 'address');
    // remove
    toRemove.forEach(email => email.remove());
    // add new
    toAdd.forEach(email => user.addEmail(email));
    await Promise.all(toAdd.map(email => sendVerificationEmail(user, email)));
    // notification changes
    notificationChange.forEach(email => {
      user.findEmail(email).sendNotification = email.sendNotification;
    });
  }
  if (changes.name) {
    user.name = changes.name;
  }
  if (changes.options) {
    user.options = changes.options;
  }
  return await user.save();
};

const verifyEmailForUserViaMail = async (user, address) => {
  const foundEmail = user.emails.find(email => email.address === address);
  if (foundEmail) {
    foundEmail.trusted = true;
    await user.save();
  }
};

const unsubscribeEmailForUserViaMail = async (user, address) => {
  const foundEmail = user.emails.find(email => email.address === address);
  if (foundEmail) {
    foundEmail.sendNotification = false;
    await user.save();
  }
};

export { mergeAccounts, saveUserForUser,
  verifyEmailForUserViaMail, unsubscribeEmailForUserViaMail };
