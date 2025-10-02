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
  AlertTriangle,
  PlusCircle,
  Edit,
  Trash2,
  Eye,
  LogOut,
  Phone,
  Mail,
  CreditCard as IdCard,
  MapPin,
  ArrowUpDown,
  Filter,
  Download,
  RefreshCw,
  User,
  Building,
  Clock,
  CheckCircle,
  XCircle,
  History,
  UserCheck,
  Zap,
  UserX,
  UserPlus,
  Home as HomeIcon,
  UserMinus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import SidebarOwner from "../../../Component/SiderbarOwner";
import TopNavigationOwner from "../../../Component/TopNavigationOwner";

const API_BASE_URL = "http://localhost:8080/api/v1";

export default function TenantManagement() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentUser, setCurrentUser] = useState({});
  const [tenants, setTenants] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showChangeRoomModal, setShowChangeRoomModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [tenantHistory, setTenantHistory] = useState([]);


  const navigate = useNavigate();

  // Get token from localStorage and clean it
  const token = localStorage.getItem("token");
  const cleanToken = token ? token.replace(/"/g, "") : "";

  // Helper function to format tenant status
  const formatTenantStatus = (status) => {
    switch (status) {
      case "PENDING": return {
        label: "Chờ Duyệt",
        className: "bg-yellow-100 text-yellow-800",
        icon: <Clock size={14} />
      };
      case "APPROVED": return {
        label: "Đã Duyệt",
        className: "bg-blue-100 text-blue-800",
        icon: <UserCheck size={14} />
      };
      case "DEPOSITED": return {
        label: "Đã Đặt Cọc",
        className: "bg-purple-100 text-purple-800",
        icon: <CreditCard size={14} />
      };
      case "CONTRACT_CONFIRMED": return {
        label: "Đang Thuê",
        className: "bg-green-100 text-green-800",
        icon: <CheckCircle size={14} />
      };
      case "COMPLETED": return {
        label: "Đã Hoàn Thành",
        className: "bg-gray-100 text-gray-800",
        icon: <CheckCircle size={14} />
      };
      case "INACTIVE": return {
        label: "Ngưng Thuê",
        className: "bg-gray-100 text-gray-800",
        icon: <XCircle size={14} />
      };
      case "MOVED_OUT": return {
        label: "Đã Chuyển Đi",
        className: "bg-orange-100 text-orange-800",
        icon: <UserMinus size={14} />
      };
      case "CANCELLED": return {
        label: "Đã Hủy",
        className: "bg-red-100 text-red-800",
        icon: <XCircle size={14} />
      };
      case "REJECTED": return {
        label: "Bị Từ Chối",
        className: "bg-red-100 text-red-800",
        icon: <UserX size={14} />
      };
      default: return {
        label: status,
        className: "bg-gray-100 text-gray-800",
        icon: <Clock size={14} />
      };
    }
  };

  // Fetch user data
  const fetchUser = async () => {
    try {
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
    }
  };

  // Fetch tenants data
  const fetchTenants = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/owner/tenants`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cleanToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Không thể tải danh sách người thuê');
      }

      const data = await response.json();
      if (data.code !== 1000) {
        throw new Error(data.message || 'Lỗi khi tải danh sách người thuê');
      }

      setTenants(data.result);
    } catch (error) {
      console.error('Error fetching tenants:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch rooms data for room change
  const fetchRooms = async () => {
    try {
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
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Filter tenants based on selection and search
  const filteredTenants = () => {
    let filtered = tenants;

    // Filter by status
    if (filter !== "ALL") {
      filtered = filtered.filter(tenant => tenant.status === filter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(tenant =>
        tenant.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tenant.phoneNumber?.includes(searchTerm) ||
        tenant.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tenant.roomNumber?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  // Handle view tenant details
  const handleViewTenant = async (tenant) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/owner/tenants/${tenant.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cleanToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Không thể tải thông tin chi tiết người thuê');
      }

      const data = await response.json();
      if (data.code !== 1000) {
        throw new Error(data.message || 'Lỗi khi tải thông tin chi tiết');
      }

      setSelectedTenant(data.result);
      setShowViewModal(true); // Hiển thị modal xem chi tiết
    } catch (error) {
      console.error('Error fetching tenant details:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };


  // Handle edit tenant - Updated to match API
  const handleEditTenant = async (tenant) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/owner/tenants/${tenant.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cleanToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Không thể tải thông tin chi tiết người thuê');
      }

      const data = await response.json();
      if (data.code !== 1000) {
        throw new Error(data.message || 'Lỗi khi tải thông tin chi tiết');
      }

      setSelectedTenant(data.result);
      setShowEditModal(true); // Hiển thị modal chỉnh sửa
    } catch (error) {
      console.error('Error fetching tenant details:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  const handleUpdateTenant = async (tenantData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/owner/tenants`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cleanToken}`
        },
        body: JSON.stringify({
          _id: tenantData.id,
          fullName: tenantData.fullName,
          phoneNumber: tenantData.phoneNumber,
          email: tenantData.email,
          idCardNumber: tenantData.idCardNumber,
          avatarUrl: tenantData.avatarUrl,
          checkInDate: tenantData.checkInDate,
          checkOutDate: tenantData.checkOutDate
        })
      });

      if (!response.ok) {
        throw new Error('Không thể cập nhật thông tin người thuê');
      }

      setShowEditModal(false);
      fetchTenants();
    } catch (error) {
      console.error('Error updating tenant:', error);
      setError(error.message);
    }
  };
  // Handle change room - Updated to match API
  const handleChangeRoom = async (newRoomId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/owner/tenants/change-room`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cleanToken}`
        },
        body: JSON.stringify({
          _id: selectedTenant.id,
          newRoomId: newRoomId
        })
      });

      if (!response.ok) {
        throw new Error('Không thể chuyển phòng');
      }

      setShowChangeRoomModal(false);
      fetchTenants();
    } catch (error) {
      console.error('Error changing room:', error);
      setError(error.message);
    }
  };

  // Handle approve/reject tenant
  const handleApproveReject = async (tenantId, status) => {
    try {
      const response = await fetch(`${API_BASE_URL}/owner/tenants/${tenantId}/status?status=${status}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cleanToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Không thể cập nhật trạng thái người thuê');
      }

      fetchTenants();
    } catch (error) {
      console.error('Error updating tenant status:', error);
      setError(error.message);
    }
  };

  // Handle modify tenant (end, delete, etc.) - Updated to match API
  const handleModifyTenant = async (tenantId, status) => {
    const confirmMessages = {
      INACTIVE: "Bạn có chắc chắn muốn ngưng hợp đồng thuê?",
      MOVED_OUT: "Bạn có chắc chắn người thuê đã chuyển đi?",
      CANCELLED: "Bạn có chắc chắn muốn hủy hợp đồng?",
      COMPLETED: "Bạn có chắc chắn muốn hoàn thành hợp đồng?",
      REJECTED: "Bạn có chắc chắn muốn xóa người thuê này? Thao tác này không thể hoàn tác."
    };

    if (window.confirm(confirmMessages[status])) {
      try {
        const response = await fetch(`${API_BASE_URL}/owner/tenants/modify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cleanToken}`
          },
          body: JSON.stringify({
            _id: tenantId,
            status: status
          })
        });

        if (!response.ok) {
          throw new Error('Không thể thực hiện thao tác');
        }

        fetchTenants();
      } catch (error) {
        console.error('Error modifying tenant:', error);
        setError(error.message);
      }
    }
  };

  // handleGetRoomNumber
  const handleGetRoomNumber = (roomId) => {
    const room = rooms.find(r => r.id === roomId);
    return room ? room.roomNumber : "Chưa xác định";
  };

  const handleGetRoomType = (roomId) => {
    const room = rooms.find(r => r.id === roomId);
    return room ? room.roomType : "Chưa xác định";
  };

  // Fetch tenant history - Updated to match API
  const fetchTenantHistory = async (tenantId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/owner/tenants/${tenantId}/history`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cleanToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Không thể tải lịch sử thuê');
      }

      const data = await response.json();
      setTenantHistory(data.result);
      setShowHistoryModal(true);
    } catch (error) {
      console.error('Error fetching tenant history:', error);
      setError(error.message);
    }
  };

  // Check for authentication and load data
  useEffect(() => {
    if (!cleanToken) {
      navigate("/login");
      return;
    }

    fetchUser();
    fetchTenants();
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
            onClick={() => { setError(null); fetchUser(); fetchTenants(); }}
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
        activeItem="tenants"
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm border-b border-gray-200 z-10">
          <TopNavigationOwner />
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="mb-8">
            <div className="flex flex-wrap items-center justify-between mb-2">
              <h1 className="text-2xl font-bold text-gray-800">
                Quản Lý Người Thuê
              </h1>
              <div className="flex space-x-3">
                <button
                  onClick={() => fetchTenants()}
                  className="flex items-center space-x-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                >
                  <RefreshCw size={16} />
                  <span>Làm mới</span>
                </button>
              </div>
            </div>
            <p className="text-gray-600">
              Quản lý thông tin và trạng thái của tất cả người thuê trong hệ thống
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Users className="text-blue-600" size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Tổng Số</p>
                  <p className="text-2xl font-bold text-gray-900">{tenants.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <Clock className="text-yellow-600" size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Chờ Duyệt</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {tenants.filter(t => t.status === "PENDING").length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-lg">
                  <CheckCircle className="text-green-600" size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Đang Thuê</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {tenants.filter(t => ["CONTRACT_CONFIRMED"].includes(t.status)).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <UserCheck className="text-blue-600" size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Đã Duyệt</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {tenants.filter(t => ["APPROVED", "DEPOSITED"].includes(t.status)).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <XCircle className="text-gray-600" size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Đã Kết Thúc</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {tenants.filter(t => ["COMPLETED", "INACTIVE", "MOVED_OUT", "CANCELLED"].includes(t.status)).length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tenant Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-white flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium text-gray-800">
                  Danh Sách Người Thuê
                </h3>
                <p className="text-sm text-gray-500">
                  Quản lý thông tin chi tiết của từng người thuê
                </p>
              </div>
              <div className="flex space-x-2">
                <div className="relative">
                  <select
                    className="appearance-none bg-gray-100 border border-gray-200 text-gray-700 py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 text-sm"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <option value="ALL">Tất Cả Trạng Thái</option>
                    <option value="PENDING">Chờ Duyệt</option>
                    <option value="APPROVED">Đã Duyệt</option>
                    <option value="DEPOSITED">Đã Đặt Cọc</option>
                    <option value="CONTRACT_CONFIRMED">Đang Thuê</option>
                    <option value="COMPLETED">Đã Hoàn Thành</option>
                    <option value="INACTIVE">Ngưng Thuê</option>
                    <option value="MOVED_OUT">Đã Chuyển Đi</option>
                    <option value="CANCELLED">Đã Hủy</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <ChevronDown size={16} />
                  </div>
                </div>
                <button className="flex items-center space-x-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm">
                  <Download size={16} />
                  <span>Xuất Excel</span>
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Người Thuê
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phòng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng Thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày Thuê
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày Hết Hạn
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao Tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {isLoading ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center">
                        <div className="flex justify-center items-center">
                          <RefreshCw className="animate-spin h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-gray-500">Đang tải dữ liệu...</span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredTenants().length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center">
                        <div className="text-gray-500">
                          <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                          <h3 className="text-lg font-medium mb-2">Không tìm thấy người thuê</h3>
                          <p className="text-sm">
                            {searchTerm || filter !== "ALL"
                              ? "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
                              : "Chưa có người thuê nào trong hệ thống"}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredTenants().map((tenant) => {
                      const statusInfo = formatTenantStatus(tenant.status);
                      return (
                        <tr key={tenant.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                {tenant.avatarUrl ? (
                                  <img
                                    className="h-10 w-10 rounded-full object-cover"
                                    src={tenant.avatarUrl}
                                    alt={tenant.fullName}
                                  />
                                ) : (
                                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                    <User className="h-5 w-5 text-gray-500" />
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {tenant.fullName || "Chưa cập nhật"}
                                </div>

                                {tenant.phoneNumber && (
                                  <div className="text-sm text-gray-500 flex items-center mt-1">
                                    <Phone size={12} className="mr-1" />
                                    {tenant.phoneNumber}
                                  </div>
                                )}

                                {tenant.email && (
                                  <div className="text-sm text-gray-500 flex items-center mt-1">
                                    <Mail size={12} className="mr-1" />
                                    {tenant.email}
                                  </div>
                                )}

                                {tenant.idCardNumber && (
                                  <div className="text-xs text-gray-400 flex items-center mt-1">
                                    <IdCard size={10} className="mr-1" />
                                    CCCD: {tenant.idCardNumber}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <HomeIcon size={16} className="text-gray-400 mr-2" />
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {handleGetRoomNumber(tenant.roomId)}
                                </div>
                                {tenant.buildingName && (
                                  <div className="text-xs text-gray-500 flex items-center">
                                    <Building size={10} className="mr-1" />
                                    {tenant.buildingName}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.className}`}>
                              {statusInfo.icon}
                              <span className="ml-1">{statusInfo.label}</span>
                            </span>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center">
                              <Calendar size={14} className="text-gray-400 mr-1" />
                              {tenant.checkInDate
                                ? new Date(tenant.checkInDate).toLocaleDateString('vi-VN')
                                : "Chưa xác định"
                              }
                            </div>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center">
                              <Calendar size={14} className="text-gray-400 mr-1" />
                              {tenant.checkOutDate
                                ? new Date(tenant.checkOutDate).toLocaleDateString('vi-VN')
                                : "Chưa xác định"
                              }
                            </div>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="flex items-center justify-center space-x-2">
                              {/* View Button */}
                              <button
                                onClick={() => handleViewTenant(tenant)}
                                className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                                title="Xem chi tiết"
                              >
                                <Eye size={16} />
                              </button>

                              {/* History Button */}
                              <button
                                onClick={() => fetchTenantHistory(tenant.id)}
                                className="text-purple-600 hover:text-purple-900 p-1 rounded hover:bg-purple-50"
                                title="Lịch sử thuê"
                              >
                                <History size={16} />
                              </button>

                              {/* Status Actions */}
                              {tenant.status === "PENDING" && (
                                <>
                                  <button
                                    onClick={() => handleApproveReject(tenant.id, "APPROVED")}
                                    className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                                    title="Phê duyệt"
                                  >
                                    <UserCheck size={16} />
                                  </button>
                                  <button
                                    onClick={() => handleApproveReject(tenant.id, "REJECTED")}
                                    className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                                    title="Từ chối"
                                  >
                                    <UserX size={16} />
                                  </button>
                                </>
                              )}

                              {/* Change Room Button */}
                              {["APPROVED", "DEPOSITED", "CONTRACT_CONFIRMED"].includes(tenant.status) && (
                                <button
                                  onClick={() => {
                                    setSelectedTenant(tenant);
                                    setShowChangeRoomModal(true);
                                  }}
                                  className="text-orange-600 hover:text-orange-900 p-1 rounded hover:bg-orange-50"
                                  title="Chuyển phòng"
                                >
                                  <ArrowUpDown size={16} />
                                </button>
                              )}

                              {/* Edit Button */}
                              <button
                                onClick={() => handleEditTenant(tenant)}
                                className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50"
                                title="Chỉnh sửa thông tin"
                              >
                                <Edit size={16} />
                              </button>

                              {/* End Contract Actions */}
                              {["CONTRACT_CONFIRMED"].includes(tenant.status) && (
                                <>
                                  <button
                                    onClick={() => handleModifyTenant(tenant.id, "COMPLETED")}
                                    className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                                    title="Đánh dấu đã hoàn thành hợp đồng"
                                  >
                                    <CheckCircle size={16} />

                                  </button>
                                  <button
                                    onClick={() => handleModifyTenant(tenant.id, "MOVED_OUT")}
                                    className="text-orange-600 hover:text-orange-900 p-1 rounded hover:bg-orange-50"
                                    title="Đánh dấu đã chuyển đi"
                                  >
                                    <UserMinus size={16} />
                                  </button>
                                  <button
                                    onClick={() => handleModifyTenant(tenant.id, "INACTIVE")}
                                    className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50"
                                    title="Ngưng hợp đồng thuê"
                                  >
                                    <XCircle size={16} />
                                  </button>
                                </>
                              )}

                              {/* Cancel Actions */}
                              {["APPROVED", "DEPOSITED"].includes(tenant.status) && (
                                <button
                                  onClick={() => handleModifyTenant(tenant.id, "CANCELLED")}
                                  className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                                  title="Hủy yêu cầu thuê"
                                >
                                  <XCircle size={16} />
                                </button>
                              )}

                              {/* Delete Action */}
                              {["PENDING", "COMPLETED", "CANCELLED", "MOVED_OUT", "INACTIVE","REJECTED"].includes(tenant.status) && (
                                <button
                                  onClick={() => handleModifyTenant(tenant.id, "REJECTED")}
                                  className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                                  title="Xóa người thuê"
                                >
                                  <Trash2 size={16} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* View Tenant Detail Modal */}
      {showEditModal && selectedTenant && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-800">Chỉnh Sửa Thông Tin Người Thuê</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const updatedTenant = {
                id: selectedTenant.id,
                fullName: formData.get('fullName'),
                phoneNumber: formData.get('phoneNumber'),
                email: formData.get('email'),
                idCardNumber: formData.get('idCardNumber'),
                avatarUrl: formData.get('avatarUrl'),
                checkInDate: formData.get('checkInDate'),
                checkOutDate: formData.get('checkOutDate')
              };
              handleUpdateTenant(updatedTenant);
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Họ và Tên</label>
                  <input
                    type="text"
                    name="fullName"
                    defaultValue={selectedTenant.fullName || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số Điện Thoại</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    defaultValue={selectedTenant.phoneNumber || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={selectedTenant.email || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số CCCD</label>
                  <input
                    type="text"
                    name="idCardNumber"
                    defaultValue={selectedTenant.idCardNumber || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày Thuê</label>
                  <input
                    type="date"
                    name="checkInDate"
                    defaultValue={selectedTenant.checkInDate ? selectedTenant.checkInDate.split('T')[0] : ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày Hết Hạn</label>
                  <input
                    type="date"
                    name="checkOutDate"
                    defaultValue={selectedTenant.checkOutDate ? selectedTenant.checkOutDate.split('T')[0] : ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Cập Nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Tenant Detail Modal */}
      {showViewModal && selectedTenant && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-800">Chi Tiết Người Thuê</h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Thông tin cá nhân */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-md font-medium text-gray-800 mb-3 flex items-center">
                  <User size={18} className="mr-2" />
                  Thông Tin Cá Nhân
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Họ và Tên</label>
                    <p className="mt-1 text-sm text-gray-900 bg-white px-3 py-2 rounded border">
                      {selectedTenant.fullName || 'Chưa cập nhật'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600">Số Điện Thoại</label>
                    <p className="mt-1 text-sm text-gray-900 bg-white px-3 py-2 rounded border flex items-center">
                      <Phone size={14} className="mr-2" />
                      {selectedTenant.phoneNumber || 'Chưa cập nhật'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600">Email</label>
                    <p className="mt-1 text-sm text-gray-900 bg-white px-3 py-2 rounded border flex items-center">
                      <Mail size={14} className="mr-2" />
                      {selectedTenant.email || 'Chưa cập nhật'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600">Số CCCD</label>
                    <p className="mt-1 text-sm text-gray-900 bg-white px-3 py-2 rounded border flex items-center">
                      <IdCard size={14} className="mr-2" />
                      {selectedTenant.idCardNumber || 'Chưa cập nhật'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Thông tin thuê trọ */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="text-md font-medium text-gray-800 mb-3 flex items-center">
                  <HomeIcon size={18} className="mr-2" />
                  Thông Tin Thuê Trọ
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Trạng Thái</label>
                    <div className="mt-1">
                      {(() => {
                        const statusInfo = formatTenantStatus(selectedTenant.status);
                        return (
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.className}`}>
                            {statusInfo.icon}
                            <span className="ml-1">{statusInfo.label}</span>
                          </span>
                        );
                      })()}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Phòng Thuê</label>
                    <p className="mt-1 text-sm text-gray-900 bg-white px-3 py-2 rounded border flex items-center">
                      <HomeIcon size={14} className="mr-2" />
                      {handleGetRoomNumber(selectedTenant.roomId)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Ngày Yêu Cầu</label>
                    <p className="mt-1 text-sm text-gray-900 bg-white px-3 py-2 rounded border flex items-center">
                      <Calendar size={14} className="mr-2" />
                      {selectedTenant.requestDate
                        ? new Date(selectedTenant.requestDate).toLocaleDateString('vi-VN')
                        : 'Chưa xác định'
                      }
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600">Ngày Thuê</label>
                    <p className="mt-1 text-sm text-gray-900 bg-white px-3 py-2 rounded border flex items-center">
                      <Calendar size={14} className="mr-2" />
                      {selectedTenant.checkInDate
                        ? new Date(selectedTenant.checkInDate).toLocaleDateString('vi-VN')
                        : 'Chưa xác định'
                      }
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600">Ngày Hết Hạn</label>
                    <p className="mt-1 text-sm text-gray-900 bg-white px-3 py-2 rounded border flex items-center">
                      <Calendar size={14} className="mr-2" />
                      {selectedTenant.checkOutDate
                        ? new Date(selectedTenant.checkOutDate).toLocaleDateString('vi-VN')
                        : 'Chưa xác định'
                      }
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600">Ngày Tạo</label>
                    <p className="mt-1 text-sm text-gray-900 bg-white px-3 py-2 rounded border flex items-center">
                      <Clock size={14} className="mr-2" />
                      {selectedTenant.createAt
                        ? new Date(selectedTenant.createAt).toLocaleDateString('vi-VN')
                        : 'Chưa xác định'
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Ghi chú */}
              {selectedTenant.note && (
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h4 className="text-md font-medium text-gray-800 mb-3 flex items-center">
                    <FileText size={18} className="mr-2" />
                    Ghi Chú
                  </h4>
                  <p className="text-sm text-gray-900 bg-white px-3 py-2 rounded border">
                    {selectedTenant.note}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Room Modal */}
      {showChangeRoomModal && selectedTenant && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Chuyển Phòng</h3>
              <button
                onClick={() => setShowChangeRoomModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Người thuê: <span className="font-medium">{selectedTenant.fullName}</span>
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Phòng hiện tại: <span className="font-medium">{handleGetRoomNumber(selectedTenant.roomId)}</span>
              </p>

              <label className="block text-sm font-medium text-gray-700 mb-2">Chọn phòng mới:</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => {
                  if (e.target.value) {
                    handleChangeRoom(e.target.value);
                  }
                }}
                defaultValue=""
              >
                <option value="">-- Chọn phòng --</option>
                {rooms
                  .filter(room => room.status === "AVAILABLE" && room.id !== selectedTenant.roomId)
                  .map(room => (
                    <option key={room.id} value={room.id}>
                      {room.roomNumber} - {room.buildingName} ({room.monthlyRent?.toLocaleString('vi-VN')}đ/tháng)
                    </option>
                  ))
                }
              </select>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowChangeRoomModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Lịch Sử Thuê Trọ</h3>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {tenantHistory.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Không có lịch sử thuê trọ</p>
              ) : (
                <div className="space-y-4">
                  {tenantHistory.map((history, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{handleGetRoomNumber(history.roomId)} - {handleGetRoomType(history.roomId)}</h4>
                          <p className="text-sm text-gray-600">{history.ownerName}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${formatTenantStatus(history.status).className}`}>
                          {formatTenantStatus(history.status).label}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Từ ngày:</span>
                          <span className="ml-2">{history.checkInDate ? new Date(history.checkInDate).toLocaleDateString('vi-VN') : 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Đến ngày:</span>
                          <span className="ml-2">{history.checkOutDate ? new Date(history.checkOutDate).toLocaleDateString('vi-VN') : 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowHistoryModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}