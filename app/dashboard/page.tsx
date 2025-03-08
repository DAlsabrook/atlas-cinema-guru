'use client';

import { useEffect, useState } from 'react';
import { Title } from '@/lib/definitions';


export default function Page() {
  const [titles, setTitles] = useState<Title[]>([]);

  useEffect(() => {
    async function fetchTitles() {
      const response = await fetch('/api/favorites', {
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
      {/* <ul>
        {titles.map((title) => (
          <li key={title.id}>
            <div>{title.title}</div>
            <div>Released: {title.released}</div>
            <div>Genre: {title.genre}</div>
          </li>
        ))}
      </ul> */}
    </div>
  );
}
