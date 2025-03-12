const axios = require("axios");
const PYTHON_URL = process.env.PYTHON_URL

/**
 * Generates a post-quantum key pair by calling the FastAPI keypair endpoint.
 * @returns {Promise<Object>} Resolves with an object containing { public_key, private_key }.
 */
const generateKeyPair = async () => {
  try {
    const response = await axios.get(`${PYTHON_URL}/generate-keypair`);
    return response.data; // e.g., { public_key: "…", private_key: "…" }
  } catch (error) {
    throw new Error("Failed to generate keypair: " + error.message);
  }
};

/**
 * Authenticates a voter's signature by calling the FastAPI authentication endpoint.
 * @param {string} voter_id - The voter identifier.
 * @param {string} public_key - The voter's public key (in hex or Base64 as required).
 * @param {string} private_key - The voter's private key (in hex or Base64 as required).
 * @returns {Promise<Object>} Resolves with the verification response data.
 */
const authenticateVoter = async (voter_id, public_key, private_key) => {
  try {
    const response = await axios.post(
      `${PYTHON_URL}/authenticate-voter`,
      {
        voter_id,
        public_key,
        private_key,
      },
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to authenticate voter: " + error.message);
  }
};

module.exports = {
  generateKeyPair,
  authenticateVoter,
};
