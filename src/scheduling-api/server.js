import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import admin from 'firebase-admin';
import fs from 'fs';

// Load environment variables
dotenv.config();

// Initialize Firebase Admin SDK
const serviceAccount = JSON.parse(fs.readFileSync(process.env.FIREBASE_ADMIN_SDK_PATH));
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

// Create Firestore database instance
const db = admin.firestore();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Import the scheduler routes
import schedulerRoutes from './routes/scheduler.js'; // Ensure correct path and file extension
app.use('/api/v1/scheduler', schedulerRoutes);

const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});