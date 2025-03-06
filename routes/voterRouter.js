const express = require("express");
const router = express.Router();
const voterController = require("../controllers/voterController");

// Get all voters
router.get("/getAllVoters", voterController.getAllVoters);

// Get single voter by ID
router.get("/getVoterById/:id", voterController.getVoterById);

// Create new voter
router.post("/createVoter", voterController.createVoter);

// Update voter
router.patch("/updateVoter/:id", voterController.updateVoter);

// Delete voter
router.delete("/deleteVoter/:id", voterController.deleteVoter);

// Verify voter signature
router.post("/verifySignature", voterController.verifyVoterSignature);

module.exports = router;
