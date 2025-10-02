import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  Key,
  Menu,
  Users,
  X,
  FileText,
  Zap,
  CreditCard,
  Settings,
  LogOut,
  Search,
  User,
  ChevronDown,
} from 'lucide-react';

const TopNavigationOwner = ({
  sidebarOpen,
  setSidebarOpen,
  currentUser,
  isOwner,
  handleLogout,
}) => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
      {/* Search box */}
      <div className="flex items-center rounded-lg bg-gray-100 px-3 py-2 w-64">
        <Search size={18} className="text-gray-500" />
        <input
          className="ml-2 bg-transparent outline-none w-full text-sm"
          type="text"
          placeholder="Tìm kiếm phòng, người thuê..."
        />
      </div>

      {/* User & Owner tools */}
      <div className="flex space-x-4 items-center">
        <div className="flex items-center space-x-4">
          {/* User Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center text-black font-medium hover:text-blue-600 px-3 py-2 rounded-md"
              onClick={() => setShowDropdown((prev) => !prev)}
            >
              <User size={20} className="mr-2" />
              {currentUser?.userName || 'Tài khoản'}
              <ChevronDown size={16} className="ml-1" />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                <div className="py-1">
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      setShowDropdown(false);
                      navigate('/profile');
                    }}
                  >
                    <User size={16} className="mr-2" />
                    Thông tin cá nhân
                  </button>
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} className="mr-2" />
                    Đăng xuất
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Owner badge & button */}
          {isOwner && (
            <>
              <span className="text-sm bg-green-600 text-white px-2 py-1 rounded">
                Owner
              </span>
              <button
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                onClick={() => navigate('/owner/dashboard')}
              >
                Quản lý
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopNavigationOwner;
