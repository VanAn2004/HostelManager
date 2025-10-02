import React from 'react';

const RoomCard = ({ room }) => {
  const {
    roomNumber,
    roomSize,
    price,
    status,
    roomType,
    facilities,
    leaseTerm,  
    condition,
    description,
    mediaUrls,
    province,
    district,
    ward,
    addressText
  } = room;

  const getStatusColor = (status) => {
    switch (status) {
      case 'AVAILABLE': return 'green';
      case 'OCCUPIED': return 'gray';
      case 'MAINTENANCE': return 'orange';
      default: return 'black';
    }
  };

  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      marginBottom: '20px',
      padding: '16px',
      display: 'flex',
      backgroundColor: '#fff'
    }}>
      <img
        src={mediaUrls[0] || 'https://via.placeholder.com/150'}
        alt="room"
        style={{ width: '150px', height: '100px', objectFit: 'cover', borderRadius: '8px', marginRight: '16px' }}
      />
      <div>
        <h3>
          <a
            href={`/rooms/${room.id}`}
            target="_self"
            rel="noopener noreferrer"
            style={{ color: '#0047ab', textDecoration: 'none' }}
          >
          Phòng {roomNumber} - {roomType}
          </a>
        </h3>

        <p><strong>Giá:</strong> {price.toLocaleString()} VNĐ</p>
        <p><strong>Kích thước:</strong> {roomSize} m² | <strong>Thời hạn thuê:</strong> {leaseTerm} tháng</p>
        <p><strong>Địa chỉ:</strong> {addressText}, {ward}, {district}, {province}</p>
        <p><strong>Tiện nghi:</strong> {facilities.join(', ') || 'Không có'}</p>
        <p><strong>Mô tả:</strong> {description}</p>
        <p style={{ color: getStatusColor(status), fontWeight: 'bold' }}>Tình trạng: {status}</p>
        <p><em>{condition}</em></p>
      </div>
    </div>
  );
};

export default RoomCard;
