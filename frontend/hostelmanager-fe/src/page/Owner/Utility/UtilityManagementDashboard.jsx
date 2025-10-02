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
  Car,
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
  Save,
  Filter,
  Download,
  TrendingUp,
  DollarSign,
  Activity,
  BarChart3,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import NavItem from "../../../Component/OwnerDashBoardComponent/NavItem";
import SidebarOwner from "../../../Component/SiderbarOwner";
import TopNavigationOwner from "../../../Component/TopNavigationOwner";



const API_BASE_URL = "http://localhost:8080/api/v1";

export default function UtilityManagement() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentUser, setCurrentUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('config'); // 'config' or 'usage'
  
  // Config states
  const [utilityConfig, setUtilityConfig] = useState({
    electricityPricePerUnit: 0,
    waterPricePerUnit: 0,
    wifiFee: 0,
    garbageFee: 0,
    parkingFee: 0
  });
  const [isConfigChanged, setIsConfigChanged] = useState(false);
  
  // Usage states
  const [utilityUsages, setUtilityUsages] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [rooms, setRooms] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingUsage, setEditingUsage] = useState(null);
  const [previousReadings, setPreviousReadings] = useState({
  oldElectricity: 0,
  oldWater: 0
});
  
  // Create/Edit form states
  const [usageForm, setUsageForm] = useState({
    roomId: '',
    month: selectedMonth,
    oldElectricity: 0,
    newElectricity: 0,
    oldWater: 0,
    newWater: 0,
    includeWifi: false,
    includeGarbage: false,
    includeParking: false,
    notes: ''
  });
  
  const navigate = useNavigate();
  
  // Get token from localStorage and clean it
  const token = localStorage.getItem("token");
  const cleanToken = token ? token.replace(/"/g, "") : "";

  // Helper function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(amount || 0);
  };

  // Helper function to format month
  const formatMonth = (monthStr) => {
    const [year, month] = monthStr.split('-');
    return `${month}/${year}`;
  };

 // Thêm function để fetch chỉ số tháng trước dựa trên tháng được chọn
