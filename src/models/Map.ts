// models/Map.ts
import mongoose from 'mongoose';

const mapSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  name: {
    type: String,
    required: true
  },
  markers: [{
    latitude: Number,
    longitude: Number,
    description: String,
    status: {
      type: String,
      enum: ['pending', 'rescued'],
      default: 'pending'
    }
  }]
}, {
  timestamps: true
});

const Map = mongoose.models.Map || mongoose.model('Map', mapSchema);
export default Map;