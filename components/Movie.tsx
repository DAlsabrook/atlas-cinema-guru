"use client";

import { useState, useEffect } from "react";
import { Title } from "@/lib/definitions";
import { Star, Clock } from "lucide-react";
import { useTitles } from "@/context/TitlesContext";

type MovieProps = Title & {
  page: number;
};

export default function Movie(props: MovieProps) {
  const title = props;
  const { titles, updateTitle } = useTitles();
  const [isFavorite, setIsFavorite] = useState<Boolean>(title.favorited ?? false);
  const [isWatchLater, setIsWatchLater] = useState<Boolean>(title.watchLater ?? false);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);

  useEffect(() => {
    setIsFavorite(title.favorited || false);
    setIsWatchLater(title.watchLater || false);
  }, [title.watchLater, title.favorited, props.page, titles]);

  const handleAddFavorite = async () => {
    try {
      setIsFavorite(true);
      await fetch(`/api/favorites/${title.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      updateTitle(title.id, { favorited: true });
    } catch (error) {
      console.error("Failed to add favorite:", error);
    }
  };

  const handleRemoveFavorite = async () => {
    try {
      setIsFavorite(false);
      await fetch(`/api/favorites/${title.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      updateTitle(title.id, { favorited: false });
    } catch (error) {
      console.error("Failed to remove favorite:", error);
    }
  };

  const handleAddWatchLater = async () => {
    try {
      setIsWatchLater(true);
      await fetch(`/api/watch-later/${title.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      updateTitle(title.id, { watchLater: true });
    } catch (error) {
      console.error("Failed to add Watch Later:", error);
    }
  };

  const handleRemoveWatchLater = async () => {
    try {
      setIsWatchLater(false);
      await fetch(`/api/watch-later/${title.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      updateTitle(title.id, { watchLater: false });
    } catch (error) {
      console.error("Failed to remove Watch Later:", error);
    }
  };

  const toggleDetails = () => {
    setIsDetailsVisible((prev) => !prev);
  };

  return (
    <div
      className="relative flex flex-col border border-green-light rounded-md overflow-hidden my-2 mx-9 group"
      onClick={toggleDetails}
    >
      <img src={title.image} alt={title.title} className="" />
      <div
        className={`flex absolute top-0 right-0 ${
          isDetailsVisible ? "opacity-100" : "opacity-0"
        } group-hover:opacity-100 transition-opacity duration-300 m-3`}
      >
        {isFavorite ? (
          <Star
            className="cursor-pointer"
            fill="white"
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveFavorite();
            }}
          />
        ) : (
          <Star
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleAddFavorite();
            }}
          />
        )}
        {isWatchLater ? (
          <Clock
            className="ml-2 cursor-pointer text-blue-atlas"
            fill="white"
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveWatchLater();
            }}
          />
        ) : (
          <Clock
            className="ml-2 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleAddWatchLater();
            }}
          />
        )}
      </div>
      <div
        className={`absolute bottom-0 left-0 right-0 h-2/5 bg-blue-atlas ${
          isDetailsVisible ? "opacity-100" : "opacity-0"
        } group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end text-white p-4`}
      >
        <h3 className="text-lg font-bold">
          {title.title} ({title.released})
        </h3>
        <p className="text-sm">{title.synopsis}</p>
        <p className="text-sm w-fit bg-green-light rounded-2xl py-1 px-2 mt-2">
          {title.genre}
        </p>
      </div>
    </div>
  );
}
