import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

import cloudinaryRoute from './routes/cloudinaryRoute.js'
import productRoute from './routes/productRoute.js'
import userRoute from './routes/userRoute.js'
import { verifyAccessToken } from './middlewares/authMiddleware.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
     credentials: true,
}));

app.get('/protected', verifyAccessToken, (req, res) => {
    res.json({ success: true, message: `Welcome, user ${req.user.phone}` });
});


const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log("✅ MongoDB Connected")
    } catch (error) {
        console.error("❌ MongoDB Connection Failed:", error);
        process.exit(1);
    }
};

await connectDB();


app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;

    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (username === adminUsername && password === adminPassword) {
        return res.status(200).json({ message: "Login Successful" });
    } else {
        return res.status(401).json({ message: 'Invalid Credentials' });
    }

});

app.use('/api/cloudinary', cloudinaryRoute);
app.use('/api/products', productRoute);
app.use('/api/users', userRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is Running On PORT: ${PORT}`)
})