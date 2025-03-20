const { StatusCodes } = require('http-status-codes');
const voteRepository = require('../repositories/voteRepository');
const axios = require("axios")
const PYTHON_SERVER_URL = process.env.PYTHON_URL

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

  getAllEncryptedVotes : async(req,res)=>{
    try {
      const result = await voteRepository.getAllEncryptedVotes();
      res.status(StatusCodes.CREATED).json({
        message: "Vote extracted successfully",
        result,
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: `Controller: Failed to extract encrypted vote - ${error.message}`,
      });
    }
  }, 

  exportVotesToPython: async (req, res) => {
    try {
      // Step 1: Retrieve all encrypted votes from the database.
      const votes = await voteRepository.getAllEncryptedVotes();
      console.log("Exporting votes...:");

      // Step 2: Send the votes JSON to the Python server.
      // Replace 'http://python-server-address:port/receive-votes' with the actual URL of your Python server.
      const response = await axios.post(
        `${PYTHON_SERVER_URL}/receive-votes`,
        { votes: votes },
        { headers: { "Content-Type": "application/json" } }
      );
      
      console.log("Response from Python server:", response.data);
 
      // Step 3: Return a success response.
      res.status(StatusCodes.OK).json({
        message: "Votes successfully sent to Python server",
        data: response.data,
      });
    } catch (error) {
      console.error("Error exporting votes:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: `Controller: Failed to export votes - ${error.message}`,
      });
    }
  },
};

module.exports = voteController;
