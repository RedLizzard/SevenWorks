const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

// Map global promise - get rid of warning
mongoose.Promise = global.Promise;

// Connect to mongoose
mongoose.connect('mongodb://localhost:27017/redlizzard-dev', {
    useNewUrlParser: true
})
    .then(()=> console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

// Load Entry Model
require('./models/Entry');
const Entry = mongoose.model('entries');

//Handlebars middleware
app.engine('handlebars', exphbs(    {defaultLayout: 'main'} ));
app.set('view engine', 'handlebars');

//How middleware works
// app.use((req, res, next)=>{
//     console.log(Date.now());
//     req.name = 'Harry Potter';
//     next();
// });

// Body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Index Route
app.get('/', (req, res)=>{
    const title = 'Welcome';
    res.render('index', {
        title: title
    });
});

//About Route
app.get('/about', (req, res)=>{
    res.render('about');
});

// Entry Index Page
app.get('/entries', (req, res)=>{
    Entry.find({})
        .sort({date:'desc'})
        .then(entries=>{
            res.render('entries/index', {
                entries: entries,
            });
        }); 
});

// Add entry 
app.get('/entries/add', (req, res)=>{
    res.render('entries/add');
});

// Process Form
app.post('/entries', (req, res)=>{
    let errors = [];
    if(!req.body.Title){
        errors.push({text: 'Please add a title'});
    }
    if(!req.body.Details){
        errors.push({text: 'Please add some details'});
    }
    if(errors.length > 0) {
        res.render('entries/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    }
    else{
        const newUser = {
            title: req.body.Title,
            details: req.body.Details
        };
        new Entry(newUser)
            .save()
            .then(entries => {
                res.redirect('/entries');
            })
    }
    
});

// Log localhost port if connection is made successfully
const port = 5000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});