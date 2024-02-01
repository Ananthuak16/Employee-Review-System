# Employee Review System

Welcome to the Employee Review System project! This application allows employees to submit feedback on each other's performance. Below are the instructions on how to use and set up the project.

## Features

### Admin View

1. **Manage Employees:**
   - Add, remove, update, and view employee details.
2. **Performance Reviews:**
   - Add, update, and view performance reviews.
3. **Assign Reviews:**
   - Assign employees to participate in another employee's performance review.

### Employee View

1. **Feedback List:**
   - View a list of performance reviews requiring feedback.
2. **Submit Feedback:**
   - Submit feedback for performance reviews.

### Authentication

1. **User Roles:**
   - Admins can register employees.
   - Admins can assign admin roles to employees.

## Project Structure

The project is structured as follows:

```
|-- config
|   |-- mongoose.js
|   |-- passport-local-strategy.js
|-- features
|   |-- dashboard
|       |-- controller
|       |-- routes
|       |-- views
|   |-- review
|       |-- controller
|       |-- model
|       |-- routes
|   |-- user
|       |-- controller
|       |-- model
|       |-- routes
|   |-- ...
|-- src
|   |-- middleware
|   |-- views
|-- .env
|-- app.js
|-- package.json
|-- README.md
```

## Getting Started

1. Clone the repository:

   ```bash
   git clone <https://github.com/Ananthuak16/Employee-Review-System.git>
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   Create a `.env` file with the following content:

   ```env
  PORT=3200
  mongoURL=mongodb://localhost:27017/EmployeeReviewSystem
  secret =hi
   ```

4. Run the application:

   ```bash
   npm start
   ```

## For Admin privileges

const newUser = {
  email: 'admin@example.com',
  password: 'hashedPassword', 
  username: 'exampleUser',
  role: 'admin', // or 'employee'
};

## Video Demo

Please watch the project demonstration video [here](<https://drive.google.com/file/d/1JwDXBT0trOQzlYMScufdL9AhJtR1l4KD/view?usp=sharing>).

## Github Repository

Explore the code on [GitHub](<https://github.com/Ananthuak16/Employee-Review-System>).

## Hosted Application

Explore the Web app  on [GitHub](<https://employee-review-system-y3ak.onrender.com/admin-dashboard>).





## Additional Information

- The project follows a clean and organized file structure.
- Code is well-documented with comments where necessary.
- Proper indentation and naming conventions are maintained.
- Design is left to your creativity, and you are free to use any CSS framework.

Feel free to reach out if you have any questions or need further assistance. Happy coding!
