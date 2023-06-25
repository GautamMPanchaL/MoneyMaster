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
    console.log(x);

   res.render('dashboard', { puser: user, transactions: user.transactions });
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

res.render("filterTransaction", { puser: x, transactions: filteredTransactions, uniqueOptionsArray:uniqueOptionsArray});

        return res.status(200);
      }
      
    
    // res.redirect("/dashboard/filterTransaction");
    const optionsArray = user.transactions.map(transaction => transaction.trimed);
    const uniqueOptionsArray = [...new Set(optionsArray)];
    res.render("filterTransaction", {puser: x, transactions:user.transactions, uniqueOptionsArray: uniqueOptionsArray});
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
