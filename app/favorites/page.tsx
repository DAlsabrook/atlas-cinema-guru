'use client'

import { useEffect, useState } from 'react';
import MoviesList from "@/components/MoviesList";
import { Title } from '@/lib/definitions';
import { useTitles } from '@/context/TitlesContext';

export default function Page() {
  const [favoriteTitles, setFavoriteTitles] = useState<Title[]>([]);
  const { titles } = useTitles();

  useEffect(() => {
    async function fetchFavorites() {
      try {
        const response = await fetch('/api/favorites', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          setFavoriteTitles(data.favorites);
          console.log(data.favorites);
        } else {
          console.error('Failed to fetch favorites:', response.statusText);
        }
      } catch (error) {
        console.error('Failed to fetch favorites:', error);
      }
    }

    fetchFavorites();
  }, [titles]);


  return (
    <div>
      <h2>Favorites</h2>
      {favoriteTitles.length > 0 ? (
        <MoviesList titles={favoriteTitles} page={0} />
      ) : (
        <p>No favorites found.</p>
      )}
    </div>
  );
}
