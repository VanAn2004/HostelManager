// Stats Card Component with improved style and formatting
export default function StatCard({ icon, label, value, change, positive = true, bgColor, iconBg, onClick }) {
  return (
    <div 
      className={`${bgColor} rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-200 hover:shadow-md ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className={`${iconBg} p-3 rounded-lg`}>
          {icon}
        </div>
        {change && (
          <span className={`text-xs font-semibold inline-flex items-center rounded-full px-2 py-1 ${
            positive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {positive ? '+' : '-'}{change}
          </span>
        )}
      </div>
      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-500">{label}</h4>
        <p className="mt-2 text-3xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}