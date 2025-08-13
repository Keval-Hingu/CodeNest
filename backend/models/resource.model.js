import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  // The 'content' field is optional, used only for blog posts or articles
  content: {
    type: String
  },
  // 'link' is for external URLs
  link: {
    type: String,
    trim: true
  },
  // 'fileUrl' is for uploaded files (PDFs, images) stored in cloud storage
  fileUrl: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['blog', 'article', 'link', 'pdf', 'image'],
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  dislikes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// A custom validation to ensure at least one form of content exists
resourceSchema.pre('validate', function(next) {
  if (this.type === 'link' && !this.link) {
    next(new Error('Link must be provided for a link type resource.'));
  } else if ((this.type === 'blog' || this.type==='article') && !this.content) {
    next(new Error('Content must be provided for a blog type resource.'));
  } else if ((this.type === 'pdf' || this.type === 'image') && !this.fileUrl) {
    next(new Error('A file must be uploaded for this resource type.'));
  } else {
    next();
  }
});

const Resource = mongoose.model('Resource', resourceSchema);

export default Resource;



