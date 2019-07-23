const express = require('express');
const mysql = require('mysql');
const path = require('path');
const creds = require('./server/public/api/mysql_credentials.js');

const app = express();
const port = 3001;
const db = mysql.createConnection(creds);

db.connect(err => {
  if (err) throw err;
  console.info('Connected to database');
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, '/server/public')));

// routes here

app.use(function (err, req, res, next) {
  if (err) {
    console.error(err);
    res.status(err.status || 500).json('Something broke!');
  }
  next();
});

app.listen(port, function () {
  console.info(`server is listening on port ${port}`);
});