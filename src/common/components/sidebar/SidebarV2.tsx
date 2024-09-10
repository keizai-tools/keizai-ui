import { Copy } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

import UserButton from './UserButton';

function SidebarV2() {
  const location = useLocation();
  const currentRoute = location.pathname;
  return (
    <div
      className="h-screen w-[250px] flex flex-col items-center justify-between bg-foreground dark:bg-background border-r dark:border-r-border py-4"
      data-test="sidebar-container"
    >
      <div className="flex flex-col w-full">
        <div className="flex flex-col mt-4 p-3">
          <Link
            to="/"
            data-test="sidebar-link"
            className={`flex gap-2 items-center hover:text-primary px-4 py-2 ${
              currentRoute === '/' &&
              'text-primary border border-border rounded-md'
            }`}
          >
            <Copy data-test="sidebar-btn-copy" size={16} />
            <span>Home</span>
          </Link>
        </div>
      </div>
      <div className="flex justify-between w-full px-4 mb-4">
        <div className="flex gap-2 items-center">
          <img
            src="/logo.svg"
            width={34}
            height={34}
            alt="Keizai Logo"
            data-test="sidebar-img"
          />
          <span className="font-semibold text-lg">Keizai</span>
        </div>
        <UserButton />
      </div>
    </div>
  );
}

export default SidebarV2;
