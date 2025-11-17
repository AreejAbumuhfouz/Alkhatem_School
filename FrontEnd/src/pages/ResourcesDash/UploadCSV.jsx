
import React, { useState } from "react";
import axios from "axios";

export default function UploadResources() {
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleUpload = async () => {
    if (!files.length) {
      setMessage("Please select files to upload");
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]); // key must match multer field
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/upload-resources`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        //   withCredentials: true, // as you requested
        }
      );
      setMessage(res.data.message || "Upload successful!");
    } catch (err) {
      console.error(err);
      setMessage(
        err.response?.data?.message || "Upload failed, check console"
      );
    }
  };

  return (
    <div>
      <h2>Upload Excel + Images</h2>
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        accept=".xlsx,.xls,image/*"
      />
      <button onClick={handleUpload}>Upload</button>
      {message && <p>{message}</p>}
    </div>
  );
}
