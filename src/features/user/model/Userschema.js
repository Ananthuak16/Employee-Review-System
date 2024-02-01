import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['employee', 'admin'],
      default: 'employee',
      required: true,
    },
    assignedReviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    reviewsFromOthers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Encrypt password before saving it in the database
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    this.password = await bcrypt.hash(this.password, 10);
    return next();
  } catch (error) {
    return next(error);
  }
});

// Validate the password with the passed user password
userSchema.methods.isValidatedPassword = async function (userSentPassword) {
  try {
    return await bcrypt.compare(userSentPassword, this.password);
  } catch (error) {
    throw error;
  }
};

const User = model('User', userSchema);

export default User;

// Function to save a new user with error handling
const saveNewUser = async (userData) => {
  try {
    // Check if the username already exists before creating a new user
    const existingUser = await User.findOne({ username: userData.username });

    if (existingUser) {
      console.error('Username already exists. Please choose a different username.');
    } else {
      const newUser = new User(userData);
      const savedUser = await newUser.save();
      console.log('User saved:', savedUser);
    }
  } catch (error) {
    console.error('Error saving user:', error);
  }
};

// Example usage
const newUser = {
  email: 'admin@example.com',
  password: 'hashedPassword', 
  username: 'exampleUser',
  role: 'admin', // or 'employee'
};

saveNewUser(newUser);
