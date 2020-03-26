module.exports = {
    ensureAuthenticated: function(req, res, next) {
      if (req.isAuthenticated()) {
        return next();
      }
      req.flash('err_msg', 'Please log in to view that resource');
      // req.flash('warning_msg', 'Warnig message test');
      res.redirect('/users/login');
    },
    forwardAuthenticated: function(req, res, next) {
      if (req.isAuthenticated()) {
        res.redirect('/dashboard'); 
      }   
      return next();  
    }
  };
  