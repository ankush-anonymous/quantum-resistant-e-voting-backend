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

const verifyVoterSignature = async (req, res, next) => {
  try {
    const { voter_id, public_key, private_key } = req.body;

    console.log("Sending request to FastAPI:", {
      voter_id: voter_id,
      public_key: public_key,
      private_key: private_key,
    });

    // Make request to verification service
    const verificationResponse = await axios.post(
      "http://0.0.0.0:8000/authenticate-voter",
      {
        voter_id: voter_id,
        public_key: public_key,
        private_key: private_key,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    console.log(
      "Verification Response:",
      JSON.stringify(verificationResponse.data, null, 2)
    );

    res.status(StatusCodes.OK).json({
      success: true,
      data: verificationResponse.data,
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
