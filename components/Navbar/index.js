"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { FiSearch } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef(null);

  // Load user from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Listen for login event
  useEffect(() => {
    const handleLogin = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };

    window.addEventListener("user-login", handleLogin);

    return () => {
      window.removeEventListener("user-login", handleLogin);
    };
  }, []);

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    router.push("/login");
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-[#252330] p-4 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold">
          OtakuHub
        </Link>

        {/* Navigation Links - Hidden on Small Screens */}
        <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 space-x-6">
          <Link href="/home" className="hover:text-[#595168] duration-500 ease-in-out transition">Home</Link>
          <Link href="/genres" className="hover:text-[#595168] duration-500 ease-in-out transition">Genres</Link>
          <Link href="/ranking" className="hover:text-[#595168] duration-500 ease-in-out transition">Ranking</Link>
          <Link href="/about" className="hover:text-[#595168] duration-500 ease-in-out transition">About</Link>
        </div>

        {/* Search and Profile Section */}
        <div className="flex items-center space-x-4 relative">
          <Link href="/search" className="flex items-center">
            <FiSearch className="text-3xl cursor-pointer hover:text-[#595168] duration-500 ease-in-out transition" />
          </Link>

          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setShowDropdown(!showDropdown)} className="flex items-center">
                <FaUserCircle className="text-3xl cursor-pointer hover:text-[#595168] duration-500 ease-in-out transition" />
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-40 bg-[#252330] shadow-lg rounded-md z-10">
                  {/* Navigation Links in Dropdown for Mobile */}
                  <div className="md:hidden">
                    <Link
                      href="/home"
                      className="block px-4 py-2 text-white hover:bg-[#595168] duration-500 ease-in-out hover:rounded-t-md rounded-t-md transition"
                      onClick={() => setShowDropdown(false)}
                    >
                      Home
                    </Link>
                    <Link
                      href="/genres"
                      className="block px-4 py-2 text-white hover:bg-[#595168] duration-500 ease-in-out transition"
                      onClick={() => setShowDropdown(false)}
                    >
                      Genres
                    </Link>
                    <Link
                      href="/ranking"
                      className="block px-4 py-2 text-white hover:bg-[#595168] duration-500 ease-in-out transition"
                      onClick={() => setShowDropdown(false)}
                    >
                      Ranking
                    </Link>
                    <Link
                      href="/about"
                      className="block px-4 py-2 text-white hover:bg-[#595168] duration-500 ease-in-out transition"
                      onClick={() => setShowDropdown(false)}
                    >
                      About
                    </Link>
                  </div>
                  {/* Profile and Logout */}
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-white hover:bg-[#595168] duration-500 ease-in-out transition"
                    onClick={() => setShowDropdown(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setShowDropdown(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-white bg-red-600 rounded-md rounded-t-none hover:bg-[#595168] hover:rounded-md hover:rounded-t-none border-none duration-500 ease-in-out transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="hover:text-[#595168] px-4 py-2 rounded hover:bg-[#252330] transition">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
