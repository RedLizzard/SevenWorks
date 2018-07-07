const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');

const app = express();

// Load routes
const entries = require('./routes/entries');
const users = require('./routes/users');

// Map global promise - get rid of warning
mongoose.Promise = global.Promise;

// Connect to mongoose
mongoose.connect('mongodb://localhost:27017/redlizzard-dev', {
    useNewUrlParser: true
})
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

//Handlebars middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Method override middleware
app.use(methodOverride('_method'));

// Express-session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));

// Flash middleware
app.use(flash());

// Global variables
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// Index Route
app.get('/', (req, res) => {
    const title = 'Welcome';
    res.render('index', {
        title: title
    });
});

//About Route
app.get('/about', (req, res) => {
    res.render('about');
});

// Use routes
app.use('/entries', entries);
app.use('/users', users);

// Log localhost port if connection is made successfully
const port = 5000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});