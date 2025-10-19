import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import groupRoutes from './routes/routergrupo.js'; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL;

const connectDB = async () => {
    if (!MONGO_URL) {
        console.error("Error: MONGO_URL is not defined in environment variables.");
        process.exit(1);
    }
    
    try {
        await mongoose.connect(MONGO_URL);
        console.log('✅ MongoDB connected successfully');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        process.exit(1);
    }
};

app.use(express.json());

app.get('/status', (req, res) => {
    res.send('School Groups API is running! Visit /api/groups');
});

app.use('/api/groups', groupRoutes);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`📡 Express server listening on http://localhost:${PORT}`);
    });
});