import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const connectDB = async () => {
  console.log("🟣 Attempting to connect to DB...");
  try {
    await pool.connect();
    console.log("✅ Connected to PostgreSQL");
  } catch (err) {
    console.error("❌ DB connection error:", err);
  }
};