import React from 'react';

export default function AboutUsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <a href="/" className="flex items-center text-blue-600 font-bold">
            <span className="text-2xl mr-2">🏠</span>
            <span className="text-xl">TRO MỚI</span>
          </a>
          
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="text-gray-700 hover:text-blue-600">Nhà trọ, phòng trọ</a>
            <a href="#" className="text-gray-700 hover:text-blue-600">Trang chủ</a>
            <a href="/lien-he" className="text-gray-700 hover:text-blue-600">Liên hệ</a>
            <a href="/ve-chung-toi" className="text-gray-700 hover:text-blue-600">Về chúng tôi</a>
          </nav>
          
          <div className="flex space-x-2">
            <a href="#" className="px-4 py-2 text-sm border border-blue-600 text-blue-600 rounded">Đăng nhập</a>
            <a href="#" className="px-4 py-2 text-sm bg-blue-600 text-white rounded">Đăng ký</a>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <div className="bg-blue-800 text-white py-16 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">VỀ CHÚNG TÔI</h1>
          <p className="text-lg">Trang thông tin uy tín hàng đầu về cho thuê phòng trọ tại Việt Nam</p>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          {/* Introduction Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-blue-800 mb-4 border-l-4 border-orange-500 pl-3">Giới Thiệu</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              TRO MỚI là nền tảng kết nối người thuê trọ và chủ nhà trọ hàng đầu Việt Nam, ra đời với sứ mệnh giải quyết bài toán tìm kiếm chỗ ở cho hàng triệu người Việt Nam, đặc biệt là sinh viên và người lao động.
            </p>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Với hơn 500 tin đăng mới mỗi ngày và 30.000 lượt xem, chúng tôi tự hào là cầu nối tin cậy giúp người dùng tìm được chỗ ở phù hợp với nhu cầu và điều kiện tài chính của mình một cách nhanh chóng và thuận tiện nhất.
            </p>
          </div>
          
          {/* Stats Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-blue-800 mb-6 border-l-4 border-orange-500 pl-3">Con Số Ấn Tượng</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-50 p-6 rounded text-center">
                <div className="text-4xl font-bold text-orange-500 mb-2">500+</div>
                <div className="text-gray-700">Tin đăng mới mỗi ngày</div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded text-center">
                <div className="text-4xl font-bold text-orange-500 mb-2">30K+</div>
                <div className="text-gray-700">Lượt xem mỗi ngày</div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded text-center">
                <div className="text-4xl font-bold text-orange-500 mb-2">10K+</div>
                <div className="text-gray-700">Chủ trọ tin tưởng</div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded text-center">
                <div className="text-4xl font-bold text-orange-500 mb-2">63</div>
                <div className="text-gray-700">Tỉnh thành phủ sóng</div>
              </div>
            </div>
          </div>
          
          {/* Mission & Vision Section */}
          <div className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold text-blue-800 mb-4 border-l-4 border-orange-500 pl-3">Sứ Mệnh</h2>
                <p className="text-gray-700 leading-relaxed">
                  Sứ mệnh của TRO MỚI là tạo ra một nền tảng kết nối đơn giản, minh bạch và hiệu quả giữa người thuê trọ và chủ nhà. Chúng tôi cam kết mang đến trải nghiệm tìm kiếm chỗ ở thuận tiện, nhanh chóng với thông tin chính xác và đầy đủ.
                </p>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-blue-800 mb-4 border-l-4 border-orange-500 pl-3">Tầm Nhìn</h2>
                <p className="text-gray-700 leading-relaxed">
                  TRO MỚI phấn đấu trở thành nền tảng số 1 Việt Nam về kết nối nhu cầu nhà trọ, phòng trọ, góp phần xây dựng một cộng đồng nhà trọ văn minh, hiện đại và thân thiện với người dùng trên khắp cả nước.
                </p>
              </div>
            </div>
          </div>
          
          {/* Team Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-blue-800 mb-6 border-l-4 border-orange-500 pl-3">Đội Ngũ Của Chúng Tôi</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <img 
                  src="/api/placeholder/150/150" 
                  alt="Người sáng lập" 
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="font-bold text-lg">Nguyễn Văn A</h3>
                <p className="text-gray-600">Đồng sáng lập & CEO</p>
              </div>
              
              <div className="text-center">
                <img 
                  src="/api/placeholder/150/150" 
                  alt="Giám đốc kỹ thuật" 
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="font-bold text-lg">Trần Thị B</h3>
                <p className="text-gray-600">Giám đốc công nghệ</p>
              </div>
              
              <div className="text-center">
                <img 
                  src="/api/placeholder/150/150" 
                  alt="Giám đốc marketing" 
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="font-bold text-lg">Lê Văn C</h3>
                <p className="text-gray-600">Giám đốc marketing</p>
              </div>
              
              <div className="text-center">
                <img 
                  src="/api/placeholder/150/150" 
                  alt="Trưởng phòng kinh doanh" 
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="font-bold text-lg">Phạm Thị D</h3>
                <p className="text-gray-600">Trưởng phòng kinh doanh</p>
              </div>
            </div>
          </div>
          
          {/* Values Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-blue-800 mb-6 border-l-4 border-orange-500 pl-3">Giá Trị Cốt Lõi</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-6 rounded">
                <h3 className="font-bold text-lg mb-2 text-blue-700">Uy Tín - Minh Bạch</h3>
                <p className="text-gray-700">
                  Chúng tôi cam kết mang đến thông tin chính xác, đầy đủ về các phòng trọ, giúp người dùng có cái nhìn thực tế nhất trước khi quyết định.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded">
                <h3 className="font-bold text-lg mb-2 text-blue-700">Nhanh Chóng - Tiện Lợi</h3>
                <p className="text-gray-700">
                  Nền tảng được thiết kế tối ưu giúp việc tìm kiếm, đăng tin trở nên đơn giản, tiết kiệm thời gian cho cả người thuê và chủ trọ.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded">
                <h3 className="font-bold text-lg mb-2 text-blue-700">Đa Dạng - Phù Hợp</h3>
                <p className="text-gray-700">
                  TRO MỚI cung cấp nhiều lựa chọn đa dạng về phòng trọ, nhà nguyên căn, căn hộ với nhiều mức giá, đáp ứng mọi nhu cầu của người dùng.
                </p>
              </div>
            </div>
          </div>
          
          {/* Partners Section */}
          <div>
            <h2 className="text-2xl font-bold text-blue-800 mb-6 border-l-4 border-orange-500 pl-3">Đối Tác Của Chúng Tôi</h2>
            <div className="flex flex-wrap justify-center gap-8">
              <img src="/api/placeholder/120/60" alt="Đối tác 1" className="h-16 object-contain" />
              <img src="/api/placeholder/120/60" alt="Đối tác 2" className="h-16 object-contain" />
              <img src="/api/placeholder/120/60" alt="Đối tác 3" className="h-16 object-contain" />
              <img src="/api/placeholder/120/60" alt="Đối tác 4" className="h-16 object-contain" />
              <img src="/api/placeholder/120/60" alt="Đối tác 5" className="h-16 object-contain" />
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