const { log } = require("node:console");
const { pool } = require("../db/connect");
const voteRepository = {
    // Create a new vote
    createVote: async (validatedData) => {
      try {
        const {
          election_id,
          voter_id,
          encrypted_vote,
          zkp_proof,
          zkp_public_key,
        } = validatedData;
        
        const query = `
          INSERT INTO votes (
            vote_id,
            election_id,
            voter_id,
            encrypted_vote,
            zkp_proof,
            zkp_public_key,
            created_at
          )
          VALUES (
            gen_random_uuid(),
            $1,
            $2,
            $3,
            $4,
            $5,
            NOW()
          )
          RETURNING *;
        `;
        
        const values = [
          election_id,
          voter_id,
          encrypted_vote,
          zkp_proof,
          zkp_public_key
        ];
        
        const result = await pool.query(query, values);
        return result.rows[0];
      } catch (error) {
        throw new Error(`Error creating vote: ${error.message}`);
      }
    },


    getAllEncryptedVotes: async()=>{
      try {
        const query = 'SELECT encrypted_vote from votes';
        const result = await pool.query(query);
        return result.rows;
      } catch (error) {
        throw new Error(`Repository: Error querying encrypted vote: ${error.message}`);

        
      }
    }
  };

  module.exports = voteRepository;
       