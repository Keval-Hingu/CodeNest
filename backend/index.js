// src/server.js (main entry file)

import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import connectDB from "./config/connectDB.js";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.routes.js"
import resourceRoutes from "./routes/resource.routes.js";
import uploadRoutes from "./routes/upload.routes.js";

const app = express();

// Load environment varibles:
dotenv.config();

// Connect to the database
connectDB();

// Init Middleware
app.use(express.json()); // Allows parsing of JSON request bodies
app.use(cookieParser());

// Define Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/upload' , uploadRoutes);
// ... other routes ...

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on : http://localhost:${PORT}`));