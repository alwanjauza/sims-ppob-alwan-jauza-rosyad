import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { MdMenu, MdClose } from "react-icons/md";
import logo from "../../assets/Logo.png";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path
      ? "text-red-500 font-bold"
      : "text-gray-900 font-semibold hover:text-red-500";
  };

  const navLinks = [
    { name: "Top Up", path: "/topup" },
    { name: "Transaction", path: "/transaction" },
    { name: "Akun", path: "/profile" },
  ];

  return (
    <nav className='bg-white border-b border-gray-200 sticky top-0 z-50'>
      <div className='container mx-auto px-4'>
        <div className='flex justify-between items-center h-16'>
          <Link to='/dashboard' className='flex items-center gap-2'>
            <img src={logo} alt='Logo SIMS PPOB' className='w-6 h-6' />
            <span className='text-lg font-bold text-gray-900'>SIMS PPOB</span>
          </Link>

          <div className='hidden md:flex items-center space-x-8'>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`transition-colors duration-200 ${isActive(
                  link.path
                )}`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className='md:hidden flex items-center'>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className='text-gray-900 focus:outline-none'
            >
              {isOpen ? <MdClose size={28} /> : <MdMenu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className='md:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-4 shadow-lg'>
          <div className='flex flex-col space-y-4 mt-2'>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block ${isActive(link.path)}`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
