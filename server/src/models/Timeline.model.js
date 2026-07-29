import mongoose from 'mongoose';

const timelineSchema = new mongoose.Schema({
  auction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auction',
    required: [true, 'Auction reference is required'],
    index: true,
  },
  eventType: {
    type: String,
    enum: ['created', 'started', 'bid', 'extended', 'completed', 'payment'],
    required: [true, 'Event type is required'],
  },
  metadata: {
    type: Object,
    default: {},
  },
}, {
  timestamps: true,
});

timelineSchema.index({ auction: 1, createdAt: 1 });

export default mongoose.model('Timeline', timelineSchema);
