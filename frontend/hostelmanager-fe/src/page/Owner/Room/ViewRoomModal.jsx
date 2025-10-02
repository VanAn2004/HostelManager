import { useState } from "react";
import { X, User, Phone, Calendar, Mail, MapPin, Info, Check, AlertCircle, Building, DollarSign, Maximize, Home } from "lucide-react";

export default function ViewRoomModal({ onClose, room, tenant, isLoadingTenant = false }) {
  console.log("Room data:", room);
  console.log("Tenant data:", tenant);
  const [activeTab, setActiveTab] = useState("details");
  const [activeImageIndex, setActiveImageIndex] = useState(0);


  // Kiểm tra xem URL có phải là hình ảnh hay không
  const isImage = (url) => {
    const imageExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".bmp",
      ".webp",
      ".svg",
      ".jqg",
    ];
    const lowerUrl = url.toLowerCase();
    return imageExtensions.some((ext) => lowerUrl.endsWith(ext.toLowerCase()));
  };

  // Kiểm tra xem URL có phải là video hay không
  const isVideo = (url) => {
    const videoExtensions = [
      ".mp4",
      ".webm",
      ".ogg",
      ".mov",
      ".avi",
      ".wmv",
      ".mkv",
    ];
    const lowerUrl = url.toLowerCase();
    return videoExtensions.some((ext) => lowerUrl.endsWith(ext.toLowerCase()));
  };

  // Chuyển đổi trạng thái thành văn bản Tiếng Việt
  const getStatusText = (status) => {
    switch (status) {
      case "OCCUPIED":
        return "Đã Thuê";
      case "AVAILABLE":
        return "Còn Trống";
      case "MAINTENANCE":
        return "Đang Sửa Chữa";
      case "PENDING":
        return "Chờ Duyệt";
      default:
        return status;
    }
  };

  // Màu sắc cho trạng thái phòng
  const getStatusColor = (status) => {
    switch (status) {
      case "OCCUPIED":
        return "bg-green-100 text-green-800";
      case "AVAILABLE":
        return "bg-blue-100 text-blue-800";
      case "MAINTENANCE":
        return "bg-orange-100 text-orange-800";
      case "PENDING":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Chuyển đổi condition thành văn bản Tiếng Việt
  const getConditionText = (condition) => {
    switch (condition) {
      case "New":
        return "Mới";
      case "Good":
        return "Tốt";
      case "Average":
        return "Trung bình";
      case "Needs Renovation":
        return "Cần sửa chữa";
      default:
        return condition;
    }
  };

  // Chuyển đổi roomType thành văn bản Tiếng Việt
  const getRoomTypeText = (roomType) => {
    switch (roomType) {
      case "Standard":
        return "Tiêu chuẩn";
      case "Deluxe":
        return "Cao cấp";
      case "Studio":
        return "Studio";
      case "Shared":
        return "Ở ghép";
      case "Mini":
        return "Mini";
      default:
        return roomType;
    }
  };
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-4 border-b border-gray-200 flex justify-between items-center z-10 rounded-t-xl">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <Building className="mr-2 text-indigo-600" size={24} />
            Chi tiết phòng {room.roomNumber}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab("details")}
              className={`px-4 py-2 font-medium text-sm transition-colors ${
                activeTab === "details"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Thông tin phòng
            </button>
            {room.status === "OCCUPIED" && (
              <button
                onClick={() => setActiveTab("tenant")}
                className={`px-4 py-2 font-medium text-sm transition-colors ${
                  activeTab === "tenant"
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Người thuê
              </button>
            )}
            {room.mediaUrls && room.mediaUrls.length > 0 && (
              <button
                onClick={() => setActiveTab("media")}
                className={`px-4 py-2 font-medium text-sm transition-colors ${
                  activeTab === "media"
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Hình ảnh & Video
              </button>
            )}
          </div>

          {/* Thông tin phòng */}
          {activeTab === "details" && (
            <div className="space-y-6">
              {/* Thông tin cơ bản */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-800">Thông tin cơ bản</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      room.status
                    )}`}
                  >
                    {getStatusText(room.status)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <div className="p-2 rounded-md bg-indigo-100 mr-3">
                      <Home size={18} className="text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Loại phòng</p>
                      <p className="font-medium">{getRoomTypeText(room.roomType) || "Tiêu chuẩn"}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="p-2 rounded-md bg-indigo-100 mr-3">
                      <Maximize size={18} className="text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Diện tích</p>
                      <p className="font-medium">{room.roomSize} m²</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="p-2 rounded-md bg-indigo-100 mr-3">
                      <DollarSign size={18} className="text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Giá thuê</p>
                      <p className="font-medium text-indigo-600">
                        {room.price ? room.price.toLocaleString() + " đ/tháng" : "Chưa có"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="p-2 rounded-md bg-indigo-100 mr-3">
                      <Building size={18} className="text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Tầng</p>
                      <p className="font-medium">Tầng {room.floor || 1}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="p-2 rounded-md bg-indigo-100 mr-3">
                      <Info size={18} className="text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Tình trạng phòng</p>
                      <p className="font-medium">{getConditionText(room.condition) || "Mới"}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="p-2 rounded-md bg-indigo-100 mr-3">
                      <Calendar size={18} className="text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Thời hạn thuê tối thiểu</p>
                      <p className="font-medium">{room.leaseTerm || 6} tháng</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Địa chỉ */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Địa chỉ</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <MapPin size={18} className="text-indigo-600 mt-1 mr-2 flex-shrink-0" />
                    <p className="text-gray-700">
                      {room.addressText}
                      {room.ward && `, ${room.ward}`}
                      {room.district && `, ${room.district}`}
                      {room.province && `, ${room.province}`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tiện ích */}
              {room.facilities && room.facilities.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Tiện ích</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {room.facilities.map((facility, index) => (
                      <div key={index} className="flex items-center">
                        <Check size={16} className="text-green-500 mr-2" />
                        <span className="text-gray-700">{facility}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Mô tả */}
              {room.description && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Mô tả</h3>
                  <p className="text-gray-700 whitespace-pre-line">{room.description}</p>
                </div>
              )}

              {/* Trạng thái duyệt */}
              {room.status === "PENDING" && (
                <div className="bg-purple-50 rounded-lg p-4 flex items-start">
                  <AlertCircle size={20} className="text-purple-600 mr-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-purple-800">Đang chờ duyệt</h4>
                    <p className="text-sm text-purple-700">
                      Phòng này đang chờ Admin phê duyệt và sẽ được hiển thị công khai sau khi được duyệt.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Thông tin người thuê */}
           {activeTab === "tenant" && room.status === "OCCUPIED" && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Thông tin người thuê</h3>

                {isLoadingTenant ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
                    <span className="ml-2 text-gray-600">Đang tải thông tin người thuê...</span>
                  </div>
                ) : tenant ? (
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-start">
                      <div className="p-2 rounded-full bg-indigo-100 mr-3">
                        <User size={18} className="text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Họ và tên</p>
                        <p className="font-medium">{tenant.fullName || tenant.firstName + ' ' + tenant.lastName || "Chưa có thông tin"}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="p-2 rounded-full bg-indigo-100 mr-3">
                        <Phone size={18} className="text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Số điện thoại</p>
                        <p className="font-medium">{tenant.phoneNumber || "Chưa có thông tin"}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="p-2 rounded-full bg-indigo-100 mr-3">
                        <Mail size={18} className="text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{tenant.email || "Chưa có thông tin"}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="p-2 rounded-full bg-indigo-100 mr-3">
                        <Calendar size={18} className="text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Ngày bắt đầu thuê</p>
                        <p className="font-medium">
                          {tenant.checkInDate
                            ? new Date(tenant.checkInDate).toLocaleDateString('vi-VN')
                            : "Chưa xác định"
                          }
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="p-2 rounded-full bg-indigo-100 mr-3">
                        <Calendar size={18} className="text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Ngày kết thúc hợp đồng</p>
                        <p className="font-medium">
                          {tenant.checkOutDate 
                            ? new Date(tenant.checkOutDate).toLocaleDateString('vi-VN')
                            : "Chưa có thông tin"
                          }
                        </p>
                      </div>
                    </div>

                    {tenant.identityCard && (
                      <div className="flex items-start">
                        <div className="p-2 rounded-full bg-indigo-100 mr-3">
                          <Info size={18} className="text-indigo-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Số CMND/CCCD</p>
                          <p className="font-medium">{tenant.identityCard}</p>
                        </div>
                      </div>
                    )}

                    {tenant.note && (
                      <div className="col-span-full mt-2 bg-white rounded-lg p-3 border border-gray-200">
                        <p className="text-sm text-gray-500 mb-1">Ghi chú:</p>
                        <p className="text-gray-700">{tenant.note}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <User size={48} className="text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Không tìm thấy thông tin người thuê</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Hình ảnh và video */}
          {activeTab === "media" && room.mediaUrls && room.mediaUrls.length > 0 && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Hình ảnh & Video</h3>

                <div className="mb-4">
                  <div className="aspect-video w-full bg-black rounded-lg overflow-hidden flex items-center justify-center">
                    {room.mediaUrls[activeImageIndex] && (
                      isImage(room.mediaUrls[activeImageIndex]) ? (
                        <img
                          src={room.mediaUrls[activeImageIndex]}
                          alt={`Hình ảnh ${activeImageIndex + 1}`}
                          className="max-w-full max-h-full object-contain"
                        />
                      ) : isVideo(room.mediaUrls[activeImageIndex]) ? (
                        <video
                          src={room.mediaUrls[activeImageIndex]}
                          controls
                          className="max-w-full max-h-full"
                        />
                      ) : (
                        <div className="text-white">Không thể hiển thị media này</div>
                      )
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {room.mediaUrls.map((url, index) => (
                    <div 
                      key={index}
                      onClick={() => setActiveImageIndex(index)}
                      className={`cursor-pointer aspect-square rounded-md overflow-hidden border-2 ${
                        activeImageIndex === index 
                          ? "border-indigo-500" 
                          : "border-transparent hover:border-indigo-200"
                      }`}
                    >
                      {isImage(url) ? (
                        <img
                          src={url}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : isVideo(url) ? (
                        <div className="relative w-full h-full bg-gray-800">
                          <video
                            src={url}
                            className="w-full h-full object-cover"
                            muted
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                              <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-black border-b-[6px] border-b-transparent ml-1"></div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-xs text-gray-500">Không hỗ trợ</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-white p-4 border-t border-gray-200">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
