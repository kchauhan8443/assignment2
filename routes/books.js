const express = require('express');
const router = express.Router();

const Book = require('../models/book');

function IsLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}


router.get('/', IsLoggedIn, (req, res, next) => {
    Book.find((err, books) => {
        if (err) {
            console.log(err);
        }
        else {
            res.render('books/index', {
                title: 'Library books list',
                dataset: books,
                user: req.user
            });
        }
    });
});

router.get('/add', IsLoggedIn, (req, res, next) => {
    res.render('books/add', {
        title: 'Add a new Book',
        user: req.user
    });
});

router.post('/add', IsLoggedIn, (req, res, next) => {
    Book.create(
        {
            name: req.body.name,
            author: req.body.author,
            price: req.body.price,
            availability: req.body.availability
        },
        (err, newProject) => {
            if (err) {
                console.log(err);
            }
            else {
                res.redirect('/books');
            }
        }
    );
});

router.get('/delete/:_id', IsLoggedIn, (req, res, next) => {
    Book.remove(
        {
            _id: req.params._id
        },
        (err) => {
            if (err) {
                console.log(err);
            }
            else {
                res.redirect('/books');
            }
        });
});

router.get('/edit/:_id', IsLoggedIn, (req, res, next) => {
    Book.findById(req.params._id, (err, book) => {
        if (err) {
            console.log(err);
        }
        else {
            res.render('books/edit', {
                title: 'Update a Book',
                book: book
            })
        }
    })
});
router.post('/edit/:_id', IsLoggedIn, (req, res, next) => {
    Book.findOneAndUpdate(
        {  
            _id: req.params._id
        }, 
        {   
            name: req.body.name,
            author: req.body.author,
            price: req.body.price,
            availability: req.body.availability
        }, 
        (err, updatedProject) => { 
            if (err) {
                console.log(err);
            }
            else {
                res.redirect('/books');
            }
        } 
    )
});

module.exports = router;