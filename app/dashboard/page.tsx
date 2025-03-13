'use client';

import { useEffect, useState } from 'react';
import { Title } from '@/lib/definitions';
import { Movie } from '@/components/Movie';


export default function Page() {
  const [titles, setTitles] = useState<Title[]>([]);

  useEffect(() => {
    async function fetchTitles() {
      const response = await fetch('/api/titles?page=1&minYear=2000&maxYear=2025&genres=drama,comedy', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setTitles(data.title);
        } else {
        setTitles([]);
      }
    }
    fetchTitles();
  }, []);

  return (
      <div>
        {titles.length > 0 ? (
          <div className='grid grid-cols-3 m-0 p-0'>
            {titles.map((title, key) => (
              <Movie key={key} {...title}/>
            ))}
          </div>
        ) : (
          <p>No titles available</p>
        )}
      </div>
    );
}
