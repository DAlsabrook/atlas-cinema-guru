'use client';

import "@/app/global.css";
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { UserProvider } from "@/context/UserContext";
import { TitlesProvider } from "@/context/TitlesContext";
import SideNav from "@/components/Sidenav";
import { Film, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import UserInfo from "@/components/UserInfo";
import { useEffect } from "react";

type Props = {
  children: React.ReactNode;
};

function AuthenticatedLayout({ children }: Props) {
  const { status } = useSession();
  const router = useRouter();

  // Redirect to /sign-in if unauthenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    return null; // Prevent rendering while redirecting
  }

  return (
    <UserProvider>
      <TitlesProvider>
        <div className="flex flex-col h-screen text-blue-atlas overflow-hidden">
          {/* Header */}
          <div className="flex flex-row bg-green-light h-12 justify-between items-center">
            <div className="flex items-center ml-2">
              <Film size={18} />
              <h1 className="ml-1 text-2xl font-bold">Cinema Guru</h1>
            </div>

            <div className="hidden md:flex items-center">
              <UserInfo />
              <button
                onClick={() => signOut({ callbackUrl: "/sign-in" })}
                className="flex items-center m-4 cursor-pointer"
              >
                <LogOut size={18} />
                <p className="ml-1">Logout</p>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-col md:flex-row h-full overflow-hidden">
            <SideNav />
            <div className="text-white w-8/10 overflow-y-scroll p-3 no-scrollbar">
              {children}
            </div>
          </div>
        </div>
      </TitlesProvider>
    </UserProvider>
  );
}

export default function RootLayout({ children }: Props) {
  const pathname = usePathname();

  // Exclude AuthenticatedLayout for the /sign-in route
  const isSignInRoute = pathname === "/sign-in";

  return (
    <html lang="en">
      <body className="antialiased bg-[#00003c] text-white">
        <SessionProvider>
          {isSignInRoute ? children : <AuthenticatedLayout>{children}</AuthenticatedLayout>}
        </SessionProvider>
      </body>
    </html>
  );
}
