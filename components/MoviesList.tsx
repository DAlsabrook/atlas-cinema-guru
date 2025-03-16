'use client';

import { Title } from '@/lib/definitions';
import { Movie } from '@/components/Movie';

type MoviesListProps = {
    titles: Title[]
}

export default function MoviesList(props: MoviesListProps) {
    const titles = props.titles

  return (
      <div>
        {titles.length > 0 ? (
          <div className='grid grid-cols-3 m-0 p-0 w-255'>
            {titles.map((title, key) => (
              <Movie key={key} {...title}/>
            ))}
          </div>
        ) : (
          <p className='w-full'>Loading...</p>
        )}
      </div>
    );
}
