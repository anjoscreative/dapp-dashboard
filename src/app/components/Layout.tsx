import React, { useState } from "react";
import { Menu } from "lucide-react";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#0d1b1e] text-gray-200">
      {/* Sidebar */}
      <aside
        className={`
  fixed md:static top-0 left-0 
  h-full md:h-auto w-64 
  bg-[#111f24] border-r border-gray-800 p-6 
  transform transition-transform duration-300 z-20 
  ${
    open
      ? "translate-x-0"
      : "-translate-x-full md:translate-x-0"
  } 
`}
      >
        <h1 className="text-xl font-bold text-orange-400 mb-8 mt-8">DApp Board</h1>
        <nav className="flex flex-col gap-4 text-sm">
          <a href="#" className="hover:text-orange-400">
            Dashboard
          </a>
          <a href="#" className="hover:text-orange-400">
            Trade
          </a>
          <a href="#" className="hover:text-orange-400">
            Marketplace
          </a>
          <a href="#" className="hover:text-orange-400">
            Stats
          </a>
        </nav>
      </aside>

      {/* Mobile menu button */}
      <button
        onClick={() => setOpen(!open)}
        className="absolute top-4 left-4 md:hidden text-gray-200 z-30"
      >
        <Menu size={24} />
      </button>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-8 ml-0 md:ml-16 pt-14">{children}</main>
    </div>
  );
}
