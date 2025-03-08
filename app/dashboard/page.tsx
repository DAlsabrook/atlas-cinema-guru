'use client';

import { useEffect, useState } from 'react';
import { Title } from '@/lib/definitions';


export default function Page() {
  const [titles, setTitles] = useState<Title[]>([]);

  useEffect(() => {
    async function fetchTitles() {
      const response = await fetch('http://localhost:3000/api/titles?genres=action', {
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
        <p>{titles.length > 0 ? titles[0].title : 'No title available'}</p>
    </div>
  );
}
