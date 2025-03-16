import SideNav from "@/components/Sidenav";
import { Film, LogOut } from 'lucide-react';
import { auth, signOut } from "@/auth";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="flex flex-col h-screen text-blue-atlas overflow-hidden">
      <div className="flex flex-row bg-green-light h-12 justify-between items-center">

        <div className="flex items-center ml-2">
          <Film size={18}/>
          <h1 className="ml-1 text-2xl font-bold">Cinema Guru</h1>
        </div>

        <div className="flex items-center">
          <p>Welcome, {user?.email}</p>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button className="flex items-center m-4 cursor-pointer">
              <LogOut size={18}/>
              <p className="ml-1">Logout</p>
            </button>
          </form>
        </div>

      </div>
      <div className="flex h-full overflow-hidden">
        <SideNav />
        <div className="text-white w-full overflow-y-scroll p-3">{children}</div>
      </div>
    </div>
  );
}
