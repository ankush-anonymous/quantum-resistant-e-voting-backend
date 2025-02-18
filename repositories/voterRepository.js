const { pool } = require("../db/connect");

const voterRepository = {
  // Create a new voter
  createVoter: async (name, email, dilithiumPublicKey, dilithiumPrivateKey) => {
    try {
      const query = `
            INSERT INTO voters (voter_id, name, email, dilithium_public_key, dilithium_private_key, is_registered)
            VALUES (gen_random_uuid(), $1, $2, $3, $4, true)
            RETURNING *`;
      const values = [name, email, dilithiumPublicKey, dilithiumPrivateKey];
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
  getVoter: async (voterId) => {
    try {
      const query = "SELECT * FROM voters WHERE voter_id = $1";
      const values = [voterId];
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error fetching voter: ${error.message}`);
    }
  },

  // Update voter
  updateVoter: async (voterId, updates) => {
    try {
      const allowedUpdates = {
        email: updates.email,
        dilithium_public_key: updates.dilithiumPublicKey,
        is_registered: updates.isRegistered,
        is_voted: updates.isVoted,
      };

      // Filter out undefined values
      const validUpdates = Object.entries(allowedUpdates)
        .filter(([_, value]) => value !== undefined)
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

      if (Object.keys(validUpdates).length === 0) {
        return null;
      }

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
