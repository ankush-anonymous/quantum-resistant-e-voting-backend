const { StatusCodes } = require("http-status-codes");
const candidateRepository = require("../repositories/candidateRepository");

const candidateController = {
  // Create new candidate
  createCandidate: async (req, res) => {
    try {
      const candidate = await candidateRepository.createCandidate(req.body);
      res
        .status(StatusCodes.CREATED)
        .json({ message: "Candidate Created successfully", candidate });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: `Controller: Failed to create candidate - ${error.message}`,
      });
    }
  },

  // Get all candidates
  getAllCandidates: async (req, res) => {
    try {
      const candidates = await candidateRepository.getAllCandidates();
      res
        .status(StatusCodes.OK)
        .json({ message: "Candidates Fetched successfully", candidates });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: `Controller: Failed to fetch candidates - ${error.message}`,
      });
    }
  },

  // Get candidate by ID
  getCandidateById: async (req, res) => {
    try {
      const candidate = await candidateRepository.getCandidateById(
        req.params.id
      );
      if (!candidate) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Controller: Candidate not found",
        });
      }
      res
        .status(StatusCodes.OK)
        .json({ message: "Candidate Fetched successfully", candidate });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: `Controller: Failed to fetch candidate - ${error.message}`,
      });
    }
  },

  // Update candidate
  updateCandidateById: async (req, res) => {
    try {
      const updatedCandidate = await candidateRepository.updateCandidateById(
        req.params.id,
        req.body
      );
      if (!updatedCandidate) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message:
            "Controller: Candidate not found or no valid updates provided",
        });
      }
      res
        .status(StatusCodes.OK)
        .json({ message: "Candidate Updated successfully", updatedCandidate });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: `Controller: Failed to update candidate - ${error.message}`,
      });
    }
  },

  // Delete candidate
  deleteCandidateById: async (req, res) => {
    try {
      const deletedCandidate = await candidateRepository.deleteCandidateById(
        req.params.id
      );
      if (!deletedCandidate) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Controller: Candidate not found",
        });
      }
      res
        .status(StatusCodes.OK)
        .json({ message: "Candidate Deleted successfully", deletedCandidate });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: `Controller: Failed to delete candidate - ${error.message}`,
      });
    }
  },
};

module.exports = candidateController;
