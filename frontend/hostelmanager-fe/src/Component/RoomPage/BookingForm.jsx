import React, { useState } from 'react';

const BookingForm = () => {
  const [formData, setFormData] = useState({
    userId: '',
    roomId: '',
    checkInDate: '',
    checkOutDate: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Dữ liệu đặt phòng:', formData);
    // Gửi API hoặc xử lý thêm ở đây
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md space-y-4">
      <div>
        <label className="block font-semibold">User ID</label>
        <input
          type="text"
          name="userId"
          value={formData.userId}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded"
          placeholder="Nhập userId"
        />
      </div>
      <div>
        <label className="block font-semibold">Room ID</label>
        <input
          type="text"
          name="roomId"
          value={formData.roomId}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded"
          placeholder="Nhập roomId"
        />
      </div>
      <div>
        <label className="block font-semibold">Ngày nhận phòng</label>
        <input
          type="date"
          name="checkInDate"
          value={formData.checkInDate}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded"
        />
      </div>
      <div>
        <label className="block font-semibold">Ngày trả phòng</label>
        <input
          type="date"
          name="checkOutDate"
          value={formData.checkOutDate}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded"
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Đặt phòng
      </button>
    </form>
  );
};

export default BookingForm;
