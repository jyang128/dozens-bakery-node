const express = require('express');
const mysql = require('mysql');
const path = require('path');
const creds = require('./mysql_credentials.js');

const app = express();
const port = 3001;
const db = mysql.createConnection(creds);

db.connect(err => {
  if (err) throw err;
  console.log('Connected to database');
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '/server/public')));

app.get('/api/products', function(request, response){
  db.connect( function(){

    const query = "SELECT * from `products`";
    
    db.query( query, function( error, data ){
      if(error) {
        response.send({ success: false, error });
      } else { 
        const output = data;
        response.send( output );
      }
    });
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'server/public/index.html'));
});

app.use(function (err, req, res, next) {
  if (err) {
    console.error(err);
    res.status(err.status || 500).json('Something went wrong!!');
  }
  next();
});

app.listen(port, function () {
  console.log(`server is listening at http://localhost:${port}`);
});
