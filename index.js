const bodyParser = require("body-parser");
const express = require("express"),
  uuid = require("uuid"),
  morgan = require("morgan");

const app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname + "/css"));

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
