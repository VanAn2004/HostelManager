const handleFileChange = async (e) => {
  const files = Array.from(e.target.files);
  const uploaded = [];

  for (const file of files) {
    if (file.size > 5 * 1024 * 1024) {
      alert(`${file.name} vượt quá giới hạn 5MB!`);
      continue;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "unsigned_upload"); // <-- Thay bằng preset của bạn
    formData.append("cloud_name", "dse5da9lr"); // hoặc bỏ nếu gọi đúng endpoint rồi

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dse5da9lr/auto/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.secure_url) {
        uploaded.push({
          url: data.secure_url,
          type: file.type.startsWith("image") ? "image" : "video",
          name: file.name,
        });
      } else {
        console.error("Lỗi khi upload file:", data);
      }
    } catch (err) {
      console.error("Lỗi kết nối Cloudinary:", err);
    }
  }

  e.setUploadedFiles((prev) => [...prev, ...uploaded]);
};
