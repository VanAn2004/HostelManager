import { useEffect, useState } from "react";
import {
  Search,
  Home,
  Users,
  FileText,
  Settings,
  Bell,
  Menu,
  X,
  ChevronDown,
  Calendar,
  CreditCard,
  Key,
  Droplet,
  Zap,
  Wifi,
  AlertTriangle,
  MessageSquare,
  Check,
  Clock,
  PlusCircle,
  Edit,
  Trash2,
  Eye,
  LogOut,
} from "lucide-react";
import UtilityCard from "../../Component/OwnerDashBoardComponent/UltilityCard";
import StatCard from "../../Component/OwnerDashBoardComponent/StartCard";
import NavItem from "../../Component/OwnerDashBoardComponent/NavItem";
import SidebarOwner from "../../Component/SiderbarOwner";
import TopNavigationOwner from "../../Component/TopNavigationOwner";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:8080/api/v1";

export default function OwnerDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentUser, setCurrentUser] = useState({});
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  
  // Get token from localStorage and clean it
  const token = localStorage.getItem("token");
  const cleanToken = token ? token.replace(/"/g, "") : "";
  
  // Helper function to format status for display
  const formatRoomStatus = (status) => {
    switch(status) {
      case "OCCUPIED": return {
        label: "Đã Thuê",
        className: "bg-green-100 text-green-800"
      };
      case "AVAILABLE": return {
        label: "Trống",
        className: "bg-gray-100 text-gray-800"
      };
      case "PENDING": return {
        label: "Chờ Duyệt",
        className: "bg-yellow-100 text-yellow-800"
      };
      case "MAINTENANCE": return {
        label: "Bảo Trì",
        className: "bg-orange-100 text-orange-800" 
      };
      default: return {
        label: status,
        className: "bg-gray-100 text-gray-800"
      };
    }
  };

  // Helper function to format payment status
  const formatPaymentStatus = (status) => {
    switch(status) {
      case "PAID": return {
        label: "Đã Thanh Toán",
        className: "bg-green-100 text-green-800"
      };
      case "UNPAID": return {
        label: "Chưa Thanh Toán",
        className: "bg-yellow-100 text-yellow-800"
      };
      case "OVERDUE": return {
        label: "Trễ Hạn",
        className: "bg-red-100 text-red-800"
      };
      default: return null;
    }
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

  // Fetch rooms data
  const fetchRooms = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/room/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cleanToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Không thể tải danh sách phòng');
      }
      
      const data = await response.json();
      if (data.code !== 1000) {
        throw new Error(data.message || 'Lỗi khi tải danh sách phòng');
      }
      
      setRooms(data.result);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Filter rooms based on selection
  const filteredRooms = () => {
    switch(filter) {
      case "OCCUPIED":
        return rooms.filter(room => room.status === "OCCUPIED");
      case "AVAILABLE":
        return rooms.filter(room => room.status === "AVAILABLE");
      case "PENDING":
        return rooms.filter(room => room.status === "PENDING");
      default:
        return rooms;
    }
  };

  // Handle view room details
  const handleViewRoom = (roomId) => {
    navigate(`/owner/rooms/${roomId}`);
  };

  // Handle edit room
  const handleEditRoom = (roomId) => {
    navigate(`/owner/rooms/edit/${roomId}`);
  };

  // Handle delete room
  const handleDeleteRoom = async (roomId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa phòng này?")) {
      try {
        const response = await fetch(`${API_BASE_URL}/room/${roomId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${cleanToken}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Không thể xóa phòng');
        }
        
        // Refresh rooms list
        fetchRooms();
      } catch (error) {
        console.error('Error deleting room:', error);
        setError(error.message);
      }
    }
  };

  // Navigate to create new room
  const handleAddNewRoom = () => {
    navigate("/owner/rooms/create");
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
      {/* Sidebar */}
      <SidebarOwner
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        currentUser={currentUser}
        activeItem="dashboard"
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm border-b border-gray-200 z-10">
          <TopNavigationOwner/>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="mb-8">
            <div className="flex flex-wrap items-center justify-between mb-2">
              <h1 className="text-2xl font-bold text-gray-800">
                Tổng Quan Phòng Trọ
              </h1>
              <div className="flex space-x-3">
                <button 
                  onClick={handleAddNewRoom}
                  className="flex items-center space-x-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <PlusCircle size={16} />
                  <span>Thêm Phòng Mới</span>
                </button>
              </div>
            </div>
            <p className="text-gray-600">
              Xin chào, {currentUser.firstName} {currentUser.lastName}! Đây là tổng quan về các phòng trọ của bạn
              hôm nay.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={<Key className="text-blue-500" />}
              label="Tổng Số Phòng"
              value={rooms.length}
              bgColor="bg-blue-50"
              iconBg="bg-blue-100"
            />
            <StatCard
              icon={<Check className="text-green-500" />}
              label="Phòng Đã Thuê"
              value={rooms.filter((room) => room.status === "OCCUPIED").length}
              bgColor="bg-green-50"
              iconBg="bg-green-100"
            />
            <StatCard
              icon={<Clock className="text-orange-500" />}
              label="Phòng Trống"
              value={rooms.filter((room) => room.status === "AVAILABLE").length}
              bgColor="bg-orange-50"
              iconBg="bg-orange-100"
            />
            <StatCard
              icon={<AlertTriangle className="text-yellow-500" />}
              label="Chờ Duyệt"
              value={rooms.filter((room) => room.status === "PENDING").length}
              bgColor="bg-yellow-50"
              iconBg="bg-yellow-100"
            />
          </div>

          {/* Utility Bills Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium text-gray-800">
                  Hóa Đơn Dịch Vụ Tháng Này
                </h3>
                <p className="text-sm text-gray-500">Tháng 5/2025</p>
              </div>
              <button 
                onClick={() => navigate("/owner/utilities")}
                className="px-3 py-1 text-xs bg-gray-100 border border-gray-200 rounded-md text-gray-600 hover:bg-gray-200"
              >
                Xem Tất Cả
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <UtilityCard
                  icon={<Droplet className="text-blue-500" />}
                  title="Nước"
                  amount="4.280.000đ"
                  status="Đã Thanh Toán"
                  color="blue"
                />
                <UtilityCard
                  icon={<Zap className="text-yellow-500" />}
                  title="Điện"
                  amount="6.750.000đ"
                  status="Chưa Thanh Toán"
                  color="yellow"
                  dueDate="25/05/2025"
                />
                <UtilityCard
                  icon={<Wifi className="text-purple-500" />}
                  title="Internet"
                  amount="2.400.000đ"
                  status="Đã Thanh Toán"
                  color="purple"
                />
              </div>
            </div>
          </div>

          {/* Room Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-white flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium text-gray-800">
                  Danh Sách Phòng
                </h3>
                <p className="text-sm text-gray-500">
                  Quản lý tất cả các phòng trọ của bạn
                </p>
              </div>
              <div className="flex space-x-2">
                <div className="relative">
                  <select 
                    className="appearance-none bg-gray-100 border border-gray-200 text-gray-700 py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 text-sm"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <option value="ALL">Tất Cả Phòng</option>
                    <option value="OCCUPIED">Phòng Đã Thuê</option>
                    <option value="AVAILABLE">Phòng Trống</option>
                    <option value="PENDING">Phòng Chờ Duyệt</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phòng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Người Thuê
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng Thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tiền Thuê
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thanh Toán
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao Tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRooms().length > 0 ? (
                    filteredRooms().map((room, i) => {
                      const roomStatus = formatRoomStatus(room.status);
                      const paymentStatus = room.paymentStatus ? formatPaymentStatus(room.paymentStatus) : null;
                      
                      return (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="bg-blue-100 p-2 rounded-md">
                                <Key size={18} className="text-blue-600" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {room.roomNumber}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {room.floor && `Tầng ${room.floor}`}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {room.tenant ? (
                              <div className="flex items-center">
                                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                  <span className="text-sm font-medium text-gray-600">
                                    {room.tenant.charAt(0)}
                                  </span>
                                </div>
                                <div className="ml-3">
                                  <div className="text-sm font-medium text-gray-900">
                                    {room.tenant}
                                  </div>
                                  {room.tenantPhone && (
                                    <div className="text-xs text-gray-500">
                                      {room.tenantPhone}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <span className="text-sm text-gray-500">Chưa có người thuê</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${roomStatus.className}`}>
                              {roomStatus.label}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {room.price ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(room.price) : "Chưa cập nhật"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {paymentStatus ? (
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${paymentStatus.className}`}>
                                {paymentStatus.label}
                              </span>
                            ) : room.dueDate ? (
                              <span className="text-sm text-gray-500">{room.dueDate}</span>
                            ) : (
                              <span className="text-sm text-gray-500">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button 
                                onClick={() => handleViewRoom(room.id)}
                                className="p-1 text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-md"
                                title="Xem chi tiết"
                              >
                                <Eye size={16} />
                              </button>
                              <button 
                                onClick={() => handleEditRoom(room.id)}
                                className="p-1 text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 rounded-md"
                                title="Chỉnh sửa"
                              >
                                <Edit size={16} />
                              </button>
                              {room.status === "AVAILABLE" && (
                                <button 
                                  onClick={() => handleDeleteRoom(room.id)}
                                  className="p-1 text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 rounded-md"
                                  title="Xóa phòng"
                                >
                                  <Trash2 size={16} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                        {filter !== "ALL" ? "Không có phòng nào trong trạng thái đã chọn" : "Chưa có phòng nào được tạo"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {filteredRooms().length > 0 && (
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Hiển thị 1 đến {filteredRooms().length} trong tổng số {filteredRooms().length} phòng
                  </div>
                  <div className="flex space-x-1">
                    <button className="px-3 py-1 rounded bg-white border border-gray-300 text-sm font-medium text-gray-500">
                      Trước
                    </button>
                    <button className="px-3 py-1 rounded bg-blue-600 border border-blue-600 text-sm font-medium text-white">
                      1
                    </button>
                    <button className="px-3 py-1 rounded bg-white border border-gray-300 text-sm font-medium text-gray-500">
                      Sau
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Recent Events and Payment Schedule Section
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-800">
                  Thông Báo & Sự Kiện Gần Đây
                </h3>
                <button 
                  onClick={() => navigate("/owner/notifications")}
                  className="px-3 py-1 text-xs bg-gray-100 border border-gray-200 rounded-md text-gray-600 hover:bg-gray-200"
                >
                  Xem Tất Cả
                </button>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
                    <div className="bg-red-100 p-2 rounded-lg">
                      <AlertTriangle size={20} className="text-red-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-medium text-gray-900">Trễ thanh toán tiền phòng</h4>
                        <span className="text-xs text-gray-500">2 giờ trước</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        Phòng 103 đã trễ hạn thanh toán tiền phòng tháng 5. Vui lòng kiểm tra và liên hệ với người thuê.
                      </p>
                      <div className="mt-2">
                        <button className="text-xs font-medium text-blue-600 hover:text-blue-800">
                          Xem chi tiết
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Check size={20} className="text-green-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-medium text-gray-900">Thanh toán hóa đơn điện</h4>
                        <span className="text-xs text-gray-500">Hôm qua</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        Đã nhận thanh toán hóa đơn điện từ phòng 201 cho tháng 5/2025.
                      </p>
                      <div className="mt-2">
                        <button className="text-xs font-medium text-blue-600 hover:text-blue-800">
                          Xem chi tiết
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
                    <div className="bg-yellow-100 p-2 rounded-lg">
                      <MessageSquare size={20} className="text-yellow-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-medium text-gray-900">Yêu cầu sửa chữa</h4>
                        <span className="text-xs text-gray-500">3 ngày trước</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        Phòng 304 đã gửi yêu cầu sửa chữa vòi nước trong phòng tắm.
                      </p>
                      <div className="mt-2">
                        <button className="text-xs font-medium text-blue-600 hover:text-blue-800">
                          Xem yêu cầu
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Users size={20} className="text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-medium text-gray-900">Người thuê mới</h4>
                        <span className="text-xs text-gray-500">5 ngày trước</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        Nguyễn Văn A đã đăng ký thuê phòng 105 và đang chờ duyệt.
                      </p>
                      <div className="mt-2">
                        <button className="text-xs font-medium text-blue-600 hover:text-blue-800">
                          Xem đơn đăng ký
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-800">
                  Lịch Thanh Toán
                </h3>
                <button 
                  onClick={() => navigate("/owner/payments/schedule")}
                  className="px-3 py-1 text-xs bg-gray-100 border border-gray-200 rounded-md text-gray-600 hover:bg-gray-200"
                >
                  Xem Tất Cả
                </button>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="bg-yellow-100 p-2 rounded-full">
                      <Calendar size={16} className="text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-600">Hôm nay</p>
                      <h4 className="text-sm font-medium text-gray-900">
                        3 khoản thanh toán đến hạn
                      </h4>
                    </div>
                    <div className="text-sm font-medium text-yellow-600">
                      5.400.000đ
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="bg-gray-100 p-2 rounded-full">
                      <Calendar size={16} className="text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-600">25/05/2025</p>
                      <h4 className="text-sm font-medium text-gray-900">
                        Hóa đơn điện
                      </h4>
                    </div>
                    <div className="text-sm font-medium text-gray-600">
                      6.750.000đ
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="bg-gray-100 p-2 rounded-full">
                      <Calendar size={16} className="text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-600">01/06/2025</p>
                      <h4 className="text-sm font-medium text-gray-900">
                        Tiền thuê tháng 6
                      </h4>
                    </div>
                    <div className="text-sm font-medium text-gray-600">
                      18.500.000đ
                    </div>
                  </div>
                </div>
                
                <div className="mt-5">
                  <button 
                    onClick={() => navigate("/owner/payments/create")}
                    className="w-full flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    <PlusCircle size={16} />
                    <span>Tạo Hóa Đơn Mới</span>
                  </button>
                </div>
              </div>
            </div>
          </div> */}
          
          {/* Quick Actions Section */}
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-800">
                Thao Tác Nhanh
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <button 
                  onClick={() => navigate("/owner/rooms/create")}
                  className="flex flex-col items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                >
                  <div className="bg-blue-100 p-3 rounded-full mb-3">
                    <Key size={20} className="text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Thêm Phòng</span>
                </button>
                
                <button 
                  onClick={() => navigate("/owner/tenants/add")}
                  className="flex flex-col items-center p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors"
                >
                  <div className="bg-green-100 p-3 rounded-full mb-3">
                    <Users size={20} className="text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Thêm Người Thuê</span>
                </button>
                
                <button 
                  onClick={() => navigate("/owner/contracts/create")}
                  className="flex flex-col items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors"
                >
                  <div className="bg-purple-100 p-3 rounded-full mb-3">
                    <FileText size={20} className="text-purple-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Tạo Hợp Đồng</span>
                </button>
                
                <button 
                  onClick={() => navigate("/owner/payments/create")}
                  className="flex flex-col items-center p-4 bg-yellow-50 hover:bg-yellow-100 rounded-xl transition-colors"
                >
                  <div className="bg-yellow-100 p-3 rounded-full mb-3">
                    <CreditCard size={20} className="text-yellow-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Tạo Hóa Đơn</span>
                </button>
                
                <button 
                  onClick={() => navigate("/owner/notifications/create")}
                  className="flex flex-col items-center p-4 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                >
                  <div className="bg-red-100 p-3 rounded-full mb-3">
                    <Bell size={20} className="text-red-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Gửi Thông Báo</span>
                </button>
                
                <button 
                  onClick={() => navigate("/owner/reports")}
                  className="flex flex-col items-center p-4 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
                >
                  <div className="bg-indigo-100 p-3 rounded-full mb-3">
                    <FileText size={20} className="text-indigo-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Báo Cáo</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Support Section */}
          <div className="mt-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-md p-6 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold">Cần hỗ trợ?</h3>
                <p className="text-blue-100 mt-1">
                  Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn 24/7
                </p>
              </div>
              <div className="flex space-x-3">
                <button 
                  onClick={() => window.open("mailto:support@tromoi.vn")}
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                >
                  Gửi Email
                </button>
                <button
                  onClick={() => navigate("/owner/support")}
                  className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors font-medium"
                >
                  Chat Với Hỗ Trợ
                </button>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <footer className="mt-16 text-center text-gray-500 text-sm">
            <p>© 2025 Trọ Mới. Đã đăng ký bản quyền.</p>
          </footer>
        </main>
      </div>
    </div>
  );
}