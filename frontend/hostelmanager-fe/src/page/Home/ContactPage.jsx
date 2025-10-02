import React from 'react';

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 font-sans">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <a href="/" className="flex items-center text-blue-600 font-bold">
            <span className="text-2xl mr-2">🏠</span>
            <span className="text-xl">TRO MỚI</span>
          </a>
          
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="text-gray-700 hover:text-blue-600">Nhà trọ, phòng trọ</a>
            <a href="/home" className="text-gray-700 hover:text-blue-600">Trang chủ</a>
            <a href="/contact" className="text-gray-700 hover:text-blue-600">Liên hệ</a>
            <a href="/about" className="text-gray-700 hover:text-blue-600">Về chúng tôi</a>
          </nav>
          
          <div className="flex space-x-2">
            <a href="/login" className="px-4 py-2 text-sm border border-blue-600 text-blue-600 rounded font-medium">Đăng nhập</a>
            <a href="/register" className="px-4 py-2 text-sm bg-blue-600 text-white rounded font-medium">Đăng ký</a>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <div className="bg-blue-800 text-white py-16 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4 uppercase tracking-wide">LIÊN HỆ VỚI CHÚNG TÔI</h1>
          <p className="text-lg">Hãy liên hệ ngay để được hỗ trợ tìm kiếm phòng trọ nhanh chóng, hiệu quả</p>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          {/* Contact Info Section */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-blue-800 mb-6">Thông Tin Liên Hệ</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded">
                <div className="flex items-start">
                  <span className="text-xl mr-3">📍</span>
                  <div>
                    <strong className="block mb-1">Địa Chỉ:</strong>
                    <span>Hutech, Khu E, Thủ Đức, Thành phố Hồ Chí Minh</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded">
                <div className="flex items-start">
                  <span className="text-xl mr-3">📞</span>
                  <div>
                    <strong className="block mb-1">Điện Thoại:</strong>
                    <span>0978275054</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded">
                <div className="flex items-start">
                  <span className="text-xl mr-3">✉️</span>
                  <div>
                    <strong className="block mb-1">Email:</strong>
                    <span>phamvansy204@gmail.com</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded">
                <div className="flex items-start">
                  <span className="text-xl mr-3">⏰</span>
                  <div>
                    <strong className="block mb-1">Giờ Làm Việc:</strong>
                    <span>8:00 - 17:30, Thứ 2 - Thứ 6</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Form Section */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-blue-800 mb-6">Gửi Thông Tin Liên Hệ</h2>
            <form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="name">
                    Họ và Tên
                  </label>
                  <input 
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="text" 
                    id="name" 
                    placeholder="Nhập họ và tên của bạn"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="email">
                    Email
                  </label>
                  <input 
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="email" 
                    id="email" 
                    placeholder="Nhập địa chỉ email của bạn"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="phone">
                  Số Điện Thoại
                </label>
                <input 
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="tel" 
                  id="phone" 
                  placeholder="Nhập số điện thoại của bạn"
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="message">
                  Nội Dung
                </label>
                <textarea 
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                  id="message" 
                  placeholder="Nhập nội dung cần liên hệ"
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded"
              >
                Gửi Thông Tin
              </button>
            </form>
          </div>
          
          {/* Map Section */}
          <div>
            <h2 className="text-2xl font-bold text-blue-800 mb-6">Bản Đồ</h2>
            <div className="h-96 bg-gray-200 rounded">
              <img 
                src="/api/placeholder/1200/400" 
                alt="Bản đồ địa điểm" 
                className="w-full h-full object-cover rounded"
              />
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 text-center">
        <div className="container mx-auto px-4">
          <p>&copy; 2025 TRO MỚI - Hệ thống tìm kiếm phòng trọ hàng đầu Việt Nam</p>
        </div>
      </footer>
    </div>
  );
}