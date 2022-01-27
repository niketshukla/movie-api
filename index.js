const bodyParser = require("body-parser");
const express = require("express"),
  uuid = require("uuid"),
  morgan = require("morgan");

const app = express();
app.use(bodyParser.json());

let movies = [
  {
    title: "Harry Potter and the Sorcerer's Stone",
    genre: {
      name: "Fantasy Fiction",
      description: "Lorem Ipsum",
    },
    director: {
      name: "J.K. Rowling",
      bio: "Lorem Ipsum",
      dob: 1990,
    },
  },
  {
    title: "Lord of the Rings",
    genre: {
      name: "Adventure Fiction",
      description: "Lorem Ipsum",
    },
    director: {
      name: "J.R.R. Tolkien",
      bio: "Lorem Ipsum",
      dob: 1990,
    },
  },
  {
    title: "Twilight",
    genre: {
      name: "Romance Horror",
      description: "Lorem Ipsum",
    },
    director: {
      name: "Stephanie Meyer",
      bio: "Lorem Ipsum",
      dob: 1990,
    },
  },
  {
    title: "John Wick",
    genre: {
      name: "Action",
      description: "Lorem Ipsum",
    },
    director: {
      name: "Chad Stahelski",
      bio: "Lorem Ipsum",
      dob: 1990,
    },
  },
  {
    title: "American Sniper",
    genre: {
      name: "Action",
      description: "Lorem Ipsum",
    },
    director: {
      name: "Clint Eastwood",
      bio: "Lorem Ipsum",
      dob: 1990,
    },
  },
  {
    title: "Rocky",
    genre: {
      name: "Action",
      description: "Lorem Ipsum",
    },
    director: {
      name: "John G. Avildsen",
      bio: "Lorem Ipsum",
      dob: 1990,
    },
  },
  {
    title: "300",
    genre: {
      name: "Action",
      description: "Lorem Ipsum",
    },
    director: {
      name: "Zack Snyder",
      bio: "Lorem Ipsum",
      dob: 1990,
    },
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
// Read
app.get("/", (req, res) => {
  res.send("Welcome to Myflix");
});
// Read
app.get("/documentation", (req, res) => {
  res.sendFile("public/documentation.html", { root: __dirname });
});
// Read
app.get("/movies", (req, res) => {
  res.json(movies);
});
// Read
app.get("/movies/:title", (req, res) => {
  res.json(
    movies.find((movie) => {
      return movie.title === req.params.title;
    })
  );
});
// Read
app.get("/movies/genre/:genreName", (req, res) => {
  res.json(movies.find((movie) => movie.genre.name === req.params.genreName).genre);
});
// Read
app.get("/movies/director/:directorName", (req, res) => {
  res.json(movies.find((movie) => movie.director.name === req.params.directorName).director);
});
// Create
app.post("/users", (req, res) => {
  let newUser = req.body;

  if (newUser.name) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser);
  } else {
    res.status(400).send("Please give name to the user");
  }
});
// Update
app.put("/users/:name", (req, res) => {
  res.send("User name modified");
});
// Create
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
