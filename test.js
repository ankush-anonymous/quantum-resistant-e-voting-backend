const axios = require("axios");

async function getKeys() {
  try {
    const response = await axios.get("http://0.0.0.0:8000/generate-keypair");
    const { public_key, private_key } = response.data; // Adjust depending on response structure
    console.log("Public Key:", public_key);
    console.log("Private Key:", private_key); // Be cautious with logging private keys
  } catch (error) {
    console.error("Error fetching keys:", error);
  }
}

getKeys();
