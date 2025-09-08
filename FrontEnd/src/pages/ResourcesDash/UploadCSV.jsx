import React, { useState } from 'react';
import axios from 'axios';

function UploadCSV() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a CSV file first.');
      return;
    }

    const formData = new FormData();
    formData.append('csv', file);

    try {
      const response = await axios.post(
        'https://alkhatem-school.onrender.com/api/resources/upload-csv',
        formData,
        {
          withCredentials: true, 
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setMessage('CSV uploaded successfully!');
      console.log(response.data);
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.error || 'Upload failed');
    }
  };

  return (
    <div>
      <h2>Upload Resources CSV</h2>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default UploadCSV;
