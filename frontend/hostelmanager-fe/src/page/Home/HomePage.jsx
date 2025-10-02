import { useEffect, useState, useRef } from "react";
import {
  Search,
  MapPin,
  DollarSign,
  Grid,
  Video,
  LogOut,
  User,
  Warehouse,
  ChevronDown,
  ReceiptText,
  Calendar,
  Home,
  Star,
  Eye
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("Tất cả");
  const [currentUser, setCurrentUser] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Function to decode JWT token
  const decodeJWT = (token) => {
    if (!token) return null;

    try {
      // Remove quotes if present
      const cleanToken = token.replace(/"/g, "");

      // Get the payload part of the token (second part)
      const base64Url = cleanToken.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );

      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  // Function to format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // Function to get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-green-100 text-green-800';
      case 'OCCUPIED':
        return 'bg-red-100 text-red-800';
      case 'MAINTENANCE':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Function to translate status
  const translateStatus = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return 'Còn trống';
      case 'OCCUPIED':
        return 'Đã thuê';
      case 'MAINTENANCE':
        return 'Bảo trì';
      default:
        return status;
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) return;

      // Decode token to check for admin and owner scope
      const decodedToken = decodeJWT(token);
      if (decodedToken && decodedToken.scope) {
        // Check if the scope includes admin role
        setIsAdmin(decodedToken.scope.includes("ROLE_ADMIN"));
        // Check if the scope includes owner role
        setIsOwner(decodedToken.scope.includes("ROLE_OWNER"));
      }

      try {
        const response = await fetch("http://localhost:8080/api/v1/users/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.replace(/"/g, "")}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setCurrentUser(data.result);
          setIsLoggedIn(true);
          console.log(data);
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchRooms = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8080/api/v1/room/availableRoom', {
          method: "GET",
        });
        if (response.ok) {
          const data = await response.json();
          setRooms(data.result || data); // Handle different response structures
          console.log("Rooms data:", data);
        } else {
          console.error("Failed to fetch rooms");
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    fetchRooms();
  }, [token]);

  // Close dropdown when clicking outside
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setIsAdmin(false);
    setIsOwner(false);
    setCurrentUser({});
    setShowDropdown(false);
    navigate("/");
  };

  const handleRoomClick = (roomId) => {
    navigate(`/rooms/${roomId}`);
  };

  const tabs = ["Tất cả", "Nhà trọ, phòng trọ", "Nhà nguyên căn", "Căn hộ"];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="text-blue-600 font-bold text-2xl flex items-center">
                <div className="bg-blue-600 p-2 rounded text-white mr-2">
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
                <a
                  href="/listRoom"
                  className="text-gray-700 hover:text-blue-600"
                >
                  Nhà trọ, phòng trọ
                </a>
                <a href="#" className="text-gray-700 hover:text-blue-600">
                  Trang chủ
                </a>
                <a href="#" className="text-gray-700 hover:text-blue-600">
                  Liên hệ
                </a>
                <a href="#" className="text-gray-700 hover:text-blue-600">
                  Về chúng tôi
                </a>
              </div>
            </div>
            <div className="flex space-x-4 items-center">
              {isLoggedIn ? (
                <div className="flex items-center space-x-4">
                  {/* User Dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      className="flex items-center text-black font-medium hover:text-blue-600 px-3 py-2 rounded-md"
                      onClick={() => setShowDropdown(!showDropdown)}
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

                  {/* Admin/Owner badges and buttons */}
                  {isAdmin && (
                    <>
                      <span className="text-sm bg-red-600 text-white px-2 py-1 rounded">
                        Admin
                      </span>
                      <button
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                        onClick={() => navigate("/admin/dashboard")}
                      >
                        Quản lý
                      </button>
                    </>
                  )}
                  {isOwner && (
                    <>
                      <span className="text-sm bg-green-600 text-white px-2 py-1 rounded">
                        Owner
                      </span>
                      <button
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        onClick={() => navigate("/owner/dashboard")}
                      >
                        Quản lý
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <>
                  <button
                    className="text-blue-600 font-medium hover:underline"
                    onClick={() => navigate("/login")}
                  >
                    Đăng nhập
                  </button>
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
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

      {/* Hero Section */}
      <section className="bg-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              TÌM NHANH, KIẾM DỄ
              <br />
              TRỌ MỚI TOÀN QUỐC
            </h1>
            <p className="text-lg">
              Trang thông tin về cho thuê phòng trọ nhanh chóng, hiệu quả với
              hơn 500 tin đăng
              <br />
              mới và 30.000 lượt xem mỗi ngày
            </p>
          </div>

          {/* Search Box */}
          <div className="bg-blue-600 rounded-lg p-6">
            {/* Tabs */}
            <div className="flex mb-4 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`px-4 py-2 rounded-md mr-2 whitespace-nowrap ${
                    activeTab === tab ? "bg-white text-blue-800" : "text-white"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Search Form */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search
                  className="absolute left-3 top-3 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Bạn muốn tìm trọ ở đâu?"
                  className="w-full p-3 pl-10 rounded-md"
                />
              </div>
              <div className="relative">
                <MapPin
                  className="absolute left-3 top-3 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Khu vực"
                  className="w-full p-3 pl-10 rounded-md"
                />
              </div>
              <div className="relative">
                <DollarSign
                  className="absolute left-3 top-3 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Giá cả"
                  className="w-full p-3 pl-10 rounded-md"
                />
              </div>
              <div className="relative">
                <Grid
                  className="absolute left-3 top-3 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Diện tích"
                  className="w-full p-3 pl-10 rounded-md"
                />
              </div>
            </div>

            {/* Search Button */}
            <div className="mt-4 flex justify-end">
              <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-md flex items-center">
                <Search className="mr-2" size={20} />
                Tìm kiếm
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Room Listings Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              Phòng trọ nổi bật
            </h2>
            <p className="text-gray-600">
              {rooms.length} phòng trọ được tìm thấy
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer overflow-hidden"
                  onClick={() => handleRoomClick(room.id)}
                >
                  {/* Room Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={room.mediaUrls?.[0] || '/placeholder-room.jpg'}
                      alt={`Phòng ${room.roomNumber}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(room.status)}`}>
                        {translateStatus(room.status)}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                      {room.mediaUrls?.length || 0} ảnh
                    </div>
                  </div>

                  {/* Room Details */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Phòng {room.roomNumber}
                      </h3>
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {room.roomType}
                      </span>
                    </div>

                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin size={16} className="mr-1" />
                      <span className="text-sm">
                        {room.ward}, {room.district}, {room.province}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {room.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-3 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Home size={16} className="mr-1" />
                        <span>{room.roomSize}m²</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar size={16} className="mr-1" />
                        <span>{room.leaseTerm} tháng</span>
                      </div>
                    </div>

                    {/* Facilities */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {room.facilities?.slice(0, 3).map((facility, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                          >
                            {facility}
                          </span>
                        ))}
                        {room.facilities?.length > 3 && (
                          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                            +{room.facilities.length - 3} khác
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Price and Action */}
                    <div className="flex justify-between items-center pt-4 border-t">
                      <div>
                        <span className="text-2xl font-bold text-blue-600">
                          {formatPrice(room.price)}
                        </span>
                        <span className="text-gray-500 text-sm">/tháng</span>
                      </div>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && rooms.length === 0 && (
            <div className="text-center py-12">
              <Home size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Không tìm thấy phòng trọ nào
              </h3>
              <p className="text-gray-500">
                Vui lòng thử tìm kiếm với từ khóa khác hoặc liên hệ với chúng tôi để được hỗ trợ.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}