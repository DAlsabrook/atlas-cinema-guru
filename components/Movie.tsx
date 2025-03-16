"use client"

import { useState, useEffect } from 'react';
import { Title } from "@/lib/definitions";
import { Star, Clock } from "lucide-react";
import { useUser } from "@/context/UserContext";

type MovieProps = Title & {
  isFavorited: boolean;
};

export default function Movie(props: MovieProps) {
  const title = props;
  const { user } = useUser();
  const [isFavorited, setIsFavorited] = useState(props.isFavorited);
  const [isWatchLater, setIsWatchLater] = useState(false);

  // useEffect(() => {
  //   const checkWatchLaterStatus = async () => {
  //     if (user?.email) {
  //       const watchLaterExistsStatus = await fetch(`/api/watch-later/${title.id}`, {
  //         method: 'GET',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //       }).then(res => res.json()).then(data => data.exists);

  //       setIsWatchLater(watchLaterExistsStatus);
  //     }
  //   };

  //   if (user) {
  //     checkWatchLaterStatus();
  //   }
  // }, [user, title.id]);

  const handleAddFavorite = async () => {
    try {
      await fetch(`/api/favorites/${title.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setIsFavorited(true);
    } catch (error) {
      console.error('Failed to add favorite:', error);
    }
  };

  const handleRemoveFavorite = async () => {
    try {
      await fetch(`/api/favorites/${title.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setIsFavorited(false);
    } catch (error) {
      console.error('Failed to remove favorite:', error);
    }
  };

  // const handleAddWatchLater = async () => {
  //   try {
  //     await fetch(`/api/watch-later/${title.id}`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //     });
  //     setIsWatchLater(true);
  //   } catch (error) {
  //     console.error('Failed to add to watch later:', error);
  //   }
  // };

  // const handleRemoveWatchLater = async () => {
  //   try {
  //     await fetch(`/api/watch-later/${title.id}`, {
  //       method: 'DELETE',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //     });
  //     setIsWatchLater(false);
  //   } catch (error) {
  //     console.error('Failed to remove from watch later:', error);
  //   }
  // };

  return (
    <div className="relative flex flex-col border border-green-light rounded-md overflow-hidden my-2 mx-9 group">
      <img src={title.image} alt={title.title} className="" />
      <div className="flex absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 m-3">
        {isFavorited ? (
          <Star className="cursor-pointer" onClick={handleRemoveFavorite} />
        ) : (
          <Star className="cursor-pointer" onClick={handleAddFavorite} />
        )}
        {isWatchLater ? (
          <Clock className="ml-2 cursor-pointer"  /> //remove watch later
        ) : (
          <Clock className="ml-2 cursor-pointer"  /> //add watch later
        )}
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-2/5 bg-blue-atlas opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end text-white p-4">
        <h3 className="text-lg font-bold">{title.title} ({title.released})</h3>
        <p className="text-sm">{title.synopsis}</p>
        <p className="text-sm w-fit bg-green-light rounded-2xl py-1 px-2 mt-2">{title.genre}</p>
      </div>
    </div>
  );
}
