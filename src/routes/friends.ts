import express from 'express';
import { pool } from '../db/connection';
const router = express.Router();

router.post('/request', async (req, res) => {
  const { user_id, friend_id } = req.body;
  await pool.query(
    `INSERT INTO friends (user_id, friend_id, status) VALUES ($1, $2, 'pending')`,
    [user_id, friend_id]
  );
  res.send('Friend request sent');
});

router.post('/accept', async (req, res) => {
  const { user_id, friend_id } = req.body;
  await pool.query(
    `UPDATE friends SET status = 'accepted' WHERE user_id = $1 AND friend_id = $2`,
    [user_id, friend_id]
  );
  res.send('Friend request accepted');
});

export default router;
