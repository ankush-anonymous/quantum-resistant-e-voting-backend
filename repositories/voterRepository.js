const { log } = require("node:console");
const { pool } = require("../db/connect");

const voterRepository = {
  // Create a new voter
  createVoter: async (validatedData) => {
    try {
      const { name, email, dilithium_public_key, dilithium_private_key } =
        validatedData;
      const query = `
            INSERT INTO voters (voter_id, name, email, dilithium_public_key, dilithium_private_key, is_registered)
            VALUES (gen_random_uuid(), $1, $2, $3, $4, true)
            RETURNING *`;
      const values = [name, email, dilithium_public_key, dilithium_private_key];
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error creating voter: ${error.message}`);
    }
  },

  // Get all voters
  getAllVoters: async () => {
    try {
      const query = "SELECT * FROM voters ORDER BY created_at DESC";
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw new Error(`Error fetching voters: ${error.message}`);
    }
  },

  // Get voter by ID
  getVoterById: async (voterId) => {
    try {
      const query = "SELECT * FROM voters WHERE voter_id = $1";
      const values = [voterId];
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error fetching voter: ${error.message}`);
    }
  },

  // Update voter (PATCH)
  updateVoter: async (voterId, updates) => {
    try {
      // Only include fields that are actually present in the updates object
      const validUpdates = {};
      if (updates.email !== undefined) validUpdates.email = updates.email;
      if (updates.dilithium_public_key !== undefined)
        validUpdates.dilithium_public_key = updates.dilithium_public_key;
      if (updates.isRegistered !== undefined)
        validUpdates.is_registered = updates.isRegistered;
      if (updates.isVoted !== undefined)
        validUpdates.is_voted = updates.isVoted;

      if (Object.keys(validUpdates).length === 0) {
        return null;
      }
      console.log(validUpdates);

      const setClauses = Object.keys(validUpdates)
        .map((key, index) => `${key} = $${index + 2}`)
        .join(", ");

      const query = `
            UPDATE voters 
            SET ${setClauses}, updated_at = NOW()
            WHERE voter_id = $1
            RETURNING *`;

      const values = [voterId, ...Object.values(validUpdates)];
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error updating voter: ${error.message}`);
    }
  },

  // Delete voter
  deleteVoter: async (voterId) => {
    try {
      const query = "DELETE FROM voters WHERE voter_id = $1 RETURNING *";
      const values = [voterId];
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error deleting voter: ${error.message}`);
    }
  },
};

module.exports = voterRepository;
