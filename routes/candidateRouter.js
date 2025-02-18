const express = require("express");
const router = express.Router();
const candidateController = require("../controllers/candidateController");

// Create new candidate
router.post("/createCandidate", candidateController.createCandidate);

// Get all candidates
router.get("/getAllCandidates", candidateController.getAllCandidates);

// Get candidate by ID
router.get("/getCandidateById/:id", candidateController.getCandidateById);

// Update candidate
router.put("/updateCandidateById/:id", candidateController.updateCandidateById);

// Delete candidate
router.delete(
  "/deleteCandidateById/:id",
  candidateController.deleteCandidateById
);

module.exports = router;
