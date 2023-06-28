const express = require("express");
const jwt = require("jsonwebtoken");
const path = require('path');
const User = require("../models/userModel");
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });


// authentication middleware
exports.isAuthentic = (req, res, next)=>{

    try{
        // extract jwt token
        const token =  req.cookies.MoneyMaster;
        if(!token){
            res.render("error", {error:401, field:"Token missing"});
            return res.status(401);
            // return res.status(401).json({
            //     success:false,
            //     message: "Token missing"
            // });
        }
        
        try{
            const decoded = jwt.verify(token, "process.env.JWT_SECRET")
            
            // console.log(decoded);
            req.user = decoded;
        }
        catch(err){
            res.render("error", {error:401, field:"Invalid token"});
            return res.status(401);
            // return res.status(401).json({
            //     success:false,
            //     message: "Invalid token"
            // });
        }
        next();
    }
    catch(err){
        res.render("error", {error:401, field:"something went wrong.."});
            return res.status(401);
        // return res.status(401).json({
        //         success:false,
        //         message: "something went wrong.."
        //     });
    }
}

