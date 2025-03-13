const express = require("express");
const { pool, connectDB } = require("./db/connect");

const app = express();
const PORT = process.env.PORT || 3000;
const cors = require("cors");

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const voterRoutes = require("./routes/voterRouter");
const candidateRoutes = require("./routes/candidateRouter");
const electionRoutes = require("./routes/electionRoutes");
const voteRoutes = require("./routes/voteRouter")

// Routes
app.use("/api/v1/voters", voterRoutes);
app.use("/api/v1/candidate", candidateRoutes);
app.use("/api/v1/election", electionRoutes);
app.use("/api/v1/vote", voteRoutes);

// Connect to database and start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
