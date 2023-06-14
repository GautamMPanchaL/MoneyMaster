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
  const { date, credit, debit, description, type} = req.body;
  const trimed = type.trim();
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

    return res.status(200).json({
      success: true,
      message: 'Data inserted in transactions array',
      data: updatedUser,
    });
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
  

    return res.status(200).json({
      success: true,
      message: 'Data inserted in transactions array',
      data: user,
    });
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
    
    return res.status(200).json({
      success: true,
      message: 'Transactions',
      data: user,
    });
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
    const {type} = req.body;
  try {
    // finding user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    // filter the data->>
    const filteredTransactions = user.transactions.filter(transaction => transaction.trimed === type);
    

    
    return res.status(200).json({
      success: true,
      message: 'Filtered transactions',
      data: filteredTransactions,
    });
  } 
  catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch data',
    });
  }
};

