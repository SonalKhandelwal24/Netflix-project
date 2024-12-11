"use client";
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
import Navbar from '@/app/components/Navbar';
import MovieList from '@/app/components/MovieList';

interface BrowseByLanguageProps {
  id: number;
  thumbnailUrl: string;
  videoUrl: string;
  title: string;
  description: string;
}

export default function BrowseByLanguage() {
  const [films, setFilms] = useState<BrowseByLanguageProps[] | any>([]);

  // movies data fetching
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem('authtoken');
        if (!token) throw new Error("Authentication token is missing.");

        const response = await fetch(`${process.env.BASE_URL}/api/movie`);
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
        <MovieList title="Hindi Movies" data={films} />
      </div>
    </>
  );
}
