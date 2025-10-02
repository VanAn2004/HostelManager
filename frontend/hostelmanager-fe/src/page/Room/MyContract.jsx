import React, { useState, useEffect } from "react";
import {
  Check,
  FileText,
  Eye,
  CreditCard,
  X,
  MapPin,
  Home,
  Calendar,
  Info,
  Loader,
} from "lucide-react";
import { message } from "antd";
import { data, useNavigate } from "react-router-dom";

const RoomContractPage = () => {
  const token = localStorage.getItem("token");
  const cleanToken = token ? token.replace(/"/g, "") : "";
  const [currentStep, setCurrentStep] = useState();
  const [showContractModal, setShowContractModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [contractData, setContractData] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [contract, setContract] = useState({});
  const [room, setRoom] = useState({});
  const [tenant, setTenant] = useState({});
  const navigate = useNavigate();
  const [owner,setOwner] = useState({});
  const [currentUser,setCurrentUser] = useState({});
  const steps = [
    { id: 1, title: "Gửi yêu cầu", description: "Gửi yêu cầu thuê phòng" },
    { id: 2, title: "Chờ duyệt", description: "Chờ chủ nhà xem xét" },
    {
      id: 3,
      title: "Xem và xác nhận hợp đồng",
      description: "Xem chi tiết và xác nhận hợp đồng",
    },
    { id: 4, title: "Thanh toán", description: "Thanh toán tiền cọc" },
    { id: 5, title: "Hoàn thành", description: "Hoàn thành hợp đồng" },
  ];
  const fetchCurrentUser= async () =>{
    const res = await fetch("http://localhost:8080/api/v1/users/me",{
      method: "GET",
      headers:{
        Authorization: `Bearer ${cleanToken}`
      }
    });
    const data = await res.json();
    if(data?.code !== 1000){
      throw new Error(data.message);
    }
    setCurrentUser(data?.result);
  }
    const fetchOwnerUser = async() =>{
    const res =await fetch(`http://localhost:8080/api/v1/users/user/${contract.ownerId}`,{
      method: "GET",
      headers:{
        Authorization: `Bearer ${cleanToken}`
      }
    })
    const data = await res.json();
    if(data.code !== 1000){
      throw new Error(data.message);
    }
    setOwner(data.result);
  }
  useEffect(() => {
    const fetchMyRoom = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/v1/tenants/room",
          {
            headers: {
              Authorization: `Bearer ${cleanToken}`,
            },
            method: "GET",
          }
        );

        const data = await response.json();

        if (data.code !== 1000) {
          throw new Error(data?.message);
        } else {
          setRoom(data.result || {});
        }
      } catch (error) {
        alert("error: " + error.message || "adsdad");
        navigate("/404");
      }
    };

    const fetchTenant = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/v1/tenants/getRequest",
          {
            headers: {
              Authorization: `Bearer ${cleanToken}`,
            },
            method: "GET",
          }
        );

        const data = await response.json();
        if (data.code !== 1000) {
          throw data.message;
        }

        setTenant(data.result);
      } catch (error) {
        alert("error: ", data.message);
      }
    };

    fetchTenant();
    fetchMyRoom();
  }, [token]);

  useEffect(() => {
    const fetchContract = async () => {
      if (!room.id) {
        console.warn("room.id chưa có sẵn để gọi hợp đồng");
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:8080/api/v1/tenants/contract/${room.id}`,
          {
            headers: { Authorization: `Bearer ${cleanToken}` },
            method: "GET",
          }
        );

        const data = await response.json();
        if (data.code !== 1000) throw new Error(data.message);

        setContract(data.result);
       
        setContractData(data.result);
        console.log("Contract data loaded:", data.result);
      } catch (error) {
        console.error("Lỗi fetch hợp đồng:", error);
        setContractData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchContract();
     
  }, [token, room.id]); // Thêm room.id vào dependency

  useEffect(() => {
    if (tenant) {
      console.log("Tenant status:", tenant.status);
      switch (tenant.status) {
        case "PENDING":
          setCurrentStep(2); // step 2: Chờ duyệt
          break;
        case "APPROVED":
          setCurrentStep(3); // step 3: Xem hợp đồng
          break;
        case "CONFIRMED":
          setCurrentStep(4); // step 4: Thanh toán
          break;
        case "PAID":
        case "CONTRACT_CONFIRMED":
          setCurrentStep(6); // step 5: Hoàn thành
          break;
        default:
          setCurrentStep(1); // step 1: Gửi yêu cầu
      }
    }
  }, [tenant]);

  // Debug log để kiểm tra
  useEffect(() => {
    console.log("Debug info:", {
      currentStep,
      tenantStatus: tenant?.status,
      hasContractData: !!contractData,
      contractId: contractData?.id,
    });
  }, [currentStep, tenant?.status, contractData]);

  // Hàm xử lý click step - Thống nhất logic
  const handleStepClick = (stepId) => {
    console.log("Step clicked:", stepId, "Current step:", currentStep);

    if (stepId === 1 && tenant?.status === "PENDING") {
      handleViewRequest();
    } else if (stepId === 3 && currentStep >= 3) {
      // Cho phép xem hợp đồng từ step 3
      handleViewContract();
    } else if (stepId === 4 && currentStep >= 3) {
      // Cho phép xem hợp đồng để thanh toán từ step 3
      handleViewContract();
    }
  };

 

 
  console.log("owner:", owner);
  
  const handlePayment = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn thanh toán tiền cọc?")) {
      return;
    }

    setPaymentLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/tenants/sign-contract/${contractData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cleanToken}`,
          },
          body: JSON.stringify({
            tenantSigned: true,
          }),
        }
      );

      const data = await response.json();
      if (data.code !== 1000) {
        throw new Error(data.message);
      }

      // Cập nhật contract data
      setContractData((prev) => ({
        ...prev,
        tenantSigned: true,
      }));

      // Cập nhật step
      setCurrentStep(4); // Hoặc step tiếp theo tùy logic

      alert("Thanh toán thành công! Chờ xác nhận của chủ phòng.");
      setShowContractModal(false);
    } catch (error) {
      console.error("Lỗi thanh toán:", error);
      alert("Đã xảy ra lỗi khi thanh toán. Vui lòng thử lại!");
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleViewContract = () => {
    console.log("handleViewContract called, contractData:", contractData);

    if (!contractData) {
      alert("Hợp đồng chưa được tạo hoặc chưa tải xong! Vui lòng thử lại sau.");
      return;
    }
    fetchOwnerUser();
    fetchCurrentUser();

    setShowContractModal(true);
  };

  const handleViewRequest = () => {
    setShowRequestModal(true);
  };

  const handleCancelRequest = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy yêu cầu thuê phòng này?")) {
      return;
    }

    setCancelLoading(true);
    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/tenants/cancel",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTimeout(() => {
        alert("Đã hủy yêu cầu thuê phòng thành công!");
        setShowRequestModal(false);
        // Reset contract data
        setContract(null);
        setContractData(null);
        setCurrentStep(1);
        setCancelLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Error canceling request:", error);
      alert("Đã xảy ra lỗi khi hủy yêu cầu. Vui lòng thử lại!");
      setCancelLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  const getStatusText = (status) => {
    switch (status) {
      case "PENDING":
        return "Đang chờ chủ phòng duyệt";
      case "APPROVED":
        return "Đã được chấp thuận";
      case "REJECTED":
        return "Đã bị từ chối";
      case "CONTRACT_CREATED":
        return "Đã tạo hợp đồng";
      case "CONFIRMED":
        return "Đã xác nhận hợp đồng";
      case "PAID":
        return "Đã thanh toán";
      default:
        return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      case "CONTRACT_CREATED":
        return "bg-blue-100 text-blue-800";
      case "CONFIRMED":
        return "bg-blue-100 text-blue-800";
      case "PAID":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Check if step should show as completed
  const isStepCompleted = (stepId) => {
    if (stepId === 1 && tenant && tenant.status === "PENDING") {
      return true;
    }
    if (stepId === 3 && contractData?.tenantSigned) {
      return true;
    }
    return stepId < currentStep;
  };

  // Check if step is clickable
  const isStepClickable = (stepId) => {
    if (stepId === 1 && tenant?.status === "PENDING") return true;
    if ((stepId === 3 || stepId === 4) && currentStep >= 3 && contractData)
      return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Quản lý Phòng Trọ
          </h1>
          <p className="text-gray-600">
            Theo dõi tiến độ hợp đồng thuê phòng của bạn
          </p>
        </div>

        {/* Progress Timeline */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Tiến độ hợp đồng
          </h2>

          <div className="relative">
            {/* Progress Line */}
            <div className="absolute top-6 left-0 w-full h-0.5 bg-gray-200">
              <div
                className="h-full bg-blue-500 transition-all duration-500"
                style={{
                  width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                }}
              />
            </div>

            {/* Steps */}
            <div className="relative flex justify-between">
              {steps.map((step) => (
                <div key={step.id} className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold transition-all duration-300 ${
                      isStepCompleted(step.id) || step.id === currentStep
                        ? "bg-blue-500 shadow-lg"
                        : "bg-gray-300"
                    } ${
                      isStepClickable(step.id)
                        ? "cursor-pointer hover:bg-blue-600"
                        : "cursor-default"
                    }`}
                    onClick={() =>
                      isStepClickable(step.id) && handleStepClick(step.id)
                    }
                  >
                    {isStepCompleted(step.id) ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <span>{step.id}</span>
                    )}
                  </div>

                  <div className="mt-3 text-center max-w-32">
                    <h3
                      className={`text-sm font-medium ${
                        isStepCompleted(step.id) || step.id === currentStep
                          ? "text-blue-600"
                          : "text-gray-500"
                      } ${
                        isStepClickable(step.id)
                          ? "cursor-pointer hover:text-blue-700"
                          : "cursor-default"
                      }`}
                      onClick={() =>
                        isStepClickable(step.id) && handleStepClick(step.id)
                      }
                    >
                      {step.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

{/*     
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex gap-4">
            {currentStep >= 3 && (
              <button
                onClick={handleViewContract}
                disabled={!contractData}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Eye className="w-4 h-4" />
                Xem và xác nhận hợp đồng
                {!contractData && (
                  <span className="text-xs">(Đang tải...)</span>
                )}
              </button>
            )}

            {currentStep >= 5 && (
              <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                <CreditCard className="w-4 h-4" />
                Thanh toán tiền cọc
              </button>
            )}
          </div>
        </div> */}
      </div>

      {/* Request Detail Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-md overflow-hidden max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">
                Chi tiết yêu cầu thuê phòng
              </h2>
              <button
                onClick={() => setShowRequestModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Image Gallery */}
              {room.mediaUrls && room.mediaUrls.length > 0 && (
                <div className="bg-gray-100 p-4 rounded-lg mb-6">
                  <div className="h-64 overflow-x-auto whitespace-nowrap flex gap-2">
                    {room.mediaUrls.map((media, index) => (
                      <div key={index} className="h-full flex-shrink-0">
                        <img
                          src={media}
                          alt={`Phòng ${room.roomNumber} - ${index + 1}`}
                          className="h-full object-cover rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Room Information */}
              <div className="mb-6">
                <div className="flex flex-col md:flex-row justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Phòng {room.roomNumber}
                    </h3>
                    <div className="flex items-center text-gray-600 mt-2">
                      <MapPin className="h-5 w-5 mr-2" />
                      <p>
                        {room.addressText}, {room.ward}, {room.district},{" "}
                        {room.province}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatCurrency(room.price)}
                    </div>
                    <p className="text-gray-500 text-sm">/ tháng</p>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-blue-800 mb-2">
                        Trạng thái yêu cầu
                      </h4>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          tenant.status
                        )}`}
                      >
                        {getStatusText(tenant.status)}
                      </span>
                    </div>
                    <Info className="h-6 w-6 text-blue-500" />
                  </div>
                </div>

                {/* Rental Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Calendar className="h-5 w-5 text-green-500 mr-2" />
                      <span className="font-medium text-gray-700">
                        Ngày bắt đầu thuê
                      </span>
                    </div>
                    <p className="text-lg font-semibold text-gray-800">
                      {formatDate(tenant.checkInDate)}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Calendar className="h-5 w-5 text-red-500 mr-2" />
                      <span className="font-medium text-gray-700">
                        Ngày kết thúc dự kiến
                      </span>
                    </div>
                    <p className="text-lg font-semibold text-gray-800">
                      {formatDate(tenant.checkOutDate)}
                    </p>
                  </div>
                </div>

                {/* Room Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center">
                    <Home className="h-6 w-6 text-blue-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Loại phòng</p>
                      <p className="font-medium">{room.roomType}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="h-6 w-6 text-blue-500 mr-3 flex items-center justify-center">
                      {/* <span className="text-sm font-bold">m²</span> */}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Diện tích</p>
                      <p className="font-medium">{room.roomSize} m²</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-6 w-6 text-blue-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">
                        Thời hạn thuê tối thiểu
                      </p>
                      <p className="font-medium">{room.leaseTerm} tháng</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-3 text-gray-800">
                    Mô tả
                  </h4>
                  <p className="text-gray-600">{room.description}</p>
                </div>

                {/* Facilities */}
                {room.facilities && room.facilities.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-3 text-gray-800">
                      Tiện nghi
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2">
                      {room.facilities.map((facility, index) => (
                        <div key={index} className="flex items-center">
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-sm">{facility}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Condition */}
                {room.condition && (
                  <div className="bg-yellow-50 p-4 rounded-lg mb-6">
                    <div className="flex items-start">
                      <Info className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-800">
                          Điều kiện
                        </h4>
                        <p className="text-yellow-700 mt-1">{room.condition}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4 border-t">
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  disabled={cancelLoading}
                >
                  Đóng
                </button>
                {tenant.status === "PENDING" && (
                  <button
                    onClick={handleCancelRequest}
                    disabled={cancelLoading}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {cancelLoading ? (
                      <>
                        <Loader className="h-4 w-4 animate-spin mr-2" />
                        Đang hủy...
                      </>
                    ) : (
                      "Hủy yêu cầu"
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contract Modal */}
      {showContractModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <FileText className="w-6 h-6" />
                  HỢP ĐỒNG THUÊ PHÒNG TRỌ
                </h2>
                <button
                  onClick={() => setShowContractModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : contractData ? (
                <div className="space-y-6">
                  {/* Contract Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="border-b pb-2">
                        <label className="text-sm font-medium text-gray-600">
                          Mã số hợp đồng:
                        </label>
                        <p className="text-lg font-semibold text-gray-800">
                          {contractData.id}
                        </p>
                      </div>

                      <div className="border-b pb-2">
                        <label className="text-sm font-medium text-gray-600">
                          Người cho thuê:
                        </label>
                        <p className="text-lg font-semibold text-gray-800">
                        {owner.firstName}    {owner.lastName}
                        </p>
                      </div>

                      <div className="border-b pb-2">
                        <label className="text-sm font-medium text-gray-600">
                          Người thuê:
                        </label>
                        <p className="text-lg font-semibold text-gray-800">
                          {tenant.fullName}
                        </p>
                      </div>

                      <div className="border-b pb-2">
                        <label className="text-sm font-medium text-gray-600">
                          Phòng:
                        </label>
                        <p className="text-lg font-semibold text-gray-800">
                          {room.roomNumber}
                        </p>
                      </div>

                      <div className="border-b pb-2">
                        <label className="text-sm font-medium text-gray-600">
                          Ngày bắt đầu:
                        </label>
                        <p className="text-lg font-semibold text-gray-800">
                          {formatDate(contractData.startDate)}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="border-b pb-2">
                        <label className="text-sm font-medium text-gray-600">
                          Ngày kết thúc:
                        </label>
                        <p className="text-lg font-semibold text-gray-800">
                          {formatDate(contractData.endDate)}
                        </p>
                      </div>

                      <div className="border-b pb-2">
                        <label className="text-sm font-medium text-gray-600">
                          Tiền cọc:
                        </label>
                        <p className="text-lg font-semibold text-red-600">
                          {formatCurrency(contractData.deposit)}
                        </p>
                      </div>

                      <div className="border-b pb-2">
                        <label className="text-sm font-medium text-gray-600">
                          Tiền phòng hàng tháng:
                        </label>
                        <p className="text-lg font-semibold text-red-600">
                          {formatCurrency(contractData.monthlyPrice)}
                        </p>
                      </div>

                      <div className="border-b pb-2">
                        <label className="text-sm font-medium text-gray-600">
                          Ngày tạo hợp đồng:
                        </label>
                        <p className="text-lg font-semibold text-gray-800">
                          {formatDateTime(contractData.createdAt)}
                        </p>
                      </div>

                      <div className="border-b pb-2">
                        <label className="text-sm font-medium text-gray-600">
                          Ngày cập nhật hợp đồng:
                        </label>
                        <p className="text-lg font-semibold text-gray-800">
                          {formatDateTime(contractData.updatedAt)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="border-t pt-6">
                    <label className="text-sm font-medium text-gray-600 block mb-2">
                      Điều khoản hợp đồng:
                    </label>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <pre className="whitespace-pre-wrap text-gray-800 font-medium leading-relaxed">
                        {contractData.terms}
                      </pre>
                    </div>
                  </div>

                  {currentStep === 3 && !contractData.tenantSigned && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                      <p className="text-lg font-medium text-blue-800 mb-4">
                        Vui lòng thanh toán tiền cọc để hoàn tất hợp đồng.
                      </p>
                      <button
                        onClick={handlePayment}
                        disabled={paymentLoading}
                        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {paymentLoading ? (
                          <>
                            <Loader className="w-5 h-5 animate-spin" />
                            Đang xử lý...
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-5 h-5" />
                            Thanh toán {formatCurrency(contractData.deposit)}
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Hiển thị khi đã thanh toán */}
                  {contractData.tenantSigned && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Check className="w-6 h-6 text-green-600" />
                        <p className="text-lg font-medium text-green-800">
                          Đã thanh toán thành công!
                        </p>
                      </div>
                      <p className="text-green-700">
                        Chờ xác nhận của chủ phòng để hoàn tất hợp đồng.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">
                    Không thể tải thông tin hợp đồng
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomContractPage;
