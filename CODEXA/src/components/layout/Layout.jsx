import { Outlet } from 'react-router-dom';
import Sidebar from '../sidebar/Sidebar';
import Navbar from '../navbar/Navbar';
import useSidebar from '../../hooks/useSidebar';

export default function Layout() {
  const { isOpen, close } = useSidebar();

  return (
    <div className="flex h-screen bg-[#090B14] overflow-hidden">
      <Sidebar isOpen={isOpen} />

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={close}
          aria-hidden="true"
        />
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
