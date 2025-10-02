import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import React, { useState } from "react";
import { CgProfile } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import Toast from "../../Component/Toast";
import axios from "axios";

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [userName, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [toast, setToast] = useState(null);
  const [roleName, setRoleName] = useState("RENTER");
  const navigate = useNavigate();
  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const isPasswordValid = () => {
    if (password !== confirmPassword) {
      showToast("Mật khẩu không khớp. Vui lòng kiểm tra lại!", "error");
      return false;
    }
    if (password.length < 6) {
      showToast("Mật khẩu phải có ít nhất 6 ký tự!", "error");
      return false;
    }
    return true;
  };

  const data = {
    userName,
    email,
    password,
    firstName,
    lastName,
    roleName
  };
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!isPasswordValid()) return;
    if (!userName || !email || !password || !firstName || !lastName) {
      showToast("Vui lòng nhập tất cả thông tin", "error");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/users/registration",
        data
      );
      if (response.data.code !== 1000) {
        throw new Error(response.data?.message || "Đăng ký thất bại");
      }
      showToast("Đăng ký thành công", "success");
      navigate("/login");
    } catch (error) {
      console.error(error);
      const errorMessage =
        error.response?.data?.message || error.message || "Đăng ký thất bại";
      showToast(errorMessage, "error");
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center px-4">
      <div className="bg-white max-w-md w-full p-8 rounded-xl shadow-2xl transform transition-all hover:scale-105 duration-300">
        {/* Header with improved styling */}
        <div className="text-center mb-8">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="bg-blue-500 w-12 h-12 rounded-full flex items-center justify-center overflow-hidden">
              <img
                src="../logo.webp"
                alt=""
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Chào mừng👋</h2>
          <p className="text-gray-500">Đăng ký để tiếp tục</p>
        </div>
        <div className="group">
          <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
            Tên đăng nhập
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CgProfile className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="name"
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
        <div className="group">
          <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
        {/* Password */}
        <div className="group">
          <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
            Mật khẩu
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
        </div>
        <div className="group">
          <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
            Nhập lại mật khẩu
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
        </div>

        <div className="group">
          <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
            Tên
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CgProfile className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="tên"
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
        <div className="group">
          <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
            Họ
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CgProfile className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="họ"
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <div className="group">
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              Vai trò
            </label>
            <select
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              className="w-full pl-3 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="TENANT">Người thuê</option>
              <option value="OWNER">Người cho thuê</option>
            </select>
          </div>
        </div>

        {/* Login Button */}
        <button
          className="mt-2 w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:translate-y-px shadow-md hover:shadow-lg"
          onClick={handleRegister}
        >
          Đăng ký
        </button>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="px-4 text-gray-500 text-sm">hoặc</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        {/* Social Logins */}
        <div className="grid grid-cols-2 gap-3">
          <button className="py-2.5 px-4 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium flex items-center justify-center hover:bg-gray-50 transition-all">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="#4285F4"
            >
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span className="ml-2">Google</span>
          </button>
          <button className="py-2.5 px-4 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium flex items-center justify-center hover:bg-gray-50 transition-all">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="#1877F2"
            >
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span className="ml-2">Facebook</span>
          </button>
        </div>

        {/* Register link */}
        <div className="text-center text-sm mt-6 text-gray-600">
          Đã có tài khoản?{" "}
          <a
            href="/login"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Đăng nhập ngay
          </a>
        </div>
      </div>

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

export default RegisterPage;
