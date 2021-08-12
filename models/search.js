const mongoose = require('mongoose');

// This is search app for online library
const searchSchema = {
    name: {
        type: String, 
        required: true
    },
    authour: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    availability: {
        type: String
    }
}

const books = mongoose.model("books", searchSchema);
module.exports = books;

