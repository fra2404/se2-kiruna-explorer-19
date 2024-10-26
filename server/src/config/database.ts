import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    console.log('process.env.MONGO_URI:', process.env.MONGO_URI);

    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
