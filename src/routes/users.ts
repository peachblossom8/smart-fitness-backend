import express from 'express';
import { pool } from '../db/connection';
const router = express.Router();

router.post('/', async (req, res) => {
  const { id, name, email, age, sex, weight_kg } = req.body;
  try {
    await pool.query(
      `INSERT INTO users (id, name, email, age, sex, weight_kg, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       ON CONFLICT (id) DO UPDATE SET name = $2, email = $3, age = $4, sex = $5, weight_kg = $6`,
      [id, name, email, age, sex, weight_kg]
    );
    res.send('User profile saved');
  } catch (e) {
    res.status(500).send('Error saving user');
  }
});

export default router;
