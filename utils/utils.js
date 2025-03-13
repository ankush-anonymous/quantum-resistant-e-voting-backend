const axios = require("axios");
const PYTHON_URL = process.env.PYTHON_URL

const generateKeyPair = async () => {
  try {
    const response = await axios.get(`${PYTHON_URL}/generate-keypair`);
    return response.data; // e.g., { public_key: "…", private_key: "…" }
  } catch (error) {
    throw new Error("Failed to generate keypair: " + error.message);
  }
};


const authenticateVoter = async (voter_id, voter_dilithium_public_key, voter_dilithium_private_key) => {
  try {
    const response = await axios.post(
      `${PYTHON_URL}/authenticate-voter`,
      {
        voter_id,
        voter_dilithium_public_key,
        voter_dilithium_private_key,
      },
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to authenticate voter: " + error.message);
  }
};

const generateFheKeypair = async() =>{
  try {
    const response = await axios.get(`${PYTHON_URL}/openfhe-keygen`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to generate OpenFHE keypair: " + error.message);
  }
}

module.exports = {
  generateKeyPair,
  authenticateVoter,
  generateFheKeypair
};
