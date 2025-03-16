"use client"

import { useState, useEffect } from 'react';
import { Title } from '@/lib/definitions';
import Movie from '@/components/Movie';
import { useUser } from '@/context/UserContext';

type MoviesListProps = {
  titles: Title[];
};

export default function MoviesList(props: MoviesListProps) {
  const { user } = useUser();
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const titles = props.titles;

  useEffect(() => {
    const fetchFavorites = async () => {
      if (user?.email) {
        const response = await fetch('/api/favorites', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          const favoriteIds = data.favorites.map((favorite: { id: string }) => favorite.id);
          setFavoriteIds(favoriteIds);
          console.log(favoriteIds)
        }
      }
    };

    fetchFavorites();
  }, [user]);

  return (
    <div>
      {titles.length > 0 ? (
        <div className='grid grid-cols-3 m-0 p-0 max-w-7xl'>
          {titles.map((title, key) => (
            <Movie key={key} {...title} isFavorited={favoriteIds.includes(title.id)} />
          ))}
        </div>
      ) : (
        <p className='w-full'>Loading...</p>
      )}
    </div>
  );
}
