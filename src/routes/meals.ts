import express from 'express';
import { pool } from '../db/connection';
const router = express.Router();

router.post('/', async (req, res) => {
  const { user_id, image_url, calories, health_score, meal_data } = req.body;
  try {
    await pool.query(
      `INSERT INTO meals (user_id, image_url, calories, health_score, meal_data, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [user_id, image_url, calories, health_score, meal_data]
    );
    res.status(200).send('Meal saved');
  } catch (e) {
    res.status(500).send('Error saving meal');
  }
});

router.get('/:user_id', async (req, res) => {
  const { user_id } = req.params;
  const result = await pool.query(
    `SELECT * FROM meals WHERE user_id = $1 ORDER BY created_at DESC`,
    [user_id]
  );
  res.json(result.rows);
});

export default router;