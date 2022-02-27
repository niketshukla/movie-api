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

// CORS integration
const cors = require("cors");
app.use(cors());

//integrating auth.js file for authentication and authorization using HTTP and JWSToken
let auth = require("./auth")(app);
const passport = require("passport");
require("./passport");

// Read
app.get("/", (req, res) => {
  res.send("Welcome to Myflix");
});
// Read
app.get("/documentation", (req, res) => {
  res.sendFile("public/documentation.html", { root: __dirname });
});
// Read
app.get("/movies", passport.authenticate("jwt", { session: false }), (req, res) => {
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
app.get("/movies/:title", passport.authenticate("jwt", { session: false }), (req, res) => {
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
app.get("/genre/:genreName", passport.authenticate("jwt", { session: false }), (req, res) => {
  // because its not a direct key to the movies object we should write genre.name as genre is an object
  Movies.findOne({ "genre.name": req.params.genreName })
    .then((movie) => {
      res.json(movie.genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});
// Read
app.get("/director/:directorName", passport.authenticate("jwt", { session: false }), (req, res) => {
  Movies.findOne({ "director.name": req.params.directorName })
    .then((movie) => {
      res.json(movie.director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});
// Read
app.get("/users", passport.authenticate("jwt", { session: false }), (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});
// Create new user
app.post("/users", (req, res) => {
  let hashedPassword = Users.hashPassword(req.body.password);
  Users.findOne({ username: req.body.username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.username + " Already exists");
      } else {
        Users.create({
          username: req.body.username,
          password: hashedPassword,
          email: req.body.email,
          birthday: req.body.birthday,
        })
          .then((user) => {
            res.status(201).json(user);
          })
          .catch((error) => {
            console.error(error);
            res.status(500).send("Error: " + error);
          });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});
// Update
app.put("/users/:username", passport.authenticate("jwt", { session: false }), (req, res) => {
  Users.findOneAndUpdate(
    { username: req.params.username },
    {
      $set: {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        birthday: req.body.birthday,
      },
    },
    { new: true },
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error" + err);
      } else {
        res.json(updatedUser);
      }
    }
  );
});
// Delete a user
app.delete("/users/:username", passport.authenticate("jwt", { session: false }), (req, res) => {
  Users.findOneAndRemove({ username: req.params.username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.username + " was not found");
      } else {
        res.status(200).send(req.params.username + " was deleted");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error" + err);
    });
});
// Create add movie to fav
app.post("/users/:username/movies/:title", passport.authenticate("jwt", { session: false }), (req, res) => {
  Users.findOneAndUpdate(
    { username: req.params.username },
    {
      $push: { favoriteMovies: req.params.title },
    },
    { new: true },
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error" + err);
      } else {
        res.json(updatedUser);
      }
    }
  );
});
// Delete remove a movie from fav
app.delete("/users/:username/movies/:title", passport.authenticate("jwt", { session: false }), (req, res) => {
  Users.findOneAndUpdate(
    { username: req.params.username },
    {
      $pull: { favoriteMovies: req.params.title },
    },
    { new: true },
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error" + err);
      } else {
        res.json(updatedUser);
      }
    }
  );
});

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
