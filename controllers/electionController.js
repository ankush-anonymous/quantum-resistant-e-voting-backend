const { StatusCodes } = require("http-status-codes");
const electionRepository = require("../repositories/electionRepository");

const electionController = {
  // Create new election
  createElection: async (req, res) => {
    try {
      const election = await electionRepository.createElection(req.body);
      res
        .status(StatusCodes.CREATED)
        .json({ message: "Election created successfully", election });
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
