const express = require("express");

const router = express.Router();

const {login , signup} = require("../controllers/auth");
const {insertnew, profile, filterTransaction, dashboard} = require("../controllers/insertnew");
const {isAuthentic} = require("../middlewares/auht");
router.post("/login", login);

router.post("/signup", signup);



// profile page route
router.get("/user/profile",isAuthentic, profile);

// dashboard to see the transcations
router.get("/dashboard", isAuthentic, dashboard);

// to insert new transcation 
router.post("/dashboard/insertnew", insertnew);

// to view filtered transcation data
router.post("/dashboard/filterTransaction",isAuthentic,  filterTransaction);

module.exports = router;