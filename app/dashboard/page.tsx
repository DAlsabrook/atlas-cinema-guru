"use client"

import MoviesList from "@/components/MoviesList"
import { useEffect, useState } from "react";
import { Title } from "@/lib/definitions";

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
      <div className='w-5/6'>
        <MoviesList titles={titles}/>
      </div>
    );
}
