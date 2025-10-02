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
  Plus,
  Home,
  Users,
  FileText,
  Settings,
  Bell,
  Menu,
  X,
  ChevronDown,
  CreditCard,
  AlertTriangle,
  LogOut,
} from "lucide-react";
import axios from "axios";
import Toast from "../../../Component/Toast";
import AddRoomModal from "./AddRoomModal";
import EditRoomModal from "./EditRoomModal";
import ViewRoomModal from "./ViewRoomModal";
import SidebarOwner from "../../../Component/SiderbarOwner";
import TopNavigationOwner from "../../../Component/TopNavigationOwner";
import { useNavigate } from "react-router-dom";

export default function OwnerRoomManagement() {
  const [toast, setToast] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddRoomModalOpen, setIsAddRoomModalOpen] = useState(false);
  const [isEditRoomModalOpen, setIsEditRoomModalOpen] = useState(false);
  const [isViewRoomModalOpen, setIsViewRoomModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tenantInfo, setTenantInfo] = useState(null);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentUser, setCurrentUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const cleanToken = token ? token.replace(/"/g, "") : "";

  // Thêm hàm xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const API_BASE_URL = "http://localhost:8080/api/v1";

  // Kiểm tra xem URL có phải là hình ảnh hay không
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

  // Kiểm tra xem URL có phải là video hay không
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

  // Fetch user data
  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cleanToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Không thể tải thông tin người dùng');
      }

      const data = await response.json();
      setCurrentUser(data.result);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTenantInfo = async (roomId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/owner/tenants/room/${roomId}`, {
        headers: {
          Authorization: `Bearer ${cleanToken}`,
        },
      });

      if (response.data?.code === 1000) {
        return response.data.result;
      } else {
        throw new Error(response.data?.message || "Không thể lấy thông tin người thuê");
      }
    } catch (error) {
      console.error("Failed to fetch tenant info:", error.message);
      return null;
    }
  };

  // Fetch rooms data
  const fetchRooms = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/room/`, {
        headers: {
          Authorization: `Bearer ${cleanToken}`,
        },
      });

      if (response.data?.code !== 1000) {
        throw new Error(response.data?.message || "Không thể lấy danh sách phòng");
      }

      setRooms(response.data?.result || []);
    } catch (error) {
      console.error("Failed to fetch rooms:", error.message);
      setToast({ message: error.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Check for authentication and load data
  useEffect(() => {
    if (!cleanToken) {
      navigate("/login");
      return;
    }

    fetchUser();
    fetchRooms();
  }, [cleanToken, navigate]);

  // Xử lý xóa phòng
  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa phòng này không?")) {
      return;
    }

    try {
      const response = await axios.delete(`${API_BASE_URL}/room/${roomId}`, {
        headers: {
          Authorization: `Bearer ${cleanToken}`,
        },
      });

      if (response.data?.code !== 1000) {
        throw new Error(response.data?.message || "Không thể xóa phòng");
      }

      // Cập nhật danh sách phòng sau khi xóa
      setRooms(rooms.filter(room => room.id !== roomId));
      setToast({ message: "Xóa phòng thành công", type: "success" });
    } catch (error) {
      console.error("Failed to delete room:", error.message);
      setToast({ message: error.message, type: "error" });
    }
  };

  // Xử lý thêm phòng mới
  const handleAddRoom = async (roomData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/room/`, roomData, {
        headers: {
          Authorization: `Bearer ${cleanToken}`,
          'Content-Type': 'application/json'
        },
      });

      if (response.data?.code !== 1000) {
        throw new Error(response.data?.message || "Không thể thêm phòng");
      }

      setToast({ message: response.data.result || "Đã gửi yêu cầu đăng bài đến admin, vui lòng chờ được duyệt", type: "success" });
      fetchRooms(); // Refresh room list
    } catch (error) {
      console.error("Failed to add room:", error.message);
      setToast({ message: error.message, type: "error" });
    } finally {
      setIsAddRoomModalOpen(false);
    }
  };

  // Xử lý cập nhật phòng
  const handleUpdateRoom = async (roomData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/room/${roomData.id}`, roomData, {
        headers: {
          Authorization: `Bearer ${cleanToken}`,
          'Content-Type': 'application/json'
        },
      });

      if (response.data?.code !== 1000) {
        throw new Error(response.data?.message || "Không thể cập nhật phòng");
      }

      // Cập nhật danh sách phòng
      setRooms(rooms.map(room => room.id === roomData.id ? response.data.result : room));
      setToast({ message: "Cập nhật phòng thành công", type: "success" });
    } catch (error) {
      console.error("Failed to update room:", error.message);
      setToast({ message: error.message, type: "error" });
    } finally {
      setIsEditRoomModalOpen(false);
    }
  };

  // Xử lý xem chi tiết phòng
  const handleViewRoom = async (room) => {
    setSelectedRoom(room);

    // Nếu phòng đã được thuê, lấy thông tin người thuê
    if (room.status === "OCCUPIED") {
      const tenant = await fetchTenantInfo(room.id);
      setTenantInfo(tenant);
    } else {
      setTenantInfo(null);
    }

    setIsViewRoomModalOpen(true);
  };

  // Cập nhật ViewRoomModal component call
  {
    isViewRoomModalOpen && selectedRoom && (
      <ViewRoomModal
        onClose={() => {
          setIsViewRoomModalOpen(false);
          setSelectedRoom(null);
          setTenantInfo(null); // Reset tenant info
        }}
        room={selectedRoom}
        tenant={tenantInfo} // Truyền thông tin người thuê
      />
    )
  }

  // Xử lý mở modal chỉnh sửa
  const handleOpenEditModal = (room) => {
    setSelectedRoom(room);
    setIsEditRoomModalOpen(true);
  };

  // Màu sắc cho trạng thái phòng
  const getStatusColor = (status) => {
    switch (status) {
      case "OCCUPIED":
        return "bg-green-100 text-green-800 border-green-200";
      case "AVAILABLE":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "MAINTENANCE":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "PENDING":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Chuyển đổi trạng thái thành văn bản Tiếng Việt
  const getStatusText = (status) => {
    switch (status) {
      case "OCCUPIED":
        return "Đã Thuê";
      case "AVAILABLE":
        return "Còn Trống";
      case "MAINTENANCE":
        return "Đang Sửa Chữa";
      case "PENDING":
        return "Chờ Duyệt";
      case "RESERVED":
        return "Đã Đặt";
      default:
        return status;
    }
  };

  // Lọc phòng theo trạng thái và từ khóa tìm kiếm
  const filteredRooms = rooms.filter((room) => {
    // Lọc theo trạng thái
    const statusFilter =
      activeFilter === "all" ||
      (activeFilter === "occupied" && room.status === "OCCUPIED") ||
      (activeFilter === "available" && room.status === "AVAILABLE") ||
      (activeFilter === "maintenance" && room.status === "MAINTENANCE") ||
      (activeFilter === "pending" && room.status === "PENDING");

    // Lọc theo từ khóa tìm kiếm
    const searchFilter = searchTerm === "" ||
      (room.roomNumber && room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (room.tenant && room.tenant.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (room.addressText && room.addressText.toLowerCase().includes(searchTerm.toLowerCase()));

    return statusFilter && searchFilter;
  });
  // Display loading state
  if (isLoading && !currentUser.firstName) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  // Display error state
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-center mb-2">Đã xảy ra lỗi</h2>
          <p className="text-gray-600 text-center mb-4">{error}</p>
          <button
            onClick={() => { setError(null); fetchUser(); fetchRooms(); }}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarOwner
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        currentUser={currentUser}
        activeItem="rooms"
      />
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm border-b border-gray-200 z-10">
          <TopNavigationOwner />
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="flex-1 overflow-y-auto p-6">
            {/* Nội dung chính của OwnerRoomManagement - giữ nguyên phần này */}
            <div className="max-w-7xl mx-auto p-6">
              {/* Header với số liệu thống kê */}
              <div className="mb-8">
                <div className="flex flex-wrap items-center justify-between mb-2">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                      Quản Lý Phòng Trọ
                    </h1>
                    <p className="text-gray-500 mt-1">Quản lý danh sách phòng của bạn</p>
                  </div>
                  <button
                    onClick={() => setIsAddRoomModalOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                  >
                    <Plus size={20} className="mr-2" />
                    Thêm Phòng Mới
                  </button>
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
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={18}
                        />
                        <input
                          type="text"
                          placeholder="Tìm kiếm phòng, người thuê..."
                          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 md:gap-4 w-full md:w-auto">
                      <button
                        className={`px-4 py-2 rounded-lg border transition-all ${activeFilter === "all"
                          ? "bg-indigo-50 text-indigo-700 border-indigo-200 font-medium"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                          }`}
                        onClick={() => setActiveFilter("all")}
                      >
                        Tất cả
                      </button>
                      <button
                        className={`px-4 py-2 rounded-lg border transition-all ${activeFilter === "occupied"
                          ? "bg-green-50 text-green-700 border-green-200 font-medium"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                          }`}
                        onClick={() => setActiveFilter("occupied")}
                      >
                        Đã thuê
                      </button>
                      <button
                        className={`px-4 py-2 rounded-lg border transition-all ${activeFilter === "available"
                          ? "bg-blue-50 text-blue-700 border-blue-200 font-medium"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                          }`}
                        onClick={() => setActiveFilter("available")}
                      >
                        Còn trống
                      </button>
                      <button
                        className={`px-4 py-2 rounded-lg border transition-all ${activeFilter === "maintenance"
                          ? "bg-orange-50 text-orange-700 border-orange-200 font-medium"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                          }`}
                        onClick={() => setActiveFilter("maintenance")}
                      >
                        Đang sửa chữa
                      </button>
                      <button
                        className={`px-4 py-2 rounded-lg border transition-all ${activeFilter === "pending"
                          ? "bg-purple-50 text-purple-700 border-purple-200 font-medium"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                          }`}
                        onClick={() => setActiveFilter("pending")}
                      >
                        Chờ duyệt
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Loading state */}
              {loading && (
                <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                    <h3 className="text-xl font-medium text-gray-700">Đang tải dữ liệu phòng...</h3>
                  </div>
                </div>
              )}

              {/* Hiển thị danh sách phòng */}
              {!loading && filteredRooms.length === 0 ? (
                <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
                  <div className="flex flex-col items-center justify-center">
                    <Building size={48} className="text-gray-400 mb-4" />
                    <h3 className="text-xl font-medium text-gray-700 mb-2">Không có phòng nào</h3>
                    <p className="text-gray-500 mb-6">
                      {searchTerm
                        ? "Không tìm thấy phòng phù hợp với từ khóa tìm kiếm."
                        : "Bạn chưa có phòng nào trong danh mục này."}
                    </p>
                    <button
                      onClick={() => setIsAddRoomModalOpen(true)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                    >
                      <PlusCircle size={20} className="mr-2" />
                      Thêm Phòng Mới
                    </button>
                  </div>
                </div>
              ) : !loading && (
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
                                Tầng {room.floor || 1} • {room.roomType || "Phòng tiêu chuẩn"}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                              room.status
                            )}`}
                          >
                            {getStatusText(room.status)}
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
                              {room.price ? room.price.toLocaleString() + " đ" : "Chưa có"}
                            </span>
                          </div>
                          {room.status === "OCCUPIED" && (
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600 text-sm">Người thuê:</span>
                              <span className="text-gray-900 font-medium">
                                {room.tenant || "Chưa có"}
                              </span>
                            </div>
                          )}
                          {(room.district || room.province) && (
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600 text-sm">Khu vực:</span>
                              <span className="text-gray-900 font-medium">
                                {room.district ? `${room.district}, ${room.province}` : room.province || "Chưa có"}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {room.facilities && room.facilities.length > 0 ? (
                            room.facilities.slice(0, 3).map((facility, index) => (
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
                          {room.facilities && room.facilities.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs">
                              +{room.facilities.length - 3}
                            </span>
                          )}
                        </div>

                        {room.mediaUrls && room.mediaUrls.length > 0 && (
                          <div className="mt-3">
                            <div className="flex gap-2 overflow-x-auto pb-2">
                              {room.mediaUrls.slice(0, 3).map((url, index) => {
                                const isVideoFile = isVideo(url);
                                const isImageFile = isImage(url.replace(/"/g, ""));

                                return (
                                  <div
                                    key={index}
                                    className="min-w-[100px] h-[80px] rounded-md bg-gray-100 overflow-hidden"
                                  >
                                    {isVideoFile ? (
                                      <video
                                        className="w-full h-full object-cover"
                                        src={url}
                                        muted
                                      />
                                    ) : (
                                      <img
                                        className="w-full h-full object-cover"
                                        src={url}
                                        alt={`Ảnh đính kèm ${index + 1}`}
                                        onError={(e) => {
                                          console.error(`Error loading image: ${url}`);
                                          e.target.src = "https://via.placeholder.com/100x80?text=Error";
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

                      {/* Các hành động */}
                      <div className="bg-gray-50 px-4 py-3 flex justify-between items-center">
                        <button
                          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                          onClick={() => handleViewRoom(room)}
                        >
                          Xem chi tiết
                        </button>

                        <div className="flex space-x-1">
                          <button
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            onClick={() => handleViewRoom(room)}
                          >
                            <Eye size={18} />
                          </button>

                          {room.status !== "PENDING" && (
                            <>
                              <button
                                className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                                onClick={() => handleOpenEditModal(room)}
                              >
                                <Edit size={18} />
                              </button>
                              <button
                                onClick={() => handleDeleteRoom(room.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                              >
                                <Trash2 size={18} />
                              </button>
                            </>
                          )}

                          {room.status === "PENDING" && (
                            <div className="inline-flex items-center px-2 text-xs text-purple-700">
                              <Clock size={14} className="mr-1" /> Đang chờ duyệt
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {isAddRoomModalOpen && (
        <AddRoomModal
          onClose={() => setIsAddRoomModalOpen(false)}
          onAddRoom={handleAddRoom}
          token={cleanToken}
        />
      )}

      {isEditRoomModalOpen && selectedRoom && (
        <EditRoomModal
          onClose={() => {
            setIsEditRoomModalOpen(false);
            setSelectedRoom(null);
          }}
          onUpdateRoom={handleUpdateRoom}
          room={selectedRoom}
          token={cleanToken}
        />
      )}

      {isViewRoomModalOpen && selectedRoom && (
        <ViewRoomModal
          onClose={() => {
            setIsViewRoomModalOpen(false);
            setSelectedRoom(null);
          }}
          room={selectedRoom}
          tenant={tenantInfo}
        />
      )}

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
