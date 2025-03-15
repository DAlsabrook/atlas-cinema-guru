import { FolderClosed, Star, Clock } from "lucide-react";
import Link from 'next/link';

export default function SideNav() {
  return (
    <div className="group flex text-green-dark w-16 hover:w-1/6 transition-width duration-300 flex-col px-3 py-4 bg-green-dark">

      <Link href="/dashboard">
        <div className="flex items-center mb-3 cursor-pointer">
          <FolderClosed fill="white"/>
          <p className="ml-2 text-sm text-white hidden group-hover:block">Home</p>
        </div>
      </Link>

      <Link href="/dashboard/favorites">
        <div className="flex items-center mb-3 cursor-pointer">
          <Star fill="white"/>
          <p className="ml-2 text-sm text-white hidden group-hover:block">Favorites</p>
        </div>
      </Link>

      <Link href="/dashboard/watch-later">
        <div className="flex items-center mb-3 cursor-pointer">
          <Clock fill="white"/>
          <p className="ml-2 text-sm text-white hidden group-hover:block">Watch Later</p>
        </div>
      </Link>

      <div className="hidden group-hover:flex group-hover:flex-col text-blue-atlas justify-center items-center bg-green-light rounded-2xl p-2">
        <p className="font-bold">Latest Activities</p>
      </div>
    </div>
  );
}
