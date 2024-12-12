"use client";
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
import Navbar from '@/app/components/Navbar';
import MovieList from '@/app/components/MovieList';
import { ToastContainer } from 'react-toastify';

interface BrowseByLanguageProps {
  id: number;
  thumbnailUrl: string;
  videoUrl: string;
  title: string;
  description: string;
}

export default function BrowseByLanguage() {
  const [series, setSeries] = useState<BrowseByLanguageProps[] | any>([]);

  // movies data fetching
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem('authtoken');
        if (!token) throw new Error("Authentication token is missing.");

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/series`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const allSeries  = await response.json();
        setSeries(allSeries.result || []);
      } catch (error: any) {
        console.error("Error fetching favorite list", error);
      }
    };

    fetchFavorites();
  }, [])

  return (
    <>      
    <ToastContainer />
      <Navbar />
      <div className="pt-32">
        <MovieList title="Hollywood Movies" data={series} />
      </div>
    </>
  );
}
