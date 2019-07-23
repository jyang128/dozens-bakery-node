const express = require('express'); 
const mysql = require('mysql');
const creds = require('./mysql_credentials.js');
const db = mysql.createConnection( creds );
const fs = require('fs');
const server = express();

server.use( express.static(__dirname + '/server/public') ); 

server.listen( 3001, function(){
    console.log('server is listening on port 3001');
})