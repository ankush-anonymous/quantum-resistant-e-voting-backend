const { StatusCodes } = require('http-status-codes');
const voteRepository = require('../repositories/voteRepository');

const voteController = {
  createVote: async (req, res) => {
    try {
      const {
        election_id,
        voter_id,
        encrypted_vote,
        zkp_proof,
        zkp_public_key,
      } = req.body;

      // Construct the validated data object with the required fields
      const validatedData = {
        election_id,
        voter_id,
        encrypted_vote,
        zkp_proof,
        zkp_public_key,
      };

      // Pass the validated data to the repository function
      const vote = await voteRepository.createVote(validatedData);

      res.status(StatusCodes.CREATED).json({
        message: "Vote created successfully",
        vote,
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: `Controller: Failed to create vote - ${error.message}`,
      });
    }
  },
};

module.exports = voteController;
