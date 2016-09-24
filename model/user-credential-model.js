//
// User Credential Schema
//
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var jwt      = require('jsonwebtoken');
var secret   = '$2a$08$BcBWyjKCJgclgfsGwEF0W===';

var schema = mongoose.Schema({
  user_profile_id  : { type: mongoose.Schema.Types.ObjectId },
  password_hash    : String,
});

schema.methods.setUserProfileId = function(val) { this.user_profile_id = val; return this; }
schema.methods.setPasswordHash  = function(val) { this.password_hash = val; return this; }

/*
 * ================================================================
 * public member methods:
 *   schema.methods.func1 = function() {
 *     xxxx
 *   });
 *
 *   to use: New Domain.User().func1();
 * ================================================================
 * public static methods:
 *   schema.statics.func2 = function() {
 *     xxxx;
 *   });
 *
 *   to use: Domain.User.func2();
 * ================================================================
 */


schema.statics.verifyToken = function(jwtToken, callback) {
  jwt.verify(jwtToken, secret, callback); // callback(err, decodedUser)
};

schema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password_hash);
};

schema.statics.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

module.exports  = schema;
