import { use, useEffect, useState } from "react";
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
} from "lucide-react";
import Toast from "../../Component/Toast";

// Sample data
const token = localStorage.getItem("token");
const cleanToken = token ? token.replace(/"/g, "") : null;

const UserManagement = () => {
  const [activeFilter, setActiveFilter] = useState("Tất cả");
  const [searchTerm, setSearchTerm] = useState("");
  const [userData, setUserDate] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
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
          setUserDate(data.result);
        } else {
          console.error("Error fetching user data:", data.message);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, [cleanToken]);

  // Count users by status

  const counts = {
    total: userData.length,
    active: userData.filter((user) => user.active === true).length,
    banned: userData.filter((user) => user.active === false).length,
  };

  // Filter users based on active filter and search term
  const filteredUsers = userData.filter((user) => {
    // Filter by status
    const statusFilter =
      activeFilter === "Tất cả" ||
      (activeFilter === "Đang hoạt động" && user.active === true) ||
      (activeFilter === "Bị khoá" && user.active === false);

    // Filter by search term
    const searchFilter =
      user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    return statusFilter && searchFilter;
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Quản Lý Người Dùng
        </h1>

        {/* Stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
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

        {/* Search and filters */}
        <div className="flex flex-col md:flex-row justify-between mb-6">
          <div className="relative mb-4 md:mb-0 md:w-1/3">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="bg-white border border-gray-200 text-gray-700 pl-10 pr-4 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tìm kiếm người dùng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex space-x-2">
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

        {/* User cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      </div>
    </div>
  );
};

// Stat card component
const StatCard = ({ icon, title, value, bgColor }) => (
  <div
    className={`${bgColor} rounded-lg p-4 flex flex-col items-center justify-center shadow-sm`}
  >
    <div className="mb-2">{icon}</div>
    <p className="text-gray-600 text-sm">{title}</p>
    <h3 className="text-2xl font-bold">{value}</h3>
  </div>
);

// Filter button component
const FilterButton = ({ label, active, onClick }) => (
  <button
    className={`px-4 py-2 rounded-md text-sm ${
      active
        ? "bg-blue-600 text-white"
        : "bg-white text-gray-700 border border-gray-200"
    }`}
    onClick={onClick}
  >
    {label}
  </button>
);

// User card component
const UserCard = ({ user }) => {
    const [toast, setToast] = useState(null);

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

    // ✅ Cập nhật UI sau khi ban user thành công (nếu cần)
    console.log(`Người dùng ${userId} đã bị khóa.`);

    // ✅ Hiển thị thông báo thành công
    setToast({
      message: `Người dùng ${userId} đã bị khóa.`,
      type: "success",
    });
  } catch (error) {
    // ❌ Hiển thị thông báo lỗi
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
      throw new Error("Không thể khóa tài khoản người dùng.");
    }

    // ✅ Cập nhật UI sau khi ban user thành công (nếu cần)
    console.log(`Người dùng ${userId} đã được mở  khóa.`);

    // ✅ Hiển thị thông báo thành công
    setToast({
      message: `Người dùng ${userId} đã được mở khóa.`,
      type: "success",
    });
  } catch (error) {
    // ❌ Hiển thị thông báo lỗi
    setToast({
      message: error.message || "Đã xảy ra lỗi khi khóa người dùng.",
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
      throw new Error("Không Xoá khóa tài khoản người dùng.");
    }

    // ✅ Cập nhật UI sau khi ban user thành công (nếu cần)
    console.log(`Người dùng ${userId} bị xoá.`);

    // ✅ Hiển thị thông báo thành công
    setToast({
      message: `Người dùng ${userId} đã bị xoá.`,
      type: "success",
    });
  } catch (error) {
    // ❌ Hiển thị thông báo lỗi
    setToast({
      message: error.message || "Đã xảy ra lỗi khi xoá người dùng.",
      type: "error",
    });
  }
};


  const getStatusColor = (active) => {
    switch (active) {
      case "Đang hoạt động":
        return "bg-green-100 text-green-800";
      case "Bị khoá":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <div className="bg-blue-50 p-2 rounded-md mr-3">
            <Users className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{user.name}</h3>
            <p className="text-gray-500 text-sm">ID: {user.id}</p>
          </div>
        </div>
        {user.status && (
          <span
            className={`text-xs px-2 py-1 rounded ${getStatusColor(
              user.status
            )}`}
          >
            {user.status}
          </span>
        )}
      </div>

      <div className="space-y-2 mb-6">
        <InfoRow
          label="Họ và tên:"
          value={user.firstName + " " + user.lastName}
        />
        <InfoRow label="Email:" value={user.email} />
        <InfoRow label="Vai trò:" value={user.roleName} />
        <InfoRow label="Điện thoại:" value={user.phone} />
        {
          <InfoRow
            label="Trạng thái"
            value={user.active === true ? "Đang hoạt động" : "Bị khoá"}
          />
        }
      </div>

      {user.attachments && (
        <>
          <p className="text-sm text-gray-600 mb-2">Tài liệu đính kèm:</p>
          <div className="flex space-x-2 mb-4">
            {user.attachments.map((attachment, index) => (
              <div
                key={index}
                className="bg-gray-100 text-gray-600 px-3 py-2 rounded text-sm"
              >
                {attachment}
              </div>
            ))}
          </div>
        </>
      )}

      <div className="flex space-x-2">
        {user.active === true ? (
          <button
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
            title="khoá tài khoản"
            onClick={() => handleBanUser(user.id)}
          >
            <Lock className="h-5 w-5" />
          </button>
        ) : (
          <button
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
            title="mở khoá tài khoản"
            onClick={() => handleUnBanUser(user.id)}
          >
            <Unlock className="h-5 w-5" />
          </button>
        )}

        <button
          className="p-2 text-red-600 hover:bg-red-50 rounded-md"
          title="Xóa" onClick={() => handleDeleteUser(user.id)}
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
      {toast && (
  <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
)}

    </div>
    
  );
};

// Helper component for displaying info rows
const InfoRow = ({ label, value }) => (
  <div className="flex justify-between">
    <span className="text-gray-600 text-sm">{label}</span>
    <span className="text-gray-800 font-medium text-sm">{value}</span>
  </div>
);

export default UserManagement;
// Note: This code is a simplified version of a user management page. In a real application, you would likely fetch user data from an API and handle actions like editing and deleting users with appropriate backend calls.
