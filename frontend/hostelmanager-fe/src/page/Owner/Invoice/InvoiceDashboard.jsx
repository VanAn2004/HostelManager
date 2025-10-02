import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Mail, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Calendar, 
  DollarSign,
  Download,
  MoreHorizontal,
  AlertTriangle,
  Users,
  Home,
  Zap,
  Droplet,
  Wifi,
  Car,
  Trash,
  X,
  Check,
  RefreshCw,
  Settings
} from 'lucide-react';
import SidebarOwner from "../../../Component/SiderbarOwner";
import TopNavigationOwner from '../../../Component/TopNavigationOwner';

const API_BASE_URL = "http://localhost:8080/api/v1";

// Modal Components
const AutoGenerateInvoiceModal = ({ isOpen, onClose, onSuccess }) => {
  const [availableUsages, setAvailableUsages] = useState([]);
  const [selectedUsages, setSelectedUsages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const fetchAvailableUsages = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token")?.replace(/"/g, "");
      const response = await fetch(`${API_BASE_URL}/utility-usages/uninvoiced`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.code === 1000) {
          setAvailableUsages(data.result || []);
        }
      }
    } catch (error) {
      console.error('Error fetching available usages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectUsage = (usage) => {
    setSelectedUsages(prev => {
      const isSelected = prev.find(u => u.id === usage.id);
      if (isSelected) {
        return prev.filter(u => u.id !== usage.id);
      } else {
        return [...prev, usage];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedUsages.length === availableUsages.length) {
      setSelectedUsages([]);
    } else {
      setSelectedUsages([...availableUsages]);
    }
  };

  const handleGenerateInvoices = async () => {
    if (selectedUsages.length === 0) return;
    
    setIsGenerating(true);
    try {
      const token = localStorage.getItem("token")?.replace(/"/g, "");
      
      // Generate invoices for selected usages
      const generatePromises = selectedUsages.map(usage =>
        fetch(`${API_BASE_URL}/invoices/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            utilityUsageId: usage.id,
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 30 days from now
          })
        })
      );

      const results = await Promise.all(generatePromises);
      const successCount = results.filter(r => r.ok).length;
      
      if (successCount > 0) {
        onSuccess();
        onClose();
        setSelectedUsages([]);
        alert(`Đã tạo thành công ${successCount} hóa đơn!`);
      }
    } catch (error) {
      console.error('Error generating invoices:', error);
      alert('Có lỗi xảy ra khi tạo hóa đơn!');
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAvailableUsages();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Tự Động Tạo Hóa Đơn</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="animate-spin h-8 w-8 text-blue-500" />
            <span className="ml-2">Đang tải dữ liệu...</span>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-600">
                  Tìm thấy {availableUsages.length} bản ghi sử dụng tiện ích chưa có hóa đơn
                </p>
                {availableUsages.length > 0 && (
                  <button
                    onClick={handleSelectAll}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    {selectedUsages.length === availableUsages.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                  </button>
                )}
              </div>
            </div>

            {availableUsages.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <p className="text-gray-500">Không có dữ liệu sử dụng tiện ích nào chưa được tạo hóa đơn</p>
              </div>
            ) : (
              <>
                <div className="max-h-96 overflow-y-auto border rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-4 py-3 text-left">
                          <input
                            type="checkbox"
                            checked={selectedUsages.length === availableUsages.length && availableUsages.length > 0}
                            onChange={handleSelectAll}
                            className="rounded border-gray-300"
                          />
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phòng</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tháng</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Điện</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nước</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dự kiến</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {availableUsages.map((usage) => (
                        <tr 
                          key={usage.id}
                          className={`hover:bg-gray-50 ${selectedUsages.find(u => u.id === usage.id) ? 'bg-blue-50' : ''}`}
                        >
                          <td className="px-4 py-4">
                            <input
                              type="checkbox"
                              checked={!!selectedUsages.find(u => u.id === usage.id)}
                              onChange={() => handleSelectUsage(usage)}
                              className="rounded border-gray-300"
                            />
                          </td>
                          <td className="px-4 py-4 text-sm font-medium text-gray-900">
                            Phòng {usage.roomNumber || usage.roomId}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-900">
                            {usage.month}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-900">
                            <div className="flex items-center space-x-1">
                              <Zap size={14} className="text-yellow-500" />
                              <span>{usage.electricityUsed || 0} kWh</span>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-900">
                            <div className="flex items-center space-x-1">
                              <Droplet size={14} className="text-blue-500" />
                              <span>{usage.waterUsed || 0} m³</span>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm font-medium text-gray-900">
                            {formatCurrency(usage.estimatedTotal || 0)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-between items-center mt-6">
                  <div className="text-sm text-gray-600">
                    Đã chọn {selectedUsages.length} / {availableUsages.length} bản ghi
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleGenerateInvoices}
                      disabled={selectedUsages.length === 0 || isGenerating}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
                    >
                      {isGenerating && <RefreshCw className="animate-spin" size={16} />}
                      <span>
                        {isGenerating ? 'Đang tạo...' : `Tạo ${selectedUsages.length} Hóa Đơn`}
                      </span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const CreateInvoiceModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    utilityUsageId: '',
    dueDate: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [utilityUsages, setUtilityUsages] = useState([]);
  const [isLoadingUsages, setIsLoadingUsages] = useState(false);
  const [selectedUsage, setSelectedUsage] = useState(null);

  // Fetch utility usages when modal opens
  const fetchUtilityUsages = async () => {
    setIsLoadingUsages(true);
    try {
      const token = localStorage.getItem("token")?.replace(/"/g, "");
      const response = await fetch(`${API_BASE_URL}/utility-usages/pending`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.code === 1000) {
          setUtilityUsages(data.result);
        }
      }
    } catch (error) {
      console.error('Error fetching utility usages:', error);
    } finally {
      setIsLoadingUsages(false);
    }
  };

  // Handle utility usage selection
  const handleUsageSelect = (usage) => {
    setSelectedUsage(usage);
    setFormData({
      ...formData,
      utilityUsageId: usage.id
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
  };

  // Calculate total amount for selected usage
  const calculateTotalAmount = (usage) => {
    if (!usage) return 0;
    return (usage.rentAmount || 0) + 
           (usage.electricityAmount || 0) + 
           (usage.waterAmount || 0) + 
           (usage.wifiFee || 0) + 
           (usage.garbageFee || 0) + 
           (usage.parkingFee || 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem("token")?.replace(/"/g, "");
      const response = await fetch(`${API_BASE_URL}/invoices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        onSuccess();
        onClose();
        setFormData({ utilityUsageId: '', dueDate: '' });
        setSelectedUsage(null);
      }
    } catch (error) {
      console.error('Error creating invoice:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Tạo Hóa Đơn Thủ Công</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID Sử Dụng Tiện Ích
            </label>
            <input
              type="text"
              value={formData.utilityUsageId}
              onChange={(e) => setFormData({...formData, utilityUsageId: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập ID sử dụng tiện ích"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ngày Đến Hạn
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Đang tạo...' : 'Tạo Hóa Đơn'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const InvoiceDetailModal = ({ invoice, isOpen, onClose }) => {
  if (!isOpen || !invoice) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'PAID': return 'bg-green-100 text-green-800';
      case 'UNPAID': return 'bg-yellow-100 text-yellow-800';
      case 'OVERDUE': return 'bg-red-100 text-red-800';
      case 'CANCELLED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'PAID': return 'Đã Thanh Toán';
      case 'UNPAID': return 'Chưa Thanh Toán';
      case 'OVERDUE': return 'Trễ Hạn';
      case 'CANCELLED': return 'Đã Hủy';
      default: return status;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Chi Tiết Hóa Đơn</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
        
        <div className="space-y-6">
          {/* Header Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Mã Hóa Đơn</label>
                <p className="text-lg font-semibold">{invoice.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Trạng Thái</label>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(invoice.status)}`}>
                  {getStatusText(invoice.status)}
                </span>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Tháng</label>
                <p className="font-medium">{invoice.month}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Ngày Đến Hạn</label>
                <p className="font-medium">{invoice.dueDate}</p>
              </div>
            </div>
          </div>

          {/* Cost Breakdown */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Chi Tiết Chi Phí</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <div className="flex items-center space-x-2">
                  <Home size={16} className="text-blue-500" />
                  <span>Tiền thuê phòng</span>
                </div>
                <span className="font-medium">{formatCurrency(invoice.rentAmount || 0)}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b">
                <div className="flex items-center space-x-2">
                  <Zap size={16} className="text-yellow-500" />
                  <span>Tiền điện</span>
                </div>
                <span className="font-medium">{formatCurrency(invoice.electricityAmount || 0)}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b">
                <div className="flex items-center space-x-2">
                  <Droplet size={16} className="text-blue-500" />
                  <span>Tiền nước</span>
                </div>
                <span className="font-medium">{formatCurrency(invoice.waterAmount || 0)}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b">
                <div className="flex items-center space-x-2">
                  <Wifi size={16} className="text-purple-500" />
                  <span>Phí WiFi</span>
                </div>
                <span className="font-medium">{formatCurrency(invoice.wifiFee || 0)}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b">
                <div className="flex items-center space-x-2">
                  <Trash size={16} className="text-green-500" />
                  <span>Phí rác</span>
                </div>
                <span className="font-medium">{formatCurrency(invoice.garbageFee || 0)}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b">
                <div className="flex items-center space-x-2">
                  <Car size={16} className="text-gray-500" />
                  <span>Phí gửi xe</span>
                </div>
                <span className="font-medium">{formatCurrency(invoice.parkingFee || 0)}</span>
              </div>
              
              <div className="flex justify-between items-center py-3 bg-blue-50 px-3 rounded-lg">
                <span className="font-semibold text-lg">Tổng cộng</span>
                <span className="font-bold text-xl text-blue-600">{formatCurrency(invoice.totalAmount || 0)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SendEmailModal = ({ invoice, isOpen, onClose, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem("token")?.replace(/"/g, "");
      const response = await fetch(`${API_BASE_URL}/invoices/${invoice.id}/send-email?email=${email}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        onSuccess();
        onClose();
        setEmail('');
      }
    } catch (error) {
      console.error('Error sending email:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !invoice) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Gửi Hóa Đơn Qua Email</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hóa đơn: {invoice.id}
            </label>
            <p className="text-sm text-gray-600 mb-4">
              Tổng tiền: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(invoice.totalAmount || 0)}
            </p>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email người nhận
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="example@email.com"
              required
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Đang gửi...' : 'Gửi Email'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon, label, value, bgColor, iconBg }) => (
  <div className={`${bgColor} rounded-xl p-6`}>
    <div className="flex items-center">
      <div className={`${iconBg} p-3 rounded-lg`}>
        {icon}
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

// Main Component
export default function InvoiceManagement() {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [showAutoGenerateModal, setShowAutoGenerateModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentUser, setCurrentUser] = useState({});
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  
  // Statistics
  const [statistics, setStatistics] = useState({
    totalInvoices: 0,
    totalRevenue: 0
  });

  // Get token
  const token = localStorage.getItem("token")?.replace(/"/g, "");

  // Helper functions
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'PAID': return 'bg-green-100 text-green-800';
      case 'UNPAID': return 'bg-yellow-100 text-yellow-800';
      case 'OVERDUE': return 'bg-red-100 text-red-800';
      case 'CANCELLED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'PAID': return 'Đã Thanh Toán';
      case 'UNPAID': return 'Chưa Thanh Toán';
      case 'OVERDUE': return 'Trễ Hạn';
      case 'CANCELLED': return 'Đã Hủy';
      default: return status;
    }
  };

  // API Functions
  const fetchAllInvoices = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/invoices/owner?page=${currentPage}&size=${pageSize}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Không thể tải danh sách hóa đơn');
      
      const data = await response.json();
      if (data.code === 1000) {
        setInvoices(data.result);
        setFilteredInvoices(data.result);
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const startDate = new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0];
      const endDate = new Date().toISOString().split('T')[0];
      
      const response = await fetch(`${API_BASE_URL}/invoices/statistics?startDate=${startDate}&endDate=${endDate}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.code === 1000) {
          setStatistics(data.result);
        }
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const updateInvoiceStatus = async (invoiceId, newStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/invoices/${invoiceId}/status?status=${newStatus}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        fetchAllInvoices();
      }
    } catch (error) {
      console.error('Error updating invoice status:', error);
    }
  };

  const markInvoiceAsPaid = async (invoiceId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/invoices/${invoiceId}/mark-paid`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        fetchAllInvoices();
        fetchStatistics();
      }
    } catch (error) {
      console.error('Error marking invoice as paid:', error);
    }
  };

  const cancelInvoice = async (invoiceId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/invoices/${invoiceId}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        fetchAllInvoices();
        fetchStatistics();
      }
    } catch (error) {
      console.error('Error cancelling invoice:', error);
    }
  };

  const deleteInvoice = async (invoiceId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa hóa đơn này?')) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/invoices/${invoiceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        fetchAllInvoices();
        fetchStatistics();
        alert('Xóa hóa đơn thành công!');
      }
    } catch (error) {
      console.error('Error deleting invoice:', error);
      alert('Có lỗi xảy ra khi xóa hóa đơn!');
    }
  };

  // Filter invoices based on status, search term, and month
  const applyFilters = () => {
    let filtered = [...invoices];

    // Filter by status
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(invoice => invoice.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(invoice => 
        invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (invoice.roomNumber && invoice.roomNumber.toString().includes(searchTerm)) ||
        (invoice.description && invoice.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by month
    if (monthFilter) {
      filtered = filtered.filter(invoice => invoice.month === monthFilter);
    }

    setFilteredInvoices(filtered);
    setCurrentPage(0);
  };

  // Effects
  useEffect(() => {
    if (token) {
      fetchAllInvoices();
      fetchStatistics();
    }
  }, [currentPage]);

  useEffect(() => {
    applyFilters();
  }, [invoices, statusFilter, searchTerm, monthFilter]);

  // Event handlers
  const handleViewDetail = (invoice) => {
    setSelectedInvoice(invoice);
    setShowDetailModal(true);
  };

  const handleSendEmail = (invoice) => {
    setSelectedInvoice(invoice);
    setShowEmailModal(true);
  };

  const handleStatusChange = (invoice, newStatus) => {
    updateInvoiceStatus(invoice.id, newStatus);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleMonthFilter = (e) => {
    setMonthFilter(e.target.value);
  };

  const handleGetRoomNumber = (room) => {
  return room?.roomNumber || room?.roomId || 'Chưa có thông tin phòng';
};

  const resetFilters = () => {
    setStatusFilter('ALL');
    setSearchTerm('');
    setMonthFilter('');
  };

  // Get unique months from invoices
  const availableMonths = [...new Set(invoices.map(invoice => invoice.month))].sort();

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Có lỗi xảy ra</h3>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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
        activeItem="invoices"
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
                  Quản Lý Hóa Đơn
                </h1>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowAutoGenerateModal(true)}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <RefreshCw size={20} className="mr-2" />
                    Tự Động Tạo
                  </button>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={20} className="mr-2" />
                    Tạo Hóa Đơn
                  </button>
                </div>
            </div>
            <p className="text-gray-600">
              Quản lý tất cả hợp đồng thuê trọ và theo dõi trạng thái của từng hợp đồng.
            </p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={<FileText className="h-8 w-8 text-blue-600" />}
              label="Tổng Hóa Đơn"
              value={statistics.totalInvoices || 0}
              bgColor="bg-blue-50"
              iconBg="bg-blue-100"
            />
            <StatCard
              icon={<DollarSign className="h-8 w-8 text-green-600" />}
              label="Tổng Doanh Thu"
              value={formatCurrency(statistics.totalRevenue || 0)}
              bgColor="bg-green-50"
              iconBg="bg-green-100"
            />
            <StatCard
              icon={<CheckCircle className="h-8 w-8 text-emerald-600" />}
              label="Đã Thanh Toán"
              value={filteredInvoices.filter(i => i.status === 'PAID').length}
              bgColor="bg-emerald-50"
              iconBg="bg-emerald-100"
            />
            <StatCard
              icon={<Clock className="h-8 w-8 text-yellow-600" />}
              label="Chưa Thanh Toán"
              value={filteredInvoices.filter(i => i.status === 'UNPAID').length}
              bgColor="bg-yellow-50"
              iconBg="bg-yellow-100"
            />
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow mb-6 p-6">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo ID, phòng, mô tả..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Filter size={20} className="text-gray-500" />
                <select
                  value={statusFilter}
                  onChange={handleStatusFilter}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ALL">Tất cả trạng thái</option>
                  <option value="PAID">Đã thanh toán</option>
                  <option value="UNPAID">Chưa thanh toán</option>
                  <option value="OVERDUE">Trễ hạn</option>
                  <option value="CANCELLED">Đã hủy</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <Calendar size={20} className="text-gray-500" />
                <select
                  value={monthFilter}
                  onChange={handleMonthFilter}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Tất cả tháng</option>
                  {availableMonths.map(month => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={resetFilters}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Đặt lại
              </button>
            </div>

            <div className="mt-4 text-sm text-gray-600">
              Hiển thị {filteredInvoices.length} / {invoices.length} hóa đơn
            </div>
          </div>

        {/* Invoice Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="animate-spin h-8 w-8 text-blue-500" />
                <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
              </div>
            ) : filteredInvoices.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <p className="text-gray-500">Không có hóa đơn nào</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hóa Đơn
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phòng
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tháng
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tổng Tiền
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng Thái
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hạn Thanh Toán
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thao Tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredInvoices.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {invoice.id}
                          </div>
                          <div className="text-sm text-gray-500">
                            {invoice.type}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Home size={16} className="text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">
                              Phòng {handleGetRoomNumber(invoice.room)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {invoice.month}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {formatCurrency(invoice.totalAmount)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                            {getStatusText(invoice.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                           {invoice.month ? (() => {
                            const date = new Date(invoice.month + "-01");
                            const month = String(date.getMonth() + 1).padStart(2, '0');
                            const year = date.getFullYear();
                            return `${month} - ${year}`;
                          })() : "Không rõ tháng"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleViewDetail(invoice)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Xem chi tiết"
                            >
                              <Eye size={16} />
                            </button>
                            
                            <button
                              onClick={() => handleSendEmail(invoice)}
                              className="text-green-600 hover:text-green-900"
                              title="Gửi email"
                            >
                              <Mail size={16} />
                            </button>

                            {invoice.status === 'UNPAID' && (
                              <button
                                onClick={() => markInvoiceAsPaid(invoice.id)}
                                className="text-emerald-600 hover:text-emerald-900"
                                title="Đánh dấu đã thanh toán"
                              >
                                <CheckCircle size={16} />
                              </button>
                            )}

                            {invoice.status !== 'CANCELLED' && (
                              <button
                                onClick={() => cancelInvoice(invoice.id)}
                                className="text-yellow-600 hover:text-yellow-900"
                                title="Hủy hóa đơn"
                              >
                                <XCircle size={16} />
                              </button>
                            )}

                            <button
                              onClick={() => deleteInvoice(invoice.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Xóa hóa đơn"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>

        {/* Pagination */}
        {filteredInvoices.length > pageSize && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-6 rounded-lg shadow">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Trước
              </button>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={(currentPage + 1) * pageSize >= filteredInvoices.length}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Sau
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Hiển thị{' '}
                  <span className="font-medium">{currentPage * pageSize + 1}</span>
                  {' '}đến{' '}
                  <span className="font-medium">
                    {Math.min((currentPage + 1) * pageSize, filteredInvoices.length)}
                  </span>
                  {' '}trong{' '}
                  <span className="font-medium">{filteredInvoices.length}</span>
                  {' '}kết quả
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                    disabled={currentPage === 0}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Trước
                  </button>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={(currentPage + 1) * pageSize >= filteredInvoices.length}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Sau
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <AutoGenerateInvoiceModal
        isOpen={showAutoGenerateModal}
        onClose={() => setShowAutoGenerateModal(false)}
        onSuccess={() => {
          fetchAllInvoices();
          fetchStatistics();
        }}
      />

      <CreateInvoiceModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          fetchAllInvoices();
          fetchStatistics();
        }}
      />

      <InvoiceDetailModal
        invoice={selectedInvoice}
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedInvoice(null);
        }}
      />

      <SendEmailModal
        invoice={selectedInvoice}
        isOpen={showEmailModal}
        onClose={() => {
          setShowEmailModal(false);
          setSelectedInvoice(null);
        }}
        onSuccess={() => {
          alert('Gửi email thành công!');
        }}
      />
    </div>
  );
}