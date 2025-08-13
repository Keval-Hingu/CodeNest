import mongoose from "mongoose";
const dsaQuestionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },
  topic: {
    type: String, // e.g., 'Arrays', 'Linked Lists', 'Graphs'
    required: true
  },
  examples: [{
    input: String,
    output: String,
    explanation: String
  }],
  // This could store the starter code for the in-app editor
  starterCode: {
    type: String
  }
});

const DsaQuestion =  mongoose.model('DsaQuestion', dsaQuestionSchema);

export default DsaQuestion;