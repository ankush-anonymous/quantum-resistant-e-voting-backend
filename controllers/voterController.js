const voterRepository = require("../repositories/voterRepository");
const {
  validateCreateVoter,
  validateGetVoterById,
  validateUpdateVoter,
} = require("../validators/voterValidator");
const { StatusCodes } = require("http-status-codes");
const axios = require("axios");
const { log } = require("console");

const createVoter = async (req, res, next) => {
  try {
    const validatedData = await validateCreateVoter(req.body);

    // Get dilithium keys from Python server
    const keyResponse = await axios.get("http://0.0.0.0:8000/generate-keypair");
    const { public_key, private_key } = keyResponse.data;

    // Combine validated data with keys
    const voterData = {
      ...validatedData,
      dilithium_public_key: public_key,
      dilithium_private_key: private_key,
    };

    const voter = await voterRepository.createVoter(voterData);

    res.status(StatusCodes.CREATED).json({
      success: true,
      data: voter,
    });
  } catch (error) {
    // Handle specific axios errors
    if (error.isAxiosError) {
      return next({
        status: StatusCodes.SERVICE_UNAVAILABLE,
        message: "Failed to generate keypair from key service",
        error: error.message,
      });
    }
    next(error);
  }
};

const getAllVoters = async (req, res, next) => {
  try {
    const voters = await voterRepository.getAllVoters();
    res.status(StatusCodes.OK).json({
      success: true,
      data: voters,
    });
  } catch (error) {
    next(error);
  }
};

const getVoterById = async (req, res, next) => {
  try {
    await validateGetVoterById(req.params.id);
    const voter = await voterRepository.getVoterById(req.params.id);
    if (!voter) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Voter not found",
      });
    }
    res.status(StatusCodes.OK).json({
      success: true,
      data: voter,
    });
  } catch (error) {
    next(error);
  }
};

const updateVoter = async (req, res, next) => {
  try {
    await validateGetVoterById(req.params.id);

    const validatedData = await validateUpdateVoter(req.body);
    console.log(validatedData);
    const voter = await voterRepository.updateVoter(
      req.params.id,
      validatedData
    );
    if (!voter) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Voter not found",
      });
    }
    res.status(StatusCodes.OK).json({
      success: true,
      data: voter,
    });
  } catch (error) {
    next(error);
  }
};

const deleteVoter = async (req, res, next) => {
  try {
    const voter = await voterRepository.deleteVoter(req.params.id);
    if (!voter) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Voter not found",
      });
    }
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Voter deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createVoter,
  getAllVoters,
  getVoterById,
  updateVoter,
  deleteVoter,
};
