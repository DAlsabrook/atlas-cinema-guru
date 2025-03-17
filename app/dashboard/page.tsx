"use client"

import { useEffect, useState } from "react";
import MoviesList from "@/components/MoviesList";
import Search from "@/components/Search";
import { useTitles } from "@/context/TitlesContext";

export default function Page() {
  const { titles, setTitles } = useTitles();
  const [query, setQuery] = useState<string>('');
  const [minYear, setMinYear] = useState<string>('');
  const [maxYear, setMaxYear] = useState<string>('');
  const [genre, setGenre] = useState<string[]>(['']);
  const [page, setPage] = useState<number>(1);
  const [pageLimit, setPageLimit] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setPage(1);
  }, [query, minYear, maxYear, genre]);

  async function fetchTitles() {
    setLoading(true);
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
      if (data.title.length < 6) {
        setPageLimit(true);
      } else {
        setPageLimit(false);
      }
    } else {
      setTitles([]);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchTitles();
  }, [query, minYear, maxYear, genre, page, setTitles]);

  useEffect(() => {
    if (!loading && titles.length === 0) {
      // Force rerender if titles not loaded correctly
      fetchTitles();
    }
  }, [loading, titles]);

  const handlePrevPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div className='flex flex-col justify-center items-center'>
      <Search setQuery={setQuery} setMinYear={setMinYear} setMaxYear={setMaxYear} setGenre={setGenre}/>
      {loading ? (
        <div className="w-full h-screen"></div>
      ) : (
        <MoviesList titles={titles} page={page}/>
      )}
      <div className="flex justify-between mt-4 w-3xs">
        <button className="bg-green-dark p-4 w-1/2 rounded-l-4xl text-blue-atlas" onClick={handlePrevPage} disabled={page === 1}>
          Previous
        </button>
        <button className="bg-green-dark p-4 w-1/2 rounded-r-4xl ml-1 text-blue-atlas" onClick={handleNextPage} disabled={pageLimit}>
          Next
        </button>
      </div>
    </div>
  );
}
