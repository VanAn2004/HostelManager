import { Bell, ChevronDown, Search, LogOut, User } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react'

const Navbar = ({ currentUser }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:8080/api/v1/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ token }) // Send token in the request body if needed
      });

      if (response.ok) {
        localStorage.removeItem('token'); // Clear token from local storage
        window.location.href = '/login'; // or use your routing method
      } else {
        console.error('Logout failed');
        // Handle logout error
        alert('Đăng xuất thất bại. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Logout error:', error);
      alert('Có lỗi xảy ra khi đăng xuất. Vui lòng thử lại.');
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 z-10">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center rounded-lg bg-gray-100 px-3 py-2 w-64">
          <Search size={18} className="text-gray-500" />
          <input
            className="ml-2 bg-transparent outline-none w-full text-sm"
            type="text"
            placeholder="Tìm kiếm phòng, người thuê..."
          />
        </div>
        <div className="flex items-center space-x-5">
          <div className="relative">
            <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 focus:outline-none">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            </button>
          </div>
          <div className="relative" ref={dropdownRef}>
            <button 
              className="flex items-center"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div className="flex items-center ml-3">
                <div>
                  <span className="text-sm font-medium text-gray-800">
                    {currentUser.firstName} {currentUser.lastName}
                  </span>
                  <p className="text-xs text-gray-500">
                    {currentUser.roleName}
                  </p>
                </div>
                <ChevronDown 
                  size={16} 
                  className={`ml-2 text-gray-500 transition-transform duration-200 ${
                    isDropdownOpen ? 'rotate-180' : ''
                  }`} 
                />
              </div>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                <button
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    // Add profile navigation logic here if needed
                  }}
                >
                  <User size={16} className="mr-3" />
                  Thông tin cá nhân
                </button>
                <hr className="my-1 border-gray-200" />
                <button
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    handleLogout();
                  }}
                >
                  <LogOut size={16} className="mr-3" />
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;