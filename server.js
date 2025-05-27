// server/server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import tipsRouter  from './routes/tips.js';
import namesRouter from './routes/names.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 1️⃣ Connect to MongoDB and wait for it
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // optional: serverSelectionTimeoutMS: 5000
    });
    console.log('✅ MongoDB connected');

    // 2️⃣ Mount routes only after DB is up
    app.use('/api/tips',  tipsRouter);
    app.use('/api/names', namesRouter);

    // 3️⃣ Start listening
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`🚀 Server listening on http://localhost:${port}`);
    });

  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err);
    process.exit(1); // exit the process with failure
  }
}

startServer();
