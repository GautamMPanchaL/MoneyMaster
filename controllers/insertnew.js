const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const express = require("express");
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const cookieParser = require('cookie-parser');



exports.insertnew = async (req, res) => {
  const token = req.cookies.MoneyMaster;
  const decodedToken = jwt.verify(token, "process.env.JWT_SECRET");
  const userId = decodedToken.id;
  console.log(req.body);
  let { date, credit, debit, description, transaction_option, additional} = req.body;
  if(transaction_option === "Other")
    transaction_option = additional;
  const trimed = transaction_option.trim();
  try {
    // finding user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    // Add the transaction to the user's transactions array
    user.transactions.unshift({ date, credit, debit, description, trimed});
    // update the money
    user.money += parseFloat(credit);
    user.money -=  parseFloat(debit);
    const updatedUser = await user.save();
    let x = JSON.stringify(user);
    console.log(x);
    res.redirect("/dashboard");
    return res.status(200);
  } 
  catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Failed to insert data in transactions array',
    });
  }
};



exports.profile = async (req, res) => {
  console.log("profile");
  console.log(req.body);
  const token = req.cookies.MoneyMaster;
  const decodedToken = jwt.verify(token, "process.env.JWT_SECRET");
  const userId = decodedToken.id;
  try {
    // finding user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    if(user.transactions.length>1){
        user.transactions = user.transactions.sort(function(x,y){
            return new Date(y.date)-new Date(x.date);
        });
      }
    console.log("in profile");
    console.log(user);

    let x = JSON.stringify(user);
    console.log(x);

    res.render('profile',{puser : x});
    return res.status(200);
  } 
  catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch the profile data',
    });
  }
};

// route for edithing the existing transaction 
exports.dashboard = async (req, res) => {

  const userId = req.user.id;
  try {
    // finding user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    let x = JSON.stringify(user);
    console.log("Inside dashboard");
    console.log(x);
    let arr = user.transactions;
    
    // added sorting and filtering for this month

    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    const firstDay = yyyy + '-' + mm + '-' + "01";
    console.log(firstDay);
    let farr = user.transactions;
    console.log(farr);
    if(user.transactions.length>0){
      farr = arr.sort(function (x,y){
          return new Date(y.date)-new Date(x.date);
        });
      farr = farr.filter(function (x){
        return x.date>=firstDay;
      });
    }
    let exp = 0,ear = 0;
    for(var i = 0;i<farr.length;i++){
      exp += parseInt(farr[i].debit);
      ear += parseInt(farr[i].credit);
    }
    console.log(farr);
    console.log(exp);
    console.log(ear);

    let tp = JSON.stringify(farr);
    // console.log(tp);
    // console.log("dono");
    // end 

    res.render('dashboard', { puser: x, transactions: farr,exp : exp,ear : ear,ptransactions : tp});
    return res.status(200);
  } 
  catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch data',
    });
  }

};

exports.filterTransaction = async (req, res) => {

    const userId = req.user.id;
    try {
      // finding user
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }
      if(user.transactions.length>1){
        user.transactions = user.transactions.sort(function(x,y){
            return new Date(y.date)-new Date(x.date);
        });
      }

      let x = JSON.stringify(user); 
      console.log(x);
      if (req.body.hasOwnProperty('type')) {
        const { type, from, to } = req.body;

      // Parse the from and to dates
      const startDate = new Date(from);
      const endDate = new Date(to);

      let filteredTransactions;
      if (type === "All") {
        filteredTransactions = user.transactions.filter(transaction => {
          const transactionDate = new Date(transaction.date);
          return transactionDate >= startDate && transactionDate <= endDate;
        });
      } else {
          filteredTransactions = user.transactions.filter(transaction => {
          const transactionDate = new Date(transaction.date);
          return transaction.trimed === type &&
            transactionDate >= startDate &&
            transactionDate <= endDate;
          });
        }
      const optionsArray = user.transactions.map(transaction => transaction.trimed);
    const uniqueOptionsArray = [...new Set(optionsArray)];
      let farr = filteredTransactions;
      farr = farr.sort(function (x,y){
          return new Date(y.date)-new Date(x.date);
        });
        let exp = 0,ear = 0;
    for(var i = 0;i<farr.length;i++){
      exp += parseInt(farr[i].debit);
      ear += parseInt(farr[i].credit);
    }
    let tp = JSON.stringify(farr);
    // console.log("Happy");
      let sdt = startDate.toISOString().substring(0,10);
      let edt = endDate.toISOString().substring(0,10);
      // console.log(startDate.toISOString().substring(0,10));
      // console.log(endDate.toISOString().substring(0,10));
      res.render("filterTransaction", { puser: x, transactions: farr, uniqueOptionsArray:uniqueOptionsArray,exp : exp,ear : ear,ptransactions : tp,startDate : sdt,endDate : edt});

        return res.status(200);
      }
      
    
    // res.redirect("/dashboard/filterTransaction");
    const optionsArray = user.transactions.map(transaction => transaction.trimed);
    const uniqueOptionsArray = [...new Set(optionsArray)];
    let farr = user.transactions;
    farr = farr.sort(function (x,y){
          return new Date(y.date)-new Date(x.date);
        });
      let exp = 0,ear = 0;
    for(var i = 0;i<farr.length;i++){
      exp += parseInt(farr[i].debit);
      ear += parseInt(farr[i].credit);
    }
    let tp = JSON.stringify(farr);
    res.render("filterTransaction", {puser: x, transactions:farr, uniqueOptionsArray: uniqueOptionsArray,exp : exp,ear : ear,ptransactions : tp,startDate : undefined,endDate : undefined});
    // return res.status(200).json({
    //   success: true,
    //   message: 'Filtered transactions',

    // });
  } 
  catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch data',
    });
  }
};


exports.newtransaction = async (req, res) => {

  console.log("in new transaction");
  console.log(req.body);
  const token = req.cookies.MoneyMaster;
  const decodedToken = jwt.verify(token, "process.env.JWT_SECRET");
  const userId = decodedToken.id;
  try {
    // finding user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    console.log("on transaction page");
    console.log(user);

    let x = JSON.stringify(user);
    console.log(x);
   
    res.render('insertnew',{puser : x});
    return res.status(200);
  }
  catch(error){
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch data',
    });
  }
}
