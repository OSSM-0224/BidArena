import mongoose from 'mongoose';

const bidSchema = new mongoose.Schema({
  auction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auction',
    required: [true, 'Auction reference is required'],
    index: true,
  },
  bidder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Bidder reference is required'],
  },
  amount: {
    type: Number,
    required: [true, 'Bid amount is required'],
    min: [1, 'Bid amount must be positive'],
  },
  isWinning: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

bidSchema.index({ auction: 1, amount: -1 });

export default mongoose.model('Bid', bidSchema);
