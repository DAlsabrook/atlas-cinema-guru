"use client"

import { useEffect, useState } from "react";
import MoviesList from "@/components/MoviesList";
import Search from "@/components/Search";
import { Title } from "@/lib/definitions";

export default function Page() {
  const [titles, setTitles] = useState<Title[]>([]);
  const [query, setQuery] = useState<string>('');
  const [minYear, setMinYear] = useState<string>('');
  const [maxYear, setMaxYear] = useState<string>('');
  const [genre, setGenre] = useState<string[]>(['']);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    setPage(1);
  }, [query, minYear, maxYear, genre]);

  useEffect(() => {
    async function fetchTitles() {
      const queryParams = new URLSearchParams();

      if (query) queryParams.append('query', query);
      if (minYear) queryParams.append('minYear', minYear);
      if (maxYear) queryParams.append('maxYear', maxYear);
      if (genre.length > 0) queryParams.append('genres', genre.join(','));
      queryParams.append('page', page.toString());

      const response = await fetch(`/api/titles?${queryParams.toString()}`, {
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
  }, [query, minYear, maxYear, genre, page]);


  const handlePrevPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div className='flex flex-col justify-center items-center'>
      <Search setQuery={setQuery} setMinYear={setMinYear} setMaxYear={setMaxYear} setGenre={setGenre}/>
      <MoviesList titles={titles}/>
      <div className="flex justify-between mt-4">
        <button onClick={handlePrevPage} disabled={page === 1}>
          Prev
        </button>
        <span>Page {page}</span>
        <button onClick={handleNextPage}>
          Next
        </button>
      </div>
    </div>
  );
}
