import express from 'express';
import {config} from 'dotenv';
import cors from 'cors';
import userRouter from './routes/userRoutes.js';
import connectDB from './config/db.js';
import authMiddleware from './middlewares/authMiddleware.js';
import postRouter from './routes/postRoutes.js';

config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cors())

app.use('/api/v1/user',userRouter);
app.use('/api/v1/post', authMiddleware, postRouter);
app.listen(PORT, async() => {
  await connectDB();
  console.log(`Server is running on port ${PORT}`);
});