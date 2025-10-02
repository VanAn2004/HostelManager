import React, { useState, useEffect } from 'react';
import { Save, X, Calendar, User, Home, DollarSign, FileText, AlertCircle } from 'lucide-react';

const CreateContractForm = ({ contract, onSuccess, onCancel }) => {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api/v1';
  const token = localStorage.getItem('token');
  const cleanToken = token?.replace(/^"|"$/g, '');

  const [formData, setFormData] = useState({
    roomNumber: '',
    roomType: '',
    tenantName: '',
    tenantEmail: '',
    tenantPhone: '',
    tenantIdNumber: '',
    tenantAddress: '',
    startDate: '',
    endDate: '',
    monthlyRent: '',
    depositAmount: '',
    electricityRate: '',
    waterRate: '',
    serviceCharge: '',
    terms: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableRooms, setAvailableRooms] = useState([]);

  // Initialize form data when editing
  useEffect(() => {
    if (contract) {
      setFormData({
        roomNumber: contract.roomNumber || '',
        roomType: contract.roomType || '',
        tenantName: contract.tenantName || '',
        tenantEmail: contract.tenantEmail || '',
        tenantPhone: contract.tenantPhone || '',
        tenantIdNumber: contract.tenantIdNumber || '',
        tenantAddress: contract.tenantAddress || '',
        startDate: contract.startDate ? contract.startDate.split('T')[0] : '',
        endDate: contract.endDate ? contract.endDate.split('T')[0] : '',
        monthlyRent: contract.monthlyRent || '',
        depositAmount: contract.depositAmount || '',
        electricityRate: contract.electricityRate || '',
        waterRate: contract.waterRate || '',
        serviceCharge: contract.serviceCharge || '',
        terms: contract.terms || ''
      });
    }
  }, [contract]);

  // Fetch available rooms
  useEffect(() => {
    fetchAvailableRooms();
  }, []);

  const fetchAvailableRooms = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/rooms/available`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cleanToken}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.code === 1000) {
          setAvailableRooms(data.result);
        }
      }
    } catch (error) {
      console.error('Error fetching available rooms:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.roomNumber.trim()) {
      newErrors.roomNumber = 'Số phòng là bắt buộc';
    }

    if (!formData.tenantName.trim()) {
      newErrors.tenantName = 'Tên người thuê là bắt buộc';
    }

    if (!formData.tenantEmail.trim()) {
      newErrors.tenantEmail = 'Email là bắt buộc';
    } else if (!/\S+@\S+\.\S+/.test(formData.tenantEmail)) {
      newErrors.tenantEmail = 'Email không hợp lệ';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Ngày bắt đầu là bắt buộc';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'Ngày kết thúc là bắt buộc';
    }

    if (formData.startDate && formData.endDate && new Date(formData.endDate) <= new Date(formData.startDate)) {
      newErrors.endDate = 'Ngày kết thúc phải sau ngày bắt đầu';
    }

    if (!formData.monthlyRent || formData.monthlyRent <= 0) {
      newErrors.monthlyRent = 'Giá thuê phải lớn hơn 0';
    }

    if (!formData.depositAmount || formData.depositAmount <= 0) {
      newErrors.depositAmount = 'Tiền đặt cọc phải lớn hơn 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const contractData = {
        ...formData,
        monthlyRent: parseFloat(formData.monthlyRent),
        depositAmount: parseFloat(formData.depositAmount),
        electricityRate: formData.electricityRate ? parseFloat(formData.electricityRate) : null,
        waterRate: formData.waterRate ? parseFloat(formData.waterRate) : null,
        serviceCharge: formData.serviceCharge ? parseFloat(formData.serviceCharge) : null,
      };

      const url = contract 
        ? `${API_BASE_URL}/contracts/${contract.id}`
        : `${API_BASE_URL}/contracts`;
      
      const method = contract ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cleanToken}`
        },
        body: JSON.stringify(contractData)
      });

      const data = await response.json();

      if (!response.ok || data.code !== 1000) {
        throw new Error(data.message || 'Có lỗi xảy ra khi lưu hợp đồng');
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving contract:', error);
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

    const roomTypes = ["Standard", "Deluxe", "Studio", "Shared", "Mini"];


  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {contract ? 'Chỉnh Sửa Hợp Đồng' : 'Tạo Hợp Đồng Mới'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Có lỗi xảy ra
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    {errors.submit}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Room Information */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Home className="h-5 w-5 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900">Thông Tin Phòng</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số phòng *
                </label>
                {contract ? (
                  <input
                    type="text"
                    name="roomNumber"
                    value={formData.roomNumber}
                    readOnly
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
                  />
                ) : (
                  <select
                    name="roomNumber"
                    value={formData.roomNumber}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Chọn phòng</option>
                    {availableRooms.map(room => (
                      <option key={room.id} value={room.roomNumber}>
                        {room.roomNumber} - {room.roomType}
                      </option>
                    ))}
                  </select>
                )}
                {errors.roomNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.roomNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loại phòng
                </label>
                <input
                  type="text"
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="VIP, Thường, ..."
                />
              </div>
            </div>
          </div>

          {/* Tenant Information */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900">Thông Tin Người Thuê</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ và tên *
                </label>
                <input
                  type="text"
                  name="tenantName"
                  value={formData.tenantName}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nguyễn Văn A"
                />
                {errors.tenantName && (
                  <p className="mt-1 text-sm text-red-600">{errors.tenantName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="tenantEmail"
                  value={formData.tenantEmail}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="example@email.com"
                />
                {errors.tenantEmail && (
                  <p className="mt-1 text-sm text-red-600">{errors.tenantEmail}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  name="tenantPhone"
                  value={formData.tenantPhone}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0123456789"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CCCD/CMND
                </label>
                <input
                  type="text"
                  name="tenantIdNumber"
                  value={formData.tenantIdNumber}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="123456789"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ thường trú
                </label>
                <input
                  type="text"
                  name="tenantAddress"
                  value={formData.tenantAddress}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Số nhà, đường, phường, quận, thành phố"
                />
              </div>
            </div>
          </div>

          {/* Contract Period */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900">Thời Gian Hợp Đồng</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày bắt đầu *
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày kết thúc *
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.endDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
                )}
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900">Thông Tin Tài Chính</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giá thuê hàng tháng (VNĐ) *
                </label>
                <input
                  type="number"
                  name="monthlyRent"
                  value={formData.monthlyRent}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="3000000"
                  min="0"
                />
                {errors.monthlyRent && (
                  <p className="mt-1 text-sm text-red-600">{errors.monthlyRent}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tiền đặt cọc (VNĐ) *
                </label>
                <input
                  type="number"
                  name="depositAmount"
                  value={formData.depositAmount}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="3000000"
                  min="0"
                />
                {errors.depositAmount && (
                  <p className="mt-1 text-sm text-red-600">{errors.depositAmount}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giá điện (VNĐ/kWh)
                </label>
                <input
                  type="number"
                  name="electricityRate"
                  value={formData.electricityRate}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="3500"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giá nước (VNĐ/m³)
                </label>
                <input
                  type="number"
                  name="waterRate"
                  value={formData.waterRate}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="25000"
                  min="0"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phí dịch vụ khác (VNĐ)
                </label>
                <input
                  type="number"
                  name="serviceCharge"
                  value={formData.serviceCharge}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="200000"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Contract Terms */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900">Điều Khoản Hợp Đồng</h3>
            </div>

            <div>
              <textarea
                name="terms"
                value={formData.terms}
                onChange={handleInputChange}
                rows={6}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập các điều khoản và quy định của hợp đồng..."
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={16} />
              <span>{isSubmitting ? 'Đang lưu...' : (contract ? 'Cập nhật' : 'Tạo hợp đồng')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateContractForm;