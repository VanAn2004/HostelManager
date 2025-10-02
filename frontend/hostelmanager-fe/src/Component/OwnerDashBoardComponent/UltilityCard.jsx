// Utility Card Component with improved payment handling
export default function UtilityCard({ icon, title, amount, status, color, dueDate, onPayment }) {
  // Format amount with proper Vietnamese currency format
  const formatAmount = (amt) => {
    if (!amt) return '';
    // Remove non-numeric characters and convert to number
    const numericValue = parseFloat(amt.replace(/[^\d]/g, ''));
    if (isNaN(numericValue)) return amt;
    
    // Format with dots as thousand separators and đ as suffix
    return numericValue.toLocaleString('vi-VN') + 'đ';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`bg-${color}-100 p-3 rounded-lg`}>
          {icon}
        </div>
        <span className={`text-xs font-semibold inline-flex items-center rounded-full px-2 py-1 ${
          status === 'Đã Thanh Toán' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {status}
        </span>
      </div>
      <h4 className="text-lg font-medium text-gray-800">{title}</h4>
      <p className="text-2xl font-bold text-gray-800 mt-1">{formatAmount(amount)}</p>
      {dueDate && (
        <p className="text-xs text-gray-500 mt-2">Hạn thanh toán: {dueDate}</p>
      )}
      {status !== 'Đã Thanh Toán' && (
        <button 
          className="mt-3 w-full px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
          onClick={onPayment}
        >
          Thanh Toán Ngay
        </button>
      )}
    </div>
  );
}