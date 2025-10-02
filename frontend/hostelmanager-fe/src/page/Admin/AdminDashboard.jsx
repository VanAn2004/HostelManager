import { useEffect, useState } from "react";
import {
  Search,
  Home,
  Users,
 
  Bell,
  Menu,
  X,
  ChevronDown,

  CreditCard,
  Key,
  Droplet,
  Zap,
  Wifi,

  Check,
  Clock,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
import UtilityCard from "../../Component/AdminDarshBoardComponent/UltilityCard";
import StatCard from "../../Component/AdminDarshBoardComponent/StartCard";
import NavItem from "../../Component/AdminDarshBoardComponent/NavItem";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Component/Navbar";


export default function RentalRoomManagement() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentUser, setCurrentUser] = useState({});
  const token = localStorage.getItem("token");
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState([]);
  const cleanToken = token.replace(/"/g, "");
    // Tính tổng từ dữ liệu API
  const calculateTotals = (invoice) => {
    return invoice.reduce((totals, bill) => {
      return {
        electricity: totals.electricity + bill.electricityAmount,
        water: totals.water + bill.waterAmount,
        service: totals.service + bill.serviceAmount
      };
    }, { electricity: 0, water: 0, service: 0 });
  };

  const totals = calculateTotals(invoice);

  // Format số tiền VND
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount * 1000); // Nhân 1000 vì dữ liệu có vẻ là đơn vị nghìn đồng
  };
  useEffect(() => {
    if (!cleanToken) {
      navigate("/login");
    }
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
    const fetchRooms = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/v1/room/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cleanToken}`,
          },
        });
        const data = await response.json();
        if (data.code !== 1000) {
          throw new Error(response.message);
        }
        setRooms(data.result);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };
    const fetchInvoice = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/v1/admin/rooms/invoice",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${cleanToken}`,
            },
          }
        );
        const data = await response.json();
        if (data.code !== 1000) {
          throw new Error(response.message);
        }
        setInvoice(data?.result);
        console.log("invoice data", data.result);
      } catch (error) {
        console.error("Error fetching invoice:", error);
      }
    };

    fetchUser();
    fetchRooms();
    fetchInvoice();
  }, [token]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-gradient-to-b from-blue-800 to-blue-600 text-white transition-all duration-300 ease-in-out relative`}
      >
        <div className="flex items-center justify-between p-5 border-b border-blue-700/50">
          {sidebarOpen ? (
            <div className="flex items-center space-x-2">
              <div className="bg-white p-1 rounded">
                <Home className="text-blue-800 h-6 w-6" />
              </div>
              <h1
                className="text-xl font-bold tracking-tight cursor-pointer"
                onClick={(e) => navigate("/home")}
              >
                TRỌ MỚI
              </h1>
            </div>
          ) : (
            <div className="mx-auto bg-white p-1 rounded">
              <Home className="text-blue-800 h-6 w-6 cursor-pointer" />
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded-md bg-blue-700/40 hover:bg-blue-700/60"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <div className="mt-6 px-4">
          {sidebarOpen && (
            <div className="mb-4 pb-4">
              <p className="px-3 text-xs font-medium uppercase tracking-wider text-blue-200 mb-3">
                Quản Lý
              </p>
            </div>
          )}

          <nav className="space-y-1">
            <NavItem
              icon={<Home size={18} />}
              label="Tổng Quan"
              active
              sidebarOpen={sidebarOpen}
            />
            <NavItem
              icon={<Key size={18} onClick={() => navigate("/admin/rooms")} />}
              label="Phòng Trọ"
              sidebarOpen={sidebarOpen}
            />
            <NavItem
              icon={
                <Users size={18} onClick={() => navigate("/admin/users")} />
              }
              label="Người Thuê"
              sidebarOpen={sidebarOpen}
            />
          </nav>
        </div>
        
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
      <Navbar currentUser={currentUser} />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="mb-8">
            <div className="flex flex-wrap items-center justify-between mb-2">
              <h1 className="text-2xl font-bold text-gray-800">
                Tổng Quan Phòng Trọ
              </h1>
              <div className="flex space-x-3"></div>
            </div>
            <p className="text-gray-600">
              Xin chào, {currentUser.firstName} {currentUser.lastName} Đây là
              tổng quan về các phòng trọ của bạn hôm nay.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={<Key className="text-blue-500" />}
              label="Tổng Số Phòng"
              value={rooms?.length}
              bgColor="bg-blue-50"
              iconBg="bg-blue-100"
            />
            <StatCard
              icon={<Check className="text-green-500" />}
              label="Phòng Đã Thuê"
              value={rooms?.filter((room) => room.status === "OCCUPIED").length}
              bgColor="bg-green-50"
              iconBg="bg-green-100"
            />
            <StatCard
              icon={<Clock className="text-orange-500" />}
              label="Phòng Trống"
              value={
                rooms?.filter((room) => room.status === "AVAILABLE").length
              }
              bgColor="bg-orange-50"
              iconBg="bg-orange-100"
            />
            <StatCard
              icon={<CreditCard className="text-purple-500" />}
              label="Chờ duyệt"
              value={rooms?.filter((room) => room.status === "PENDING").length}
              positive={true}
              bgColor="bg-purple-50"
              iconBg="bg-purple-100"
            />
          </div>

          {/* Utility Bills Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium text-gray-800">
                  Hóa Đơn Dịch Vụ Tháng Này
                </h3>
                <p className="text-sm text-gray-500">Tháng 4/2025</p>
              </div>
              <button className="px-3 py-1 text-xs bg-gray-100 border border-gray-200 rounded-md text-gray-600 hover:bg-gray-200">
                Xem Tất Cả
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <UtilityCard
                  icon={<Droplet className="text-blue-500" />}
                  title="Nước"
                  amount={formatCurrency(totals.water)}
                  color="blue"
                />
                <UtilityCard
                  icon={<Zap className="text-yellow-500" />}
                  title="Điện"
                  amount={formatCurrency(totals.electricity)}

                  color="yellow"
              
                />
                <UtilityCard
                  icon={<Wifi className="text-purple-500" />}
                  title="Service"
                  amount={formatCurrency(totals.service)}
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
                  Quản lý tất cả các phòng trọ
                </p>
              </div>
              <div className="flex space-x-2">
                <div className="relative">
                  <select className="appearance-none bg-gray-100 border border-gray-200 text-gray-700 py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 text-sm">
                    <option>Tất Cả Phòng</option>
                    <option>Phòng Đã Thuê</option>
                    <option>Phòng Trống</option>
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
                      Hạn Thanh Toán
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao Tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {rooms.map((room, i) => (
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
                            <div className="text-xs text-gray-500"></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {room.tenant ? (
                          <div className="flex items-center">
                            <img
                              className="h-8 w-8 rounded-full object-cover border border-gray-200"
                              src={`/api/placeholder/${32}/${32}`}
                              alt=""
                            />
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {room.tenant}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            room.status === "Đã Thuê"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {room.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {room.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {room.paymentStatus === "Đã Thanh Toán" ? (
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {room.paymentStatus}
                            </span>
                          ) : room.paymentStatus === "Chưa Thanh Toán" ? (
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              {room.paymentStatus}
                            </span>
                          ) : room.paymentStatus === "Trễ Hạn" ? (
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              {room.paymentStatus}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-500">
                              {room.dueDate}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button className="p-1 text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-md">
                            <Eye size={16} />
                          </button>
                          <button className="p-1 text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 rounded-md">
                            <Edit size={16} />
                          </button>
                          {room.status === "Trống" && (
                            <button className="p-1 text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 rounded-md">
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Hiển thị 1 đến {rooms.length} trong tổng số {rooms.length}{" "}
                  phòng
                </div>
                <div className="flex space-x-1">
                  <button className="px-3 py-1 rounded bg-white border border-gray-300 text-sm font-medium text-gray-500">
                    Trước
                  </button>
                  <button className="px-3 py-1 rounded bg-blue-600 border border-blue-600 text-sm font-medium text-white">
                    1
                  </button>
                  <button className="px-3 py-1 rounded bg-white border border-gray-300 text-sm font-medium text-gray-500">
                    2
                  </button>
                  <button className="px-3 py-1 rounded bg-white border border-gray-300 text-sm font-medium text-gray-500">
                    3
                  </button>
                  <button className="px-3 py-1 rounded bg-white border border-gray-300 text-sm font-medium text-gray-500">
                    Sau
                  </button>
                </div>
              </div>
            </div>
        
         
          </div>
        </main>
      </div>
    </div>
  );
}
