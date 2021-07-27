const express = require('express');
const morgan = require('morgan');
const path = require('path');
const routes = require('./routes');
require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 3333;

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join( __dirname, './../build' )));

app.use('/users', routes);

app.listen(PORT, () => console.log(`Express listening on ${PORT}`) );