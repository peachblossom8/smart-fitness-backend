import express from 'express';
import cors from 'cors';
import mealsRouter from './routes/meals';
import workoutsRouter from './routes/workouts';
import usersRouter from './routes/users';
import leaderboardRouter from './routes/leaderboard';
import friendsRouter from './routes/friends';
import { connectDB } from './db/connection';

import * as dotenv from 'dotenv';
dotenv.config();

console.log("🟡 index.ts started");

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/meals', mealsRouter);
app.use('/api/workouts', workoutsRouter);
app.use('/api/users', usersRouter);
app.use('/api/leaderboard', leaderboardRouter);
app.use('/api/friends', friendsRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});