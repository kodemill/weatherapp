import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: String,
  emails: [{
    address: String,
    trusted: Boolean,
    sendNotification: Boolean,
  }],
  ip: String,
  options: {
    notificateViaEmail: Boolean,
    notificateViaNative: Boolean,
    notificateViaPopup: {
      type: Boolean,
      default: true,
    },
  },
  token: {
    type: String,
    unique: true,
    sparse: true,
  },
  facebookId: {
    type: String,
    unique: true,
    sparse: true,
  },
  githubId: {
    type: String,
    unique: true,
    sparse: true,
  },
});

UserSchema.methods.mergeOptions = function (options) {
  this.options = this.options || {};
  this.options.notificateViaEmail =
    this.options.notificateViaEmail || options.notificateViaEmail;
  this.options.notificateViaNative =
    this.options.notificateViaNative || options.notificateViaNative;
  this.options.notificateViaPopup =
    this.options.notificateViaPopup || options.notificateViaPopup;
};

UserSchema.methods.findEmail = function (email) {
  let address = email;
  if (typeof email === 'object') {
    address = email.address;
  }
  return this.emails.find(existingEmail => existingEmail.address === address);
};

UserSchema.methods.addEmail = function (address, trusted, sendNotification) {
  if (typeof address === 'object') {
    /* eslint-disable */
    trusted = address.trusted;
    sendNotification = address.sendNotification;
    address = address.address;
    /* eslint-enable */
  }
  if (this.emails) {
    const existingAddress = this.emails.find(email => email.address === address);
    if (existingAddress) {
      existingAddress.trusted = existingAddress.trusted || trusted;
      existingAddress.sendNotification = existingAddress.sendNotification || sendNotification;
      return;
    }
  } else {
    this.emails = [];
  }
  this.emails.push({ address, trusted, sendNotification });
};

UserSchema.methods.getNotificationEmails = function () {
  if (this.options && this.options.notificateViaEmail && this.emails) {
    return this.emails.filter(email => email.trusted && email.sendNotification);
  }
  return [];
};

UserSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    delete ret.ip;
    delete ret.token;
  },
});

export default mongoose.model('User', UserSchema);
