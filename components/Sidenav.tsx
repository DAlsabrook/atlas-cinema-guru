'use client'
import { auth } from "@/auth";

export default function SideNav() {
  // const session = await auth();
  // const user = session?.user;

  return (
    <div className="flex w-44 h-auto flex-col px-3 py-4 bg-green-dark">
        <p>Side Nav</p>
        {/* <p>{user?.name}</p> */}
    </div>
  );
}
