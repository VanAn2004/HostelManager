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
  Filter,
  Download,
  CheckCircle,
  XCircle,
  Banknote,
  UserCheck,
  FileCheck,
  RefreshCw,
  Send,
  Pause,
  PlayCircle,
  AlertCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import SidebarOwner from "../../../Component/SiderbarOwner";
import TopNavigationOwner from '../../../Component/TopNavigationOwner';
import CreateContractForm from "./CreateContractForm";

const API_BASE_URL = "http://localhost:8080/api/v1";

export default function OwnerContractManagement() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentUser, setCurrentUser] = useState({});
  const [contracts, setContracts] = useState([]);
  const [requests, setRequests] = useState([]); // Thêm state cho rental requests
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [error, setError] = useState(null);
  const [selectedContract, setSelectedContract] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [renewalRequests, setRenewalRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showRenewalModal, setShowRenewalModal] = useState(false);
  const [selectedRenewalRequest, setSelectedRenewalRequest] = useState(null);


  const navigate = useNavigate();

  // Get token from localStorage and clean it
  const token = localStorage.getItem("token");
  const cleanToken = token ? token.replace(/"/g, "") : "";

  // Helper function to format contract status
  const formatContractStatus = (status) => {
    switch (status) {
      case "PENDING": return {
        label: "Đang Chờ",
        className: "bg-yellow-100 text-yellow-800",
        icon: <Clock size={16} />
      };
      case "ACTIVE": return {
        label: "Đang Hiệu Lực",
        className: "bg-green-100 text-green-800",
        icon: <PlayCircle size={16} />
      };
      case "EXPIRING_SOON": return {
        label: "Sắp Hết Hạn",
        className: "bg-orange-100 text-orange-800",
        icon: <AlertCircle size={16} />
      };
      case "EXPIRED": return {
        label: "Hết Hạn",
        className: "bg-red-100 text-red-800",
        icon: <XCircle size={16} />
      };
      case "TERMINATED": return {
        label: "Đã Chấm Dứt",
        className: "bg-purple-100 text-purple-800",
        icon: <Pause size={16} />
      };
      case "CANCELLED": return {
        label: "Đã Hủy",
        className: "bg-gray-100 text-gray-800",
        icon: <XCircle size={16} />
      };
      default: return {
        label: status,
        className: "bg-gray-100 text-gray-800",
        icon: <FileText size={16} />
      };
    }
  };

  // Thêm function format renewal status
  const formatRenewalStatus = (status) => {
    const statusConfig = {
      PENDING: {
        label: 'Chờ duyệt',
        className: 'bg-yellow-100 text-yellow-800',
        icon: <Clock size={14} />
      },
      APPROVED: {
        label: 'Đã duyệt',
        className: 'bg-green-100 text-green-800',
        icon: <CheckCircle size={14} />
      },
      REJECTED: {
        label: 'Đã từ chối',
        className: 'bg-red-100 text-red-800',
        icon: <XCircle size={14} />
      }
    };
    return statusConfig[status] || statusConfig.PENDING;
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

  // Fetch rental requests
  const fetchRentalRequests = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/contracts`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cleanToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Không thể tải danh sách yêu cầu thuê');
      }

      const data = await response.json();
      if (data.code !== 1000) {
        throw new Error(data.message || 'Lỗi khi tải danh sách yêu cầu thuê');
      }

      setRequests(data.result);
    } catch (error) {
      console.error('Error fetching rental requests:', error);
      setError(error.message);
    }
  };

  // Fetch contracts data
  const fetchContracts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/contracts`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cleanToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Không thể tải danh sách hợp đồng');
      }

      const data = await response.json();
      if (data.code !== 1000) {
        throw new Error(data.message || 'Lỗi khi tải danh sách hợp đồng');
      }

      setContracts(data.result);
    } catch (error) {
      console.error('Error fetching contracts:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRenewalRequests = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/owner/tenants/renew/requests`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setRenewalRequests(data.result || data); // Handle ApiResponse wrapper
      }
    } catch (error) {
      console.error('Error fetching renewal requests:', error);
    }
  };

  const fetchRenewalRequestsByStatus = async (status) => {
    try {
      const response = await fetch(`${API_BASE_URL}/owner/tenants/renew/requests?status=${status}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setRenewalRequests(data.result);
      }
    } catch (error) {
      console.error('Error fetching renewal requests:', error);
      setError(error.message);
    }
  };


  // Handle confirm deposit received (owner signs)
  const handleConfirmDeposit = async (contractId) => {
    if (window.confirm("Xác nhận đã nhận tiền đặt cọc và ký hợp đồng?")) {
      try {
        const response = await fetch(`${API_BASE_URL}/contracts/${contractId}/owner-sign`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cleanToken}`
          },
          body: JSON.stringify({
            ownerSignature: `${currentUser.firstName} ${currentUser.lastName}`,
            signedDate: new Date().toISOString()
          })
        });

        if (!response.ok) {
          throw new Error('Không thể xác nhận đặt cọc');
        }

        fetchContracts();
      } catch (error) {
        console.error('Error confirming deposit:', error);
        setError(error.message);
      }
    }
  };

  // Handle terminate contract
  const handleTerminateContract = async (contractId) => {
    const reason = window.prompt("Nhập lý do chấm dứt hợp đồng:");
    if (reason) {
      try {
        const response = await fetch(`${API_BASE_URL}/contracts/${contractId}/terminate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cleanToken}`
          },
          body: JSON.stringify({
            terminationReason: reason,
            terminationDate: new Date().toISOString()
          })
        });

        if (!response.ok) {
          throw new Error('Không thể chấm dứt hợp đồng');
        }

        fetchContracts();
      } catch (error) {
        console.error('Error terminating contract:', error);
        setError(error.message);
      }
    }
  };

  // Handle cancel contract
  const handleCancelContract = async (contractId) => {
    if (window.confirm("Bạn có chắc chắn muốn hủy hợp đồng này?")) {
      try {
        const response = await fetch(`${API_BASE_URL}/contracts/${contractId}/cancel`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${cleanToken}`
          }
        });

        if (!response.ok) {
          throw new Error('Không thể hủy hợp đồng');
        }

        fetchContracts();
      } catch (error) {
        console.error('Error cancelling contract:', error);
        setError(error.message);
      }
    }
  };

  // Handle view contract details
  const handleViewContract = async (contractId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/contracts/${contractId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${cleanToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Không thể tải thông tin hợp đồng');
      }

      const data = await response.json();
      setSelectedContract(data.result);
      setShowDetailModal(true);
    } catch (error) {
      console.error('Error fetching contract details:', error);
      setError(error.message);
    }
  };

  // Thêm functions xử lý renewal requests - Sửa endpoint và method
  const handleApproveRenewal = async (requestId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/owner/tenants/renew/${requestId}/approve`, {
        method: 'POST', // Đổi từ PUT sang POST
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        fetchRenewalRequests();
        fetchContracts(); // Refresh contracts để cập nhật ngày hết hạn
        // toast.success('Đã duyệt yêu cầu gia hạn hợp đồng');
      }
    } catch (error) {
      console.error('Error approving renewal:', error);
      // toast.error('Không thể duyệt yêu cầu gia hạn');
    }
  };

  const handleRejectRenewal = async (requestId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/owner/tenants/renew/${requestId}/reject`, {
        method: 'POST', // Đổi từ PUT sang POST
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        fetchRenewalRequests();
        // toast.success('Đã từ chối yêu cầu gia hạn hợp đồng');
      }
    } catch (error) {
      console.error('Error rejecting renewal:', error);
      // toast.error('Không thể từ chối yêu cầu gia hạn');
    }
  };

  // Filter contracts based on selection
  const filteredContracts = () => {
    let filtered = contracts;

    if (filter !== "ALL") {
      filtered = filtered.filter(contract => contract.status === filter);
    }

    if (searchTerm) {
      filtered = filtered.filter(contract =>
        contract.tenantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.roomNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.contractNumber?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  // Filter requests based on selection
  const filteredRequests = () => {
    let filtered = requests;

    if (filter !== "ALL") {
      filtered = filtered.filter(request => request.status === filter);
    }

    if (searchTerm) {
      filtered = filtered.filter(request =>
        request.tenantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.roomNumber?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  // Check for authentication and load data
  useEffect(() => {
    if (!cleanToken) {
      navigate("/login");
      return;
    }

    fetchUser();
    fetchContracts();
    fetchRentalRequests();
    fetchRenewalRequests();
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
            onClick={() => { setError(null); fetchUser(); fetchContracts(); fetchRentalRequests(); }}
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
        activeItem="contracts"
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
                Quản Lý Hợp Đồng
              </h1>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center space-x-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <PlusCircle size={16} />
                  <span>Tạo Hợp Đồng</span>
                </button>
              </div>
            </div>
            <p className="text-gray-600">
              Quản lý tất cả hợp đồng thuê trọ và theo dõi trạng thái của từng hợp đồng.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Tổng Hợp Đồng</p>
                  <p className="text-2xl font-bold text-gray-800">{contracts.length}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <FileText className="text-blue-600" size={20} />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Đang Chờ</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {contracts.filter(c => c.status === "PENDING").length}
                  </p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <Clock className="text-yellow-600" size={20} />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Đang Hiệu Lực</p>
                  <p className="text-2xl font-bold text-green-600">
                    {contracts.filter(c => c.status === "ACTIVE").length}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <CheckCircle className="text-green-600" size={20} />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Sắp Hết Hạn</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {contracts.filter(c => c.status === "EXPIRING_SOON").length}
                  </p>
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  <AlertCircle className="text-orange-600" size={20} />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Hết Hạn</p>
                  <p className="text-2xl font-bold text-red-600">
                    {contracts.filter(c => c.status === "EXPIRED").length}
                  </p>
                </div>
                <div className="bg-red-100 p-3 rounded-full">
                  <XCircle className="text-red-600" size={20} />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Đã Chấm Dứt</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {contracts.filter(c => c.status === "TERMINATED").length}
                  </p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <Pause className="text-purple-600" size={20} />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Yêu Cầu Gia Hạn</p>
                  <p className="text-2xl font-bold text-indigo-600">
                    {renewalRequests.filter(r => r.status === "PENDING").length}
                  </p>
                </div>
                <div className="bg-indigo-100 p-3 rounded-full">
                  <RefreshCw className="text-indigo-600" size={20} />
                </div>
              </div>
            </div>
          </div>

          {/* Contracts Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-white flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium text-gray-800">
                  Danh Sách Hợp Đồng
                </h3>
                <p className="text-sm text-gray-500">
                  Quản lý tất cả các hợp đồng thuê trọ
                </p>
              </div>
              <div className="flex space-x-2">
                <div className="relative">
                  <select
                    className="appearance-none bg-gray-100 border border-gray-200 text-gray-700 py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 text-sm"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <option value="ALL">Tất Cả</option>
                    <option value="PENDING">Đang Chờ</option>
                    <option value="ACTIVE">Đang Hiệu Lực</option>
                    <option value="EXPIRING_SOON">Sắp Hết Hạn</option>
                    <option value="EXPIRED">Hết Hạn</option>
                    <option value="TERMINATED">Đã Chấm Dứt</option>
                    <option value="CANCELLED">Đã Hủy</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>
            </div>

            {/* Contracts Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hợp Đồng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phòng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Người Thuê
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thời Gian
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Giá Thuê
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng Thái
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao Tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredContracts().length > 0 ? (
                    filteredContracts().map((contract, i) => {
                      const contractStatus = formatContractStatus(contract.status);

                      return (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                  <FileText className="h-5 w-5 text-indigo-600" />
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {contract.contractNumber || `HD-${contract.id?.substr(-6)}` || 'N/A'}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {contract.createdDate ? `Tạo: ${new Date(contract.createdDate).toLocaleDateString('vi-VN')}` : 'N/A'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {contract.roomNumber || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {contract.roomType || 'Chưa xác định'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {contract.tenantName || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {contract.tenantPhone || contract.tenantEmail || 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div>
                              <div className="font-medium">
                                {contract.startDate ? new Date(contract.startDate).toLocaleDateString('vi-VN') : 'N/A'}
                              </div>
                              <div>
                                đến {contract.endDate ? new Date(contract.endDate).toLocaleDateString('vi-VN') : 'N/A'}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {contract.monthlyRent ? `${contract.monthlyRent.toLocaleString('vi-VN')} VNĐ` : 'N/A'}
                            </div>
                            <div className="text-sm text-gray-500">
                              Cọc: {contract.depositAmount ? `${contract.depositAmount.toLocaleString('vi-VN')} VNĐ` : 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${contractStatus.className}`}>
                              {contractStatus.icon}
                              <span className="ml-1">{contractStatus.label}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => handleViewContract(contract.id)}
                                className="text-blue-600 hover:text-blue-800 p-1 rounded"
                                title="Xem chi tiết"
                              >
                                <Eye size={16} />
                              </button>

                              {/* Nếu hợp đồng PENDING và tenant đã ký, owner có thể xác nhận đặt cọc */}
                              {contract.status === "PENDING" && contract.tenantSignature && !contract.ownerSignature && (
                                <button
                                  onClick={() => handleConfirmDeposit(contract.id)}
                                  className="text-green-600 hover:text-green-800 p-1 rounded"
                                  title="Xác nhận đã nhận đặt cọc"
                                >
                                  <Banknote size={16} />
                                </button>
                              )}

                              {/* Nếu hợp đồng ACTIVE, có thể chấm dứt */}
                              {contract.status === "ACTIVE" && (
                                <button
                                  onClick={() => handleTerminateContract(contract.id)}
                                  className="text-orange-600 hover:text-orange-800 p-1 rounded"
                                  title="Chấm dứt hợp đồng"
                                >
                                  <Pause size={16} />
                                </button>
                              )}

                              {/* Nếu hợp đồng chưa active, có thể hủy */}
                              {(contract.status === "PENDING" || contract.status === "CANCELLED") && (
                                <button
                                  onClick={() => handleCancelContract(contract.id)}
                                  className="text-red-600 hover:text-red-800 p-1 rounded"
                                  title="Hủy hợp đồng"
                                >
                                  <Trash2 size={16} />
                                </button>
                              )}

                              {/* Nếu có thể chỉnh sửa */}
                              {contract.status === "PENDING" && !contract.tenantSignature && (
                                <button
                                  onClick={() => {
                                    setSelectedContract(contract);
                                    setShowCreateModal(true);
                                  }}
                                  className="text-gray-600 hover:text-gray-800 p-1 rounded"
                                  title="Chỉnh sửa hợp đồng"
                                >
                                  <Edit size={16} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                        <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-sm font-medium text-gray-900 mb-1">Không có hợp đồng nào</h3>
                        <p className="text-sm text-gray-500">Chưa có hợp đồng nào được tạo. Nhấp vào "Tạo Hợp Đồng" để bắt đầu.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Renewal Requests Section */}
          {renewalRequests.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-8">
              <div className="px-6 py-4 border-b border-gray-200 bg-white flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-gray-800">
                    Yêu Cầu Gia Hạn Hợp Đồng
                  </h3>
                  <p className="text-sm text-gray-500">
                    Quản lý các yêu cầu gia hạn từ người thuê
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                    {renewalRequests.filter(r => r.status === "PENDING").length} chờ duyệt
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hợp Đồng
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Người Thuê
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thời Gian Hiện Tại
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Gia Hạn Thêm
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Lý Do
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng Thái
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thao Tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {renewalRequests.map((request, i) => {
                      const renewalStatus = formatRenewalStatus(request.status);

                      return (
                        <tr key={request.id || i} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {request.contract?.contractNumber || `HD-${request.contract?.id?.substr(-6) || 'N/A'}`}
                            </div>
                            <div className="text-sm text-gray-500">
                              {request.contract?.room?.roomNumber || 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {request.contract?.tenant?.fullName || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {request.contract?.tenant?.email || 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div>
                              <div className="font-medium">
                                Hết hạn: {request.contract?.endDate ? new Date(request.contract.endDate).toLocaleDateString('vi-VN') : 'N/A'}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {request.extensionMonths} tháng
                            </div>
                            <div className="text-sm text-gray-500">
                              Đến: {request.newEndDate ? new Date(request.newEndDate).toLocaleDateString('vi-VN') : 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 max-w-xs truncate">
                              {request.reason || 'Không có lý do'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${renewalStatus.className}`}>
                              {renewalStatus.icon}
                              <span className="ml-1">{renewalStatus.label}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedRenewalRequest(request);
                                  setShowRenewalModal(true);
                                }}
                                className="text-blue-600 hover:text-blue-800 p-1 rounded"
                                title="Xem chi tiết"
                              >
                                <Eye size={16} />
                              </button>

                              {request.status === "PENDING" && (
                                <>
                                  <button
                                    onClick={() => handleApproveRenewal(request.id)}
                                    className="text-green-600 hover:text-green-800 p-1 rounded"
                                    title="Duyệt yêu cầu"
                                  >
                                    <CheckCircle size={16} />
                                  </button>
                                  <button
                                    onClick={() => handleRejectRenewal(request.id)}
                                    className="text-red-600 hover:text-red-800 p-1 rounded"
                                    title="Từ chối yêu cầu"
                                  >
                                    <XCircle size={16} />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>


      {/*  */}
      {showDetailModal && selectedContract && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Chi Tiết Hợp Đồng</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="py-4 space-y-6">
              {/* Contract Status */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Trạng Thái Hợp Đồng</h4>
                    <div className="flex items-center space-x-2">
                      {(() => {
                        const status = formatContractStatus(selectedContract.status);
                        return (
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${status.className}`}>
                            {status.icon}
                            <span className="ml-2">{status.label}</span>
                          </span>
                        );
                      })()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Số hợp đồng</div>
                    <div className="font-medium">{selectedContract.contractNumber || `HD-${selectedContract.id?.substr(-6)}`}</div>
                  </div>
                </div>
              </div>

              {/* Contract Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">Thông Tin Cơ Bản</h4>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Phòng</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedContract.roomNumber}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Loại phòng</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedContract.roomType || 'Chưa xác định'}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Ngày bắt đầu</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedContract.startDate ? new Date(selectedContract.startDate).toLocaleDateString('vi-VN') : 'N/A'}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Ngày kết thúc</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedContract.endDate ? new Date(selectedContract.endDate).toLocaleDateString('vi-VN') : 'N/A'}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Thời hạn hợp đồng</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedContract.startDate && selectedContract.endDate
                        ? `${Math.ceil((new Date(selectedContract.endDate) - new Date(selectedContract.startDate)) / (1000 * 60 * 60 * 24 * 30))} tháng`
                        : 'N/A'
                      }
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">Thông Tin Tài Chính</h4>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Giá thuê hàng tháng</label>
                    <p className="mt-1 text-lg font-semibold text-green-600">
                      {selectedContract.monthlyRent ? `${selectedContract.monthlyRent.toLocaleString('vi-VN')} VNĐ` : 'N/A'}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Tiền đặt cọc</label>
                    <p className="mt-1 text-lg font-semibold text-blue-600">
                      {selectedContract.depositAmount ? `${selectedContract.depositAmount.toLocaleString('vi-VN')} VNĐ` : 'N/A'}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Tiền điện (kWh)</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedContract.electricityRate ? `${selectedContract.electricityRate.toLocaleString('vi-VN')} VNĐ` : 'Theo giá nhà nước'}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Tiền nước (m³)</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedContract.waterRate ? `${selectedContract.waterRate.toLocaleString('vi-VN')} VNĐ` : 'Theo giá nhà nước'}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Phí dịch vụ khác</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedContract.serviceCharge ? `${selectedContract.serviceCharge.toLocaleString('vi-VN')} VNĐ` : 'Không có'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tenant Information */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">Thông Tin Người Thuê</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Họ và tên</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedContract.tenantName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedContract.tenantEmail}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Số điện thoại</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedContract.tenantPhone || 'Chưa có'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">CCCD/CMND</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedContract.tenantIdNumber || 'Chưa có'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Địa chỉ thường trú</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedContract.tenantAddress || 'Chưa có'}</p>
                  </div>
                </div>
              </div>

              {/* Contract Signatures */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">Chữ Ký Hợp Đồng</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-blue-800">Chữ ký người thuê</h5>
                      {selectedContract.tenantSignature ? (
                        <CheckCircle className="text-green-500" size={20} />
                      ) : (
                        <Clock className="text-gray-400" size={20} />
                      )}
                    </div>
                    {selectedContract.tenantSignature ? (
                      <div>
                        <p className="text-sm text-blue-700">{selectedContract.tenantSignature}</p>
                        <p className="text-xs text-blue-600 mt-1">
                          {selectedContract.tenantSignedDate
                            ? `Ký ngày: ${new Date(selectedContract.tenantSignedDate).toLocaleString('vi-VN')}`
                            : 'Đã ký'
                          }
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">Chưa ký</p>
                    )}
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-green-800">Chữ ký chủ trọ</h5>
                      {selectedContract.ownerSignature ? (
                        <CheckCircle className="text-green-500" size={20} />
                      ) : (
                        <Clock className="text-gray-400" size={20} />
                      )}
                    </div>
                    {selectedContract.ownerSignature ? (
                      <div>
                        <p className="text-sm text-green-700">{selectedContract.ownerSignature}</p>
                        <p className="text-xs text-green-600 mt-1">
                          {selectedContract.ownerSignedDate
                            ? `Ký ngày: ${new Date(selectedContract.ownerSignedDate).toLocaleString('vi-VN')}`
                            : 'Đã ký'
                          }
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">Chưa ký</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Contract Terms */}
              {selectedContract.terms && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">Điều Khoản Hợp Đồng</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700">{selectedContract.terms}</pre>
                  </div>
                </div>
              )}
              {/* Contract History */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">Lịch Sử Hợp Đồng</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Hợp đồng được tạo: {selectedContract.createdDate ? new Date(selectedContract.createdDate).toLocaleString('vi-VN') : 'N/A'}</span>
                  </div>
                  {selectedContract.tenantSignedDate && (
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Người thuê đã ký: {new Date(selectedContract.tenantSignedDate).toLocaleString('vi-VN')}</span>
                    </div>
                  )}
                  {selectedContract.ownerSignedDate && (
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <span>Chủ trọ đã ký: {new Date(selectedContract.ownerSignedDate).toLocaleString('vi-VN')}</span>
                    </div>
                  )}
                  {selectedContract.terminationDate && (
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span>Hợp đồng chấm dứt: {new Date(selectedContract.terminationDate).toLocaleString('vi-VN')}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end pt-4 border-t border-gray-200 space-x-3">
              {selectedRenewalRequest.status === "PENDING" && (
                <>
                  <button
                    onClick={() => {
                      handleApproveRenewal(selectedRenewalRequest.id);
                      setShowRenewalModal(false);
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <CheckCircle size={16} />
                    <span>Duyệt Yêu Cầu</span>
                  </button>
                  <button
                    onClick={() => {
                      handleRejectRenewal(selectedRenewalRequest.id);
                      setShowRenewalModal(false);
                    }}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                  >
                    <XCircle size={16} />
                    <span>Từ Chối</span>
                  </button>
                </>
              )}

              <button
                onClick={() => setShowRenewalModal(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Contract Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="py-4">
            <CreateContractForm
              contract={selectedContract}
              onSuccess={() => {
                setShowCreateModal(false);
                setSelectedContract(null);
                fetchContracts();
              }}
              onCancel={() => {
                setShowCreateModal(false);
                setSelectedContract(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Renewal Request Detail Modal */}
      {showRenewalModal && selectedRenewalRequest && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Chi Tiết Yêu Cầu Gia Hạn</h3>
              <button
                onClick={() => setShowRenewalModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="py-4 space-y-6">
              {/* Request Status */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Trạng Thái Yêu Cầu</h4>
                    <div className="flex items-center space-x-2">
                      {(() => {
                        const status = formatRenewalStatus(selectedRenewalRequest.status);
                        return (
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${status.className}`}>
                            {status.icon}
                            <span className="ml-2">{status.label}</span>
                          </span>
                        );
                      })()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Ngày yêu cầu</div>
                    <div className="font-medium">
                      {selectedRenewalRequest.createdAt ? new Date(selectedRenewalRequest.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contract Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">Thông Tin Hợp Đồng</h4>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Số hợp đồng</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedRenewalRequest.contract?.contractNumber || `HD-${selectedRenewalRequest.contract?.id?.substr(-6) || 'N/A'}`}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Phòng</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedRenewalRequest.contract?.room?.roomNumber || 'N/A'}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Người thuê</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedRenewalRequest.contract?.tenant?.fullName || 'N/A'}</p>
                    <p className="mt-1 text-xs text-gray-500">{selectedRenewalRequest.contract?.tenant?.email || 'N/A'}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">Thông Tin Gia Hạn</h4>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Ngày hết hạn hiện tại</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedRenewalRequest.contract?.endDate ? new Date(selectedRenewalRequest.contract.endDate).toLocaleDateString('vi-VN') : 'N/A'}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Gia hạn thêm</label>
                    <p className="mt-1 text-lg font-semibold text-blue-600">
                      {selectedRenewalRequest.extensionMonths} tháng
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Ngày hết hạn mới</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedRenewalRequest.newEndDate ? new Date(selectedRenewalRequest.newEndDate).toLocaleDateString('vi-VN') : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Reason */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">Lý Do Gia Hạn</h4>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">
                    {selectedRenewalRequest.reason || 'Không có lý do cụ thể'}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end pt-4 border-t border-gray-200 space-x-3">
              {selectedRenewalRequest.status === "PENDING" && (
                <>
                  <button
                    onClick={() => {
                      handleApproveRenewal(selectedRenewalRequest.id);
                      setShowRenewalModal(false);
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <CheckCircle size={16} />
                    <span>Duyệt Yêu Cầu</span>
                  </button>
                  <button
                    onClick={() => {
                      handleRejectRenewal(selectedRenewalRequest.id);
                      setShowRenewalModal(false);
                    }}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                  >
                    <XCircle size={16} />
                    <span>Từ Chối</span>
                  </button>
                </>
              )}

              <button
                onClick={() => setShowRenewalModal(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
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