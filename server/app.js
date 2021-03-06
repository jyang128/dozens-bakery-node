const express = require('express');
const mysql = require('mysql');
const path = require('path');
const creds = require('./mysql_credentials.js');

const app = express();
const PORT = process.env.PORT || 3001;
const db = mysql.createConnection(creds);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '/server/public')));

app.get('/api/products', function (req, res) {
  db.connect(function () {
    let query = '';
    if (!req.query.id) {
      query = 'SELECT * from `products`';
    } else if (isNaN(req.query.id)) {
      res.send({ success: false, error: 'Number required for product ID' });
      return;
    } else {
      query = 'SELECT * FROM `products` WHERE id=' + req.query.id;
    }

    db.query(query, function (error, data) {
      if (error) {
        res.send({ success: false, error });
      } else if (data.length === 0) {
        res.send({ success: false, error: 'No product results' });
      } else {
        res.send(data);
      }
    });
  });
});

app.get('/api/orders', function (req, res) {
  db.connect(function () {
    const orderId = req.query.orderId;

    if (orderId === undefined || isNaN(orderId)) {
      res.send({ success: false, error: 'Number required for order ID' });
      return;
    }

    const query = 'SELECT * FROM `orders` WHERE id=' + orderId;

    db.query(query, function (error, data) {
      if (error) {
        res.send({ success: false, error });
      } else if (data.length === 0) {
        res.send({ success: false, error: 'No orders found' });
      } else {
        res.send(data);
      }
    });
  });
});

app.post('/api/orders', function (req, res) {
  const { name, phoneNum, specialInstr, cart } = req.body;
  const dateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

  if (name === undefined || phoneNum === undefined) {
    res.send({
      success: false,
      error: 'Invalid name or phone number'
    });
    return;
  }

  if (name.length < 2) {
    res.send({ success: false, error: 'Invalid name' });
    return;
  }

  let phoneNumRegex = /^1?\(?([0-9]{3})\)?[-.]?([0-9]{3})[-.]?([0-9]{4})$/gm;
  if (!phoneNumRegex.test(phoneNum)) {
    res.send({ success: false, error: 'Not a valid phone number format.' });
    return;
  }

  db.connect(function () {

    const query = `INSERT INTO \`orders\` (customer_name, phone_number, special_instr, cart_items, timestamp)
      VALUES (?, ?, ?, ?, ?)`;

    db.query(query, [name, phoneNum, specialInstr, cart, dateTime], function (error, data) {
      if (!error) {
        res.send({ orderId: data.insertId });
      } else {
        res.send({ success: false, error });
      }
    });
  });
});

app.get('*', (req, res) => {
  res.sendStatus(404);
});

app.use(function (err, req, res, next) {
  if (err) {
    console.error(err);
    res.status(err.status || 500).json('Something went wrong!!');
  }
  next();
});

app.listen(PORT, function () {
  console.log(`server is listening at ${PORT}`);
});
