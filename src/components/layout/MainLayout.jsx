import React from "react";
import { Outlet } from "react-router-dom";

const Navbar = () => <nav className='border-b p-4'>Navbar Component</nav>;

function MainLayout() {
  return (
    <div className='min-h-screen bg-white'>
      <Navbar />
      <main className='container mx-auto px-4 py-8'>
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
