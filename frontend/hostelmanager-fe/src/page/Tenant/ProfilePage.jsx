import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Edit, Save, X, ArrowLeft } from 'lucide-react';

export default function ProfilePage() {
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchUserProfile();
  }, [token, navigate]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/v1/users/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token.replace(/"/g, "")}`
        }
      });
     

      if (response.ok) {
        const data = await response.json();
        
        setUser({
        ...data.result,
      });        // isActive: data.result.isActive === 1 ? true : false  // Nếu isActive là 1 thì là true, nếu là 0 thì false

        setEditedUser(data.result);
        console.log("Trạng thái isActive:", data.result.isActive);
      } else {
        setMessage('Không thể tải thông tin người dùng');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setMessage('Lỗi kết nối server');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditedUser(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const updateData = {
        userName: editedUser.userName,
        email: editedUser.email,
        phone: editedUser.phone,
        firstName: editedUser.firstName,
        lastName: editedUser.lastName
      };

      const response = await fetch('http://localhost:8080/api/v1/users/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token.replace(/"/g, "")}`
        },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.result);
        setEditedUser(data.result);
        setIsEditing(false);
        setMessage('Cập nhật thông tin thành công');
        setMessageType('success');

        // Clear message after 3 seconds
        setTimeout(() => {
          setMessage('');
          setMessageType('');
        }, 3000);
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || 'Không thể cập nhật thông tin');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Lỗi kết nối server');
      setMessageType('error');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
    setMessage('');
    setMessageType('');
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
 console.log("user: ", user);
 
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/')}
                className="flex items-center text-gray-600 hover:text-blue-600 mr-4"
              >
                <ArrowLeft size={20} className="mr-1" />
                Quay lại
              </button>
              <h1 className="text-2xl font-bold text-gray-800">Thông tin cá nhân</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Success/Error Message */}
          {message && (
            <div className={`mb-6 p-4 rounded-md ${messageType === 'success'
              ? 'bg-green-100 border border-green-300 text-green-700'
              : 'bg-red-100 border border-red-300 text-red-700'
              }`}>
              {message}
            </div>
          )}

          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header */}
            <div className="bg-blue-600 px-6 py-8 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-white p-3 rounded-full">
                    <User size={32} className="text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-2xl font-bold">{user.userName}</h2>
                    <p className="text-blue-100">{user.roleName}</p>
                  </div>
                </div>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-gray-100 flex items-center"
                  >
                    <Edit size={16} className="mr-2" />
                    Cập nhật thông tin
                  </button>
                )}
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên đăng nhập
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedUser.userName || ''}
                      onChange={(e) => handleInputChange('userName', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-md">{user.userName}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editedUser.email || ''}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-md">{user.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editedUser.phone || ''}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-md">{user.phone || 'Chưa cập nhật'}</p>
                  )}
                </div>

                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Họ
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedUser.firstName || ''}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-md">{user.firstName || 'Chưa cập nhật'}</p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedUser.lastName || ''}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-md">{user.lastName || 'Chưa cập nhật'}</p>
                  )}
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trạng thái
                  </label>
                  <p className="p-3 bg-gray-50 rounded-md">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${user.active === true // Kiểm tra nếu giá trị trả về là số 1
                        ? 'bg-green-100 text-green-800'  // Hiển thị "Hoạt động" khi là 1
                        : 'bg-red-100 text-red-800'      // Hiển thị "Không hoạt động" khi là 0
                      }`}>
                      {user.active === true ? 'Hoạt động' : 'Không hoạt động'}
                    </span>
                  </p>
                </div>

                {/* Created At */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày tạo tài khoản
                  </label>
                  <p className="p-3 bg-gray-50 rounded-md">{formatDate(user.createdAt)}</p>
                </div>
              </div>

              {/* Action Buttons for Edit Mode */}
              {isEditing && (
                <div className="mt-8 flex justify-end space-x-4">
                  <button
                    onClick={handleCancel}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center"
                    disabled={saving}
                  >
                    <X size={16} className="mr-2" />
                    Hủy
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center disabled:opacity-50"
                  >
                    <Save size={16} className="mr-2" />
                    {saving ? 'Đang lưu...' : 'Lưu thông tin'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}