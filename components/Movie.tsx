"use client"

import { Title } from "@/lib/definitions";
import { Star, Clock } from "lucide-react";
import { useState, useEffect } from "react";

type movieProps = Title & {
  page: number
}
export default function Movie(props: movieProps) {
  const title = props;
  const [isFavorite, setIsFavorite] = useState<Boolean>(title.favorited ?? false)
  const [isWatchLater, setIsWatchLater] = useState<Boolean>(title.watchLater ?? false)

  useEffect(() => {
    setIsFavorite(title.favorited || false)
    setIsWatchLater(title.watchLater || false )
  }, [title.watchLater, title.favorited, props.page])

  const handleAddFavorite = async () => {
    try {
      await fetch(`/api/favorites/${title.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setIsFavorite(true);
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
      setIsFavorite(false);
    } catch (error) {
      console.error('Failed to remove favorite:', error);
    }
  };

  const handleAddWatchLater = async () => {
    try {
      await fetch(`/api/watch-later/${title.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setIsWatchLater(true);
    } catch (error) {
      console.error('Failed to add Watch Later:', error);
    }
  };

  const handleRemoveWatchLater = async () => {
    try {
      await fetch(`/api/watch-later/${title.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setIsWatchLater(false);
    } catch (error) {
      console.error('Failed to add Watch Later:', error);
    }
  };

  return (
    <div className="relative flex flex-col border border-green-light rounded-md overflow-hidden my-2 mx-9 group">
      <img src={title.image} alt={title.title} className="" />
      <div className="flex absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 m-3">
        {isFavorite ? (
          <Star className="cursor-pointer" fill='white' onClick={handleRemoveFavorite} />
        ) : (
          <Star className="cursor-pointer" onClick={handleAddFavorite} />
        )}
        {isWatchLater ? (
          <Clock className="ml-2 cursor-pointer text-blue-atlas" fill="white" onClick={handleRemoveWatchLater} />
        ) : (
          <Clock className="ml-2 cursor-pointer" onClick={handleAddWatchLater} />
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
