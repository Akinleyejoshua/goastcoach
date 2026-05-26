import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/goastcoach';

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let connectionPromise: Promise<typeof mongoose>;

if (process.env.NODE_ENV === 'development') {
  if (!(global as any)._mongooseConnectionPromise) {
    connectionPromise = mongoose.connect(uri);
    (global as any)._mongooseConnectionPromise = connectionPromise;
  }
  connectionPromise = (global as any)._mongooseConnectionPromise;
} else {
  connectionPromise = mongoose.connect(uri);
}

export { connectionPromise };