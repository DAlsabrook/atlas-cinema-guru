import { useState, useEffect } from 'react';

type SearchProps = {
    setQuery: (query: string) => void,
    setMinYear: (minYear: string) => void,
    setMaxYear: (maxYear: string) => void,
    setGenre: (genre: string[]) => void
}

export default function Search({ setQuery, setMinYear, setMaxYear, setGenre }: SearchProps) {
    const genres = ['drama', 'thriller', 'action', 'horror', 'romance', "sci-Fi", "fantasy", "mystery", "western", "adventure"];
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 1990 + 1 }, (_, i) => (1990 + i).toString());

    const [minYear, updateMinYear] = useState<string>('1990');
    const [maxYear, updateMaxYear] = useState<string>(currentYear.toString());

    const handleGenreClick = (genre: string) => {
        setSelectedGenres((prevSelectedGenres) => {
            if (prevSelectedGenres.includes(genre)) {
                return prevSelectedGenres.filter((g) => g !== genre);
            } else {
                return [...prevSelectedGenres, genre];
            }
        });
    };

    useEffect(() => {
        setGenre(selectedGenres);
    }, [selectedGenres, setGenre]);

    const handleMinYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        updateMinYear(value);
        setMinYear(value);
        if (parseInt(value) > parseInt(maxYear)) {
            updateMaxYear(value);
            setMaxYear(value);
        }
    };

    const handleMaxYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        updateMaxYear(value);
        setMaxYear(value);
        if (parseInt(value) < parseInt(minYear)) {
            updateMinYear(value);
            setMinYear(value);
        }
    };

    return (
        <div className="flex flex-col md:flex-row justify-between w-full max-w-7xl">
            <div className='m-2 w-1/4'>
                <div className="m-2">
                    <label className='flex flex-col'>
                        Query:
                        <input
                            className='border border-green-light rounded-3xl bg-blue-atlas-light px-3 py-1'
                            placeholder='Search Movies...'
                            type="text"
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </label>
                </div>
                <div className='flex w-full'>
                    <div className="m-2 w-1/2">
                        <label className='flex flex-col'>
                            Min Year:
                            <select
                                className='border border-green-light rounded-3xl bg-blue-atlas-light px-3 py-1'
                                value={minYear}
                                onChange={handleMinYearChange}
                            >
                                {years.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                    <div className="m-2 w-1/2">
                        <label className='flex flex-col'>
                            Max Year:
                            <select
                                className='border border-green-light rounded-3xl bg-blue-atlas-light px-3 py-1'
                                value={maxYear}
                                onChange={handleMaxYearChange}
                            >
                                {years.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                </div>
            </div>

            <div className='m-4'>
                <p>Genres</p>
                <div className="flex flex-wrap w-90">
                    {genres.map((genre) => (
                        <button
                            className={`h-fit m-1 py-1 px-2 cursor-pointer text-sm font-light items-center justify-center border border-green-light rounded-4xl ${selectedGenres.includes(genre) ? 'bg-green-light text-blue-atlas' : ''}`}
                            key={genre}
                            onClick={() => handleGenreClick(genre)}
                        >
                            {genre}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
