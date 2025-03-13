const { StatusCodes } = require("http-status-codes");
const electionRepository = require("../repositories/electionRepository");
const { generateFheKeypair } = require("../utils/utils");
const crypto = require("crypto");


// Function to generate an election id that includes a slugified title and a random hex string
function generateElectionId(title) {
  // Create a slug from the title (convert to lowercase and replace non-alphanumeric characters)
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  // Generate a random component (8 hex characters)
  const randomPart = crypto.randomBytes(4).toString('hex');
  return `${slug}-${randomPart}`;
}

const electionController = {
  // Create new election
  createElection: async (req, res) => {
    try {
      const { title } = req.body;
      // Generate a unique election id that is a mix of the title and a random component
      const electionId = generateElectionId(title);
      console.log(electionId);
      
      // Pass the election id to the Python key-generation function
      const { openfhe_public_key, openfhe_private_key } = await generateFheKeypair(electionId);

      // Build the validated data with the generated election id and keys
      const validatedData = { 
        election_id: electionId, 
        title, 
        openfhe_public_key, 
        openfhe_private_key 
      };

      // Save the election record using the repository
      const election = await electionRepository.createElection(validatedData);
      res.status(StatusCodes.CREATED).json({
        message: "Keys generated. Election created successfully",
        election
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: `Controller: Failed to create election - ${error.message}`,
      });
    }
  },
  
  

  // Get all elections
  getAllElections: async (req, res) => {
    try {
      const elections = await electionRepository.getAllElections();
      res
        .status(StatusCodes.OK)
        .json({ message: "Elections fetched successfully", elections });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: `Controller: Failed to fetch elections - ${error.message}`,
      });
    }
  },

  // Get election by ID
  getElectionById: async (req, res) => {
    try {
      const election = await electionRepository.getElectionById(req.params.id);
      if (!election) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Controller: Election not found",
        });
      }
      res
        .status(StatusCodes.OK)
        .json({ message: "Election fetched successfully", election });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: `Controller: Failed to fetch election - ${error.message}`,
      });
    }
  },

  // Update election
  updateElection: async (req, res) => { 
    try {
      const updatedElection = await electionRepository.updateElection( 
        req.params.id,
        req.body
      );
      if (!updatedElection) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message:
            "Controller: Election not found or no valid updates provided",
        });
      }
      res
        .status(StatusCodes.OK)
        .json({ message: "Election updated successfully", election: updatedElection });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: `Controller: Failed to update election - ${error.message}`,
      });
    }
  },

  // Delete election
  deleteElection: async (req, res) => {
    try {
      const deletedElection = await electionRepository.deleteElection(req.params.id);
      if (!deletedElection) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Controller: Election not found",
        });
      }
      res
        .status(StatusCodes.OK)
        .json({ message: "Election deleted successfully", election: deletedElection });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: `Controller: Failed to delete election - ${error.message}`,
      });
    }
  },
};

module.exports = electionController;
