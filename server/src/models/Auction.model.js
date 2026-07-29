import mongoose from 'mongoose';

const auctionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters'],
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
  },
  imageUrl: {
    type: String,
    trim: true,
  },
  startingBid: {
    type: Number,
    required: [true, 'Starting bid is required'],
    min: [1, 'Starting bid must be greater than 0'],
  },
  currentHighestBid: {
    type: Number,
  },
  highestBidder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  minIncrement: {
    type: Number,
    default: 100,
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: [1, 'Duration must be at least 1 minute'],
  },
  startTime: {
    type: Date,
  },
  endTime: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['upcoming', 'active', 'completed'],
    default: 'upcoming',
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Seller is required'],
  },
  bidCount: {
    type: Number,
    default: 0,
  },
  spectatorCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

auctionSchema.index({ status: 1, endTime: 1 });
auctionSchema.index({ seller: 1 });

export default mongoose.model('Auction', auctionSchema);