const fetchPreviousReadings = async (roomId, selectedMonth = null) => {
  try {
    console.log('🔍 Fetching previous readings for room:', roomId, 'for month:', selectedMonth);
    setIsLoading(true);
    
    // Tính tháng trước dựa trên tháng được chọn
    let previousMonth = '';
    if (selectedMonth) {
      const date = new Date(selectedMonth + '-01');
      date.setMonth(date.getMonth() - 1);
      previousMonth = date.toISOString().slice(0, 7); // Format: YYYY-MM
      console.log('📅 Looking for readings from:', previousMonth);
    }
    
    // Thử dùng API với tháng cụ thể
    const url = previousMonth 
      ? `/api/utility-usage/previous-readings/${roomId}?month=${previousMonth}`
      : `/api/utility-usage/previous-readings/${roomId}`;
      
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('📡 API Response status:', response.status);

    if (response.ok) {
      const apiResponse = await response.json();
      console.log('📊 API Response:', apiResponse);
      
      // Lấy data từ ApiResponse wrapper
      const data = apiResponse.result || {};
      console.log('📊 Usage data:', data);
      
      const readings = {
        oldElectricity: data.newElectricity || 0,
        oldWater: data.newWater || 0,
        month: data.month || previousMonth
      };
      
      console.log('⚡ Setting readings:', readings);
      setPreviousReadings(readings);
      
      // Tự động điền vào form
      setUsageForm(prev => ({
        ...prev,
        oldElectricity: readings.oldElectricity,
        oldWater: readings.oldWater
      }));
    } else if (response.status === 404) {
      // Không tìm thấy chỉ số tháng trước, reset về 0
      console.log('🔄 No previous readings found');
      setPreviousReadings({ oldElectricity: 0, oldWater: 0, month: previousMonth });
      setUsageForm(prev => ({
        ...prev,
        oldElectricity: 0,
        oldWater: 0
      }));
    } else {
      console.error('❌ API Error:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('❌ Error details:', errorText);
    }
  } catch (error) {
    console.error('💥 Network error:', error);
    // Thử fallback khi có lỗi network
    await fetchPreviousReadingsFallback(roomId, selectedMonth);
  } finally {
    setIsLoading(false);
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

  // Fetch utility config
  const fetchUtilityConfig = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/utility`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cleanToken}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          // Chưa có config, sử dụng giá trị mặc định
          return;
        }
        throw new Error('Không thể tải cấu hình tiện ích');
      }
      
      const data = await response.json();
      if (data.code === 1000) {
        setUtilityConfig(data.result);
      }
    } catch (error) {
      console.error('Error fetching utility config:', error);
      // Không set error cho trường hợp này vì có thể chưa có config
    }
  };

// Fallback: tìm từ danh sách usage hiện có (nếu bạn đã load trước đó)
// Fallback: tìm từ danh sách usage hiện có dựa trên tháng
const fetchPreviousReadingsFallback = async (roomId, selectedMonth = null) => {
  try {
    console.log('🔄 Using fallback method for month:', selectedMonth);
    
    // Tính tháng trước
    let previousMonth = '';
    if (selectedMonth) {
      const date = new Date(selectedMonth + '-01');
      date.setMonth(date.getMonth() - 1);
      previousMonth = date.toISOString().slice(0, 7);
    }
    
    // Nếu bạn có danh sách utilityUsages trong state
    if (utilityUsages && utilityUsages.length > 0) {
      const roomUsages = utilityUsages.filter(usage => 
        usage.roomId === roomId && 
        (previousMonth ? usage.month === previousMonth : true)
      );
      
      if (roomUsages.length > 0) {
        const targetUsage = previousMonth 
          ? roomUsages.find(usage => usage.month === previousMonth)
          : roomUsages.sort((a, b) => new Date(b.month) - new Date(a.month))[0];
          
        if (targetUsage) {
          const readings = {
            oldElectricity: targetUsage.newElectricity || 0,
            oldWater: targetUsage.newWater || 0,
            month: targetUsage.month
          };
          
          console.log('⚡ Fallback readings:', readings);
          setPreviousReadings(readings);
          
          setUsageForm(prev => ({
            ...prev,
            oldElectricity: readings.oldElectricity,
            oldWater: readings.oldWater
          }));
          return;
        }
      }
    }
    
    // Nếu không có dữ liệu fallback, gọi API utility-usage với filter tháng
    const url = previousMonth 
      ? `/api/utility-usage?roomId=${roomId}&month=${previousMonth}&limit=1`
      : `/api/utility-usage?roomId=${roomId}&limit=1`;
      
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const apiResponse = await response.json();
      // Xử lý ApiResponse wrapper
      const data = apiResponse.result || apiResponse.data || apiResponse;
      
      if (data && Array.isArray(data) && data.length > 0) {
        const targetUsage = data[0];
        const readings = {
          oldElectricity: targetUsage.newElectricity || 0,
          oldWater: targetUsage.newWater || 0,
          month: targetUsage.month
        };
        
        console.log('⚡ Fallback API readings:', readings);
        setPreviousReadings(readings);
        
        setUsageForm(prev => ({
          ...prev,
          oldElectricity: readings.oldElectricity,
          oldWater: readings.oldWater
        }));
      } else {
        // Không có dữ liệu, reset về 0
        setPreviousReadings({ oldElectricity: 0, oldWater: 0, month: previousMonth });
        setUsageForm(prev => ({
          ...prev,
          oldElectricity: 0,
          oldWater: 0
        }));
      }
    }
  } catch (error) {
    console.error('💥 Fallback error:', error);
  }
};

  // Fetch utility usages
  const fetchUtilityUsages = async (month = selectedMonth) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/utility/usage?month=${month}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cleanToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Không thể tải danh sách chỉ số tiện ích');
      }
      
      const data = await response.json();
      if (data.code === 1000) {
        setUtilityUsages(data.result);
      }
    } catch (error) {
      console.error('Error fetching utility usages:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch rooms
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
      if (data.code === 1000) {
        setRooms(data.result);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  // Handle config update
  const handleConfigUpdate = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/utility`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cleanToken}`
        },
        body: JSON.stringify(utilityConfig)
      });
      
      if (!response.ok) {
        throw new Error('Không thể cập nhật cấu hình');
      }
      
      const data = await response.json();
      if (data.code === 1000) {
        setUtilityConfig(data.result);
        setIsConfigChanged(false);
        alert('Cập nhật cấu hình thành công!');
      }
    } catch (error) {
      console.error('Error updating config:', error);
      alert('Lỗi khi cập nhật cấu hình: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle usage create
  const handleUsageCreate = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/utility/usage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cleanToken}`
        },
        body: JSON.stringify(usageForm)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể tạo chỉ số tiện ích');
      }
      
      const data = await response.json();
      if (data.code === 1000) {
        setShowCreateForm(false);
        resetUsageForm();
        fetchUtilityUsages();
        alert('Tạo chỉ số tiện ích thành công!');
      }
    } catch (error) {
      console.error('Error creating usage:', error);
      alert('Lỗi khi tạo chỉ số tiện ích: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle usage update
  const handleUsageUpdate = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/utility/usage/${editingUsage.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cleanToken}`
        },
        body: JSON.stringify(usageForm)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể cập nhật chỉ số tiện ích');
      }
      
      const data = await response.json();
      if (data.code === 1000) {
        setShowEditForm(false);
        setEditingUsage(null);
        resetUsageForm();
        fetchUtilityUsages();
        alert('Cập nhật chỉ số tiện ích thành công!');
      }
    } catch (error) {
      console.error('Error updating usage:', error);
      alert('Lỗi khi cập nhật chỉ số tiện ích: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle usage delete
  const handleUsageDelete = async (usageId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa chỉ số tiện ích này?")) {
      try {
        const response = await fetch(`${API_BASE_URL}/utility/usage/${usageId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${cleanToken}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Không thể xóa chỉ số tiện ích');
        }
        
        fetchUtilityUsages();
        alert('Xóa chỉ số tiện ích thành công!');
      } catch (error) {
        console.error('Error deleting usage:', error);
        alert('Lỗi khi xóa chỉ số tiện ích: ' + error.message);
      }
    }
  };

  // Reset usage form
  const resetUsageForm = () => {
    setUsageForm({
      roomId: '',
      month: selectedMonth,
      oldElectricity: 0,
      newElectricity: 0,
      oldWater: 0,
      newWater: 0,
      includeWifi: false,
      includeGarbage: false,
      includeParking: false,
      notes: ''
    });
    setPreviousReadings({ oldElectricity: 0, oldWater: 0 });
  };

  // Handle edit usage
  const handleEditUsage = (usage) => {
    setEditingUsage(usage);
    setUsageForm({
      roomId: usage.roomId,
      month: usage.month,
      oldElectricity: usage.oldElectricity,
      newElectricity: usage.newElectricity,
      oldWater: usage.oldWater,
      newWater: usage.newWater,
      includeWifi: usage.includeWifi || false,
      includeGarbage: usage.includeGarbage || false,
      includeParking: usage.includeParking || false,
      notes: usage.notes || ''
    });
    setShowEditForm(true);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Handle month change
  const handleMonthChange = (month) => {
    setSelectedMonth(month);
    fetchUtilityUsages(month);
  };

  // Calculate usage statistics
  const getUsageStats = () => {
    const totalElectricity = utilityUsages.reduce((sum, usage) => 
      sum + (usage.newElectricity - usage.oldElectricity), 0);
    const totalWater = utilityUsages.reduce((sum, usage) => 
      sum + (usage.newWater - usage.oldWater), 0);
    const totalCost = utilityUsages.reduce((sum, usage) => {
      const electricityCost = (usage.newElectricity - usage.oldElectricity) * utilityConfig.electricityPricePerUnit;
      const waterCost = (usage.newWater - usage.oldWater) * utilityConfig.waterPricePerUnit;
      const wifiCost = usage.includeWifi ? utilityConfig.wifiFee : 0;
      const garbageCost = usage.includeGarbage ? utilityConfig.garbageFee : 0;
      const parkingCost = usage.includeParking ? utilityConfig.parkingFee : 0;
      return sum + electricityCost + waterCost + wifiCost + garbageCost + parkingCost;
    }, 0);

    return { totalElectricity, totalWater, totalCost };
  };

  const stats = getUsageStats();

  // Check for authentication and load data
  useEffect(() => {
    if (!cleanToken) {
      navigate("/login");
      return;
    }
    
    fetchUser();
    fetchUtilityConfig();
    fetchRooms();
    if (activeTab === 'usage') {
      fetchUtilityUsages();
    }
  }, [cleanToken, navigate, activeTab]);

  // Handle config input changes
  const handleConfigChange = (field, value) => {
    setUtilityConfig(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
    setIsConfigChanged(true);
  };

  // Cập nhật handleUsageFormChange để xử lý khi chọn phòng hoặc thay đổi tháng
const handleUsageFormChange = (field, value) => {
  setUsageForm(prev => ({
    ...prev,
    [field]: value
  }));
  

  // Khi chọn phòng hoặc thay đổi tháng, tự động load chỉ số tháng trước
  if (field === 'roomId' && value) {
    fetchPreviousReadings(value, usageForm.month);
  } else if (field === 'month' && value && usageForm.roomId) {
    fetchPreviousReadings(usageForm.roomId, value);
  }
};

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
            onClick={() => { setError(null); fetchUser(); fetchUtilityConfig(); fetchRooms(); }}
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
        activeItem="utilities"
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
                Quản Lý Tiện Ích
              </h1>
            </div>
            <p className="text-gray-600">
              Quản lý cấu hình đơn giá và chỉ số sử dụng tiện ích của các phòng trọ
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('config')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'config'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Settings size={18} />
                  <span>Cấu Hình Đơn Giá</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('usage')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'usage'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Activity size={18} />
                  <span>Chỉ Số Sử Dụng</span>
                </div>
              </button>
            </div>

            {/* Config Tab Content */}
            {activeTab === 'config' && (
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    Cấu Hình Đơn Giá Tiện Ích
                  </h3>
                  <p className="text-sm text-gray-600">
                    Thiết lập giá cho các dịch vụ tiện ích trong trọ
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Zap size={16} className="inline mr-2 text-yellow-500" />
                        Giá điện (VND/kWh)
                      </label>
                      <input
                        type="number"
                        value={utilityConfig.electricityPricePerUnit}
                        onChange={(e) => handleConfigChange('electricityPricePerUnit', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nhập giá điện"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Droplet size={16} className="inline mr-2 text-blue-500" />
                        Giá nước (VND/m³)
                      </label>
                      <input
                        type="number"
                        value={utilityConfig.waterPricePerUnit}
                        onChange={(e) => handleConfigChange('waterPricePerUnit', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nhập giá nước"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Wifi size={16} className="inline mr-2 text-purple-500" />
                        Phí Wi-Fi (VND/tháng)
                      </label>
                      <input
                        type="number"
                        value={utilityConfig.wifiFee}
                        onChange={(e) => handleConfigChange('wifiFee', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nhập phí Wi-Fi"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Trash2 size={16} className="inline mr-2 text-green-500" />
                        Phí rác (VND/tháng)
                      </label>
                      <input
                        type="number"
                        value={utilityConfig.garbageFee}
                        onChange={(e) => handleConfigChange('garbageFee', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nhập phí rác"/>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Car size={16} className="inline mr-2 text-gray-500" />
                        Phí gửi xe (VND/tháng)
                      </label>
                      <input
                        type="number"
                        value={utilityConfig.parkingFee}
                        onChange={(e) => handleConfigChange('parkingFee', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nhập phí gửi xe"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    onClick={handleConfigUpdate}
                    disabled={!isConfigChanged || isLoading}
                    className={`px-6 py-2 rounded-md text-white font-medium ${
                      isConfigChanged && !isLoading
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Save size={16} />
                      <span>{isLoading ? 'Đang lưu...' : 'Lưu Cấu Hình'}</span>
                    </div>
                  </button>
                </div>

                {/* Config Preview */}
                <div className="mt-8 bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-800 mb-3">Xem Trước Đơn Giá</h4>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-yellow-600 font-medium">Điện</div>
                      <div className="text-gray-800">{formatCurrency(utilityConfig.electricityPricePerUnit)}/kWh</div>
                    </div>
                    <div className="text-center">
                      <div className="text-blue-600 font-medium">Nước</div>
                      <div className="text-gray-800">{formatCurrency(utilityConfig.waterPricePerUnit)}/m³</div>
                    </div>
                    <div className="text-center">
                      <div className="text-purple-600 font-medium">Wi-Fi</div>
                      <div className="text-gray-800">{formatCurrency(utilityConfig.wifiFee)}/tháng</div>
                    </div>
                    <div className="text-center">
                      <div className="text-green-600 font-medium">Rác</div>
                      <div className="text-gray-800">{formatCurrency(utilityConfig.garbageFee)}/tháng</div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-600 font-medium">Gửi xe</div>
                      <div className="text-gray-800">{formatCurrency(utilityConfig.parkingFee)}/tháng</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Usage Tab Content */}
            {activeTab === 'usage' && (
              <div className="p-6">
                <div className="flex flex-wrap items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">
                      Chỉ Số Sử Dụng Tiện Ích
                    </h3>
                    <p className="text-sm text-gray-600">
                      Quản lý chỉ số điện, nước và các dịch vụ khác cho từng phòng
                    </p>
                  </div>
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
                  >
                    <PlusCircle size={16} />
                    <span>Thêm Chỉ Số</span>
                  </button>
                </div>

                {/* Month Filter and Stats */}
                <div className="mb-6 space-y-4">
                  <div className="flex flex-wrap items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Calendar size={16} className="text-gray-500" />
                      <label className="text-sm font-medium text-gray-700">Tháng:</label>
                      <input
                        type="month"
                        value={selectedMonth}
                        onChange={(e) => handleMonthChange(e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Filter size={16} className="text-gray-500" />
                      <span className="text-sm text-gray-600">
                        Hiển thị: {utilityUsages.length} phòng
                      </span>
                    </div>
                  </div>

                  {/* Usage Statistics */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg p-4 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-yellow-100 text-sm">Tổng Điện</p>
                          <p className="text-2xl font-bold">{stats.totalElectricity} kWh</p>
                        </div>
                        <Zap size={24} className="text-yellow-100" />
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg p-4 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-100 text-sm">Tổng Nước</p>
                          <p className="text-2xl font-bold">{stats.totalWater} m³</p>
                        </div>
                        <Droplet size={24} className="text-blue-100" />
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-lg p-4 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-green-100 text-sm">Tổng Chi Phí</p>
                          <p className="text-xl font-bold">{formatCurrency(stats.totalCost)}</p>
                        </div>
                        <DollarSign size={24} className="text-green-100" />
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-purple-400 to-purple-600 rounded-lg p-4 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-purple-100 text-sm">Số Phòng</p>
                          <p className="text-2xl font-bold">{utilityUsages.length}</p>
                        </div>
                        <BarChart3 size={24} className="text-purple-100" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Usage Table */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Phòng
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tháng
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Điện (kWh)
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nước (m³)
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Dịch vụ
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tổng tiền
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Thao tác
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {utilityUsages.length === 0 ? (
                          <tr>
                            <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                              <div className="flex flex-col items-center">
                                <Activity size={48} className="text-gray-300 mb-2" />
                                <p>Chưa có dữ liệu chỉ số cho tháng {formatMonth(selectedMonth)}</p>
                                <button
                                  onClick={() => setShowCreateForm(true)}
                                  className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                                >
                                  Thêm chỉ số đầu tiên
                                </button>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          utilityUsages.map((usage) => {
                            const room = rooms.find(r => r.id === usage.roomId);
                            const electricityUsed = usage.newElectricity - usage.oldElectricity;
                            const waterUsed = usage.newWater - usage.oldWater;
                            const electricityCost = electricityUsed * utilityConfig.electricityPricePerUnit;
                            const waterCost = waterUsed * utilityConfig.waterPricePerUnit;
                            const wifiCost = usage.includeWifi ? utilityConfig.wifiFee : 0;
                            const garbageCost = usage.includeGarbage ? utilityConfig.garbageFee : 0;
                            const parkingCost = usage.includeParking ? utilityConfig.parkingFee : 0;
                            const totalCost = electricityCost + waterCost + wifiCost + garbageCost + parkingCost;

                            return (
                              <tr key={usage.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="bg-blue-100 p-2 rounded-lg mr-3">
                                      <Key size={16} className="text-blue-600" />
                                    </div>
                                    <div>
                                      <div className="text-sm font-medium text-gray-900">
                                        {room?.roomNumber || `Phòng ${usage.roomId}`}
                                      </div>
                                      <div className="text-sm text-gray-500">
                                        {room?.roomType || 'N/A'}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {formatMonth(usage.month)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">
                                    {usage.oldElectricity} → {usage.newElectricity}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    Sử dụng: {electricityUsed} kWh
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">
                                    {usage.oldWater} → {usage.newWater}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    Sử dụng: {waterUsed} m³
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex flex-wrap gap-1">
                                    {usage.includeWifi && (
                                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                                        <Wifi size={10} className="mr-1" />
                                        WiFi
                                      </span>
                                    )}
                                    {usage.includeGarbage && (
                                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                        <Trash2 size={10} className="mr-1" />
                                        Rác
                                      </span>
                                    )}
                                    {usage.includeParking && (
                                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                                        <Car size={10} className="mr-1" />
                                        Xe
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">
                                    {formatCurrency(totalCost)}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    Điện: {formatCurrency(electricityCost)}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    Nước: {formatCurrency(waterCost)}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <div className="flex items-center space-x-2">
                                    <button
                                      onClick={() => handleEditUsage(usage)}
                                      className="text-blue-600 hover:text-blue-900"
                                      title="Chỉnh sửa"
                                    >
                                      <Edit size={16} />
                                    </button>
                                    <button
                                      onClick={() => handleUsageDelete(usage.id)}
                                      className="text-red-600 hover:text-red-900"
                                      title="Xóa"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                    <button
                                      onClick={() => navigate(`/owner/utility/usage/${usage.id}`)}
                                      className="text-gray-600 hover:text-gray-900"
                                      title="Xem chi tiết"
                                    >
                                      <Eye size={16} />
                                    </button>
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
              </div>
            )}
          </div>

        {/* Create Usage Modal */}
        {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                Thêm Chỉ Số Tiện Ích
                </h3>
                <button
                onClick={() => {
                    setShowCreateForm(false);
                    resetUsageForm();
                    setPreviousReadings({ oldElectricity: 0, oldWater: 0 });
                }}
                className="text-gray-400 hover:text-gray-600"
                >
                <X size={24} />
                </button>
            </div>

            <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phòng <span className="text-red-500">*</span>
                    </label>
                    <select
                    value={usageForm.roomId}
                    onChange={(e) => handleUsageFormChange('roomId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    >
                    <option value="">Chọn phòng</option>
                    {rooms.map((room) => (
                        <option key={room.id} value={room.id}>
                        {room.roomNumber} - {room.roomType}
                        </option>
                    ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tháng <span className="text-red-500">*</span>
                    </label>
                    <input
                    type="month"
                    value={usageForm.month}
                    onChange={(e) => handleUsageFormChange('month', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    />
                </div>
                </div>

                {/* Hiển thị thông tin chỉ số tháng trước nếu có */}
                {usageForm.roomId && usageForm.month && (previousReadings.oldElectricity > 0 || previousReadings.oldWater > 0) && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-blue-800 mb-2">
                    📊 Chỉ số {previousReadings.month ? new Date(previousReadings.month + '-01').toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' }) : 'trước'}
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                        <Zap size={14} className="mr-2 text-yellow-500" />
                        <span className="text-blue-700">
                        Điện: <strong>{previousReadings.oldElectricity.toLocaleString()}</strong>
                        </span>
                    </div>
                    <div className="flex items-center">
                        <Droplet size={14} className="mr-2 text-blue-500" />
                        <span className="text-blue-700">
                        Nước: <strong>{previousReadings.oldWater.toLocaleString()}</strong>
                        </span>
                    </div>
                    </div>
                </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                    <h4 className="text-sm font-medium text-gray-800 flex items-center">
                    <Zap size={16} className="mr-2 text-yellow-500" />
                    Chỉ Số Điện
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">
                        Chỉ số cũ
                        {previousReadings.oldElectricity > 0 && (
                            <span className="text-xs text-blue-600 ml-1">(tự động)</span>
                        )}
                        </label>
                        <input
                        type="number"
                        value={usageForm.oldElectricity}
                        onChange={(e) => handleUsageFormChange('oldElectricity', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0"
                        style={{
                            backgroundColor: previousReadings.oldElectricity > 0 ? '#f0f9ff' : 'white'
                        }}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">
                        Chỉ số mới <span className="text-red-500">*</span>
                        </label>
                        <input
                        type="number"
                        value={usageForm.newElectricity}
                        onChange={(e) => handleUsageFormChange('newElectricity', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0"
                        required
                        min={usageForm.oldElectricity}
                        />
                        {usageForm.oldElectricity > 0 && usageForm.newElectricity > 0 && (
                        <div className="text-xs text-green-600 mt-1">
                            Tiêu thụ: {(usageForm.newElectricity - usageForm.oldElectricity).toLocaleString()} kWh
                        </div>
                        )}
                    </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className="text-sm font-medium text-gray-800 flex items-center">
                    <Droplet size={16} className="mr-2 text-blue-500" />
                    Chỉ Số Nước
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">
                        Chỉ số cũ
                        {previousReadings.oldWater > 0 && (
                            <span className="text-xs text-blue-600 ml-1">(tự động)</span>
                        )}
                        </label>
                        <input
                        type="number"
                        value={usageForm.oldWater}
                        onChange={(e) => handleUsageFormChange('oldWater', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0"
                        style={{
                            backgroundColor: previousReadings.oldWater > 0 ? '#f0f9ff' : 'white'
                        }}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">
                        Chỉ số mới <span className="text-red-500">*</span>
                        </label>
                        <input
                        type="number"
                        value={usageForm.newWater}
                        onChange={(e) => handleUsageFormChange('newWater', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0"
                        required
                        min={usageForm.oldWater}
                        />
                        {usageForm.oldWater > 0 && usageForm.newWater > 0 && (
                        <div className="text-xs text-green-600 mt-1">
                            Tiêu thụ: {(usageForm.newWater - usageForm.oldWater).toLocaleString()} m³
                        </div>
                        )}
                    </div>
                    </div>
                </div>
                </div>

                <div>
                <h4 className="text-sm font-medium text-gray-800 mb-3">Dịch Vụ Bổ Sung</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={usageForm.includeWifi}
                        onChange={(e) => handleUsageFormChange('includeWifi', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex items-center">
                        <Wifi size={16} className="mr-1 text-purple-500" />
                        <span className="text-sm">Wi-Fi ({formatCurrency(utilityConfig.wifiFee)})</span>
                    </div>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={usageForm.includeGarbage}
                        onChange={(e) => handleUsageFormChange('includeGarbage', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex items-center">
                        <Trash2 size={16} className="mr-1 text-green-500" />
                        <span className="text-sm">Rác ({formatCurrency(utilityConfig.garbageFee)})</span>
                    </div>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={usageForm.includeParking}
                        onChange={(e) => handleUsageFormChange('includeParking', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex items-center">
                        <Car size={16} className="mr-1 text-gray-500" />
                        <span className="text-sm">Gửi xe ({formatCurrency(utilityConfig.parkingFee)})</span>
                    </div>
                    </label>
                </div>
                </div>

                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ghi chú
                </label>
                <textarea
                    value={usageForm.notes}
                    onChange={(e) => handleUsageFormChange('notes', e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ghi chú thêm về chỉ số này..."
                />
                </div>
            </div>

            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
                <button
                onClick={() => {
                    setShowCreateForm(false);
                    resetUsageForm();
                    setPreviousReadings({ oldElectricity: 0, oldWater: 0 });
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                Hủy
                </button>
                <button
                onClick={handleUsageCreate}
                disabled={!usageForm.roomId || !usageForm.month || isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                {isLoading ? 'Đang tạo...' : 'Tạo Chỉ Số'}
                </button>
            </div>
            </div>
        </div>
        )}

          {/* Edit Usage Modal */}
          {showEditForm && editingUsage && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    Chỉnh Sửa Chỉ Số Tiện Ích
                  </h3>
                  <button
                    onClick={() => {
                      setShowEditForm(false);
                      setEditingUsage(null);
                      resetUsageForm();
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phòng
                      </label>
                      <select
                        value={usageForm.roomId}
                        onChange={(e) => handleUsageFormChange('roomId', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled
                      >
                        {rooms.map((room) => (
                          <option key={room.id} value={room.id}>
                            {room.roomNumber} - {room.roomType}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tháng
                      </label>
                      <input
                        type="month"
                        value={usageForm.month}
                        onChange={(e) => handleUsageFormChange('month', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-gray-800 flex items-center">
                        <Zap size={16} className="mr-2 text-yellow-500" />
                        Chỉ Số Điện
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Chỉ số cũ</label>
                          <input
                            type="number"
                            value={usageForm.oldElectricity}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                            disabled
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Chỉ số mới <span className="text-red-500">*</span></label>
                          <input
                            type="number"
                            value={usageForm.newElectricity}
                            onChange={(e) => handleUsageFormChange('newElectricity', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="0"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-gray-800 flex items-center">
                        <Droplet size={16} className="mr-2 text-blue-500" />
                        Chỉ Số Nước
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Chỉ số cũ</label>
                          <input
                            type="number"
                            value={usageForm.oldWater}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                            disabled
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Chỉ số mới <span className="text-red-500">*</span></label>
                          <input
                            type="number"
                            value={usageForm.newWater}
                            onChange={(e) => handleUsageFormChange('newWater', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="0"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-800 mb-3">Dịch Vụ Bổ Sung</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={usageForm.includeWifi}
                          onChange={(e) => handleUsageFormChange('includeWifi', e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex items-center">
                          <Wifi size={16} className="mr-1 text-purple-500" />
                          <span className="text-sm">Wi-Fi ({formatCurrency(utilityConfig.wifiFee)})</span>
                        </div>
                      </label>

                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={usageForm.includeGarbage}
                          onChange={(e) => handleUsageFormChange('includeGarbage', e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex items-center">
                          <Trash2 size={16} className="mr-1 text-green-500" />
                          <span className="text-sm">Rác ({formatCurrency(utilityConfig.garbageFee)})</span>
                        </div>
                      </label>

                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={usageForm.includeParking}
                          onChange={(e) => handleUsageFormChange('includeParking', e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex items-center">
                          <Car size={16} className="mr-1 text-gray-500" />
                          <span className="text-sm">Gửi xe ({formatCurrency(utilityConfig.parkingFee)})</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ghi chú
                    </label>
                    <textarea
                      value={usageForm.notes}
                      onChange={(e) => handleUsageFormChange('notes', e.target.value)}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ghi chú thêm về chỉ số này..."
                    />
                  </div>

                  {/* Usage Calculation Preview */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="text-sm font-medium text-gray-800 mb-3">Tính Toán Chi Phí</h5>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">Điện sử dụng</div>
                        <div className="font-medium">{usageForm.newElectricity - usageForm.oldElectricity} kWh</div>
                        <div className="text-xs text-gray-500">{formatCurrency((usageForm.newElectricity - usageForm.oldElectricity) * utilityConfig.electricityPricePerUnit)}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Nước sử dụng</div>
                        <div className="font-medium">{usageForm.newWater - usageForm.oldWater} m³</div>
                        <div className="text-xs text-gray-500">{formatCurrency((usageForm.newWater - usageForm.oldWater) * utilityConfig.waterPricePerUnit)}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Dịch vụ khác</div>
                        <div className="font-medium">
                          {formatCurrency(
                            (usageForm.includeWifi ? utilityConfig.wifiFee : 0) +
                            (usageForm.includeGarbage ? utilityConfig.garbageFee : 0) +
                            (usageForm.includeParking ? utilityConfig.parkingFee : 0)
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600">Tổng cộng</div>
                        <div className="font-bold text-lg text-blue-600">
                          {formatCurrency(
                            (usageForm.newElectricity - usageForm.oldElectricity) * utilityConfig.electricityPricePerUnit +
                            (usageForm.newWater - usageForm.oldWater) * utilityConfig.waterPricePerUnit +
                            (usageForm.includeWifi ? utilityConfig.wifiFee : 0) +
                            (usageForm.includeGarbage ? utilityConfig.garbageFee : 0) +
                            (usageForm.includeParking ? utilityConfig.parkingFee : 0)
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setShowEditForm(false);
                      setEditingUsage(null);
                      resetUsageForm();
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleUsageUpdate}
                    disabled={!usageForm.roomId || !usageForm.month || isLoading}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Đang cập nhật...' : 'Cập Nhật'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};