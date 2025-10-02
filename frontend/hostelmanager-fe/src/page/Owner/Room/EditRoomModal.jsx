import { useState, useEffect } from "react";
import { X, Upload, PlusCircle, Loader, Info, Trash2 } from "lucide-react";
import axios from "axios";
import { uploadToCloudinary } from "../../../Config/UploadToCloudinary";

export default function EditRoomModal({ onClose, onUpdateRoom, room, token }) {
  const [formData, setFormData] = useState({
    id: room?.id || "",
    roomNumber: room?.roomNumber || "",
    roomSize: room?.roomSize || "",
    price: room?.price || "",
    status: room?.status || "AVAILABLE",
    roomType: room?.roomType || "Standard",
    facilities: room?.facilities || [],
    condition: room?.condition || "Good",
    floor: room?.floor || 1,
    description: room?.description || "",
    mediaUrls: room?.mediaUrls || [],
    province: room?.province || "",
    district: room?.district || "",
    ward: room?.ward || "",
    addressText: room?.addressText || "",
    tenant: room?.tenant || "",
    leaseTerm: room?.leaseTerm || 6
  });

  const [otherFacility, setOtherFacility] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});

  const API_BASE_URL = "http://localhost:8080/api/v1";

  // Load existing media files
  useEffect(() => {
    if (room?.mediaUrls?.length > 0) {
      const existingFiles = room.mediaUrls.map((url, index) => {
        const isImageUrl = isImage(url);
        return {
          name: `File ${index + 1}`,
          url: url,
          type: isImageUrl ? "image" : "video"
        };
      });
      setUploadedFiles(existingFiles);
    }
  }, [room]);

  // Fetch provinces on component mount
  useEffect(() => {
    fetchProvinces();
  }, []);

  // Load districts and wards based on existing location data
  useEffect(() => {
    if (room?.province) {
      fetchDistricts(room.province);
    }
  }, [room?.province]);

  useEffect(() => {
    if (room?.province && room?.district) {
      fetchWards(room.province, room.district);
    }
  }, [room?.province, room?.district]);

  const fetchProvinces = async () => {
    try {
      const response = await axios.get("https://provinces.open-api.vn/api/p/");
      setProvinces(response.data);
    } catch (error) {
      console.error("Error fetching provinces:", error);
    }
  };

  const fetchDistricts = async (provinceName) => {
    try {
      const response = await axios.get(
        "https://provinces.open-api.vn/api/p/search/?q=" + provinceName
      );
      if (response.data && response.data.length > 0) {
        const provinceCode = response.data[0].code;
        const districtsResponse = await axios.get(
          `https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`
        );
        setDistricts(districtsResponse.data.districts || []);
      }
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  const fetchWards = async (provinceName, districtName) => {
    try {
      const provinceResponse = await axios.get(
        "https://provinces.open-api.vn/api/p/search/?q=" + provinceName
      );
      if (provinceResponse.data && provinceResponse.data.length > 0) {
        const provinceCode = provinceResponse.data[0].code;
        const districtsResponse = await axios.get(
          `https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`
        );
        
        const district = districtsResponse.data.districts.find(
          (d) => d.name === districtName
        );
        
        if (district) {
          const wardsResponse = await axios.get(
            `https://provinces.open-api.vn/api/d/${district.code}?depth=2`
          );
          setWards(wardsResponse.data.wards || []);
        }
      }
    } catch (error) {
      console.error("Error fetching wards:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear validation error when field is changed
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: null,
      });
    }

    // Handle province change
    if (name === "province") {
      const selectedProvince = provinces.find(p => p.name === value);
      if (selectedProvince) {
        fetchDistricts(selectedProvince.name);
        setFormData(prev => ({
          ...prev,
          district: "",
          ward: "",
        }));
      }
    }

    // Handle district change
    if (name === "district") {
      fetchWards(formData.province, value);
      setFormData(prev => ({
        ...prev,
        ward: "",
      }));
    }
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    // Allow only numbers
    if (value === "" || /^\d+$/.test(value)) {
      setFormData({
        ...formData,
        [name]: value === "" ? "" : Number(value),
      });
      
      // Clear validation error
      if (validationErrors[name]) {
        setValidationErrors({
          ...validationErrors,
          [name]: null,
        });
      }
    }
  };

  const handleFacilityChange = (facility) => {
    if (formData.facilities.includes(facility)) {
      setFormData({
        ...formData,
        facilities: formData.facilities.filter((f) => f !== facility),
      });
    } else {
      setFormData({
        ...formData,
        facilities: [...formData.facilities, facility],
      });
    }
  };

  const handleAddCustomFacility = () => {
    if (otherFacility.trim() !== "" && !formData.facilities.includes(otherFacility.trim())) {
      setFormData({
        ...formData,
        facilities: [...formData.facilities, otherFacility.trim()],
      });
      setOtherFacility("");
    }
  };

const handleFileChange = async (e) => {
  const files = Array.from(e.target.files);
  if (files.length === 0) return;

  setUploading(true);
  const newUploadedFiles = [...uploadedFiles];

  const uploadPromises = files.map(async (file) => {
    try {
      if (file.size > 5 * 1024 * 1024) {
        alert(`File "${file.name}" quá lớn. Tối đa 5MB.`);
        return null;
      }

      const cloudUrl = await uploadToCloudinary(file);
      if (!cloudUrl) {
        alert(`Không thể tải lên file "${file.name}"`);
        return null;
      }

      return {
        name: file.name,
        url: cloudUrl,
        type: file.type.startsWith("image") ? "image" : "video",
      };
    } catch (err) {
      console.error(`Lỗi upload file ${file.name}:`, err);
      alert(`Không thể tải lên file ${file.name}`);
      return null;
    }
  });

  const uploadedResults = await Promise.all(uploadPromises);

  const validFiles = uploadedResults.filter((f) => f !== null);
  const updatedFiles = [...newUploadedFiles, ...validFiles];

  setUploadedFiles(updatedFiles);
  setFormData({
    ...formData,
    mediaUrls: updatedFiles.map((f) => f.url),
  });

  setUploading(false);
};
  

  const removeFile = (index) => {
  const newFiles = [...uploadedFiles];
  newFiles.splice(index, 1);
  setUploadedFiles(newFiles);

  setFormData({
    ...formData,
    mediaUrls: newFiles.map((f) => f.url),
  });
};


  const validateForm = () => {
    const errors = {};
    
    if (!formData.roomNumber) errors.roomNumber = "Vui lòng nhập số phòng";
    if (!formData.roomSize) errors.roomSize = "Vui lòng nhập diện tích";
    if (!formData.price) errors.price = "Vui lòng nhập giá thuê";
    if (!formData.addressText) errors.addressText = "Vui lòng nhập địa chỉ cụ thể";
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Call the update function passed from parent component
      await onUpdateRoom(formData);
      onClose();
    } catch (error) {
      console.error("Error updating room:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isImage = (url) => {
    const imageExtensions = [
      ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp", ".svg", ".jqg"
    ];
    const lowerUrl = url.toLowerCase();
    return imageExtensions.some((ext) => lowerUrl.endsWith(ext.toLowerCase()));
  };

  const isVideo = (url) => {
    const videoExtensions = [
      ".mp4", ".webm", ".ogg", ".mov", ".avi", ".wmv", ".mkv"
    ];
    const lowerUrl = url.toLowerCase();
    return videoExtensions.some((ext) => lowerUrl.endsWith(ext.toLowerCase()));
  };

  const facilities = [
    "WiFi",
    "Điều hòa",
    "Nóng lạnh", 
    "Tủ lạnh",
    "Máy giặt",
    "Giường",
    "Tủ quần áo",
    "Bàn học",
    "Nhà vệ sinh riêng", 
    "Ban công",
    "Bếp"
  ];

  const roomTypes = ["Standard", "Deluxe", "Premium", "Studio", "Shared", "Mini"];
  const conditions = ["New", "Good", "Fair", "Poor", "Needs Renovation"];
  const statusOptions = ["AVAILABLE", "OCCUPIED", "MAINTENANCE"];
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-4 border-b border-gray-200 flex justify-between items-center z-10 rounded-t-xl">
          <h2 className="text-xl font-semibold text-gray-800">Chỉnh Sửa Phòng</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Thông tin cơ bản */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800 border-b pb-2">
                Thông tin cơ bản
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số phòng *
                </label>
                <input
                  type="text"
                  name="roomNumber"
                  value={formData.roomNumber}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                    validationErrors.roomNumber ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Nhập số phòng (vd: P101)"
                />
                {validationErrors.roomNumber && (
                  <p className="mt-1 text-sm text-red-500">{validationErrors.roomNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Diện tích (m²) *
                </label>
                <input
                  type="text"
                  name="roomSize"
                  value={formData.roomSize}
                  onChange={handleNumberChange}
                  className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                    validationErrors.roomSize ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Nhập diện tích phòng"
                />
                {validationErrors.roomSize && (
                  <p className="mt-1 text-sm text-red-500">{validationErrors.roomSize}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giá thuê (VNĐ/tháng) *
                </label>
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleNumberChange}
                  className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                    validationErrors.price ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Nhập giá thuê"
                />
                {validationErrors.price && (
                  <p className="mt-1 text-sm text-red-500">{validationErrors.price}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tầng
                </label>
                <select
                  name="floor"
                  value={formData.floor}
                  onChange={handleNumberChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((floor) => (
                    <option key={floor} value={floor}>
                      {floor}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loại phòng
                </label>
                <select
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  {roomTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trạng thái phòng
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status === "AVAILABLE" ? "Còn Trống" : 
                       status === "OCCUPIED" ? "Đã Thuê" : 
                       "Đang Sửa Chữa"}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Người thuê
                </label>
                <input
                  type="text"
                  name="tenant"
                  value={formData.tenant}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Để trống nếu chưa có người thuê"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tình trạng phòng
                </label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  {conditions.map((condition) => (
                    <option key={condition} value={condition}>
                      {condition}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thời hạn thuê tối thiểu (tháng)
                </label>
                <select
                  name="leaseTerm"
                  value={formData.leaseTerm}
                  onChange={handleNumberChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  {[1, 3, 6, 12, 24, 36].map((month) => (
                    <option key={month} value={month}>
                      {month} tháng
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Địa chỉ và tiện ích */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800 border-b pb-2">
                Địa chỉ và mô tả
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tỉnh/Thành phố
                </label>
                <select
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Chọn Tỉnh/Thành phố</option>
                  {provinces.map((province) => (
                    <option key={province.code} value={province.name}>
                      {province.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quận/Huyện
                </label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  disabled={!formData.province}
                >
                  <option value="">Chọn Quận/Huyện</option>
                  {districts.map((district) => (
                    <option key={district.code} value={district.name}>
                      {district.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phường/Xã
                </label>
                <select
                  name="ward"
                  value={formData.ward}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  disabled={!formData.district}
                >
                  <option value="">Chọn Phường/Xã</option>
                  {wards.map((ward) => (
                    <option key={ward.code} value={ward.name}>
                      {ward.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ cụ thể *
                </label>
                <input
                  type="text"
                  name="addressText"
                  value={formData.addressText}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                    validationErrors.addressText ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Số nhà, tên đường..."
                />
                {validationErrors.addressText && (
                  <p className="mt-1 text-sm text-red-500">{validationErrors.addressText}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả chi tiết
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  rows="4"
                  placeholder="Mô tả chi tiết về phòng, quy định, điều kiện..."
                ></textarea>
              </div>
            </div>
          </div>

          {/* Tiện ích */}
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-800 border-b pb-2 mb-4">
              Tiện ích
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {facilities.map((facility) => (
                <div key={facility} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`facility-${facility}`}
                    checked={formData.facilities.includes(facility)}
                    onChange={() => handleFacilityChange(facility)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor={`facility-${facility}`}
                    className="ml-2 block text-sm text-gray-700"
                  >
                    {facility}
                  </label>
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={otherFacility}
                onChange={(e) => setOtherFacility(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="Tiện ích khác..."
              />
              <button
                type="button"
                onClick={handleAddCustomFacility}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg flex items-center justify-center transition-colors"
              >
                <PlusCircle size={16} className="mr-1" />
                Thêm
              </button>
            </div>

            <div className="mt-2 flex flex-wrap gap-1">
              {formData.facilities.filter(f => !facilities.includes(f)).map((facility) => (
                <span
                  key={facility}
                  className="flex items-center gap-1 px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs"
                >
                  {facility}
                  <button
                    type="button"
                    onClick={() => handleFacilityChange(facility)}
                    className="text-indigo-500 hover:text-indigo-700"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Ảnh và video */}
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-800 border-b pb-2 mb-4">
              Hình ảnh và video
            </h3>

            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <input
                  type="file"
                  id="media-upload"
                  onChange={handleFileChange}
                  className="hidden"
                  multiple
                  accept="image/*,video/*"
                />
                <label
                  htmlFor="media-upload"
                  className="cursor-pointer flex flex-col items-center justify-center py-6"
                >
                  <Upload size={32} className="mb-2 text-gray-400" />
                  <span className="block text-sm font-medium text-gray-700">
                    Nhấn để tải lên ảnh hoặc video
                  </span>
                  <span className="block text-xs text-gray-500 mt-1">
                    JPG, PNG, MP4, MOV &bull; Tối đa 5MB
                  </span>
                </label>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-video w-full rounded-lg overflow-hidden border border-gray-200">
                        {file.type === "image" ? (
                          <img
                            src={file.url}
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <video
                            src={file.url}
                            className="w-full h-full object-cover"
                            controls
                          />
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="absolute top-1 right-1 p-1 bg-white rounded-full shadow hover:bg-red-100"
                      >
                        <X size={16} className="text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-center justify-end mt-8 border-t pt-6">
            <div className="flex items-center text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
              <Info size={16} className="mr-2" />
              <span className="text-sm">
                Thông tin phòng sẽ được cập nhật trong hệ thống
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center transition-colors disabled:bg-indigo-400"
            >
              {isSubmitting ? (
                <>
                  <Loader size={16} className="mr-2 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                "Cập nhật phòng"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}