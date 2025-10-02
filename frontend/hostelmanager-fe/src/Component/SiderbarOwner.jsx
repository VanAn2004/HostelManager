import React from 'react'
import NavItem from './OwnerDashBoardComponent/NavItem';
import { Home, Key, Menu, Users, X, FileText ,Zap,CreditCard,Settings,LogOut} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ 
  sidebarOpen, 
  setSidebarOpen, 
  currentUser, 
  activeItem = "dashboard"
}) => {
  const navigate = useNavigate();
  const navigationItems = [
    {
      id: "dashboard",
      icon: <Home size={18} />,
      label: "Tổng Quan",
      path: "/owner/dashboard"
    },
    {
      id: "rooms",
      icon: <Key size={18} />,
      label: "Phòng Trọ", 
      path: "/owner/rooms"
    },
    {
      id: "tenants",
      icon: <Users size={18} />,
      label: "Người Thuê",
      path: "/owner/tenants"
    },
    {
      id: "contracts",
      icon: <FileText size={18} />,
      label: "Hợp Đồng",
      path: "/owner/contracts"
    },
    {
      id: "utilities",
      icon: <Zap size={18} />,
      label: "Tiện Ích",
      path: "/owner/utilities"
    },
    {
      id: "invoices",
      icon: <CreditCard size={18} />,
      label: "Hoá Đơn",
      path: "/owner/invoices"
    },
    // {
    //   id: "settings",
    //   icon: <Settings size={18} />,
    //   label: "Cài Đặt",
    //   path: "/owner/settings"
    // },
    {
    id: "logout",
    icon: <LogOut size={18} />,
    label: "Đăng Xuất",
    action: "logout"
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
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
                onClick={() => navigate("/home")}
                >
                TRỌ MỚI
                </h1>
            </div>
            ) : (
            <div className="mx-auto bg-white p-1 rounded">
                <Home 
                    className="text-blue-800 h-6 w-6 cursor-pointer" 
                    onClick={() => navigate("/home")} />
            </div>
            )}
            <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded-md bg-blue-700/40 hover:bg-blue-700/60 transition-colors"
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
                {navigationItems.map((item) => (
                    <div
                        key={item.id}
                        onClick={() => handleNavigation(item.path)}
                        className="cursor-pointer"
                    >
                    <NavItem
                    icon={item.icon}
                    label={item.label}
                    sidebarOpen={sidebarOpen}
                    active={activeItem === item.id}
                    onClick={() => {
                    if (item.action === "logout") {
                        handleLogout();
                    } else {
                        handleNavigation(item.path);
                    }
                    }}
                    />
                    </div>
                ))}
            </nav>
        </div>
    </div>
  );
};

export default Sidebar