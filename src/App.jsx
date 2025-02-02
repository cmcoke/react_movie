/**
 * This React application fetches and displays movie data using the TMDB API.
 *
 * Features:
 * - Users can search for movies, and results update dynamically with debouncing to reduce API calls.
 * - Fetches and displays trending movies.
 * - Handles API errors and loading states gracefully.
 * - Utilizes React hooks for state management and side effects.
 */

import { useEffect, useState } from "react";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import { useDebounce } from "react-use";
import { getTrendingMovies, updateSearchCount } from "./appwrite.js";

// Base URL for TMDB API
const API_BASE_URL = "https://api.themoviedb.org/3";

// API Key retrieved from environment variables
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

// API request options with headers
const API_OPTIONS = {
  method: "GET", // HTTP GET method to fetch data
  headers: {
    accept: "application/json", // Request JSON response format
    Authorization: `Bearer ${API_KEY}` // Authorization token for TMDB API
  }
};

const App = () => {
  // State for debounced search term
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // State for user input search term
  const [searchTerm, setSearchTerm] = useState("");

  // State to store fetched movies
  const [movieList, setMovieList] = useState([]);

  // State to store error messages
  const [errorMessage, setErrorMessage] = useState("");

  // State to track loading status
  const [isLoading, setIsLoading] = useState(false);

  // State to store trending movies
  const [trendingMovies, setTrendingMovies] = useState([]);

  // Debounce the search term to prevent excessive API requests
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  // Function to fetch movies based on search query
  const fetchMovies = async (query = "") => {
    setIsLoading(true); // Set loading state to true
    setErrorMessage(""); // Clear previous error messages

    try {
      // Construct API endpoint based on search query
      const endpoint = query ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}` : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      // Fetch data from TMDB API
      const response = await fetch(endpoint, API_OPTIONS);

      // Throw an error if the response is not successful
      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }

      // Parse the JSON response
      const data = await response.json();

      // Handle API errors
      if (data.Response === "False") {
        setErrorMessage(data.Error || "Failed to fetch movies"); // Set error message
        setMovieList([]); // Clear movie list
        return;
      }

      // Update movie list with fetched data
      setMovieList(data.results || []);

      // Update search count if search results exist
      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      console.error(`Error fetching movies: ${error}`); // Log error to console
      setErrorMessage("Error fetching movies. Please try again later."); // Display error message
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  // Function to fetch trending movies
  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies(); // Fetch trending movies
      setTrendingMovies(movies); // Update trending movies state
    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`); // Log error to console
    }
  };

  // Fetch movies when debounced search term changes
  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  // Fetch trending movies on initial render
  useEffect(() => {
    loadTrendingMovies();
  }, []);

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle
          </h1>

          {/* Search component for user input */}
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {/* Display trending movies if available */}
        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>
            <ul>
              {/* Map through trending movies and display each */}
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="all-movies">
          <h2>All Movies</h2>

          {/* Show spinner if loading, error message if failed, otherwise display movies */}
          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map(movie => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};
export default App;
