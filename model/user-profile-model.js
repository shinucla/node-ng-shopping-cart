MAX_LOGIN_ATTEMPTS = 5;
var LOCKED_TIME = 1000 * 60 * 60 * 2;  // two hours

var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var jwt      = require('jsonwebtoken');
var secret   = '$2a$08$BcBWyjKCJgclgfsGwEF0W===';

var schema = mongoose.Schema({
  firstname      : String,
  lastname       : String,
  email          : String,

  status_bit     : Number,   // 0: delete 1: active 2: inactive
  role           : String,   // lower case: admin, canread, canwrite

  login_attempts : Number,
  locked_until   : Date,
});

schema.methods.setFirstName     = function(val) { this.firstname = val; return this; }
schema.methods.setLastName      = function(val) { this.lastname = val; return this; }
schema.methods.setEmail         = function(val) { this.email = val; return this; }
schema.methods.setStatusBit     = function(val) { this.status_bit = val; return this; }
schema.methods.setRole          = function(val) { this.role = val; return this; }
schema.methods.setLoginAttempts = function(val) { this.login_attempts = val; return this; }
schema.methods.setLockedUntil   = function(val) { this.locked_until = val; return this; }

schema.statics.signupUser = function(jsonUser, callback /* (Error, Domain.UserProfile entity) */ ) {
  var regex    = new RegExp(["^", jsonUser.email, "$"].join(""), "i");

  Domain
    .UserProfile
    .findOne({ 'email': regex }, function(err, user) {
      if (err) return callback(err.toString(), null);
      if (user) return callback('That email is already taken.', null);

      // if there is no user with that email
      var newUser = (new Domain.UserProfile()
                     .setEmail(jsonUser.email)
                     .setFirstName(jsonUser.firstname)
                     .setLastName(jsonUser.lastname)
                     .setLoginAttempts(1)
                     .setRole('memeber'));

      newUser.save(function() {
        var newUserCredential = (new Domain.UserCredential()
                                 .setUserProfileId(newUser._id)
                                 .setPasswordHash(Domain.UserCredential.generateHash(jsonUser.password)));

        newUserCredential.save(function(err2) {
          callback(err2, jwt.sign(newUser, secret));
        });
      });
    });
};

schema.statics.loginUser = function(jsonUser, callback /* (Error, Domain.UserProfile entity) */ ) {
  var regex = new RegExp(["^", jsonUser.email, "$"].join(""), "i");

  Domain.UserProfile.findOne({ 'email': regex }, function(err, user) {
    Domain.UserCredential.findOne({ 'user_profile_id': (user || { _id: null })._id }, function(err, credential) {

      if (err || !user) { // 1) User not found
        return callback('The email or password you entered is incorrect!!!.', null);

      } else if (Date.now() < user.locked_until) { // 2) User Found With Locked Account
        return callback('This account has been locked until ' + user.locked_until, null);

      } else if (credential.validPassword(jsonUser.password)) { // 3) User Found with Correct Password
        return (Domain // this return here is very important!!!
                .UserProfile
                .update({ _id: user._id }, { login_attempts : 1 }, function(err2, num) {
                  return callback(err2, jwt.sign(user, secret));
                }));

        // 4) User Found With Incorrect Password
        // 5) and MAX_LOGIN_ATTEMPTS <= Login Attempts
      } else if (MAX_LOGIN_ATTEMPTS <= user.login_attempts) {
        return (Domain
                .UserProfile
                .update({ _id: user._id }, { login_attempts: 1, locked_until: Date.now() + LOCKED_TIME }, function(err2, num) {
                  return callback('This account has been locked.', null);
                }));

      } else { // 6) Login Attempts < MAX_LOGIN_ATTEMPTS
        return (Domain
                .UserProfile
                .update({ _id: user._id }, { $inc: { login_attempts: 1 }}, function(err2, num) {
                  return callback('This account will be locked after ' +
                                  (MAX_LOGIN_ATTEMPTS - user.login_attempts) +
                                  ' more failed logins.', null);
                }));
      }
    });
  });
};

schema.statics.verifyToken = function(jwtToken, callback) {
  // callback(err, decodedUser)
  // jwt.verify(jwtToken, secret, callback);

  jwt.verify(jwtToken, secret, function(err, decodedUser) {
    if (err) {
      callback(err, null);

    } else {
      Domain.UserProfile.findOne({ _id : decodedUser._doc._id}, function(err, doc) {
        if (doc) {
          callback(null, doc);

        } else {
          callback('invalid user', null);
        }
      });
    }
  });
};

// return a promise:
// Domain.UserProfile
//   .forEmail('...')
//   .then(function(user) {
//         ...
//    });
schema.statics.forEmail = function(email) {
  return this.findOne({ email: email }).exec();
};

module.exports  = schema;
