const fs = require('fs');
const ShortUniqueId = require('short-unique-id');
const uid = new ShortUniqueId({ length: 10 });


async function getMoviesList() {
    const data = fs.readFileSync('movies.json', 'utf8');
    const response = JSON.parse(data);
    return response.movies || [];
}

async function getMovieById(id) {
    const movies = await getMoviesList();
    return movies.find(movie => movie.id === id);
}

async function createMovie(movie) {
    const movies = await getMoviesList();
    const newMovie = { id: uid.rnd(), ...movie };
    movies.push(newMovie);
    fs.writeFileSync('movies.json', JSON.stringify({ movies }));
    return newMovie;
}

async function updateMovie(id, movie) {
    const movies = await getMoviesList();
    const index = movies.findIndex(m => m.id === id);
    console.log(index);
    if (index == -1) {
        console.log('Movie not found');
        return null;
    }
    const updatedMovie = { ...movies[index], ...movie };
    movies[index] = updatedMovie;
    fs.writeFileSync('movies.json', JSON.stringify({ movies }));
    return updatedMovie;
}

async function deleteMovie(id) {
    const movies = await getMoviesList();
    const index = movies.findIndex(m => m.id === id);
    if (index == -1) {
        return null;
    }
    movies.splice(index, 1);
    fs.writeFileSync('movies.json', JSON.stringify({ movies }));
    return true;
}

module.exports = { getMoviesList, getMovieById, createMovie, updateMovie, deleteMovie };
