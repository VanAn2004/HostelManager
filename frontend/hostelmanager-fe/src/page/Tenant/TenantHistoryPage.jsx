import React, { useEffect, useState } from 'react';
import API from '@/Service/api';

const TenantHistoryPage = () => {
  const [requests, setRequests] = useState([]);
  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    if (userId) {
      API.get(`/tenants/user/${userId}`)
        .then((res) => setRequests(res.data.result || []))
        .catch((err) => console.error(err));
    }
  }, [userId]);

  const handleCancel = (id) => {
    API.delete(`/tenants/${id}`)
      .then(() => {
        setRequests((prev) => prev.map(r => r.id === id ? { ...r, status: 'CANCELLED' } : r));
        alert('Đã huỷ yêu cầu');
      })
      .catch(() => alert('Không thể huỷ yêu cầu'));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Lịch sử thuê phòng</h2>
      <ul className="space-y-4">
        {requests.map((r) => (
          <li key={r.id} className="border p-4 rounded">
            <p>Phòng: {r.roomId}</p>
            <p>Ngày thuê: {r.checkInDate} - {r.checkOutDate}</p>
            <p>Trạng thái: {r.status}</p>
            {r.status === 'PENDING' && (
              <button
                onClick={() => handleCancel(r.id)}
                className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
              >Huỷ yêu cầu</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TenantHistoryPage;