// Import mongoose
const mongoose = require('mongoose');

const booksSchema = {
    name: {
        type: String,
        required: true
    },
    author: {
        type: String
    },
    price: {
        type: String
    },
    availability: {
        type: String
    }
}

//Create, instantiate and export model with schema
const Books = mongoose.model("Book", booksSchema);
module.exports = Books;
