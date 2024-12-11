"use client";
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "./components/Navbar";
import BillBoard from './components/BillBoard';
import MovieList from './components/MovieList';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from './redux/store';

interface Movie {
  type: string;
  id: string;
  thumbnailUrl: string;
  videoUrl: string;
  title: string;
  description: string;
  movieid: string;
  seriesid: string;
}

export default function Home() {
  const [movies, setMovies] = useState<Movie[] | any >([]);
  const [favorites, setFavorites] = useState<{ id: string, type: 'movie' | 'series' }[]>([]);
  const [series, setSeries] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [favoriteDetails, setFavoriteDetails] = useState<Movie[] | any>([]);
  const refresh = useSelector((state : RootState) => state.refreshSlice);

  const fetchMovies = async () => {
    try {
      const response = await fetch(process.env.BASE_URL + '/api/movie');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const allMovies = await response.json();
      setMovies(allMovies.result || []);
    } catch (error: any) {
      console.error("Error fetching movie data:", error);
      setError(error.message);
    }
  };

  const fetchSeries = async () => {
    try {
      const response = await fetch(process.env.BASE_URL + '/api/series');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const allSeries = await response.json();
      setSeries(allSeries.result || []);
    } catch (error: any) {
      console.error("Error fetching series data:", error);
      setError(error.message);
    }
  };
  
  const fetchFavorites = async () => {
    try {
      const response = await fetch(process.env.BASE_URL + '/api/favorite');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const favoriteData = await response.json();
      console.log("Favorite Movies Response:", favoriteData.result); // Debugging line

      if (favoriteData.result) {
        setFavorites(favoriteData.result);
      } else {
        throw new Error("Favorites data is missing or malformed.");
      }
    } catch (error: any) {
      console.error("Error fetching favorite movies:", error);
      setError(error.message);
    }
  };
  
  // Fetch all data
  useEffect(() => {
    fetchMovies();
    fetchSeries();
    fetchFavorites();
  }, [refresh]);

  // Map favorite IDs to corresponding movie or series details
  useEffect(() => {
    if (favorites.length > 0) {
      const mappedFavorites = favorites.map((fav) => {
        if (fav.type === 'movie') {
          const foundMovie = movies.find((movie: { movieid: string; }) => movie.movieid === fav.id);
          if (!foundMovie) {
            console.warn(`Movie with id ${fav.id} not found`);
          }
          return foundMovie;
        }
        if (fav.type === 'series') {
          const foundSeries = series.find((serie) => serie.seriesid === fav.id);
          if (!foundSeries) {
            console.warn(`Series with id ${fav.id} not found`);
          }
          return foundSeries;
        }
        return null;
      });

      // Filter out any null values that might have occurred in the mapping
      setFavoriteDetails(mappedFavorites.filter((fav) => fav !== null) as Movie[]);
    }
  }, [favorites, movies, series]);

  return (
    <>
      <Navbar />
      <BillBoard />
      <div className="pb-40">
        {error && <p className="text-center text-red-500">{error}</p>}
        <MovieList title="Trending now" data={movies} />
        <MovieList title="My List" data={favoriteDetails} />
      </div>
    </>
  );
}
