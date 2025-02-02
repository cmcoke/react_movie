/**
 * Appwrite Database Utility Functions
 *
 * This script provides functions to interact with an Appwrite database, specifically:
 *
 * - `updateSearchCount`: Checks if a search term exists in the database, updates the count if it does, or creates a new record if it doesn't.
 * - `getTrendingMovies`: Retrieves the top 5 most searched movies based on the search count.
 *
 * It uses the Appwrite SDK for client-server interactions, querying, updating, and creating documents in a specified database collection.
 */

import { Client, Databases, ID, Query } from "appwrite";

// Retrieve environment variables for Appwrite configuration
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID; // Appwrite project identifier
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID; // Appwrite database identifier
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID; // Appwrite collection identifier

// Initialize the Appwrite client
const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1") // Sets the API endpoint for Appwrite
  .setProject(PROJECT_ID); // Links the client to the specific Appwrite project

// Create a database instance using the configured client
const database = new Databases(client);

/**
 * updateSearchCount Function
 *
 * This function checks if a given search term exists in the database.
 * - If the term exists, it increments the search count.
 * - If the term doesn't exist, it creates a new record with the search term and count set to 1.
 */
export const updateSearchCount = async (searchTerm, movie) => {
  try {
    // Query the database to check if the search term already exists
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("searchTerm", searchTerm) // Filters for existing records with the searchTerm
    ]);

    // If the search term exists, update the count
    if (result.documents.length > 0) {
      const doc = result.documents[0]; // Get the first matching document

      // Increment the existing search count
      await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
        count: doc.count + 1 // Increase the count by 1
      });
    } else {
      // If the search term does not exist, create a new record
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm, // Stores the search term
        count: 1, // Initializes the count to 1
        movie_id: movie.id, // Stores the movie's unique ID
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}` // Saves the movie poster URL
      });
    }
  } catch (error) {
    console.error(error); // Logs any errors that occur during the process
  }
};

/**
 * getTrendingMovies Function
 *
 * Retrieves the top 5 most searched movies from the database, ordered by the search count in descending order.
 */
export const getTrendingMovies = async () => {
  try {
    // Query the database to get the top 5 most searched movies
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(5), // Limits the result to 5 documents
      Query.orderDesc("count") // Orders results by search count in descending order
    ]);

    return result.documents; // Returns the list of trending movies
  } catch (error) {
    console.error(error); // Logs errors if any occur
  }
};
