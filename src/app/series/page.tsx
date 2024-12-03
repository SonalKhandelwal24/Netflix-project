"use client";
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import MovieList from '../components/MovieList';

interface SeriesProps {
  id: number;
  thumbnailUrl: string;
  videoUrl: string;
  title: string;
  description: string;
}

export default function Series() {
  const [series, setSeries] = useState<SeriesProps[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem('authtoken');
        if (!token) throw new Error("Authentication token is missing.");

        const response = await fetch('http://192.168.1.50:3000/api/series');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const allSeries = await response.json();
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
        <MovieList title="Web Series" data={series} />
      </div>
    </>
  );
}
