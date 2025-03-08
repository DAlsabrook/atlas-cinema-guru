'use client';

import { useEffect, useState } from 'react';
import SideNav from "@/components/Sidenav";
import { checkDbConnection } from '@/lib/data';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [dbConnected, setDbConnected] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkConnection() {
      const isConnected = await checkDbConnection();
      setDbConnected(isConnected);
    }
    checkConnection();
  }, []);

  return (
    <div className="flex flex-col h-screen text-blue-atlas">
      <div className="flex flex-row bg-green-light h-12">
        Nav Bar
        {dbConnected !== null && (
          <div className={`ml-4 ${dbConnected ? 'text-green-500' : 'text-red-500'}`}>
            {dbConnected ? 'DB Connected' : 'DB Connection Failed'}
          </div>
        )}
      </div>
      <div className="flex flex-grow">
        <SideNav />
        <div className="flex-grow p-6 md:overflow-y-auto md:p-12 text-white">{children}</div>
      </div>
    </div>
  );
}
