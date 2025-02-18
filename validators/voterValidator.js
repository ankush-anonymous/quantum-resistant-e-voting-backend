const Joi = require("joi");

// Schema for creating a new voter
const createVoterSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().trim().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 2 characters long",
    "string.max": "Name cannot exceed 50 characters",
  }),

  email: Joi.string().email().required().trim().messages({
    "string.email": "Please provide a valid email address",
    "string.empty": "Email is required",
  }),
});

// Schema for getting voter by ID
const getVoterByIdSchema = Joi.object({
  id: Joi.string().required().messages({
    "string.empty": "Voter ID is required",
  }),
});

// Schema for updating voter
const updateVoterSchema = Joi.object({
  name: Joi.string().min(2).max(50).trim().messages({
    "string.min": "Name must be at least 2 characters long",
    "string.max": "Name cannot exceed 50 characters",
  }),

  email: Joi.string().email().trim().messages({
    "string.email": "Please provide a valid email address",
  }),
}).min(1); // Require at least one field to be present

const validateCreateVoter = async (voterData) => {
  try {
    return await createVoterSchema.validateAsync(voterData, {
      abortEarly: false,
      stripUnknown: true,
    });
  } catch (error) {
    throw formatValidationError(error);
  }
};

const validateGetVoterById = async (id) => {
  try {
    return await getVoterByIdSchema.validateAsync(
      { id },
      {
        abortEarly: false,
      }
    );
  } catch (error) {
    throw formatValidationError(error);
  }
};

const validateUpdateVoter = async (voterData) => {
  try {
    return await updateVoterSchema.validateAsync(voterData, {
      abortEarly: false,
      stripUnknown: true,
    });
  } catch (error) {
    throw formatValidationError(error);
  }
};

const formatValidationError = (error) => ({
  status: 400,
  message: "Validation Error",
  errors: error.details.map((detail) => ({
    field: detail.path.join("."),
    message: detail.message,
  })),
});

module.exports = {
  validateCreateVoter,
  validateGetVoterById,
  validateUpdateVoter,
};
