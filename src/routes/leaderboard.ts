import express from 'express';
import { pool } from '../db/connection';
const router = express.Router();

router.get('/:user_id', async (req, res) => {
  const { user_id } = req.params;
  const friends = await pool.query(
    `SELECT friend_id FROM friends WHERE user_id = $1 AND status = 'accepted'`,
    [user_id]
  );
  const ids = friends.rows.map((row: any) => row.friend_id).concat(user_id);

  const leaderboard = await pool.query(
    `SELECT users.name, ranks.total_points, ranks.current_rank
     FROM ranks
     JOIN users ON ranks.user_id = users.id
     WHERE ranks.user_id = ANY($1::uuid[])
     ORDER BY ranks.total_points DESC`,
    [ids]
  );

  res.json(leaderboard.rows);
});

export default router;
