var mongoose = require('mongoose');

//             Model (camel)                    Table (snake)              Schema (snake)
module.exports.UserProfile    = mongoose.model('user-profile',    require('./model/user-profile-model.js'));
module.exports.UserCredential = mongoose.model('user_credential', require('./model/user-credential-model.js'));

