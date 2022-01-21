const express = require("express"),
  morgan = require("morgan");

const app = express();

let topMovies = [
  {
    title: "Harry Potter and the Sorcerer's Stone",
    director: "J.K. Rowling",
  },
  {
    title: "Lord of the Rings",
    director: "J.R.R. Tolkien",
  },
  {
    title: "Twilight",
    director: "Stephanie Meyer",
  },
  {
    title: "John Wick",
    director: "Chad Stahelski",
  },
  {
    title: "American Sniper",
    director: "Clint Eastwood",
  },
  {
    title: "Rocky",
    director: "John G. Avildsen",
  },
  {
    title: "300",
    director: "Zack Snyder",
  },
];

app.use(morgan("common"));

// app.get("/", (req, res) => {
//   res.send("Welcome to my app!");
// });
app.get("/", (req, res) => {
  res.send("Welcome to Myflix");
});

app.get("/documentation", (req, res) => {
  res.sendFile("public/documentation.html", { root: __dirname });
});

app.get("/top-movies", (req, res) => {
  res.json(topMovies);
});

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
