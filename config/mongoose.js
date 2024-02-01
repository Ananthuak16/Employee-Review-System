import mongoose from "mongoose";
import dotenv from "dotenv";

 dotenv.config();

/**
 * Establishes a connection to the MongoDB database.
 */
export const connectDB = async () => {
  try {
    console.log("Connecting to the database...");
    console.log("MongoDB URI:", process.env.mongoURL||"mongodb://localhost:27017/EmployeeReviewSystem");

    // Connect to MongoDB
    await mongoose.connect(process.env.mongoURL||"mongodb://localhost:27017/EmployeeReviewSystem", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Connection successful
    console.log(`MongoDB connected to server at ${mongoose.connection.host}`);
  } catch (error) {
    // Connection failed
    console.error("MongoDB connection failed!");
    console.error(error);
  }
};

// You might also want to listen for events like disconnect and error
mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});
