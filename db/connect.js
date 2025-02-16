const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const connectDB = async () => {
  try {
    await pool.query("SELECT NOW()");
    console.log("Database connected successfully");

    // Error handling for idle clients
    pool.on("error", (err) => {
      console.error("Unexpected error on idle client", err);
      process.exit(-1);
    });

    return pool;
  } catch (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
  }
};

module.exports = { pool, connectDB };