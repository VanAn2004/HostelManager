import { useEffect, useState } from "react";
import {
  Users,
  Clock,
  Eye,
  Edit,
  Trash2,
  Search,
  UserCheck,
  UserCog,
  UserX,
  Lock,
  Unlock,

  FileSpreadsheet,
} from "lucide-react";
import Toast from "../../Component/Toast";
import Sidebar from "../../Component/Sidebar";
import Navbar from "../../Component/Navbar";

// Sample data
const token = localStorage.getItem("token");

const cleanToken = token ? token.replace(/"/g, "") : null;

const UserManagement = () => {
  const [activeFilter, setActiveFilter] = useState("Tất cả");
  const [searchTerm, setSearchTerm] = useState("");
  const [userData, setUserData] = useState([]); // Fixed typo: setUserDate -> setUserData
  const [currentUser, setCurrentUser] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [toast, setToast] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [allUsers, setAllUsers] = useState([]); // Lưu tất cả users ban đầu
  console.log("clean token: ", cleanToken);
  
  // Fetch all users
  const fetchAllUsers = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/admin/users",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cleanToken}`,
          },
        }
      );
      const data = await response.json();
      if (data.code === 1000) {
        setUserData(data.result); // Fixed typo
        setAllUsers(data.result); // Lưu tất cả users để restore khi clear search
      } else {
        console.error("Error fetching user data:", data.message);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Search users by firstName
  const searchUsers = async (firstName) => {
    if (!firstName.trim()) {
      // Nếu search term rỗng, hiển thị lại tất cả users
      setUserData(allUsers); // Fixed typo
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/admin/users/search/${encodeURIComponent(firstName)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cleanToken}`,
          },
        }
      );
      const data = await response.json();
      if (data.code === 1000) {
        setUserData(data.result); // Fixed typo
      } else {
        console.error("Error searching users:", data.message);
        setToast({
          message: "Không thể tìm kiếm người dùng",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error searching users:", error);
      setToast({
        message: "Đã xảy ra lỗi khi tìm kiếm",
        type: "error",
      });
    } finally {
      setIsSearching(false);
    }
  };

  // Debounce search để tránh gọi API quá nhiều lần
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchTerm !== "") {
        searchUsers(searchTerm);
      } else {
        setUserData(allUsers); // Fixed typo - Restore all users when search is cleared
      }
    }, 500); // Delay 500ms

    return () => clearTimeout(delayedSearch);
  }, [searchTerm, allUsers]);

  useEffect(() => {
    fetchAllUsers();
  }, [cleanToken]);

  // Export Excel function
  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/admin/export/users",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${cleanToken}`,
          },
        }
      );
      console.log("res: ", response);
      
      if (!response.ok) {
        throw new Error("Không thể xuất file Excel");
      }

      // Lấy filename từ response header nếu có
      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = "users_export.xlsx";
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      // Tạo blob từ response
      const blob = await response.blob();
      
      // Tạo URL cho blob
      const url = window.URL.createObjectURL(blob);
      
      // Tạo element <a> để download
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      
      // Thêm vào DOM, click và remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Giải phóng URL
      window.URL.revokeObjectURL(url);

      setToast({
        message: "Xuất file Excel thành công!",
        type: "success",
      });

    } catch (error) {
      console.error("Export error:", error);
      setToast({
        message: error.message || "Đã xảy ra lỗi khi xuất file Excel",
        type: "error",
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Count users by status
  const counts = {
    total: userData.length,
    active: userData.filter((user) => user.active === true).length,
    banned: userData.filter((user) => user.active === false).length,
  };

  // Filter users based on active filter only (search is handled by API)
  const filteredUsers = userData.filter((user) => {
    // Filter by status only since search is handled by API
    const statusFilter =
      activeFilter === "Tất cả" ||
      (activeFilter === "Đang hoạt động" && user.active === true) ||
      (activeFilter === "Bị khoá" && user.active === false);

    return statusFilter;
  });

  // Handle refresh data after user actions
  const refreshUserData = () => {
    if (searchTerm.trim()) {
      searchUsers(searchTerm);
    } else {
      fetchAllUsers();
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar - Fixed ở bên trái */}
      <Sidebar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        currentUser={currentUser}
        activeItem="users" // Set active item to "users" cho trang user management
      />
      
      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        {/* Navbar */}
        <Navbar currentUser={currentUser} />
        
        {/* Content Container */}
        <div className="p-4 sm:p-6">
          {/* Header Section - Improved responsive */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              Quản Lý Người Dùng
            </h1>
            
            {/* Export Excel Button */}
            <button
              onClick={handleExportExcel}
              disabled={isExporting}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors w-full sm:w-auto justify-center ${
                isExporting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              } text-white`}
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span>{isExporting ? "Đang xuất..." : "Xuất Excel"}</span>
            </button>
          </div>

          {/* Stat cards - Improved spacing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <StatCard
              icon={<Users className="text-indigo-600" />}
              title="Tổng Số Người Dùng"
              value={counts.total}
              bgColor="bg-indigo-50"
            />
            <StatCard
              icon={<UserCheck className="text-green-600" />}
              title="Đang Hoạt Động"
              value={counts.active}
              bgColor="bg-green-50"
            />
            <StatCard
              icon={<UserX className="text-blue-600" />}
              title="Bị Khoá"
              value={counts.banned}
              bgColor="bg-blue-50"
            />
          </div>

          {/* Search and filters - Improved responsive layout */}
          <div className="flex flex-col lg:flex-row justify-between gap-4 mb-6">
            {/* Search Input */}
            <div className="relative w-full lg:w-1/3">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className={`w-5 h-5 ${isSearching ? 'text-blue-500' : 'text-gray-400'}`} />
              </div>
              <input
                type="text"
                className="bg-white border border-gray-200 text-gray-700 pl-10 pr-4 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tìm kiếm theo tên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {isSearching && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                </div>
              )}
            </div>

            {/* Filter Buttons - Improved mobile layout */}
            <div className="flex flex-wrap gap-2">
              <FilterButton
                label="Tất cả"
                active={activeFilter === "Tất cả"}
                onClick={() => setActiveFilter("Tất cả")}
              />
              <FilterButton
                label="Đang hoạt động"
                active={activeFilter === "Đang hoạt động"}
                onClick={() => setActiveFilter("Đang hoạt động")}
              />
              <FilterButton
                label="Bị khoá"
                active={activeFilter === "Bị khoá"}
                onClick={() => setActiveFilter("Bị khoá")}
              />
            </div>
          </div>

          {/* User cards - Improved responsive grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredUsers.map((user) => (
              <UserCard 
                key={user.id} 
                user={user} 
                setToast={setToast}
                onUserAction={refreshUserData}
              />
            ))}
          </div>

          {/* No results message - Improved spacing */}
          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Không tìm thấy người dùng
              </h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                {searchTerm ? 
                  `Không có kết quả cho "${searchTerm}"` : 
                  "Không có người dùng nào phù hợp với bộ lọc đã chọn"
                }
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Toast notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
};

// Stat card component - Improved responsive design
const StatCard = ({ icon, title, value, bgColor }) => (
  <div
    className={`${bgColor} rounded-lg p-4 sm:p-6 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow`}
  >
    <div className="mb-3">{icon}</div>
    <p className="text-gray-600 text-xs sm:text-sm text-center mb-1">{title}</p>
    <h3 className="text-xl sm:text-2xl font-bold">{value}</h3>
  </div>
);

// Filter button component - Improved styling
const FilterButton = ({ label, active, onClick }) => (
  <button
    className={`px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors ${
      active
        ? "bg-blue-600 text-white shadow-md"
        : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
    }`}
    onClick={onClick}
  >
    {label}
  </button>
);

// User card component - Improved layout and spacing
const UserCard = ({ user, setToast, onUserAction }) => {
  const handleBanUser = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/admin/users/ban/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cleanToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Không thể khóa tài khoản người dùng.");
      }

      console.log(`Người dùng ${userId} đã bị khóa.`);

      setToast({
        message: `Người dùng ${userId} đã bị khóa.`,
        type: "success",
      });

      // Refresh data
      if (onUserAction) onUserAction();
    } catch (error) {
      setToast({
        message: error.message || "Đã xảy ra lỗi khi khóa người dùng.",
        type: "error",
      });
    }
  };

  const handleUnBanUser = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/admin/users/un-ban/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cleanToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Không thể mở khóa tài khoản người dùng.");
      }

      console.log(`Người dùng ${userId} đã được mở khóa.`);

      setToast({
        message: `Người dùng ${userId} đã được mở khóa.`,
        type: "success",
      });

      // Refresh data
      if (onUserAction) onUserAction();
    } catch (error) {
      setToast({
        message: error.message || "Đã xảy ra lỗi khi mở khóa người dùng.",
        type: "error",
      });
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/admin/users/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cleanToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Không thể xóa tài khoản người dùng.");
      }

      console.log(`Người dùng ${userId} bị xóa.`);

      setToast({
        message: `Người dùng ${userId} đã bị xóa.`,
        type: "success",
      });

      // Refresh data
      if (onUserAction) onUserAction();
    } catch (error) {
      setToast({
        message: error.message || "Đã xảy ra lỗi khi xóa người dùng.",
        type: "error",
      });
    }
  };

  const getStatusColor = (active) => {
    if (active === true) {
      return "bg-green-100 text-green-800";
    } else if (active === false) {
      return "bg-red-100 text-red-800";
    }
    return "bg-gray-100 text-gray-800";
  };

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 sm:p-6 border border-gray-100">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center min-w-0 flex-1">
          <div className="bg-blue-50 p-2 rounded-md mr-3 flex-shrink-0">
            <Users className="h-5 w-5 text-blue-600" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-base sm:text-lg truncate">{user.name}</h3>
            <p className="text-gray-500 text-xs sm:text-sm">ID: {user.id}</p>
          </div>
        </div>
        <span
          className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ml-2 ${getStatusColor(user.active)}`}
        >
          {user.active === true ? "Hoạt động" : "Bị khóa"}
        </span>
      </div>

      {/* User Information */}
      <div className="space-y-2 mb-6">
        <InfoRow
          label="Họ và tên:"
          value={user.firstName + " " + user.lastName}
        />
        <InfoRow label="Email:" value={user.email} />
        <InfoRow label="Vai trò:" value={user.roleName} />
        <InfoRow label="Điện thoại:" value={user.phone || "Chưa cập nhật"} />
        <InfoRow
          label="Trạng thái:"
          value={user.active === true ? "Đang hoạt động" : "Bị khóa"}
        />
      </div>

      {/* Attachments (if any) */}
      {user.attachments && user.attachments.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Tài liệu đính kèm:</p>
          <div className="flex flex-wrap gap-2">
            {user.attachments.map((attachment, index) => (
              <div
                key={index}
                className="bg-gray-100 text-gray-600 px-3 py-1 rounded text-xs"
              >
                {attachment}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-2 pt-2 border-t border-gray-100">
        {user.active === true ? (
          <button
            className="flex-1 p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors flex items-center justify-center"
            title="Khóa tài khoản"
            onClick={() => handleBanUser(user.id)}
          >
            <Lock className="h-4 w-4 mr-1" />
            <span className="text-sm">Khóa</span>
          </button>
        ) : (
          <button
            className="flex-1 p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors flex items-center justify-center"
            title="Mở khóa tài khoản"
            onClick={() => handleUnBanUser(user.id)}
          >
            <Unlock className="h-4 w-4 mr-1" />
            <span className="text-sm">Mở khóa</span>
          </button>
        )}

        <button
          className="flex-1 p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors flex items-center justify-center"
          title="Xóa người dùng"
          onClick={() => handleDeleteUser(user.id)}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          <span className="text-sm">Xóa</span>
        </button>
      </div>
    </div>
  );
};

// Helper component for displaying info rows - Improved responsive
const InfoRow = ({ label, value }) => (
  <div className="flex justify-between items-start gap-2">
    <span className="text-gray-600 text-xs sm:text-sm flex-shrink-0">{label}</span>
    <span className="text-gray-800 font-medium text-xs sm:text-sm text-right break-words">{value}</span>
  </div>
);

export default UserManagement;