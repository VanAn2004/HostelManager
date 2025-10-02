
// Navigation Item Component
export default function NavItem({ icon, label, active = false, sidebarOpen }) {
    return (
      <div className={`flex items-center py-3 px-3 rounded-lg cursor-pointer transition-all duration-150 ${
        active 
          ? 'bg-gradient-to-r from-blue-700 to-blue-600 text-white shadow-md' 
          : 'text-blue-100 hover:bg-blue-700/40'
      }`}>
        <div className={`${active ? 'bg-blue-500/30' : 'bg-blue-800/30'} p-2 rounded-lg`}>
          {icon}
        </div>
        {sidebarOpen && <span className="ml-3 text-sm font-medium">{label}</span>}
      </div>
    );
  }
  
  