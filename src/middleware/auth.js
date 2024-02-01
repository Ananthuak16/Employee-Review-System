// middleware/auth.js

// Importing passport for authentication
import passport from 'passport';

// Middleware to authenticate user credentials using passport
export const authenticateUser = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/employee-dashboard', // Redirect to this route on successful authentication (adjust based on your setup)
    failureRedirect: '/auth/signin',         // Redirect to sign-in page on authentication failure
    failureFlash: true,                       // Enable flash messages for authentication failures
  })(req, res, next);
};

// Middleware to check if the user is authenticated
export const checkAuthentication = (req, res, next) => {
  // If the user is authenticated, proceed to the next middleware or route handler
  if (req.isAuthenticated()) {
    return next();
  }

  // If not authenticated, redirect to the sign-in page
  return res.redirect('/auth/signin');
};
