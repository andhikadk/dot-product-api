import mongoose from 'mongoose';

const db = () => {
  try {
    mongoose.set('strictQuery', true);
    mongoose.connect(process.env.DB_CONNECT, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log('Database connected');
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default db;
