/**
 * Search Component
 *
 * This functional component renders a search input field that allows users
 * to search for movies. It takes two props:
 * - `searchTerm`: The current value of the search input.
 * - `setSearchTerm`: A function to update the search term when the user types.
 *
 * The component includes:
 * - An input field for entering search queries.
 * - A search icon for visual representation.
 * - An event handler that updates the search term state as the user types.
 */

const Search = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="search">
      <div>
        <img src="./search.svg" alt="search icon" />
        <input
          type="text"
          placeholder="Search through thousands of movies" // Placeholder text in input
          value={searchTerm} // Binds input value to searchTerm state
          onChange={e => setSearchTerm(e.target.value)} // Updates searchTerm state when user types
        />
      </div>
    </div>
  );
};

export default Search;
