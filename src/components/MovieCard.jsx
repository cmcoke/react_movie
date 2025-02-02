/**
 * MovieCard Component
 *
 * This functional component displays a movie card containing:
 *
 * - A movie poster (fetched from TMDB if available, otherwise a fallback image is used).
 * - The movie title.
 * - The movie rating with a star icon.
 * - The original language of the movie.
 * - The release year (extracted from the release date).
 *
 * This component is useful for presenting movie details in a grid or list format.
 */

const MovieCard = ({ movie: { title, vote_average, poster_path, release_date, original_language } }) => {
  return (
    <div className="movie-card">
      <img
        src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : "/no-movie.png"} // Displays the movie poster if available, otherwise a default image
        alt={title} // Sets the movie title as the alt text for accessibility
      />

      <div className="mt-4">
        {" "}
        {/* Adds margin at the top for spacing */}
        <h3>{title}</h3> {/* Displays the movie title */}
        <div className="content">
          <div className="rating">
            <img src="star.svg" alt="Star Icon" />
            <p>{vote_average ? vote_average.toFixed(1) : "N/A"}</p> {/* Shows rating or "N/A" if unavailable */}
          </div>
          <span>•</span> {/* Visual separator */}
          <p className="lang">{original_language}</p>
          <span>•</span> {/* Visual separator */}
          <p className="year">{release_date ? release_date.split("-")[0] : "N/A"}</p> {/* Extracts and displays the release year or "N/A" if unavailable */}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
