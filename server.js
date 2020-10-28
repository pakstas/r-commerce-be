const express = require("express");
const bp = require("body-parser");
const cors = require("cors");
const mysql = require("mysql");
require("dotenv").config();

const app = express();

const port = process.env.SERVER_PORT || 3003;

const con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
});

con.connect((err) => {
  if (err) throw err;
  console.log("Connected to DB");
});

app.use(bp.json());
app.use(cors());

const cities = ["vilnius", "kaunas", "klaipeda"];

app.get("/:city", (req, res) => {
  if (cities.includes(req.params.city.toLowerCase().trim())) {
    con.query(
      `SELECT * FROM products WHERE city = '${req.params.city
        .toLowerCase()
        .trim()}'`,
      (err, result) => {
        if (err) {
          console.log(err);
          res.status(400).send("Trouble with DB");
        }
        res.json(result);
      }
    );
  } else {
    res.status(400).send("not ok");
  }
});

app.get("/", (req, res) => {
  res.status(400).send("City not defined");
});

app.listen(port, console.log(`The server is UP on port: ${port}`));
