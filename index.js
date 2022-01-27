const bodyParser = require("body-parser");
const express = require("express"),
  uuid = require("uuid"),
  morgan = require("morgan");

const app = express();
app.use(bodyParser.json());

let movies = [
  {
    title: "Harry Potter and the Sorcerer's Stone",
    genre: "Fantasy Fiction",
    director: "J.K. Rowling",
  },
  {
    title: "Lord of the Rings",
    genre: "Adventure Fiction",
    director: "J.R.R. Tolkien",
  },
  {
    title: "Twilight",
    genre: "Romance Horror",
    director: "Stephanie Meyer",
  },
  {
    title: "John Wick",
    genre: "Action",
    director: "Chad Stahelski",
  },
  {
    title: "American Sniper",
    genre: "Action",
    director: "Clint Eastwood",
  },
  {
    title: "Rocky",
    genre: "Action",
    director: "John G. Avildsen",
  },
  {
    title: "300",
    genre: "Action",
    director: "Zack Snyder",
  },
];

let users = [
  {
    id: 1,
    name: "Max",
    favoriteMovies: [],
  },
  {
    id: 2,
    name: "Jane",
    favoriteMovies: ["Creed"],
  },
  {
    id: 3,
    name: "Sam",
    favoriteMovies: [],
  },
];

// use morgan for loggin into the log.txt
app.use(morgan("common"));

app.get("/", (req, res) => {
  res.send("Welcome to Myflix");
});

app.get("/documentation", (req, res) => {
  res.sendFile("public/documentation.html", { root: __dirname });
});

app.get("/movies", (req, res) => {
  res.json(movies);
});

app.get("/movies/:title", (req, res) => {
  res.json(
    movies.find((movie) => {
      return movie.title === req.params.title;
    })
  );
});

app.get("/movies/:genre", (req, res) => {
  res.json(
    movies.find((movie) => {
      return movie.genre === req.params.genre;
    })
  );
});

app.get("/movies/:director", (req, res) => {
  res.json(
    movies.find((movie) => {
      return movie.director === req.params.director;
    })
  );
});

app.post("/users", (req, res) => {
  res.send("New user registered");
});

app.put("/users/:name", (req, res) => {
  res.send("User name modified");
});

app.post("/users/:favorites", (req, res) => {
  res.send("Movie added to favorites");
});

app.post("/users", (req, res) => {
  res.send("User removed");
});

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
