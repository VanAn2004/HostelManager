import React from 'react';
import { Heart, Play } from 'lucide-react';

// Sample data for additional rental properties
const additionalProperties = [
  {
    id: 1,
    title: 'Nhà trọ số 85/109A Đường Huỳnh Tấn Phát',
    price: '3.5 triệu/tháng',
    size: '25m²',
    type: 'Nhà trọ, phòng trọ',
    location: 'Quận 7, Thành phố Hồ Chí Minh',
    hasReview: false,
    image: '/api/placeholder/400/250'
  },
  {
    id: 2,
    title: 'Nhà trọ số 25/6 Phạm Mạn, Phường 5',
    price: '4.2 triệu/tháng',
    size: '32m²',
    type: 'Nhà trọ, phòng trọ',
    location: 'Quận 3, Thành phố Hồ Chí Minh',
    hasReview: true,
    image: '/api/placeholder/400/250'
  },
  {
    id: 3,
    title: 'Nhà Trọ 24/13 Nguyễn Thái Bình',
    price: '3.5 triệu/tháng',
    size: '22m²',
    type: 'Nhà trọ, phòng trọ',
    location: 'Quận 1, Thành phố Hồ Chí Minh',
    hasReview: false,
    image: '/api/placeholder/400/250'
  },
  {
    id: 4,
    title: 'Nhà trọ 116/63/58 Tô Hiến Thành',
    price: '3.8 triệu/tháng',
    size: '28m²',
    type: 'Nhà trọ, phòng trọ',
    location: 'Quận 10, Thành phố Hồ Chí Minh',
    hasReview: false,
    image: '/api/placeholder/400/250'
  },
  {
    id: 5,
    title: 'Ký túc xá 74 Đường số 6, Linh Xuân',
    price: '1.8 triệu/tháng',
    size: '15m²',
    type: 'Nhà trọ, phòng trọ',
    location: 'Thủ Đức, Thành phố Hồ Chí Minh',
    hasReview: true,
    image: '/api/placeholder/400/250'
  }
];

// Additional Listings Section Component
const AdditionalListingsSection = () => {
  return (
    <section className="py-8 container mx-auto px-4">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">PHÒNG TRỌ MỚI ĐĂNG</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {additionalProperties.map((property) => (
          <div key={property.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative">
              <img src={property.image} alt={property.title} className="w-full h-48 object-cover" />
              
              <div className="absolute top-2 left-2">
                <span className="bg-red-600 text-white text-xs font-bold py-1 px-2 rounded">HOT</span>
              </div>
              
              {property.hasReview && (
                <div className="absolute bottom-2 left-2">
                  <span className="bg-blue-500 text-white text-xs flex items-center py-1 px-2 rounded">
                    <Play size={14} className="mr-1" /> Review
                  </span>
                </div>
              )}
              
              <button className="absolute top-2 right-2 bg-white bg-opacity-80 p-1 rounded-full">
                <Heart size={20} className="text-gray-500" />
              </button>
            </div>
            
            <div className="p-3">
              <h3 className="font-medium text-gray-800 mb-2 truncate">{property.title}</h3>
              
              <div className="flex justify-between items-center mb-2">
                <span className="text-orange-500 font-bold">{property.price}</span>
                <span className="text-gray-600 text-sm">{property.size}</span>
              </div>
              
              <div className="text-sm text-gray-600 mb-2">{property.type}</div>
              
              <div className="text-xs text-gray-500 flex items-center">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                {property.location}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Show more button */}
      <div className="flex justify-center mt-6">
        <button className="bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium px-6 py-2 rounded">
          Xem thêm
        </button>
      </div>
    </section>
  );
};

export default AdditionalListingsSection;