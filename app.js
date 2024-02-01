// Import dependencies
import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import passport from './config/passport-local-strategy.js'; 
import { connectDB } from './config/mongoose.js'; 
import dotenv from 'dotenv';
import userRoutes from './src/features/user/routes/userRoutes.js'; 
import path from 'path';
import { fileURLToPath } from 'url'
import dashboardRoutes from './src/features/dashboard/routes/dashboardRoutes.js';
import reviewRoutes from './src/features/review/routes/reviews.js'
import flash from 'connect-flash';
import helmet from 'helmet';

// Initialize Express app
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
dotenv.config();
app.use(flash());

// Connect to MongoDB
connectDB();

// Set up body-parser
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set up express-session
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 100 }, 
  })
);

// Enhance security with Helmet
app.use(helmet());

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

// Set up EJS as the view engine
app.set('view engine', 'ejs');

// Set the views directory using __dirname
app.set('views', path.join(__dirname, 'src', 'views'));

// Serve static files (if any)
app.use(express.static(path.join(__dirname, 'public')));

// Use routes
app.use('/auth', userRoutes);
app.use('/', dashboardRoutes);
app.use('/reviews', reviewRoutes);

// Basic error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
