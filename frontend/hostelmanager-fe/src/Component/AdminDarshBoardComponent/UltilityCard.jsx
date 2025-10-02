
// Utility Card Component
export default function UtilityCard({ icon, title, amount, status, color, dueDate }) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
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
        <p className="text-2xl font-bold text-gray-800 mt-1">{amount}</p>
        {dueDate && (
          <p className="text-xs text-gray-500 mt-2">Hạn thanh toán: {dueDate}</p>
        )}
        {status !== 'Đã Thanh Toán' && (
          <button className="mt-3 w-full px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
            Thanh Toán Ngay
          </button>
        )}
      </div>
    );
  }