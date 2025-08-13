import mongoose from "mongoose";
const dsaTrackingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dsaQuestion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DsaQuestion', // Reference to the actual question
    required: true
  },
  status: {
    type: String,
    enum: ['unattempted', 'attempted', 'solved'],
    default: 'unattempted'
  },
  solutionLink: { // Optional link to the user's solution
    type: String
  },
  notes: {
    type: String
  },
  attemptedAt: {
    type: Date
  },
  solvedAt: {
    type: Date
  }
}, {
  timestamps: true
});

const DsaTracking = mongoose.model('DsaTracking', dsaTrackingSchema);

export default DsaTracking;