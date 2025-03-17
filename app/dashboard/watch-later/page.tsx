'use client'

import { useEffect, useState } from 'react';
import MoviesList from "@/components/MoviesList";
import { Title } from '@/lib/definitions';
import { useTitles } from '@/context/TitlesContext';

export default function Page() {
  const [watchLaterTitles, setWatchLaterTitles] = useState<Title[]>([]);
  const { titles } = useTitles();

  useEffect(() => {
    async function fetchWatchLater() {
      try {
        const response = await fetch('/api/watch-later', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          setWatchLaterTitles(data.watchLater);
          console.log(data.watchLater);
        } else {
          console.error('Failed to fetch watch later:', response.statusText);
        }
      } catch (error) {
        console.error('Failed to fetch watch later:', error);
      }
    }

    fetchWatchLater();
  }, [titles]);


  return (
    <div>
      <h2>Watch Later</h2>
      {watchLaterTitles.length > 0 ? (
        <MoviesList titles={watchLaterTitles} page={0} />
      ) : (
        <p>No Watch Later found.</p>
      )}
    </div>
  );
}
