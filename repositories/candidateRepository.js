const { pool } = require("../db/connect");

const candidateRepository = {
  // Create new candidate
  createCandidate: async (candidateData) => {
    try {
      const query = `
        INSERT INTO candidates (
          candidate_id,
          election_id,
          name,
          party,
          description
        )
        VALUES (gen_random_uuid(), $1, $2, $3, $4)
        RETURNING *`;

      const values = [
        candidateData.electionId,
        candidateData.name,
        candidateData.party,
        candidateData.description,
      ];

      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Database: Error creating candidate: ${error.message}`);
    }
  },

  // Get all candidates
  getAllCandidates: async () => {
    try {
      const query = "SELECT * FROM candidates ORDER BY created_at DESC";
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw new Error(`Database: Error fetching candidates: ${error.message}`);
    }
  },

  // Get candidate by ID
  getCandidateById: async (candidateId) => {
    try {
      const query = "SELECT * FROM candidates WHERE candidate_id = $1";
      const result = await pool.query(query, [candidateId]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Database: Error fetching candidate: ${error.message}`);
    }
  },

  // Update candidate (PATCH)
  updateCandidateById: async (candidateId, updates) => {
    try {
      // Only include fields that are actually present in the updates object
      const validUpdates = {};
      if (updates.name !== undefined) validUpdates.name = updates.name;
      if (updates.party !== undefined) validUpdates.party = updates.party;
      if (updates.description !== undefined)
        validUpdates.description = updates.description;
      if (updates.electionId !== undefined)
        validUpdates.election_id = updates.electionId;

      if (Object.keys(validUpdates).length === 0) {
        return null;
      }

      const setClauses = Object.keys(validUpdates)
        .map((key, index) => `${key} = $${index + 2}`)
        .join(", ");

      const query = `
        UPDATE candidates 
        SET ${setClauses}
        WHERE candidate_id = $1
        RETURNING *`;

      const values = [candidateId, ...Object.values(validUpdates)];
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Database: Error updating candidate: ${error.message}`);
    }
  },

  // Delete candidate by ID
  deleteCandidateById: async (candidateId) => {
    try {
      const query =
        "DELETE FROM candidates WHERE candidate_id = $1 RETURNING *";
      const result = await pool.query(query, [candidateId]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Database: Error deleting candidate: ${error.message}`);
    }
  },
};

module.exports = candidateRepository;
