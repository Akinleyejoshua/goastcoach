import { Schema, model, models } from 'mongoose';

export const UserSchema = new Schema({
  fullName: { type: String, required: true },
  sport: { type: String, required: true },
  position: { type: String, required: true },
  experienceLevel: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // Advanced profile fields
  bio: { type: String, default: '' },
  team: { type: String, default: '' },
  trainingFrequency: { type: String, default: '' },
  goals: { type: String, default: '' },
  age: { type: Number },
  height: { type: Number },
  weight: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

export const SessionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  imageUrl: { type: String, required: true },
  thumbnail: { type: String },
  feedback: {
    overallScore: Number,
    strengths: [String],
    areasToImprove: [String],
    priorityFix: String,
    drillSuggestion: String,
    confidenceLevel: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  },
  uploadedAt: { type: Date, default: Date.now },
});

export const ChatSchema = new Schema({
  sessionId: { type: Schema.Types.ObjectId, ref: 'Session', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  messages: [
    {
      role: { type: String, enum: ['user', 'assistant'], required: true },
      content: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const User = models?.User || model('User', UserSchema);
export const Session = models?.Session || model('Session', SessionSchema);
export const Chat = models?.Chat || model('Chat', ChatSchema);
