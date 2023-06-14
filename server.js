require("dotenv").config();
const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');
app.use(cookieParser());

const PORT = process.env.PORT;

app.use(express.json());

require("./config/database").connect();

// route

const user = require("./routes/user");

app.use("/", user);


// server

app.listen(3000, ()=>{
    console.log(`Server started at ${PORT}`);
})
