"use client";
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import MovieList from '../components/MovieList';

interface NewPopularProps {
  id: number;
  thumbnailUrl: string;
  videoUrl: string;
  title: string;
  description: string;
}

export default function NewPopular() {
  const [films, setFilms] = useState<NewPopularProps[] | any>([]);

  // movies data fetching
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem('authtoken');
        if (!token) throw new Error("Authentication token is missing.");

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/movie`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const allMovies  = await response.json();
        setFilms(allMovies.result || []);
      } catch (error: any) {
        console.error("Error fetching favorite list", error);
      }
    };

    fetchFavorites();
  }, [])

  return (
    <>
      <Navbar />
      <div className="pt-32 ">
        <MovieList title="New & Popular" data={films} />
      </div>
    </>
  );
}
