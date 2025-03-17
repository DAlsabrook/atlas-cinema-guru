"use client"

import { Title } from '@/lib/definitions';
import Movie from '@/components/Movie';
import { useEffect } from 'react';

type MoviesListProps = {
  titles: Title[];
  page: number
};

export default function MoviesList(props: MoviesListProps) {

  return (
    <div>
      {props.titles.length > 0 ? (
        <div className='grid grid-cols-3 m-0 p-0 max-w-7xl'>
          {props.titles.map((title, key) => (
            <Movie key={key} {...title} page={props.page}/>
          ))}
        </div>
      ) : (
        <p className='w-full'>Loading Movies...</p>
      )}
    </div>
  );
}
