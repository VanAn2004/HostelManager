import { useEffect, useState } from "react";
import {
  PlusCircle,
  Search,
  Key,
  Eye,
  Edit,
  Trash2,
  Building,
  Filter,
  Info,
  Clock,
  CheckCircle,
  XCircle,
  Download,
} from "lucide-react";
import axios from "axios";
import Toast from "../../Component/Toast";
import Navbar from "../../Component/Navbar";
import Sidebar from "../../Component/Sidebar";

export default function RoomManagement() {
  const [toast, setToast] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const token = localStorage.getItem("token");
  const cleanToken = token.replace(/"/g, "");
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [currentUser, setCurrentUser] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false); // Add initialization flag

  const isImage = (url) => {
    const imageExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".bmp",
      ".webp",
      ".svg",
      ".jqg",
    ];
    const lowerUrl = url.toLowerCase();
    return imageExtensions.some((ext) => lowerUrl.endsWith(ext.toLowerCase()));
  };

  const isVideo = (url) => {
    const videoExtensions = [
      ".mp4",
      ".webm",
      ".ogg",
      ".mov",
      ".avi",
      ".wmv",
      ".mkv",
    ];
    const lowerUrl = url.toLowerCase();
    return videoExtensions.some((ext) => lowerUrl.endsWith(ext.toLowerCase()));
  };

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/v1/room/", {
          headers: {
            Authorization: `Bearer ${cleanToken}`,
          },
        });
        if (response.data?.code !== 1000) {
          throw new Error(response.data?.message);
        }
        setRooms(response.data?.result);
        setFilteredRooms(response.data?.result);
        setIsInitialized(true); // Set initialization flag after data is loaded
      } catch (error) {
        console.error("Failed to fetch rooms:", error.message);
        setIsInitialized(true); // Set flag even on error
      }
    };
    fetchRooms();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
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
          console.log(data);
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUser();
  }, [cleanToken]);

  // Search function
  const handleSearch = async (query) => {
    if (!query.trim()) {
      // If search query is empty, show all rooms with current filter
      applyFilter(activeFilter, rooms);
      return;
    }

    setIsSearching(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/admin/rooms/search/${encodeURIComponent(query)}`,
        {
          headers: {
            Authorization: `Bearer ${cleanToken}`,
          },
        }
      );
      
      if (response.data?.code === 1000) {
        const searchResults = response.data?.result || [];
        setFilteredRooms(searchResults);
      } else {
        throw new Error(response.data?.message || "Search failed");
      }
    } catch (error) {
      console.error("Search failed:", error.message);
      setToast({ 
        message: `Tìm kiếm thất bại: ${error.message}`, 
        type: "error" 
      });
      setFilteredRooms([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Apply filter function
  const applyFilter = (filter, roomsData = rooms) => {
    let filtered = roomsData;
    
    if (filter !== "all") {
      filtered = roomsData.filter((room) => {
        if (filter === "occupied") return room.status === "OCCUPIED";
        if (filter === "available") return room.status === "AVAILABLE";
        if (filter === "maintenance") return room.status === "MAINTENANCE";
        if (filter === "pending") return room.status === "PENDING";
        return true;
      });
    }
    
    setFilteredRooms(filtered);
  };

  // Handle filter change
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    
    // If there's a search query, don't apply filter to avoid conflicts
    if (searchQuery.trim()) {
      return;
    }
    
    applyFilter(filter);
  };

  // Handle search input change
  const handleSearchInputChange = (value) => {
    setSearchQuery(value);
  };

  // Debounce search - Only run after component is initialized
  useEffect(() => {
    if (!isInitialized) return; // Don't run search before data is loaded
    
    const timeoutId = setTimeout(() => {
      handleSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, isInitialized]); // Add isInitialized to dependencies

  console.log("rooms", rooms);

  const getStatusColor = (status) => {
    switch (status) {
      case "Đã Thuê":
        return "bg-green-100 text-green-800 border-green-200";
      case "Còn Trống":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Đang Sửa Chữa":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "PENDING":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleApproveRoom = async (roomId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/admin/room/accept/${roomId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${cleanToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Không thể duyệt phòng");
      }

      const updatedRooms = rooms.map((room) =>
        room.id === roomId ? { ...room, status: "AVAILABLE" } : room
      );
      setRooms(updatedRooms);
      
      const updatedFilteredRooms = filteredRooms.map((room) =>
        room.id === roomId ? { ...room, status: "AVAILABLE" } : room
      );
      setFilteredRooms(updatedFilteredRooms);

      setToast({ message: `Phòng ${roomId} đã được duyệt.`, type: "success" });
    } catch (error) {
      setToast({ message: error.message || "Đã xảy ra lỗi.", type: "error" });
    }
  };

  const handleRejectRoom = async (roomId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/admin/room/reject/${roomId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${cleanToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Không thể duyệt phòng");
      }

      const updatedRooms = rooms.map((room) =>
        room.id === roomId ? { ...room } : room
      );
      setRooms(updatedRooms);
      
      const updatedFilteredRooms = filteredRooms.map((room) =>
        room.id === roomId ? { ...room } : room
      );
      setFilteredRooms(updatedFilteredRooms);

      setToast({ message: `Phòng ${roomId} không được duyệt.`, type: "success" });
    } catch (error) {
      setToast({ message: error.message || "Đã xảy ra lỗi.", type: "error" });
    }
  };

  const handleExportToExcel = async () => {
    setIsExporting(true);
    try {
      const response = await fetch("http://localhost:8080/api/v1/admin/export/rooms", {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${cleanToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Không thể xuất file Excel");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'danh_sach_phong_tro.xlsx';
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\\n]*=((['"]).*?\\2|[^;\\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '');
        }
      }
      
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setToast({ message: "Xuất file Excel thành công!", type: "success" });
    } catch (error) {
      setToast({ message: error.message || "Không thể xuất file Excel.", type: "error" });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        currentUser={currentUser}
        activeItem="rooms"
      />
      
      <div className="flex-1 flex flex-col">
        <Navbar currentUser={currentUser} />
        
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">
                    Quản Lý Phòng Trọ
                  </h1>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleExportToExcel}
                    disabled={isExporting}
                    className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
                      isExporting
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-green-600 text-white hover:bg-green-700 shadow-sm hover:shadow-md"
                    }`}
                  >
                    <Download size={18} className="mr-2" />
                    {isExporting ? "Đang xuất..." : "Xuất Excel"}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center">
                  <div className="p-3 rounded-lg bg-indigo-100 mr-4">
                    <Building size={24} className="text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tổng Số Phòng</p>
                    <h3 className="text-xl font-bold text-gray-800">
                      {rooms.length}
                    </h3>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center">
                  <div className="p-3 rounded-lg bg-green-100 mr-4">
                    <Key size={24} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Đã Thuê</p>
                    <h3 className="text-xl font-bold text-gray-800">
                      {rooms.filter((room) => room.status === "OCCUPIED").length}
                    </h3>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center">
                  <div className="p-3 rounded-lg bg-blue-100 mr-4">
                    <Info size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Còn Trống</p>
                    <h3 className="text-xl font-bold text-gray-800">
                      {rooms.filter((room) => room.status === "AVAILABLE").length}
                    </h3>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center">
                  <div className="p-3 rounded-lg bg-orange-100 mr-4">
                    <Filter size={24} className="text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Đang Sửa Chữa</p>
                    <h3 className="text-xl font-bold text-gray-800">
                      {rooms.filter((room) => room.status === "MAINTENANCE").length}
                    </h3>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center">
                  <div className="p-3 rounded-lg bg-purple-100 mr-4">
                    <Clock size={24} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Chờ Duyệt</p>
                    <h3 className="text-xl font-bold text-gray-800">
                      {rooms.filter((room) => room.status === "PENDING").length}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <div className="flex-1 min-w-[200px] w-full">
                    <div className="relative">
                      <Search
                        className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                          isSearching ? 'text-indigo-500 animate-pulse' : 'text-gray-400'
                        }`}
                        size={18}
                      />
                      <input
                        type="text"
                        placeholder="Tìm kiếm theo số phòng..."
                        value={searchQuery}
                        onChange={(e) => handleSearchInputChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      {isSearching && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 md:gap-4 w-full md:w-auto">
                    <button
                      className={`px-4 py-2 rounded-lg border transition-all ${
                        activeFilter === "all"
                          ? "bg-indigo-50 text-indigo-700 border-indigo-200 font-medium"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                      onClick={() => handleFilterChange("all")}
                    >
                      Tất cả
                    </button>
                    <button
                      className={`px-4 py-2 rounded-lg border transition-all ${
                        activeFilter === "occupied"
                          ? "bg-green-50 text-green-700 border-green-200 font-medium"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                      onClick={() => handleFilterChange("occupied")}
                    >
                      Đã thuê
                    </button>
                    <button
                      className={`px-4 py-2 rounded-lg border transition-all ${
                        activeFilter === "available"
                          ? "bg-blue-50 text-blue-700 border-blue-200 font-medium"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                      onClick={() => handleFilterChange("available")}
                    >
                      Còn trống
                    </button>
                    <button
                      className={`px-4 py-2 rounded-lg border transition-all ${
                        activeFilter === "maintenance"
                          ? "bg-orange-50 text-orange-700 border-orange-200 font-medium"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                      onClick={() => handleFilterChange("maintenance")}
                    >
                      Đang sửa chữa
                    </button>
                    <button
                      className={`px-4 py-2 rounded-lg border transition-all ${
                        activeFilter === "pending"
                          ? "bg-purple-50 text-purple-700 border-purple-200 font-medium"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                      onClick={() => handleFilterChange("pending")}
                    >
                      Chờ duyệt
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {searchQuery.trim() && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 text-sm">
                  {isSearching 
                    ? `Đang tìm kiếm "${searchQuery}"...`
                    : `Kết quả tìm kiếm cho "${searchQuery}": ${filteredRooms.length} phòng`
                  }
                  {!isSearching && (
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        applyFilter(activeFilter);
                      }}
                      className="ml-2 text-blue-600 hover:text-blue-800 underline"
                    >
                      Xóa tìm kiếm
                    </button>
                  )}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredRooms.map((room) => (
                <div
                  key={room.id}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden"
                >
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="bg-indigo-100 p-2 rounded-lg">
                          <Key size={20} className="text-indigo-600" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-lg font-semibold text-gray-800">
                            {room.roomNumber}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Tầng {room.floor} • {room.type}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          room.status
                        )}`}
                      >
                        {room.status === "PENDING" ? "Chờ Duyệt" : room.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">Diện tích:</span>
                        <span className="text-gray-900 font-medium">
                          {room.roomSize} m²
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">Giá thuê:</span>
                        <span className="text-indigo-600 font-medium">
                          {room.price}
                        </span>
                      </div>
                      {room.status === "PENDING" ? (
                        <>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 text-sm">Thời hạn:</span>
                            <span className="text-gray-900 font-medium">
                              {room.leaseTerm} tháng
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 text-sm">Khu vực:</span>
                            <span className="text-gray-900 font-medium">
                              {room.district}, {room.province}
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 text-sm">Người thuê:</span>
                          <span className="text-gray-900 font-medium">
                            {room.tenant || "Chưa có"}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {room.facilities && room.facilities.length > 0 ? (
                        room.facilities.map((facility, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs"
                          >
                            {facility}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500 text-xs italic">
                          Không có tiện nghi được liệt kê
                        </span>
                      )}
                    </div>

                    {room.mediaUrls &&
                      room.mediaUrls.length > 0 &&
                      room.status === "PENDING" && (
                        <div className="mt-3">
                          <p className="text-sm text-gray-600 mb-2">
                            Hình ảnh đính kèm:
                          </p>
                          <div className="flex gap-2 overflow-x-auto pb-2">
                            {room.mediaUrls.map((url, index) => {
                              const isVideoFile = isVideo(url);
                              const isImageFile = isImage(url.replace(/"/g, ""));

                              return (
                                <div
                                  key={index}
                                  className="min-w-[150px] h-[100px] rounded-md bg-gray-100 overflow-hidden"
                                >
                                  {isVideoFile ? (
                                    <video
                                      className="w-full h-full object-cover"
                                      src={url}
                                      controls
                                      muted
                                    />
                                  ) : (
                                    <img
                                      className="w-full h-full object-cover"
                                      src={url}
                                      alt={`Ảnh đính kèm ${index + 1}`}
                                      onError={(e) => {
                                        console.error(
                                          `Error loading image: ${url}`,
                                          e
                                        );
                                        e.target.style.objectFit = "contain";
                                      }}
                                    />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                  </div>

                  {room.status === "PENDING" && (
                    <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex">
                      <button
                        onClick={() => handleApproveRoom(room.id)}
                        className="w-1/2 py-2 bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 rounded-lg mr-2 flex items-center justify-center transition-colors"
                      >
                        <CheckCircle size={16} className="mr-1" />
                        Duyệt phòng
                      </button>
                      <button
                        onClick={() => handleRejectRoom(room.id)}
                        className="w-1/2 py-2 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 rounded-lg flex items-center justify-center transition-colors"
                      >
                        <XCircle size={16} className="mr-1" />
                        Từ chối
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredRooms.length === 0 && !isSearching && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search size={48} className="mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  {searchQuery.trim() ? "Không tìm thấy phòng nào" : "Không có phòng nào"}
                </h3>
                <p className="text-gray-500">
                  {searchQuery.trim() 
                    ? `Không có phòng nào khớp với từ khóa "${searchQuery}"`
                    : "Danh sách phòng trống"
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}