const express = require('express');
const exphbs = require('express-handlebars');

const app = express();

//Handlebars middleware
app.engine('handlebars', exphbs(    {defaultLayout: 'main'} ));
app.set('view engine', 'handlebars');

//How middleware works
// app.use((req, res, next)=>{
//     console.log(Date.now());
//     req.name = 'Harry Potter';
//     next();
// });

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

const port = 5000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});