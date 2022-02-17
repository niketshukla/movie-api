const bodyParser = require("body-parser");

const express = require("express"),
  uuid = require("uuid"),
  morgan = require("morgan");

// integration between your REST API and your database layer using Mongoose
const mongoose = require("mongoose");
const Models = require("./modal.js");

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect("mongodb://localhost:27017/test", { useNewUrlParser: true, useUnifiedTopology: true });
// Mongoose end

const app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname + "/css"));

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
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});
// Read
app.get("/movies/:title", (req, res) => {
  Movies.findOne({ title: req.params.title })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});
// Read
app.get("/movies/genre/:genreName", (req, res) => {
  Movies.findOne({ "genre.name": req.params.genreName })
    .then((movie) => {
      res.json(movie.genre.name);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});
// Read
app.get("/movies/director/:directorName", (req, res) => {
  res.json(movies.find((movie) => movie.director.name === req.params.directorName).director);
});
// Read
app.get("/users", (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});
// Create
app.post("/users", (req, res) => {
  const newUser = req.body;

  if (newUser.name) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser);
  } else {
    res.status(400).send("Please give name to the user");
  }
});
// Update
app.put("/users/:id", (req, res) => {
  const updatedUser = req.body;
  // this is destructuring so no need to write (req.params.id)
  const { id } = req.params;
  // Checking if user exists
  let user = users.find((user) => user.id == id);
  if (user) {
    user.name = updatedUser.name;
    res.status(200).json(user);
  } else {
    res.status(400).send("User not found");
  }
});
// Create
app.post("/users/:id/:movieTitle", (req, res) => {
  const { id, movieTitle } = req.params;
  // Checking if user exists
  let user = users.find((user) => user.id == id);
  if (user) {
    user.favoriteMovies.push(movieTitle);
    res.status(200).send(`${movieTitle} has been added to ${user.name}'s favorites`);
  } else {
    res.status(400).send("Please add movie title to add to favorites");
  }
});
// Delete
app.delete("/users/:id/:movieTitle", (req, res) => {
  const { id, movieTitle } = req.params;
  // Checking if user exists
  let user = users.find((user) => user.id == id);
  if (user) {
    user.favoriteMovies = user.favoriteMovies.filter((title) => title !== movieTitle);
    res.status(200).send(`${movieTitle} has been removed from ${user.name}'s favorites`);
  } else {
    res.status(400).send("Please add movie title to remove from favorites");
  }
});

// Delete
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  // Checking if user exists
  let user = users.find((user) => user.id == id);
  if (user) {
    // We have used users instead of user as we have to modify user array by deleting a record
    users = users.filter((e) => e.id == id);
    res.status(200).send(`${user.name} with id ${id} has been deregistered`);
  } else {
    res.status(400).send("Please add id to deregister");
  }
});

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
