import React from "react";
import {
  X,
  Calendar,
  DollarSign,
  Info,
  Receipt,
  Zap,
  Droplets,
  Wifi,
  Trash2,
  Car,
  Wrench,
  Clock,
  FileText,
} from "lucide-react";

export default function InvoiceDetailModal({ invoice, onClose, onPay }) {
  if (!invoice) return null;

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatMonth = (month) => {
    const [year, monthNum] = month.split("-");
    return `Tháng ${monthNum}/${year}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PAID":
        return "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200";
      case "UNPAID":
        return "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-200";
      case "OVERDUE":
        return "bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "PAID":
        return "Đã thanh toán";
      case "UNPAID":
        return "Chưa thanh toán";
      case "OVERDUE":
        return "Quá hạn";
      default:
        return "";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg relative shadow-2xl transform transition-all duration-300 max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-gray-100 hover:bg-red-100 rounded-full text-gray-500 hover:text-red-600 transition-colors duration-200"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header với gradient */}
        <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white p-6 rounded-t-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
                <Receipt className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Chi tiết hóa đơn</h3>
                <p className="text-blue-100 text-sm">
                  Hóa đơn #{invoice.id || "001"}
                </p>
              </div>
            </div>

            {/* Status và tháng */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 bg-white bg-opacity-20 px-4 py-2 rounded-full backdrop-blur-sm">
                <Calendar className="w-4 h-4" />
                <span className="font-semibold">
                  {formatMonth(invoice.month)}
                </span>
              </div>
              <span
                className={`px-3 py-1.5 rounded-full text-xs font-semibold bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30`}
              >
                {getStatusText(invoice.status)}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Tổng tiền nổi bật */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-6 mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-200 bg-opacity-30 rounded-full -mr-10 -mt-10"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-purple-600" />
                <span className="text-purple-700 font-medium">
                  Tổng thanh toán
                </span>
              </div>
              <p className="text-3xl font-bold text-purple-800">
                {formatCurrency(invoice.totalAmount)}
              </p>
            </div>
          </div>

          {/* Chi tiết các khoản */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Chi tiết các khoản
            </h4>

            <div className="grid gap-3">
              <DetailCard
                icon={<Receipt className="w-5 h-5" />}
                label="Tiền phòng"
                value={formatCurrency(invoice.rentAmount)}
                color="blue"
              />
              <DetailCard
                icon={<Zap className="w-5 h-5" />}
                label="Tiền điện"
                value={formatCurrency(invoice.electricityAmount || 0)}
                color="yellow"
              />
              <DetailCard
                icon={<Droplets className="w-5 h-5" />}
                label="Tiền nước"
                value={formatCurrency(invoice.waterAmount || 0)}
                color="cyan"
              />
              <DetailCard
                icon={<Wifi className="w-5 h-5" />}
                label="Wifi"
                value={formatCurrency(invoice.wifiFee || 0)}
                color="green"
              />
              <DetailCard
                icon={<Trash2 className="w-5 h-5" />}
                label="Rác"
                value={formatCurrency(invoice.garbageFee || 0)}
                color="gray"
              />
              <DetailCard
                icon={<Car className="w-5 h-5" />}
                label="Đậu xe"
                value={formatCurrency(invoice.parkingFee || 0)}
                color="indigo"
              />
              <DetailCard
                icon={<Wrench className="w-5 h-5" />}
                label="Dịch vụ khác"
                value={formatCurrency(invoice.serviceAmount || 0)}
                color="purple"
              />
            </div>

            {/* Thông tin thêm */}
            <div className="mt-6 space-y-3">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-700 font-medium text-sm">
                    Hạn thanh toán
                  </span>
                </div>
                <p className="text-gray-800 font-semibold">
                  {formatDate(invoice.paymentDate)}
                </p>
              </div>

              {invoice.description && (
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-700 font-medium text-sm">
                      Ghi chú
                    </span>
                  </div>
                  <p className="text-blue-800">{invoice.description}</p>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors duration-200 font-medium"
                >
                  Đóng
                </button>
                {invoice.status !== "PAID" && (
                  <button
                    onClick={() => onPay(invoice)} 
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all duration-200 font-medium shadow-lg"
                  >
                    Thanh toán ngay
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailCard({ icon, label, value, color }) {
  const getColorClasses = (color) => {
    const colors = {
      blue: "bg-blue-50 border-blue-200 text-blue-600",
      yellow: "bg-yellow-50 border-yellow-200 text-yellow-600",
      cyan: "bg-cyan-50 border-cyan-200 text-cyan-600",
      green: "bg-green-50 border-green-200 text-green-600",
      gray: "bg-gray-50 border-gray-200 text-gray-600",
      indigo: "bg-indigo-50 border-indigo-200 text-indigo-600",
      purple: "bg-purple-50 border-purple-200 text-purple-600",
    };
    return colors[color] || colors.gray;
  };

  return (
    <div
      className={`p-4 rounded-xl border ${getColorClasses(
        color
      )} hover:shadow-md transition-shadow duration-200`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-white ${getColorClasses(color)}`}>
            {icon}
          </div>
          <span className="font-medium text-gray-700">{label}</span>
        </div>
        <span className="font-bold text-gray-900">{value}</span>
      </div>
    </div>
  );
}
