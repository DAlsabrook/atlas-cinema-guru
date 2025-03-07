import { auth } from "@/auth";


export default async function SideNav() {
  const session = await auth();
  const user = session?.user;
  if (!user) return
  return (
    <div className="flex w-44 h-auto flex-col px-3 py-4 bg-green-dark">
        <p>Side Nav</p>
        <p>{user.name}</p>
    </div>
  );
}
