const axios = require("axios");
const { log } = require("console");

const verifyVoterSignatureUtil = async (voterId, publicKey, privateKey) => {
  try {
    // console.log(voterId);
    const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8000";

    const response = await axios.get(`${API_BASE_URL}/authenticate-voter`, {
      params: {
        voterId,
        publicKey,
        privateKey,
      },
    });

    const { is_Authenticated, signature } = response.data;
    return { is_Authenticated, signature };
  } catch (error) {
    console.error("Error verifying voter signature:", error);
    throw error;
  }
};

module.exports = { verifyVoterSignatureUtil };
