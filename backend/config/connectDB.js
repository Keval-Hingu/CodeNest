// src/config/database.js

import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// Get the MongoDB connection URI from environment variables
const mongoURI = process.env.MONGO_URI;


const connectDB = async () => {
  try {
    if (!mongoURI) {
      console.error('FATAL ERROR: MONGO_URI is not defined. Please set it in your .env file.');
      process.exit(1);
    }

    // Connect to the MongoDB database
    await mongoose.connect(mongoURI)
    // , {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
      // The following options are now default in Mongoose 6+ but are
      // good practice to include for backward compatibility and clarity.
      // useCreateIndex: true,
      // useFindAndModify: false,
    // });

    // console.log(`MongoDB connected: ${conn.connection.host}`);
    console.log(`MongoDB connected Successfully`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;