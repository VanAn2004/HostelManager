import React, { useEffect, useState, useRef } from "react";
import RoomCard from "../../Component/RoomPage/RoomCard";
import {
  DollarSign,
  Filter,
  MapPin,
  Search,
  Square,
  User,
  Warehouse,
  ChevronDown,
  LogOut,
  ReceiptText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const RoomListPage = () => {
  const token = localStorage.getItem("token");
  const cleanToken = token ? token.replace(/"/g, "") : "";
  const [rooms, setRooms] = useState([]);
  const [activeTab, setActiveTab] = useState("all");

  const [currentUser, setCurrentUser] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const decodeJWT = (token) => {
    if (!token) return null;
    try {
      const base64Url = token.replace(/"/g, "").split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Decode error:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) return;
      try {
        const res = await fetch("http://localhost:8080/api/v1/users/me", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cleanToken}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setCurrentUser(data.result);
          setIsLoggedIn(true);
        }
      } catch (e) {
        console.error("Fetch user error:", e);
      }
    };
    fetchUserData();
  }, [token]);

  useEffect(() => {
    document.addEventListener("mousedown", (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setCurrentUser({});
    navigate("/");
  };

  useEffect(() => {
    fetch("http://localhost:8080/api/v1/room/", {
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 1000) {
          // Chỉ lấy các phòng chưa cho thuê
          const availableRooms = data.result.filter(
            (room) => room.status == "AVAILABLE"
          );
          setRooms(availableRooms);
        } else {
          console.warn("API trả về code khác 1000:", data.code);
        }
      })
      .catch((error) => console.error("Error fetching rooms:", error));
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen pb-12">
      {/* Header */}
      <header className="bg-blue-700 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="text-white font-bold text-2xl flex items-center">
                <div className="bg-white p-2 rounded text-blue-700 mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </div>
                <span>TRỌ MỚI</span>
              </div>
              <div className="ml-10 space-x-8 hidden md:flex">
                <a href="/listRoom" className="text-white hover:text-blue-200">
                  Nhà trọ, phòng trọ
                </a>
                <a href="/home" className="text-white hover:text-blue-200">
                  Trang chủ
                </a>
                <a href="#" className="text-white hover:text-blue-200">
                  Liên hệ
                </a>
                <a href="#" className="text-white hover:text-blue-200">
                  Về chúng tôi
                </a>
              </div>
            </div>
            <div className="flex space-x-4 items-center">
              {isLoggedIn ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center text-white font-medium hover:underline"
                  >
                    <User size={20} className="mr-2" />
                    {currentUser.userName}
                    <ChevronDown size={16} className="ml-1" />
                  </button>
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                      <div className="py-1">
                        <button
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => {
                            setShowDropdown(false);
                            navigate("/profile");
                          }}
                        >
                          <User size={16} className="mr-2" />
                          Thông tin cá nhân
                        </button>
                        <button
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => navigate("/MyContract")}
                        >
                          <ReceiptText size={16} className="mr-2" />
                          Hợp đồng của tôi
                        </button>
                        <button
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => navigate("/MyRoom")}
                        >
                          <Warehouse size={16} className="mr-2" />
                          Phòng của tôi
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
              ) : (
                <>
                  <button
                    className="text-white font-medium hover:underline"
                    onClick={() => navigate("/login")}
                  >
                    Đăng nhập
                  </button>
                  <button
                    className="bg-white text-blue-700 px-4 py-2 rounded hover:bg-gray-100"
                    onClick={() => navigate("/register")}
                  >
                    Đăng ký
                  </button>
                </>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 mt-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Danh Sách Phòng Trọ
        </h2>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          {/* Search Form */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Bạn muốn tìm trọ ở đâu?"
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Khu vực"
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Giá cả"
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Diện tích"
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Square className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Advanced Filters */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="flex items-center text-gray-600 hover:text-blue-600">
                <Filter className="h-4 w-4 mr-1" />
                <span>Bộ lọc nâng cao</span>
              </button>
            </div>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md font-medium flex items-center">
              <Search className="h-5 w-5 mr-2" />
              Tìm kiếm
            </button>
          </div>
        </div>

        {/* Room Listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={room.mediaUrls[0]}
                alt={room.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 mb-1">
                    {room.roomNumber}
                  </h3>
                </div>
                <p className="text-gray-600 flex items-center text-sm mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  {room.province}
                </p>
                <div className="flex justify-between mb-2">
                  <p className="text-red-600 font-bold">
                    {room.price.toLocaleString("vi-VN")} đ/tháng
                  </p>
                  <p className="text-gray-600">{room.area} m²</p>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {room.facilities.map((facility, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
                    >
                      {facility}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-gray-500 text-sm">{room.date}</span>
                  <a
                    href={`/rooms/${room.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Xem chi tiết →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex justify-center">
          <div className="flex space-x-1">
            <button className="px-4 py-2 border rounded bg-gray-100 text-gray-600 hover:bg-gray-200">
              ←
            </button>
            <button className="px-4 py-2 border rounded bg-blue-600 text-white">
              1
            </button>
            <button className="px-4 py-2 border rounded bg-gray-100 text-gray-600 hover:bg-gray-200">
              2
            </button>
            <button className="px-4 py-2 border rounded bg-gray-100 text-gray-600 hover:bg-gray-200">
              3
            </button>
            <button className="px-4 py-2 border rounded bg-gray-100 text-gray-600 hover:bg-gray-200">
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomListPage;
