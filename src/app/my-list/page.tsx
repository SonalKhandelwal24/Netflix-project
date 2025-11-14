"use client";
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import MovieList from '../components/MovieList';
import { ToastContainer } from 'react-toastify';

interface MyListProps {
  type: string;
  id: string;
  thumbnailUrl: string;
  videoUrl: string;
  title: string;
  description: string;
  movieid: string;
  seriesid: string;
}

export default function MyList() {
  const [movies, setMovies] = useState<MyListProps[]>([]);
  const [favorites, setFavorites] = useState<{ id: string, type: 'movie' | 'series' }[]>([]);
  const [series, setSeries] = useState<MyListProps[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [favoriteDetails, setFavoriteDetails] = useState<MyListProps[] | any>([]);

  // Fetch movies data
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/movie`);
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

    // Fetch series data
    const fetchSeries = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/series`);
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

    // Fetch favorites data
    const fetchFavorites = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/favorite`);
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
    fetchMovies();
    fetchSeries();
    fetchFavorites();
  }, []);

  // Map favorite IDs to corresponding movie or series details
  useEffect(() => {
    if (favorites.length > 0) {
      const mappedFavorites = favorites.map((fav) => {
        if (fav.type === 'movie') {
          const foundMovie = movies.find((movie) => movie.movieid === fav.id);
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
      setFavoriteDetails(mappedFavorites.filter((fav) => fav !== null) as MyListProps[]);
    }
  }, [favorites, movies, series]);

  return (
    <>
    < ToastContainer />
      <Navbar />
      <div className="pt-32">
        {error && <p className="text-center text-red-500">{error}</p>}
        <MovieList title="My List" data={favoriteDetails} />
      </div>
    </>
  );
}
