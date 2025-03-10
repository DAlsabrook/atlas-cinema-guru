'use client';

import { useEffect, useState } from 'react';
import { Title } from '@/lib/definitions';


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
        console.log("Return data: ", data)
        setTitles(data.title);
        } else {
        console.log(response);
        setTitles([]);
      }
    }
    fetchTitles();
  }, []);

  return (
      <div>
        <div>This is the dashboard</div>
        {titles.length > 0 ? (
          <ul>
            {titles.map((title) => (
              <li key={title.id}>
                <h3>{title.title}</h3>
                <p>{title.synopsis}</p>
                <p>Released: {title.released}</p>
                <p>Genre: {title.genre}</p>
                <img src={title.image} alt={title.title} />
              </li>
            ))}
          </ul>
        ) : (
          <p>No titles available</p>
        )}
      </div>
    );
}
