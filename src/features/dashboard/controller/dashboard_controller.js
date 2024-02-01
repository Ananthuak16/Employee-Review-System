import Review from '../../review/routes/reviews.js';
import User from '../../user/model/Userschema.js';

// Render admin dashboard
export const adminDashboard = async (req, res) => {
  try {
    if (req.isAuthenticated() && req.user.role === 'admin') {
      // Populate all users excluding the logged-in user
      const users = await User.find({ email: { $ne: req.user.email } }).populate('username');

      return res.render('admin_dashboard', {
        title: 'Admin dashboard',
        users,
      });
    } else {
      return res.redirect('/');
    }
  } catch (err) {
    console.error('Error in adminDashboard:', err);
    return res.redirect('/');
  }
};

// Render employee dashboard
export const employeeDashboard = async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      const user = req.user;

      if (user.role === 'admin') {
        console.log('Redirecting to admin dashboard');
        return res.redirect('/admin-dashboard');
      }

      console.log('Rendering employee dashboard:', user);

      // Populate the employee with assigned reviews and reviews from others
      const employee = await User.findById(user._id)
        .populate('assignedReviews')
        .populate({
          path: 'reviewsFromOthers',
          populate: {
            path: 'reviewer',
            model: 'User',
          },
        });

      // Extract assigned reviews and reviews from others
      const assignedReviews = employee.assignedReviews;
      const reviewsFromOthers = employee.reviewsFromOthers;

      return res.render('employee_dashboard', {
        title: 'Employee dashboard',
        employee: user,
        assignedReviews,
        reviewsFromOthers,
      });
    } else {
      console.log('User not authenticated. Redirecting to home page');
      return res.redirect('/');
    }
  } catch (err) {
    console.error('Error in employeeDashboard:', err);
    return res.redirect('/');
  }
};

// Render add employee form
export const addEmployeeForm = async (req, res) => {
  try {
    // Check if the user is an admin
    if (req.isAuthenticated() && req.user.role === 'admin') {
      return res.render('add_employee', {
        title: 'Add Employee',
      });
    } else {
      return res.redirect('/');
    }
  } catch (err) {
    console.error('Error in addEmployeeForm:', err);
    return res.redirect('/');
  }
};

// Handle adding a new employee
export const addEmployee = async (req, res) => {
  try {
    // Check if the user is an admin
    if (req.isAuthenticated() && req.user.role === 'admin') {
      // Extract employee details from the request body
      const { username, email, password, role } = req.body;

      // Create a new user (employee)
      const newEmployee = new User({
        username,
        email,
        password, // Note: In production, use proper password hashing
        role,
      });

      // Save the new employee to the database
      await newEmployee.save();

      // Redirect to the admin dashboard or any other appropriate page
      return res.redirect('/admin-dashboard');
    } else {
      return res.redirect('/');
    }
  } catch (err) {
    console.error('Error in addEmployee:', err);
    return res.redirect('/');
  }
};
