import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { ToastContainer } from '../ui/Toast';

export function Layout() {
  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      <ToastContainer />
    </div>
  );
}