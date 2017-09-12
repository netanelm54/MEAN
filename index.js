const express = require('express');
const app = express();
const mongoose = require('mongoose');
const config = require('./config/database');

mongoose.Promise = global.Promise;
mongoose.connect(config.uri, (err) => {
    if(err)
        console.log('Faild to connect database: ', err);
    else
        console.log('Connected to datebase: ' + config.db);
});

app.get('*', (req, res) => {
    res.send('hello my friend');
});

app.listen(8080, () => {
    console.log("Listening on port 8080...");
});