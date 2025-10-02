import axios from 'axios';
import { Mail } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Toast from '../../Component/Toast';

const ResetPasswordPage = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [resetSuccess, setResetSuccess] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
     const [toast, setToast] = useState(null);
      const showToast = (message, type = "success") => {
        setToast({ message, type });
      };
    // Lấy token từ query string
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    useEffect(() => {
        if (!token) {
            setError('Token không hợp lệ');
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate passwords match
        if (password !== confirmPassword) {
            setError('Mật khẩu không khớp');
            return;
        }
        const response = await axios.post(`http://localhost:8080/api/v1/auth/reset-password/${token}`, password,{
            headers: {
                'Content-Type': 'application/json',
            },        
        });
        if (response.data.code !== 1000) {
            setError(response.data.message || 'Đặt lại mật khẩu thất bại');
            return;
        }
        // Reset password thành công

        showToast('mật khẩu đã được đặt lại thành công', 'success');
        
        setError('');
        setResetSuccess(true);
        setTimeout(() => {
                
            navigate('/login');
          }, 2000); // Đợi 2 giây để hiển thị thông báo thành công trước khi chuyển hướng
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
                <div className="flex justify-center mb-6">
                    <div className="bg-blue-100 p-4 rounded-full">
                        <Mail className="text-blue-500 w-8 h-8" />
                    </div>
                </div>
                
                <h1 className="text-2xl font-bold text-center mb-2">Đặt lại mật khẩu</h1>
                <p className="text-gray-600 text-center mb-6">
                    Nhập mật khẩu mới của bạn để tiếp tục
                </p>
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Mật khẩu mới</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nhập mật khẩu mới"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Xác nhận mật khẩu</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nhập lại mật khẩu mới"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>
                    
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded">
                            {error}
                        </div>
                    )}
                    
                    {resetSuccess && (
                        <div className="mb-4 p-3 bg-green-100 border border-green-200 text-green-700 rounded">
                            Mật khẩu của bạn đã được đặt lại thành công.
                        </div>
                    )}
                    
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded mb-4"
                    >
                        Đặt lại mật khẩu
                    </button>
                </form>
                
                <div className="text-center">
                    <a href="/login" className="text-blue-600 hover:underline">
                        Quay lại đăng nhập
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
}

export default ResetPasswordPage;