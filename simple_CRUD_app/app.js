const express = require("express");
const morgan = require("morgan");
const { Client, Pool } = require("pg");
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

let client = new Client({ database: 'inventory' });
let pool = new Pool();


app.use(express.static('public'));

app.set("views", "./views");
app.set("view engine", "pug");
app.use(morgan('common'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', function (req, res) {
  res.render('index');   //render a specific pug file
});

app.get('/get', (req, res) => {
  try {
    pool.connect(async (error, client, release) => {
      let resp = await client.query("SELECT * FROM items WHERE name='Chair'");
      res.send(resp.rows);
      release()
    })
  } catch (error) {
    console.log(error);
  }
});

app.post('/post', (req, res) => {
  try {
    pool.connect(async (error, client, release) => {
      let resp = await client.query(`INSERT INTO items (name) VALUES ('${req.body.POST}')`);
      res.redirect("/inventory");
      release()
    })
  } catch (error) {
    console.log(error);
  }
});


app.post('/update', (req, res) => {
  try {
    console.log(req.body.OldValue);
    console.log(req.body);
    pool.connect(async (error, client, release) => {
      let resp = await client.query(`UPDATE items SET name = '${req.body.newValue}' WHERE name ='${req.body.OldValue}'`);
      res.redirect("/inventory");
      release();
    })
  } catch (error) {
    console.log(error);
  }
});


app.post('/delete', (req, res) => {
  try {
    pool.connect(async (error, client, release) => {
      console.log(req.body.DeleteVAl);
      let resp = await client.query(`DELETE FROM items where name = '${req.body.DeleteVAl}'`);
      res.redirect('/inventory');
      release()
    })
  } catch (error) {
    console.log(error);
  }
});

app.get('/inventory', (req, res) => {
  try {
    pool.connect(async (error, client, release) => {
      let resp = await client.query("SELECT * FROM items");
      res.render('inventory', {
        items: resp.rows
      })
    })
  } catch (error) {
    console.log(error);
  }
});

app.listen(PORT, (req, res) => {
  console.log(`listening on PORT ${PORT}`);
});
