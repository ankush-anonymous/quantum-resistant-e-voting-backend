const voterRepository = require("../repositories/voterRepository");
const {
  validateCreateVoter,
  validateGetVoterById,
  validateUpdateVoter,
} = require("../validators/voterValidator");
const { StatusCodes } = require("http-status-codes");
const axios = require("axios");
const { log } = require("console");
const { generateKeyPair, authenticateVoter } = require("../utils/utils");

const createVoter = async (req, res, next) => {
  try {
    const validatedData = await validateCreateVoter(req.body);

    // Use the utility function to generate the keypair
    const keyPairData = await generateKeyPair();
    const { public_key, private_key } = keyPairData;

    // Combine the validated data with keys
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

const verifyVoterSignature = async (req, res, next) => {
  try {
    const { voter_id, public_key, private_key } = req.body;

    console.log("Sending request to FastAPI:", { voter_id, public_key, private_key });

    // Use the utility function to authenticate the voter
    const verificationData = await authenticateVoter(voter_id, public_key, private_key);

    console.log("Verification Response:", JSON.stringify(verificationData, null, 2));

    res.status(StatusCodes.OK).json({
      success: true,
      data: verificationData,
    });
  } catch (error) {
    if (error.response) {
      console.error("FastAPI Response Error:", error.response.data);
    } else {
      console.error("Error:", error.message);
    }
    if (error.isAxiosError) {
      return next({
        status: StatusCodes.SERVICE_UNAVAILABLE,
        message: "Failed to verify signature with verification service",
        error: error.message,
      });
    }
    next(error);
  }
};

module.exports = {
  createVoter,
  getAllVoters,
  getVoterById,
  updateVoter,
  deleteVoter,
  verifyVoterSignature,
};
