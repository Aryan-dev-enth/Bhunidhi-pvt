import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import regionRoutes from './routes/regionRoutes.js'
import siteRoutes from './routes/siteRoutes.js';
import userRoutes from './routes/userRoutes.js';
import reportRoutes from './routes/reportRoutes.js'

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/region', regionRoutes);
app.use('/api/site', siteRoutes);
app.use('/api/user', userRoutes);
app.use('/api/report', reportRoutes);


const PORT = process.env.PORT || 8001;
const MONGODB_URI = process.env.MONGODB_URI;
app.listen(PORT, async () => {
    try {
        await mongoose.connect( MONGODB_URI);
        console.log("Connected to mongoDB...");
    } catch (error) {
        console.log(error.message);
    }
  console.log(`Server running on port ${PORT}`);
});