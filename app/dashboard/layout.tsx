import SideNav from "@/components/Sidenav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen text-blue-atlas">
      <div className="flex flex-row bg-green-light h-12">Nav Bar</div>
      <div className="flex flex-grow">
        <SideNav />
        <div className="flex-grow p-6 md:overflow-y-auto md:p-12 text-white">{children}</div>
      </div>
    </div>
  );
}
