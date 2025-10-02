export const uploadToCloudinary = async (file) => {
    if (file) {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "hostel-mamagement");
      data.append("cloud_name", "dse5da9lr");
  
      // Xác định loại file để chọn endpoint phù hợp
      const isVideo = file.type.startsWith("video");
      const endpoint = isVideo
        ? "https://api.cloudinary.com/v1_1/dse5da9lr/video/upload"
        : "https://api.cloudinary.com/v1_1/dse5da9lr/image/upload";
  
      const res = await fetch(endpoint, {
        method: "POST",
        body: data,
      });
  
      const fileData = await res.json();
      return fileData.url?.toString();
    }
  };
  