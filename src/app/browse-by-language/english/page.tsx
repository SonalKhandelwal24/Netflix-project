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
  const [series, setSeries] = useState<BrowseByLanguageProps[]>([]);
  const [error, setError] = useState<string | null>(null);

  // movies data fetching
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem('authtoken');
        if (!token) throw new Error("Authentication token is missing.");

        const response = await fetch('http://192.168.1.50:3000/api/series');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const allSeries  = await response.json();
        setSeries(allSeries.result || []);
      } catch (error: any) {
        console.error("Error fetching favorite list", error);
        setError(error.message);
      }
    };

    fetchFavorites();
  }, [])

  return (
    <>
      <Navbar />
      <div className="pt-32">
        <MovieList title="Hollywood Movies" data={series} />
      </div>
    </>
  );
}
