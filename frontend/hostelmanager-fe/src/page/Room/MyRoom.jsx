import React, { useState, useEffect } from "react";
import InvoiceDetailModal from "../../Component/RoomPage/InvoiceDetailModal";
import ConfirmModal from "../../Component/RoomPage/ConfirmModal";
import { useNavigate } from "react-router-dom";
import {
  Home,
  MapPin,
  Calendar,
  DollarSign,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  Loader,
  Receipt,
  ArrowLeft,
} from "lucide-react";
import getToken from "../../Service/LocalStorageService";

export default function MyRoomPage() {
  const navigate = useNavigate();
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    invoice: null,
  });
  const token = localStorage.getItem("token");
  
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showEndModal, setShowEndModal] = useState(false);
  const [room, setRoom] = useState({});
  const [tenant, setTenant] = useState({});
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const [contract, setContract] = useState({});
  const today = new Date();
  const endDate = new Date(contract?.endDate);
  const timeDiff = endDate - today;
  const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  const isExpiringSoon = daysLeft <= 30 && contract?.status === "ACTIVE";

  useEffect(() => {
  const fetchContract = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/v1/tenants/my-contract", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      const data = await res.json();
      if (data.code === 1000) {
        setContract(data.result);
      }
    } catch (error) {
      console.error("Lỗi lấy hợp đồng:", error);
    }
  };

  fetchContract();
}, []);


  // Fetch room data
  useEffect(() => {
    const fetchMyRoom = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "http://localhost:8080/api/v1/tenants/room",
          {
            headers: {
              Authorization: `Bearer ${token}`,
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
        console.error("Error fetching room:", error);
        alert("Lỗi khi tải thông tin phòng: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchTenant = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/v1/tenants/getRequest",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            method: "GET",
          }
        );

        const data = await response.json();
        if (data.code !== 1000) {
          throw new Error(data.message);
        }
        console.log("Data :", data.result);

        setTenant(data.result);
      } catch (error) {
        console.error("Error fetching tenant:", error);
      }
    };

    fetchMyRoom();
    fetchTenant();
  }, [token]);
  console.log("Tenant: ", tenant);

  // Fetch invoices when tenant data is available
  useEffect(() => {
    const fetchInvoices = async () => {
      if (!tenant.id) return;
      console.log("Tenant id: ", tenant.id);

      setInvoiceLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8080/api/v1/tenants/invoice/${tenant.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            method: "GET",
          }
        );

        const data = await response.json();
        if (data.code !== 1000) {
          throw new Error(data?.message);
        } else {
          setInvoices(data.result);
        }
      } catch (error) {
        console.error("Error fetching invoices:", error);
        alert("Lỗi khi tải hóa đơn: " + error.message);
      } finally {
        setInvoiceLoading(false);
      }
    };

    fetchInvoices();
  }, [token, tenant.id]);
  console.log("Invoice: ", invoices);

  const handlePayInvoice = (invoice) => {
    setConfirmModal({ open: true, invoice });
  };
  const confirmPay = async () => {
    const invoice = confirmModal.invoice;
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/tenants/invoice/pay/${invoice.id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.code === 1000) {
        alert("Thanh toán thành công!");
        setConfirmModal({ open: false, invoice: null });
        window.location.reload();
      } else {
        alert("Lỗi: " + data.message);
      }
    } catch (err) {
      alert("Lỗi kết nối: " + err.message);
    }
  };

  const handleRequestToEndContract = async () => {
    try {
      const res = await fetch(
        "http://localhost:8080/api/v1/tenants/request-end",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify({
            tenantId: tenant.id,
            contractId: contract.id,
            reason: "Kết thúc do gần hết hạn",
          }),
        }
      );

      const data = await res.json();
      if (data.code === 1000) {
        alert("Yêu cầu kết thúc hợp đồng đã được gửi.");
        setShowEndModal(false);
      } else {
        alert("Lỗi: " + data.message);
      }
    } catch (err) {
      alert("Lỗi hệ thống: " + err.message);
    }
  };

  const handleViewDetails = (invoice) => {
    setSelectedInvoice(invoice);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN"); // Hoặc định dạng bạn muốn
  };

  function formatMonth(monthStr) {
    if (!monthStr) return "";
    const [year, month] = monthStr.split("-");
    return `Tháng ${parseInt(month)}/${year}`;
  }

  const getStatusText = (status) => {
    switch (status) {
      case "PAID":
        return "Đã thanh toán";
      case "PENDING":
        return "Chờ thanh toán";
      case "OVERDUE":
        return "Quá hạn";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "OVERDUE":
        return "bg-red-100 text-red-800";
      case "CANCELLED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "PAID":
        return <CheckCircle className="w-4 h-4" />;
      case "PENDING":
        return <Clock className="w-4 h-4" />;
      case "OVERDUE":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getMonthName = (month) => {
    const months = [
      "Tháng 1",
      "Tháng 2",
      "Tháng 3",
      "Tháng 4",
      "Tháng 5",
      "Tháng 6",
      "Tháng 7",
      "Tháng 8",
      "Tháng 9",
      "Tháng 10",
      "Tháng 11",
      "Tháng 12",
    ];
    return months[month - 1] || `Tháng ${month}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Đang tải thông tin phòng...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Quay lại</span>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  Phòng của tôi
                </h1>
                <p className="text-gray-600">
                  Thông tin chi tiết phòng trọ và hóa đơn của bạn
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Room Information */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Thông tin phòng
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Room Images */}
            <div className="lg:col-span-2">
              {room.mediaUrls && room.mediaUrls.length > 0 ? (
                <div className="bg-gray-100 rounded-lg overflow-hidden">
                  <div className="h-64 md:h-80 overflow-x-auto flex gap-2 p-2">
                    {room.mediaUrls.map((media, index) => (
                      <div key={index} className="h-full flex-shrink-0">
                        <img
                          src={media}
                          alt={`Phòng ${room.roomNumber} - ${index + 1}`}
                          className="h-full object-cover rounded-lg shadow-sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-gray-200 rounded-lg h-64 md:h-80 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Home className="w-12 h-12 mx-auto mb-2" />
                    <p>Chưa có hình ảnh phòng</p>
                  </div>
                </div>
              )}
            </div>

            {/* Room Details */}
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Phòng {room.roomNumber}
                </h3>
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {formatCurrency(room.price)}
                </div>
                <p className="text-gray-500 text-sm">/ tháng</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Địa chỉ</p>
                    <p className="text-gray-800">
                      {room.addressText}, {room.ward}, {room.district},{" "}
                      {room.province}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Home className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Loại phòng</p>
                    <p className="text-gray-800 font-medium">{room.roomType}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 text-gray-500 flex items-center justify-center">
                    <span className="text-xs font-bold">m²</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Diện tích</p>
                    <p className="text-gray-800 font-medium">
                      {room.roomSize} m²
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">
                      Thời hạn thuê tối thiểu
                    </p>
                    <p className="text-gray-800 font-medium">
                      {room.leaseTerm} tháng
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="pt-4 border-t">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-1" />
                    <p className="text-sm font-medium">
                      Trạng thái:{" "}
                      <span className="font-semibold text-green-600">
                        Đang thuê
                      </span>
                      {isExpiringSoon && (
                        <span className="ml-2 text-sm text-red-600 font-semibold">
                          (Sắp hết hạn - còn {daysLeft} ngày)
                        </span>
                      )}
                    </p>

                    {isExpiringSoon && (
                      <div className="mt-4 flex gap-3">
                        <button
                          onClick={() =>
                            navigate("/renew-contract", {
                              state: {
                                tenantId: tenant.id,
                                contractId: contract.id,
                                currentEndDate: contract.checkOutDate,
                              },
                            })
                          }
                          className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700"
                        >
                          Gia hạn hợp đồng
                        </button>

                        <button
                          onClick={() => setShowEndModal(true)}
                          className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
                        >
                          Kết thúc hợp đồng
                        </button>
                      </div>
                    )}
                    {showEndModal && (
                      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
                          <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Xác nhận kết thúc hợp đồng
                          </h3>
                          <p className="text-gray-600 mb-6">
                            Bạn có chắc chắn muốn gửi yêu cầu kết thúc hợp đồng
                            trước thời hạn không?
                          </p>
                          <div className="flex justify-end gap-3">
                            <button
                              onClick={() => setShowEndModal(false)}
                              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                            >
                              Hủy
                            </button>
                            <button
                              onClick={handleRequestToEndContract}
                              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                              Xác nhận
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <Receipt className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-600">Hóa đơn</p>
                    <p className="text-sm font-medium text-blue-700">
                      {invoices.length} hóa đơn
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Room Description */}
          {room.description && (
            <div className="mt-6 pt-6 border-t">
              <h4 className="text-lg font-semibold mb-3 text-gray-800">
                Mô tả
              </h4>
              <p className="text-gray-600 leading-relaxed">
                {room.description}
              </p>
            </div>
          )}

          {/* Facilities */}
          {room.facilities && room.facilities.length > 0 && (
            <div className="mt-6 pt-6 border-t">
              <h4 className="text-lg font-semibold mb-3 text-gray-800">
                Tiện nghi
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-2">
                {room.facilities.map((facility, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm text-gray-700">{facility}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Invoices Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Hóa đơn phòng trọ
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Receipt className="w-4 h-4" />
              <span>{invoices.length} hóa đơn</span>
            </div>
          </div>

          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition"
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="text-base font-medium text-gray-800">
                    {formatMonth(invoice.month)}
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      invoice.status
                    )}`}
                  >
                    {getStatusIcon(invoice.status)}
                    {getStatusText(invoice.status)}
                  </span>
                </div>

                <ul className="text-sm text-gray-700 space-y-1 mb-4">
                  <li>Tiền phòng: {formatCurrency(invoice.rentAmount)}</li>
                  <li className="font-semibold">
                    Tổng cộng: {formatCurrency(invoice.totalAmount)}
                  </li>
                  <li className="text-gray-600 italic">
                    Hạn thanh toán: {formatDate(invoice.paymentDate)}
                  </li>
                </ul>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleViewDetails(invoice)}
                    className="px-3 py-1.5 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
                  >
                    Xem chi tiết
                  </button>

                  {["UNPAID", "OVERDUE"].includes(invoice.status) && (
                    <button
                      onClick={() => handlePayInvoice(invoice)}
                      className="px-3 py-1.5 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
                    >
                      Thanh toán
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedInvoice && (
          <InvoiceDetailModal
            invoice={selectedInvoice}
            onClose={() => setSelectedInvoice(null)}
            onPay={handlePayInvoice}
          />
        )}

        {confirmModal.open && (
          <ConfirmModal
            title="Xác nhận thanh toán"
            message={`Bạn có chắc chắn muốn thanh toán hóa đơn tháng ${formatMonth(
              confirmModal.invoice.month
            )}?`}
            onConfirm={confirmPay}
            onClose={() => setConfirmModal({ open: false, invoice: null })}
          />
        )}
      </div>
    </div>
  );
}
