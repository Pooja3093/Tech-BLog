const withAuth = (req, res, next) => {
  if (req.session.loggedIn !== true) {
    res.render('login');
  } else {
  next();
  }
  };

module.exports = withAuth;
