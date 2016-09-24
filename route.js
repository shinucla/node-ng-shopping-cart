
/**
 * Register controllers here.
 */

module.exports = { on: function(app) {

  app.requireLogin = function(req, res, next) {
    var token = req.headers.jwt;

    if (!!token) {
      Domain.User.verifyToken(token, function(err, user) {
        if (!err) {
          req.user = user;
          next();

        } else {
          res.json({ status: 200,
                     error: { code: 'NOT_AUTHORIZED', text: 'not authorized' }
                   });
        }
      });

    } else {
      res.json({ status: 200,
                 error: { code: 'NOT_AUTHORIZED', text: 'not authorized' }
               });
    }
  };

  require('./controller/HomeController')(app);
  require('./controller/UserController')(app);
}};

/*
 * req.headers = request's header
 * req.body = request's json payload
 * req.params = request's url parameters
 */
