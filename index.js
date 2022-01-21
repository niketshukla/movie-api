const express = require("express");
const morgan = require("morgan");

const app = express();

let myLogger = (req, res, next) => {
  console.log(req.url);
  next();
};

app.use(morgan("common"));

app.get("/", (req, res) => {
  res.send("Welcome to my app!");
});

app.get("/secreturl", (req, res) => {
  res.send("This is a secret url with super top-secret content.");
});

app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
