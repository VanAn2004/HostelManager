import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import axios from 'axios';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleSubmit =async (e) => {
    e.preventDefault();
    // Validate email
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setMessage('Vui lòng nhập một địa chỉ email hợp lệ');
      setMessageType('error');
      return;
    }
    setIsSubmitting(true);
    setMessage('');
    const response = await axios.post('http://localhost:8080/api/v1/auth/forgot-password', {
      email,
    });
    if(response.data.code !== 1000) {
      setMessage(response.data.message || 'Đã xảy ra lỗi');
      setMessageType('error');
    }
      setMessage(response.data?.result);
      setMessageType('success');
    setEmail('');
    setIsSubmitting(false);
 
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-8 transform transition-all">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-6 bg-blue-100 w-16 h-16 flex items-center justify-center rounded-full">
            <Mail className="text-blue-600" size={28} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Quên mật khẩu?</h1>
          <p className="text-gray-600">
            Nhập địa chỉ email của bạn và chúng tôi sẽ gửi hướng dẫn để đặt lại mật khẩu
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 ml-1">
              Địa chỉ Email
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          {/* Status message */}
          {message && (
            <div 
              className={`p-3 rounded-md text-sm ${
                messageType === 'success' 
                  ? 'bg-green-100 text-green-700 border border-green-300' 
                  : 'bg-red-100 text-red-700 border border-red-300'
              }`}
            >
              {message}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all ${
              isSubmitting 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang gửi...
              </span>
            ) : (
              'Gửi hướng dẫn đặt lại'
            )}
          </button>
        </form>

        {/* Back to login link */}
        <div className="text-center mt-6">
          <a 
            href="/login" 
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            Quay lại đăng nhập
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;