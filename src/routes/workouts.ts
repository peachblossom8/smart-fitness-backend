import express from 'express';
import { pool } from '../db/connection';
const router = express.Router();

const MET = {
  low: 4.0,
  medium: 6.0,
  high: 8.0,
};

router.post('/', async (req, res) => {
  const {
    user_id,
    type,
    duration_min,
    intensity,
    weight_kg,
  }: {
    user_id: string;
    type: string;
    duration_min: number;
    intensity: 'low' | 'medium' | 'high';
    weight_kg: number;
  } = req.body;
  const met = MET[intensity as keyof typeof MET] || 6.0;
  const calories = met * weight_kg * duration_min * 0.0175;
  const points = Math.floor(calories / 5);

  try {
    await pool.query(
      `INSERT INTO workouts (user_id, type, duration_min, intensity, calories_burned, points_earned, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
      [user_id, type, duration_min, intensity, calories, points]
    );

    // Update rank
    const total = await pool.query(`SELECT SUM(points_earned) AS total FROM workouts WHERE user_id = $1`, [user_id]);
    const totalPoints = parseInt(total.rows[0].total || 0);
    const rank =
      totalPoints >= 5000 ? 'Titan' :
      totalPoints >= 3000 ? 'Diamond' :
      totalPoints >= 2000 ? 'Platinum' :
      totalPoints >= 1000 ? 'Gold' :
      totalPoints >= 500 ? 'Silver' : 'Bronze';

    await pool.query(
      `INSERT INTO ranks (user_id, total_points, current_rank, last_updated)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (user_id) DO UPDATE
       SET total_points = $2, current_rank = $3, last_updated = NOW()`,
      [user_id, totalPoints, rank]
    );

    res.status(200).json({ calories, points, rank });
  } catch (e) {
    console.error(e);
    res.status(500).send('Error saving workout');
  }
});

export default router;
