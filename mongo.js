const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/LoginFormPractice")
    .then(() => {
        console.log('mongoose connected');
    })
    .catch((e) => {
        console.log('failed');
    });

const logInSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const userDetailsSchema = new mongoose.Schema({
    name: String,
    firstName: String,
    lastName: String,
    dateOfBirth: Date,
    aadhaarNumber: String,
    address: String
});

const randomNumberSchema = new mongoose.Schema({

    randomNumber: {
        type: Number,
        required: true
    },
   
});


const merchantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const LogInCollection = mongoose.model('LogInCollection', logInSchema);
const UserDetails = mongoose.model('details', userDetailsSchema);
const RandomNumber = mongoose.model('randomNumbers', randomNumberSchema); // New model for storing random numbers
const Merchant = mongoose.model('merchant', merchantSchema); // New model for merchant collection

module.exports = { LogInCollection, UserDetails, RandomNumber, Merchant }; // Export all models
