import mongoose from 'mongoose';
import 'dotenv/config'
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.URI);
    console.log('Connected to MongoDB Atlas');
  } catch (err) {
    console.error('Error connecting to MongoDB Atlas:', err);
    process.exit(1); 
  }
};

export default connectDB;
