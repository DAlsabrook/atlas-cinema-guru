'use client'

import { FolderClosed, Star, Clock } from "lucide-react";
import Link from 'next/link';
import { useUser } from "@/context/UserContext";
import { useState, useEffect } from "react";
import { useTitles } from '@/context/TitlesContext';
import { Activity } from "@/lib/definitions";

export default function SideNav() {
  const { titles } = useTitles();
  const { user } = useUser();
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    async function fetchActivities() {
      try {
        const response = await fetch('/api/activities', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          setActivities(data.activities);
        } else {
          console.error('Failed to fetch activities:', response.statusText);
        }
      } catch (error) {
        console.error('Failed to fetch activities:', error);
      }
    }

    fetchActivities();
  }, [titles]);

  return (
    <div className="group flex flex-row justify-around md:justify-start md:flex-col text-green-dark bg-green-dark px-3 py-4 transition-all duration-300 md:w-16 md:hover:w-1/5">
      <Link href="/">
        <div className="flex items-center mb-3 cursor-pointer">
          <FolderClosed fill="white" />
          <p className="ml-2 text-sm text-white block md:hidden md:group-hover:block transition-opacity delay-300">
            Home
          </p>
        </div>
      </Link>

      {/* Favorites Link */}
      <Link href="/favorites">
        <div className="flex items-center mb-3 cursor-pointer">
          <Star fill="white" />
          <p className="ml-2 text-sm text-white block md:hidden md:group-hover:block transition-opacity delay-300">
            Favorites
          </p>
        </div>
      </Link>

      {/* Watch Later Link */}
      <Link href="/watch-later">
        <div className="flex items-center mb-3 cursor-pointer">
          <Clock fill="white" />
          <p className="ml-2 text-sm text-white block md:hidden md:group-hover:block transition-opacity delay-300">
            Watch Later
          </p>
        </div>
      </Link>

      {/* Latest Activities */}
      <div className="hidden md:group-hover:flex md:group-hover:flex-col text-blue-atlas items-center bg-green-light rounded-2xl p-2 overflow-y-scroll no-scrollbar transition-opacity delay-300">
        <p className="font-bold">Latest Activities</p>
        {activities.map((activity) => {
          const date = new Date(activity.timestamp);
          const formattedDate = date.toLocaleString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          });
          const activityMessage =
            activity.activity === "FAVORITED" ? (
              <>
                Favorited: <strong>{activity.title}</strong>
              </>
            ) : (
              <>
                Added <strong>{activity.title}</strong> to watch later
              </>
            );
          return (
            <p key={activity.id} className="text-sm my-2">
              {formattedDate} {activityMessage}
            </p>
          );
        })}
      </div>
    </div>
  );
}
