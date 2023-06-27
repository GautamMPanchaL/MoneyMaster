const express = require("express");
const router = express.Router();

const cookieParser = require("cookie-parser");
const app = express();
app.use(cookieParser());

const {login , signup ,logout} = require("../controllers/auth");
const {insertnew, profile, filterTransaction, dashboard, newtransaction, filterTransactionpage} = require("../controllers/insertnew");
const {isAuthentic} = require("../middlewares/auht");

router.get("/",(req,res)=>{
    res.render('index');
});

router.get("/login",(req,res)=>{
    // console.log(req.cookies);
    const str = req.cookies.signup;
    res.clearCookie("signup");
    // console.log(str);
    res.render('login',{opt : str});
});

router.post("/login", login);

router.get("/signup",(req,res)=>{
    res.render('signup');
});

router.post("/signup",signup);

// profile page route
router.get("/user/profile",isAuthentic, profile);

// dashboard to see the transcations
router.get("/dashboard", isAuthentic, dashboard);

// to insert new transcation 

router.get("/dashboard/insertnew",isAuthentic, newtransaction);

router.post("/dashboard/insertnew",isAuthentic, insertnew);

// to view filtered transcation data

router.get("/dashboard/filterTransaction",isAuthentic,  filterTransaction);

router.post("/dashboard/filterTransaction",isAuthentic,  filterTransaction);

router.post("/logout", logout);

module.exports = router;