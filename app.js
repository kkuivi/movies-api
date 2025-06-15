var express = require("express");
var app = express();

app.use(express.json());

const records = require("./records.js");

app.get("/", (req, res) => {
  res.send("Welcom to Movies API");
});

app.get("/movies", async (req, res) => {
  try {
    const movies = await records.getMoviesList();
    res.status(200).json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/movies/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const movie = await records.getMovieById(id);

    if (!movie) {
      res.status(404).json({ error: "Movie not found" });
      return;
    }

    res.status(200).json(movie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/movies", async (req, res) => {
  try {
    const movie = req.body;
    if (!movie.title || !movie.overview) {
      res.status(400).json({ error: "Title and overview are required" });
      return;
    }

    const newMovie = await records.createMovie(movie);
    res.status(201).json(newMovie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/movies/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const movie = req.body;

    if (!movie.title || !movie.overview) {
      res.status(400).json({ error: "Title and overview are required" });
      return;
    }

    const updatedMovie = await records.updateMovie(id, movie);
    if (!updatedMovie) {
      res.status(404).json({ error: "Movie not found" });
      return;
    }

    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/movies/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const deletedMovie = await records.deleteMovie(id);
    if (!deletedMovie) {
      res.status(404).json({ error: "Movie not found" });
      return;
    }

    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use((req, res, next) => {
  next({ status: 404, message: "Not found" });
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message });
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
