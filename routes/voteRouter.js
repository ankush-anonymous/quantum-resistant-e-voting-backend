const express = require("express");
const router = express.Router();
const voteController = require("../controllers/voteController");



// Create new vote
router.post("/createVote", voteController.createVote);


module.exports = router;
