module.exports = function(app) {

  /* Login */
  app
    .route('/user/api/login')
    .post(function(req, res) {
      var jsonUser  = { 'email': req.body.email,
                        'password': req.body.password };
      Domain.UserProfile.loginUser(jsonUser, function(errMsg, jwt) {
        res.json({ status : 200,
                   result: { jwt: jwt, errMsg: errMsg }
                 });
      });
    });

  /* Signup */
  app
    .route('/user/api/signup')
    .post(function(req, res) {
      var jsonUser  = { 'firstname': req.body.firstname,
                        'lastname': req.body.lastname,
                        'email': req.body.email,
                        'password': req.body.password };
      Domain.UserProfile.signupUser(jsonUser, function(errMsg, jwt) {
        res.json({ status : 200,
                   result: { jwt: jwt, errMsg: errMsg }
                 });
      });
    });
};
