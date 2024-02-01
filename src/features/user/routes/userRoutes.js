// routes/userRoutes.js
import express from 'express';
import * as userController from '../controller/userController.js'; // Adjust the path based on your actual file structure
import passport from 'passport';

const router = express.Router();

// Render sign-in form
router.get('/signin', userController.renderSignInForm);

// Handle sign-in logic
router.post('/signin', passport.authenticate('local', {
  successRedirect: '/employee-dashboard/:id', // Redirect to employee dashboard on successful sign-in (adjust based on your setup)
  failureRedirect: '/auth/signin',             // Redirect to sign-in page on authentication failure
  failureFlash: true,                           // Enable flash messages for authentication failures
}), userController.signIn);

// Render sign-up form
router.get('/signup', userController.renderSignUpForm);

// Handle sign-up logic
router.post('/signup', userController.signUp);

// Log out user
router.get('/signout', userController.destroySession);

// Handle edit employee logic
router.get('/edit-employee/:id', userController.editEmployee);

// Handle update employee logic
router.post('/update-employee/:id', userController.updateEmployee);

export default router;
