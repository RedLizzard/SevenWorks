const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


// Load Entry Model
require('../models/Entry');
const Entry = mongoose.model('entries');

// Entry Index Page
router.get('/', (req, res) => {
    Entry.find({})
        .sort({ date: 'desc' })
        .then(entries => {
            res.render('entries/index', {
                entries: entries,
            });
        });
});

// Add entry 
router.get('/add', (req, res) => {
    res.render('entries/add');
});

// Edit entry 
router.get('/edit/:id', (req, res) => {
    Entry.findOne({
        _id: req.params.id
    })
        .then(entry => {
            res.render('/edit', {
                entry: entry
            });
        });
});

// Process Form
router.post('/', (req, res) => {
    let errors = [];
    if (!req.body.title) {
        errors.push({ text: 'Please add a title' });
    }
    if (!req.body.details) {
        errors.push({ text: 'Please add some details' });
    }
    if (errors.length > 0) {
        res.render('/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    }
    else {
        const newUser = {
            title: req.body.title,
            details: req.body.details
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
router.put('/:id', (req, res) => {
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
router.delete('/:id', (req, res) => {
    Entry.remove({ _id: req.params.id })
        .then(() => {
            req.flash('success_msg', 'Entry removed!');
            res.redirect('/');
        })
})

module.exports = router;