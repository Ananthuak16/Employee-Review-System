// Import necessary modules
import passport from 'passport';
import User from '../model/Userschema.js';
import Review from '../../review/model/reviewSchema.js';

// Render the sign-up form
export const renderSignUpForm = (req, res) => {
  res.render('auth/signUp.ejs');
};

// Handle sign-up logic
export const signUp = async (req, res) => {
  try {
    // Extract user data from request body
    const { username, password, firstName, lastName, email } = req.body;

    // Create a new User instance and save it to the database
    const newUser = new User({ username, password, firstName, lastName, email });
    await newUser.save();

    // Redirect to sign-in page after successful sign-up
    res.redirect('/auth/signin');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

// Render the sign-in form
export const renderSignInForm = (req, res) => {
  res.render('auth/signIn.ejs', { error: null });
};

// Handle sign-in logic
export const signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });

    // Check if user exists and the provided password is correct
    if (!user || !(await user.isValidatedPassword(password))) {
      console.log('Invalid email or password. Redirecting to sign-in page');
      return res.render('auth/signIn.ejs', { error: 'Invalid email or password' });
    }

    // Store user in session for session-based authentication
    req.session.user = user;

    // Redirect based on user role
    if (user.role === 'admin') {
      return res.redirect('/admin-dashboard');
    }

    // Redirect to employee dashboard
    console.log('Redirecting to employee dashboard:', `/employee-dashboard/${user.id}`);
    return res.redirect(`/employee-dashboard/${user.id}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

// Add an employee
export const createEmployee = async (req, res) => {
  try {
    // Extract data from request body
    const { username, email, password, confirm_password, role } = req.body;

    // Check if password matches confirm_password
    if (password !== confirm_password) {
      req.flash('error', 'Password and Confirm password are not the same');
      return res.redirect('back');
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      // Create a new user if not found in the database
      await User.create({
        email,
        password,
        username,
        role,
      });

      req.flash('success', 'Employee added!');
      return res.redirect('back');
    } else {
      req.flash('error', 'Employee already registered!');
      return res.redirect('back');
    }
  } catch (err) {
    console.error(err);
    return res.redirect('back');
  }
};

// Update employee details
export const updateEmployee = async (req, res) => {
  try {
    // Find employee by ID
    const employee = await User.findById(req.params.id);
    const { username, role } = req.body;

    if (!employee) {
      req.flash('error', 'employee does not exist!');
      return res.redirect('back');
    }

    // Update data coming from req.body
    employee.username = username;
    employee.role = role;
    employee.save(); // Save the updated data

    req.flash('success', 'Employee details updated!');
    return res.redirect('/admin-dashboard');
  } catch (err) {
    console.log('error', err);
    return res.redirect('/auth/signin');
  }
};

// Delete a user
export const destroy = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the user by ID
    await User.findByIdAndDelete(id);

    // Delete all the reviews in which this user is a recipient
    await Review.deleteMany({ recipient: id });

    // Delete all the reviews in which this user is a reviewer
    await Review.deleteMany({ reviewer: id });

    req.flash('success', 'User and associated reviews deleted!');
    return res.redirect('back');
  } catch (err) {
    console.error(err);
    return res.redirect('back');
  }
};

// ... (other functions)

// Sign in and create a session for the user
export const createSession = (req, res) => {
  req.flash('success', 'Logged in successfully');
  const user = req.session.user;
  if (user && user.role === 'admin') {
    return res.redirect('/admin-dashboard');
  }
  // If the user is not admin, redirect to the employee page
  return res.redirect(`/employee-dashboard/${user.id}`);
};

// Clear the session cookie
export const destroySession = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    // Delete all the reviews in which this user is a recipient
    await Review.deleteMany({ recipient: id });

    // Delete all the reviews in which this user is a reviewer
    await Review.deleteMany({ reviewer: id });

    // Delete this user
    await User.findByIdAndDelete(id);

    req.flash('success', `User and associated reviews deleted!`);
    return res.redirect('/auth/signin');
  } catch (err) {
    console.log('error', err);
    return res.redirect('back');
  }
};

// Handle edit employee logic
export const editEmployee = async (req, res) => {
  try {
    // Check if the user is authenticated and an admin
    if (req.isAuthenticated()) {
      if (req.user.role === 'admin') {
        // Populate employee with all the reviews (feedback) given by other users
        const employee = await User.findById(req.params.id).populate({
          path: 'reviewsFromOthers',
          populate: {
            path: 'reviewer',
            model: 'User',
          },
        });

        // Extract reviews given by others from the employee variable
        const reviewsFromOthers = employee.reviewsFromOthers;

        return res.render('edit_employee', {
          title: 'Edit Employee',
          employee,
          reviewsFromOthers,
        });
      }
    }
    return res.redirect('/');
  } catch (err) {
    console.log('error', err);
    return res.redirect('back');
  }
};
