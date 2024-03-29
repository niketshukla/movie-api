// myFlixDB
const bodyParser = require("body-parser");

const express = require("express"),
  uuid = require("uuid"),
  morgan = require("morgan");

// integration between your REST API and your database layer using Mongoose
const mongoose = require("mongoose");
const Models = require("./modal.js");

const Movies = Models.Movie;
const Users = Models.User;

// mongoose.connect("mongodb://localhost:27017/test", { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });
// Mongoose end

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/css"));

// use morgan for loggin into the log.txt
app.use(morgan("common"));

// CORS integration
/**
 * cors
 * @constant
 * @type {object}
 * @default
 */
const cors = require("cors");
app.use(cors());

//integrating auth.js file for authentication and authorization using HTTP and JWSToken
let auth = require("./auth.js");
const passport = require("passport");
require("./passport");
auth(app);

// For input validation
const { check, validationResult } = require("express-validator");

// Read
/**
 * redirects root to index.html
 * @param {express.request} req
 * @param {express.response} res
 */
app.get("/", (req, res) => {
  res.send("Welcome to Myflix");
});
// Read
app.get("/documentation", (req, res) => {
  res.sendFile("public/documentation.html", { root: __dirname });
});
// Read
/**
 * /movies end-point
 * method: get
 * get all movies
 * @param {express.request} req
 * @param {express.response} res
 */
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
/**
 * /movies/:Title end-point
 * method: gt
 * movies by title
 * @param {express.request} req
 * @param {express.response} res
 */
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
/**
 * /genre end-point
 * method: get
 * get description of a genre by name
 * @param {express.request} req
 * @param {express.response} res
 */
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
/**
 * /directors end-point
 * method: get
 * director by name
 * @param {express.request} req
 * @param {express.response} res
 */
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
/**
 * /users end-point
 * method: get
 * get all user profiles
 * @param {express.request} req
 * @param {express.response} res
 */
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
// Get a user by username
/**
 * /users end-point
 * method: get
 * get user by username
 * @param {express.request} req
 * @param {express.response} res
 */
app.get('/users/:username', passport.authenticate("jwt", { session: false }), (req, res) => {
  Users.findOne({ username: req.params.username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});
// Create new user
/**
 * /users end-point
 * method: post
 * register user profile
 * expects Username, Password, Email, Birthday
 * @param {express.request} req
 * @param {express.response} res
 */
app.post(
  "/users",
  // Validation logic here for request
  //you can either use a chain of methods like .not().isEmpty()
  //which means "opposite of isEmpty" in plain english "is not empty"
  //or use .isLength({min: 5}) which means
  //minimum value of 5 characters are only allowed
  [
    check("username", "Username is required").isLength({ min: 5 }),
    check("username", "Username contains non alphanumeric characters - not allowed.").isAlphanumeric(),
    check("password", "Password is required").not().isEmpty(),
    check("email", "Email does not appear to be valid").isEmail(),
  ],
  (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
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
  }
);
// Update
/**
 * /users/ end-point
 * method: put
 * update user's profile
 * @param {express.request} req
 * @param {express.response} res
 */
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
/**
 * /users end-point
 * method: delete
 * delete user's profile
 * @param {express.request} req
 * @param {express.response} res
 */
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
/**
 * /users end-point
 * method: post
 * add movie to user's favorites
 * @param {express.request} req
 * @param {express.response} res
 */
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
/**
 * /users end-point
 * method: delete
 * delete a movie from user's favorites
 * @param {express.request} req
 * @param {express.response} res
 */
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

const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log("Listening on Port " + port);
});
