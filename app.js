const express = require('express');

const app = express();

//How middleware works
app.use((req, res, next)=>{
    console.log(Date.now());
    req.name = 'Harry Potter';
    next();
});

// Index Route
app.get('/', (req, res)=>{
    console.log(req.name)
    res.send('INDEX');
});

//About Route
app.get('/about', (req, res)=>{
    res.send('ABOUT');
});

const port = 5000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});