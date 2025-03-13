const express = require("express");
const router = express.Router();
const electionController = require("../controllers/electionController");

router.post("/createElection", electionController.createElection);
router.get("/getAllElections", electionController.getAllElections);
router.get("/getElectionById/:id", electionController.getElectionById);
router.patch("/updateElectionById/:id", electionController.updateElection);
router.delete("/deleteElectionById/:id", electionController.deleteElection);

module.exports = router;
