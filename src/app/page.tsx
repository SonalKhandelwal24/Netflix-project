"use client";
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "./components/Navbar";
import BillBoard from './components/BillBoard';
import MovieList from './components/MovieList';
import { useEffect, useState } from 'react';

interface Movie {
  id: number;
  thumbnailUrl: string;
  videoUrl: string;
  title: string;
  description: string;
}

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch('http://192.168.1.50:3000/api/movie');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const allMovies = await response.json();
        console.log(allMovies.result); 
        setMovies(allMovies.result || []);
      } catch (error: any) {
        console.error("Error fetching movie data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return <div className="text-white text-lg">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-red-500 text-lg flex justify-center items-center h-[56.25vw]">
        <p>Failed to load movie list. Please try again later.</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
     <BillBoard/>
      <div className="pb-40">
        <MovieList title="Trending Now" data={movies} />
        <MovieList title="My List" data={movies} />
      </div>
    </>
  );
}
