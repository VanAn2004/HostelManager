import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  MapPin,
  Home,
  DollarSign,
  Maximize2,
  Calendar,
  Check,
  Info,
  Loader,
  X,
} from "lucide-react";

const RoomDetailPage = () => {
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    idCardNumber: "",
    email: "",
    checkInDate: "",
    checkOutDate: "",
  });
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/v1/room/${roomId}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();
        console.log("data: ", data.result);

        if (data.code === 1000) {
          setRoom(data.result);
          console.log("Room ID:", data.result.id);
        } else {
          setError(`API returned code ${data.code}`);
          console.warn("API returned non-1000 code:", data.code);
        }
      } catch (error) {
        setError("Failed to load room details");
        console.error("API call error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomDetails();
  }, [roomId]);

  const handleOpenModal = () => {
    // Set ngày tối thiểu là ngày hôm nay
    const today = new Date().toISOString().split("T")[0];

    // Tính checkOutDate dựa trên leaseTerm
    let calculatedCheckOutDate = "";
    if (room?.leaseTerm) {
      const checkInDate = new Date(today);
      const checkOutDate = new Date(checkInDate);
      checkOutDate.setMonth(checkOutDate.getMonth() + room.leaseTerm);
      calculatedCheckOutDate = checkOutDate.toISOString().split("T")[0];
    }

    setFormData((prev) => ({
      ...prev,
      checkInDate: today,
      checkOutDate: calculatedCheckOutDate,
    }));
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      fullName: "",
      phoneNumber: "",
      idCardNumber: "",
      email: "",
      checkInDate: "",
      checkOutDate: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Kiểm tra nếu là checkInDate và ngày được chọn nhỏ hơn ngày hiện tại
    if (name === "checkInDate") {
      const today = new Date().toISOString().split("T")[0];
      if (value < today) {
        alert(
          "Ngày check-in không thể là ngày trong quá khứ. Vui lòng chọn ngày từ hôm nay trở đi."
        );
        return;
      }
    }

    setFormData((prev) => {
      const updatedData = {
        ...prev,
        [name]: value,
      };

      // Tự động tính checkOutDate khi checkInDate thay đổi
      if (name === "checkInDate" && value && room?.leaseTerm) {
        const checkInDate = new Date(value);
        const checkOutDate = new Date(checkInDate);
        checkOutDate.setMonth(checkOutDate.getMonth() + room.leaseTerm);
        updatedData.checkOutDate = checkOutDate.toISOString().split("T")[0];
      }

      return updatedData;
    });
  };

  const validateForm = () => {
    const { fullName, phoneNumber, idCardNumber, email, checkInDate } =
      formData;

    if (!fullName.trim()) {
      alert("Vui lòng nhập họ tên");
      return false;
    }

    if (!phoneNumber.trim()) {
      alert("Vui lòng nhập số điện thoại");
      return false;
    }

    if (!idCardNumber.trim()) {
      alert("Vui lòng nhập số CMND/CCCD");
      return false;
    }

    if (!email.trim()) {
      alert("Vui lòng nhập email");
      return false;
    }

    if (!checkInDate) {
      alert("Vui lòng chọn ngày check-in");
      return false;
    }

    // Kiểm tra ngày check-in không được là ngày trong quá khứ
    const today = new Date().toISOString().split("T")[0];
    if (checkInDate < today) {
      alert(
        "Ngày check-in không thể là ngày trong quá khứ. Vui lòng chọn ngày từ hôm nay trở đi."
      );
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Email không hợp lệ");
      return false;
    }

    // Validate phone number (basic)
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(phoneNumber.replace(/\s/g, ""))) {
      alert("Số điện thoại không hợp lệ");
      return false;
    }

    return true;
  };

  const handleCreateRentRequest = async () => {
    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      const cleanToken = token.replace(/"/g, "");

      // Fetch current user
      const userRes = await fetch("http://localhost:8080/api/v1/users/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cleanToken}`,
        },
      });
      const userData = await userRes.json();
      if (userData.code !== 1000)
        throw new Error(userData.message || "Lỗi lấy thông tin người dùng");

      setCurrentUser(userData.result);

      // 🟡 Fetch tenant info để kiểm tra trạng thái
      const tenantRes = await fetch(
        `http://localhost:8080/api/v1/tenants/user/${userData.result.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cleanToken}`,
          },
        }
      );
      const tenantData = await tenantRes.json();
      if (tenantData.code === 1000 && tenantData.result) {
        const tenantStatus = tenantData.result.status;
        const notAllowedStatuses = ["APPROVE", "ACTIVE"];
        if (notAllowedStatuses.includes(tenantStatus)) {
          alert(
            "Tài khoản của bạn hiện đang có hợp đồng chưa kết thúc. Không thể gửi yêu cầu thuê mới."
          );
          return;
        }
      }

      // Gửi yêu cầu thuê phòng
      const requestBody = {
        userId: userData.result.id,
        roomId: roomId,
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        idCardNumber: formData.idCardNumber,
        email: formData.email,
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate || null,
      };

      const request = await fetch("http://localhost:8080/api/v1/tenants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cleanToken}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await request.json();
      if (data.code !== 1000)
        throw new Error(data.message || "Gửi yêu cầu thất bại");

      alert("Gửi yêu cầu thuê phòng thành công!");
      handleCloseModal();
    } catch (error) {
      console.error("Request error:", error);
      alert(error.message || "Đã xảy ra lỗi không xác định");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 w-full">
        <Loader className="h-8 w-8 text-blue-600 animate-spin" />
        <p className="mt-4 text-gray-600">Đang tải thông tin phòng...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg max-w-3xl mx-auto mt-8">
        <h3 className="text-red-700 font-medium text-lg">
          Không thể tải thông tin phòng
        </h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!room) return null;

  const {
    roomNumber,
    roomSize,
    price,
    status,
    roomType,
    facilities = [],
    leaseTerm,
    condition,
    description,
    mediaUrls = [],
    province,
    district,
    ward,
    addressText,
  } = room;

  const getStatusColor = (status) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-green-100 text-green-800";
      case "OCCUPIED":
        return "bg-gray-100 text-gray-800";
      case "MAINTENANCE":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "AVAILABLE":
        return "Còn trống";
      case "OCCUPIED":
        return "Đã cho thuê";
      case "MAINTENANCE":
        return "Đang bảo trì";
      default:
        return status;
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate("/")}
        className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition duration-200"
      >
        ← Quay lại
      </button>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Image Gallery */}
        <div className="bg-gray-100 p-4">
          <div className="h-96 overflow-x-auto whitespace-nowrap flex gap-2">
            {mediaUrls.map((media, index) => {
              const isVideo = media?.match(/\.(mp4|webm|ogg)$/i);

              return (
                <div key={index} className="h-full flex-shrink-0">
                  {isVideo ? (
                    <video
                      src={media}
                      controls
                      className="h-full object-cover rounded-lg"
                    />
                  ) : (
                    <img
                      src={media || `/api/placeholder/200/200`}
                      alt={`Phòng ${roomNumber} - media ${index + 1}`}
                      className="h-full object-cover rounded-lg"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Room Information */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start mb-6">
            <div>
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">
                  Phòng {roomNumber}
                </h1>
                <span
                  className={`ml-4 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    status
                  )}`}
                >
                  {getStatusText(status)}
                </span>
              </div>
              <div className="flex items-center text-gray-600 mt-2">
                <MapPin className="h-5 w-5 mr-2" />
                <p>
                  {addressText}, {ward}, {district}, {province}
                </p>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="text-3xl font-bold text-blue-600">
                {formatPrice(price)}
              </div>
              <p className="text-gray-500 text-sm">/ tháng</p>
            </div>
          </div>

          {/* Room Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-center">
              <Home className="h-6 w-6 text-blue-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Loại phòng</p>
                <p className="font-medium">{roomType || "Standard"}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Maximize2 className="h-6 w-6 text-blue-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Kích thước</p>
                <p className="font-medium">{roomSize} m²</p>
              </div>
            </div>
            <div className="flex items-center">
              <Calendar className="h-6 w-6 text-blue-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Thời hạn thuê tối thiểu</p>
                <p className="font-medium">{leaseTerm} tháng</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Mô tả</h2>
            <p className="text-gray-600 whitespace-pre-line">{description}</p>
          </div>

          {/* Facilities */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Tiện nghi
            </h2>
            {facilities.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3">
                {facilities.map((facility, index) => (
                  <div key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>{facility}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">
                Không có thông tin về tiện nghi
              </p>
            )}
          </div>

          {/* Condition */}
          {condition && (
            <div className="bg-blue-50 p-4 rounded-lg mb-8">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-800">Điều kiện</h3>
                  <p className="text-blue-700 mt-1">{condition}</p>
                </div>
              </div>
            </div>
          )}

          {/* Contact Button */}
          <div className="mt-8">
            <button
              className="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
              onClick={handleOpenModal}
            >
              Gửi yêu cầu thuê
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Thông tin yêu cầu thuê phòng
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Nhập họ và tên"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="Nhập số điện thoại"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* ID Card Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số CMND/CCCD <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="idCardNumber"
                  value={formData.idCardNumber}
                  onChange={handleInputChange}
                  placeholder="Nhập số CMND/CCCD"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Nhập địa chỉ email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Lease Term Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">
                  Thông tin thuê phòng
                </h4>
                <div className="text-sm text-gray-600">
                  <p>
                    <strong>Thời gian thuê tối thiểu:</strong>{" "}
                    {leaseTerm || "Chưa xác định"} tháng
                  </p>
                  <p className="text-blue-600 mt-1">
                    <Info className="h-4 w-4 inline mr-1" />
                    Ngày kết thúc sẽ được tính tự động dựa trên thời gian thuê
                    tối thiểu
                  </p>
                </div>
              </div>

              {/* Check-in Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày check-in <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="checkInDate"
                  value={formData.checkInDate}
                  onChange={handleInputChange}
                  min={today}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Ngày check-in phải từ hôm nay (
                  {new Date().toLocaleDateString("vi-VN")}) trở đi
                </p>
              </div>

              {/* Check-out Date (Auto calculated) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày kết thúc dự kiến
                </label>
                <input
                  type="date"
                  name="checkOutDate"
                  value={formData.checkOutDate}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
                />
                <p className="text-sm text-gray-500 mt-1">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Tự động tính dựa trên ngày check-in + {leaseTerm || 0} tháng
                </p>
              </div>

              {/* Room Info Summary */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">
                  Thông tin phòng
                </h4>
                <div className="text-sm text-blue-700">
                  <p>
                    <strong>Phòng:</strong> {roomNumber}
                  </p>
                  <p>
                    <strong>Giá thuê:</strong> {formatPrice(price)}/tháng
                  </p>
                  <p>
                    <strong>Thời hạn thuê:</strong> {leaseTerm} tháng
                  </p>
                  <p>
                    <strong>Địa chỉ:</strong> {addressText}, {ward}, {district},{" "}
                    {province}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleCloseModal}
                className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                disabled={submitting}
              >
                Hủy
              </button>
              <button
                onClick={handleCreateRentRequest}
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {submitting ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin mr-2" />
                    Đang gửi...
                  </>
                ) : (
                  "Gửi yêu cầu"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomDetailPage;
