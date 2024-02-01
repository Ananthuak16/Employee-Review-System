// passport-config.js

import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../src/features/user/model/Userschema.js';

// Local Strategy Configuration
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email', // Field for email in the request
      passReqToCallback: true, // Pass request object to the callback
    },
    async (req, email, password, done) => {
      try {
        const user = await User.findOne({ email });

        if (!user || !(await user.isValidatedPassword(password))) {
          req.flash('error', 'Invalid email or password');
          return done(null, false);
        }

        return done(null, user);
      } catch (err) {
        req.flash('error', err.message);
        return done(err);
      }
    }
  )
);

// Serialization: User to Session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialization: Session to User
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    return done(null, user);
  } catch (err) {
    console.log('Error in finding user ---> Passport:', err);
    return done(err);
  }
});

// Custom Middleware Functions
passport.checkAuthentication = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.redirect('/');
};

passport.setAuthenticatedUser = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  }
  next();
};

export default passport;
