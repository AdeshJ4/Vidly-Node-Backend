const movies = [{ _id: 101, name: "Movie 1" },{ _id: 102, name: "Movie 2" },];
const requestedMovieIds = ['101', '102', '104'];
const foundMovieIds = movies.map((movie) => movie._id.toString());// [ '101', '102' ]

const missingMovieIds = requestedMovieIds.filter(
  (movieId) => !foundMovieIds.includes(movieId)  // ['104']
);

console.log(missingMovieIds);

// if (missingMovieIds.length > 0) {
//   const missingMovieTitles = missingMovieIds.join(", ");
//   return res
//     .status(404)
//     .send(
//       `The following movies are not found in the database: ${missingMovieTitles}`
//     );
// }
