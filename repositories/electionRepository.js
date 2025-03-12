const { log } = require("node:console");
const { pool } = require("../db/connect");

const electionRepository = {
  // Create a new election
  createElection: async (validatedData) => {
    try {
      const { title, description, fhe_public_key } = validatedData;
      const query = `
        INSERT INTO elections (election_id, title, description, fhe_public_key, created_at)
        VALUES (gen_random_uuid(), $1, $2, $3, NOW())
        RETURNING *`;
      const values = [title, description, fhe_public_key];
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error creating election: ${error.message}`);
    }
  },

  // Get all elections
  getAllElections: async () => {
    try {
      const query = "SELECT * FROM elections ORDER BY created_at DESC";
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw new Error(`Error fetching elections: ${error.message}`);
    }
  },

  // Get election by ID
  getElectionById: async (electionId) => {
    try {
      const query = "SELECT * FROM elections WHERE election_id = $1";
      const values = [electionId];
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error fetching election: ${error.message}`);
    }
  },

  // Update election (PATCH)
  updateElection: async (electionId, updates) => {
    try {
      // Only include fields that are present in the updates object
      const validUpdates = {};
      if (updates.title !== undefined) validUpdates.title = updates.title;
      if (updates.description !== undefined) validUpdates.description = updates.description;
      if (updates.fhe_public_key !== undefined) validUpdates.fhe_public_key = updates.fhe_public_key;

      if (Object.keys(validUpdates).length === 0) {
        return null;
      }

      const setClauses = Object.keys(validUpdates)
        .map((key, index) => `${key} = $${index + 2}`)
        .join(", ");

      const query = `
        UPDATE elections
        SET ${setClauses}, updated_at = NOW()
        WHERE election_id = $1
        RETURNING *`;

      const values = [electionId, ...Object.values(validUpdates)];
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error updating election: ${error.message}`);
    }
  },

  // Delete election
  deleteElection: async (electionId) => {
    try {
      const query = "DELETE FROM elections WHERE election_id = $1 RETURNING *";
      const values = [electionId];
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error deleting election: ${error.message}`);
    }
  },
};

module.exports = electionRepository;
