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

let movies = [
  {
    title: "Harry Potter and the Sorcerer's Stone",
    description:
      "Adaptation of the first of J.K. Rowling's popular children's novels about Harry Potter, a boy who learns on his eleventh birthday that he is the orphaned son of two powerful wizards and possesses unique magical powers of his own.",
    genre: {
      name: "Fantasy Fiction",
      description:
        "Fantasy is a genre of speculative fiction involving magical elements, typically set in a fictional universe and sometimes inspired by mythology and folklore. Its roots are in oral traditions, which then became fantasy literature and drama.",
    },
    director: {
      name: "Alfonso Cuarón",
      bio: "Alfonso Cuarón Orozco is a Mexican filmmaker. Cuarón is the first Mexico-born filmmaker to win the Academy Award for Best Director.",
      birth: "1961",
      death: null,
    },
    imagePath: "https://upload.wikimedia.org/wikipedia/en/6/6b/Harry_Potter_and_the_Philosopher%27s_Stone_Book_Cover.jpg",
    featured: true,
  },
  {
    title: "Harry Potter and the Chamber of Secrets",
    description:
      "Adaptation of the first of J.K. Rowling's popular children's novels about Harry Potter, a boy who learns on his eleventh birthday that he is the orphaned son of two powerful wizards and possesses unique magical powers of his own.",
    genre: {
      name: "Fantasy Fiction",
      description:
        "Fantasy is a genre of speculative fiction involving magical elements, typically set in a fictional universe and sometimes inspired by mythology and folklore. Its roots are in oral traditions, which then became fantasy literature and drama.",
    },
    director: {
      name: "Alfonso Cuarón",
      bio: "Alfonso Cuarón Orozco is a Mexican filmmaker. Cuarón is the first Mexico-born filmmaker to win the Academy Award for Best Director.",
      birth: "1961",
      death: null,
    },
    imagePath: "https://upload.wikimedia.org/wikipedia/en/5/5c/Harry_Potter_and_the_Chamber_of_Secrets.jpg",
    featured: false,
  },
  {
    title: "Lord of the Rings",
    description: "The future of civilization rests in the fate of the One Ring, which has been lost for centuries. Powerful forces are unrelenting in their search for it.",
    genre: {
      name: "Adventure",
      description: "Adventure fiction is a type of romance that usually presents danger, or gives the reader a sense of excitement.",
    },
    director: {
      name: "Peter Jackson",
      bio: "Sir Peter Robert Jackson ONZ KNZM is a New Zealand film director, screenwriter, and film producer.",
      birth: "1961",
      death: null,
    },
    imagePath: "https://upload.wikimedia.org/wikipedia/en/8/8a/The_Lord_of_the_Rings_The_Fellowship_of_the_Ring_%282001%29.jpg",
    featured: true,
  },
  {
    title: "Twilight",
    description: "The Twilight Saga is a series of five vampire-themed romance fantasy films from Summit Entertainment based on the four novels published by author Stephenie Meyer.",
    genre: {
      name: "Romance",
      description:
        "A romance novel or romantic novel generally refers to a type of genre fiction novel which places its primary focus on the relationship and romantic love between two people, and usually has an emotionally satisfying and optimistic ending.",
    },
    director: {
      name: "Bill Condon",
      bio: "William Condon is an American director and screenwriter. Condon is known for writing and/or directing numerous successful and acclaimed films.",
      birth: "1955",
      death: null,
    },
    imagePath: "https://upload.wikimedia.org/wikipedia/en/b/b6/Twilight_%282008_film%29_poster.jpg",
    featured: false,
  },
  {
    title: "John Wick",
    description:
      "John Wick is an American neo-noir action-thriller media franchise created by screenwriter Derek Kolstad and starring Keanu Reeves as John Wick, a former hitman who is forced back into the criminal underworld he abandoned.",
    genre: {
      name: "Action",
      description: "Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats.",
    },
    director: {
      name: "Chad Stahelski",
      bio: "Chad Stahelski is an American stuntman and film director. He is known for his work on Buffy the Vampire Slayer and directing the 2014 film John Wick.",
      birth: "1968",
      death: null,
    },
    imagePath: "https://upload.wikimedia.org/wikipedia/en/9/98/John_Wick_TeaserPoster.jpg",
    featured: true,
  },
  {
    title: "American Sniper",
    description: "U.S. Navy SEAL Chris Kyle (Bradley Cooper) takes his sole mission -- protect his comrades -- to heart and becomes one of the most lethal snipers in American history.",
    genre: {
      name: "Action",
      description: "Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats.",
    },
    director: {
      name: "Clint Eastwood",
      bio: "Clinton Eastwood Jr. is an American actor, film director, producer, and composer.",
      birth: "1930",
      death: null,
    },
    imagePath: "https://upload.wikimedia.org/wikipedia/en/1/10/American_Sniper_poster.jpg",
    featured: true,
  },
  {
    title: "Rocky",
    description: "Rocky is a 1976 American sports drama film written by and starring Sylvester Stallone, and directed by John G. Avildsen.",
    genre: {
      name: "Action",
      description: "Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats.",
    },
    director: {
      name: "John G. Avildsen",
      bio: "John Guilbert Avildsen was an American film director. He is perhaps best known for directing Rocky, which earned him the Academy Award for Best Director.",
      birth: "1935",
      death: "2017",
    },
    imagePath: "https://upload.wikimedia.org/wikipedia/en/1/18/Rocky_poster.jpg",
    featured: true,
  },
  {
    title: "Rocky Balboa",
    description: "Rocky is a 1976 American sports drama film written by and starring Sylvester Stallone, and directed by John G. Avildsen.",
    genre: {
      name: "Action",
      description: "Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats.",
    },
    director: {
      name: "John G. Avildsen",
      bio: "John Guilbert Avildsen was an American film director. He is perhaps best known for directing Rocky, which earned him the Academy Award for Best Director.",
      birth: "1935",
      death: "2017",
    },
    imagePath: "https://upload.wikimedia.org/wikipedia/en/d/db/Rocky_Balboa_%282006%29_theatrical_poster.jpg",
    featured: true,
  },
  {
    title: "300",
    description:
      "In 480 B.C. a state of war exists between Persia, led by King Xerxes (Rodrigo Santoro), and Greece. At the Battle of Thermopylae, Leonidas (Gerard Butler), king of the Greek city state of Sparta, leads his badly outnumbered warriors against the massive Persian army.",
    genre: {
      name: "Action",
      description: "Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats.",
    },
    director: {
      name: "Zack Snyder",
      bio: "Zachary Edward Snyder is an American film director, producer, screenwriter, and cinematographer.",
      birth: "1966",
      death: null,
    },
    imagePath: "https://upload.wikimedia.org/wikipedia/en/5/5c/300poster.jpg",
    featured: false,
  },
  {
    title: "Creed",
    description: "Adonis Johnson (Michael B. Jordan) never knew his famous father, boxing champion Apollo Creed, who died before Adonis was born.",
    genre: {
      name: "Action",
      description: "Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats.",
    },
    director: {
      name: "John G. Avildsen",
      bio: "John Guilbert Avildsen was an American film director. He is perhaps best known for directing Rocky, which earned him the Academy Award for Best Director.",
      birth: "1935",
      death: "2017",
    },
    imagePath: "https://upload.wikimedia.org/wikipedia/en/2/24/Creed_poster.jpg",
    featured: true,
  },
];

let users = [
  {
    name: "Max",
    password: "123456",
    email: "max@gmail.com",
    birthday: "1982-12-01",
    favoriteMovies: [],
  },
  {
    name: "Jane",
    password: "123456",
    email: "jane@gmail.com",
    birthday: "1999-02-05",
    favoriteMovies: [],
  },
  {
    name: "Sam",
    password: "123456",
    email: "sam@gmail.com",
    birthday: "1987-07-13",
    favoriteMovies: [],
  },
  {
    name: "Sid",
    password: "123456",
    email: "sid@gmail.com",
    birthday: "1947-09-13",
    favoriteMovies: [],
  },
  {
    name: "Jack",
    password: "123456",
    email: "jack@gmail.com",
    birthday: "1989-10-09",
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
  Movies.findOne({ "Movies.Title": req.params.title })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});
// Read
app.get("/genre/:genreName", (req, res) => {
  Movies.findOne({ "Genre.Name": req.params.genreName })
    .then((movie) => {
      res.json(movie.genre.description);
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
