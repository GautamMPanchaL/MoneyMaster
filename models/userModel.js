const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        require:true,
        trim:true,
    },

    email: {
        type: String,
        require:true,
        trim:true,
    },
    password: {
        type: String,
        require:true,
        trim:true
    },

    money:{
        type: Number,
        default: 0
    },

    transactions: [] 
});

module.exports = mongoose.model("User", userSchema);