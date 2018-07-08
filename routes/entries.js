const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../helpers/auth'); // Pulls out a specific function from the required js file

// Load Entry Model
require('../models/Entry');
const Entry = mongoose.model('entries');

// Entry Index Page
router.get('/', ensureAuthenticated, (req, res) => {
    Entry.find({user: req.user.id})
        .sort({ date: 'desc' })
        .then(entries => {
            res.render('entries/index', {
                entries: entries,
            });
        });
});

// Add entry 
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('entries/add');
});

// Edit entry 
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Entry.findOne({
        _id: req.params.id
    })
        .then(entry => {
            if(entry.user != req.user.id){
                req.flash('error_msg', 'Not authorised');
                res.redirect('/entries');
            }
            else{
                res.render('entries/edit', {
                    entry: entry
                });
            }
        });
});

// Process Form
router.post('/', ensureAuthenticated, (req, res) => {
    let errors = [];
    if (!req.body.title) {
        errors.push({ text: 'Please add a title' });
    }
    if (!req.body.details) {
        errors.push({ text: 'Please add some details' });
    }
    if (errors.length > 0) {
        res.render('entries/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    }
    else {
        const newUser = {
            title: req.body.title,
            details: req.body.details,
            user: req.user.id 
        };
        new Entry(newUser)
            .save()
            .then(entry => {
                req.flash('success_msg', 'Entry added!');
                res.redirect('/');

            })
    }

});

//Edit Form Process
router.put('/:id', ensureAuthenticated, (req, res) => {
    Entry.findOne({
        _id: req.params.id
    })
        .then(entry => {
            // new values
            entry.title = req.body.title,
                entry.details = req.body.details

            entry.save()
                .then(entry => {
                    req.flash('success_msg', 'Entry updated!');
                    res.redirect('/');
                })
        })
});

// Delete Entry
router.delete('/:id', ensureAuthenticated, (req, res) => {
    Entry.findOneAndRemove({ _id: req.params.id })
        .then(() => {
            req.flash('success_msg', 'Entry removed!');
            res.redirect('/');
        }).catch(err=> {
            req.flash('error_msg', err);
            res.redirect('/entries');
        });
});

module.exports = router;