"use client";
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import MovieList from '../components/MovieList';
import { ToastContainer } from 'react-toastify';

interface MovieProps {
  id: number;
  thumbnailUrl: string;
  videoUrl: string;
  title: string;
  description: string;
  genre: string;
  duration: string;
  movieid : string,
}

export default function Films() {
  const [movies, setMovies] = useState<MovieProps[] | any>([]);

  useEffect(() => {
    const fetchFilms = async () => {
      try {
        const token = localStorage.getItem('authtoken');
        if (!token) throw new Error("Authentication token is missing.");

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/movie`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const allMovies  = await response.json();
        setMovies(allMovies.result || []);
      } catch (error: any) {
        console.error("Error fetching favorite list", error);
      }
    };

    fetchFilms();
  }, [])

  return (
    <>
      <ToastContainer />
      <Navbar />
      <div className="pt-32 ">
        <MovieList title="All Films" data={movies} />
      </div>
    </>
  );
}
