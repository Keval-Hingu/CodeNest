import mongoose from 'mongoose';
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    // A regex for basic email validation
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  role: {
    type: String,
    enum: ['user', 'admin'], // Example roles
    default: 'user'
  },
  profile: {
    name: { type: String, trim: true },
    bio: { type: String, trim: true },
    github: { type: String, trim: true },
    linkedin: { type: String, trim: true }
  },
  // References to other user-related data
  dsaProgress: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DsaTracking'
  }],
  uploadedResources: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resource'
  }]
}, {
  timestamps: true // Adds `createdAt` and `updatedAt` fields
});

// Pre-save hook to hash the password before saving a new user
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;