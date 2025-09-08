import React, { useState, useCallback } from 'react';
import { Upload, FileText, Image, CheckCircle, XCircle, Loader, AlertCircle } from 'lucide-react';

const ResourcesUpload = () => {
  const [files, setFiles] = useState({
    excel: null,
    images: []
  });
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(Array.from(e.dataTransfer.files));
    }
  }, []);

  const handleFileSelection = (selectedFiles) => {
    const excelFile = selectedFiles.find(file => 
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.type === 'application/vnd.ms-excel'
    );
    
    const imageFiles = selectedFiles.filter(file => 
      file.type.startsWith('image/')
    );

    setFiles(prev => ({
      excel: excelFile || prev.excel,
      images: [...prev.images, ...imageFiles]
    }));
  };

  const handleFileInputChange = (e) => {
    if (e.target.files) {
      handleFileSelection(Array.from(e.target.files));
    }
  };

  const removeFile = (type, index = null) => {
    if (type === 'excel') {
      setFiles(prev => ({ ...prev, excel: null }));
    } else if (type === 'image' && index !== null) {
      setFiles(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
    }
  };

  const uploadFiles = async () => {
    if (!files.excel) {
      setUploadStatus({ type: 'error', message: 'Please select an Excel file' });
      return;
    }

    setUploading(true);
    setUploadStatus(null);

    const formData = new FormData();
    formData.append('files', files.excel);
    
    files.images.forEach(image => {
      formData.append('files', image);
    });

    try {
      const response = await fetch('https://alkhatem-school.onrender.com/api/resources/upload-csv', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (response.ok) {
        setUploadStatus({
          type: 'success',
          message: result.message || 'Files uploaded successfully!'
        });
        setFiles({ excel: null, images: [] });
      } else {
        setUploadStatus({
          type: 'error',
          message: result.error || 'Upload failed'
        });
      }
    } catch (error) {
      setUploadStatus({
        type: 'error',
        message: 'Network error. Please try again.'
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Upload Resources</h2>
        <p className="text-gray-600">Upload your Excel inventory file and corresponding images</p>
      </div>

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-700 mb-2">
          Drop files here or click to browse
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Upload Excel file (.xlsx, .xls) and images (.jpg, .png, .gif)
        </p>
        
        <input
          type="file"
          multiple
          accept=".xlsx,.xls,image/*"
          onChange={handleFileInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <button
          type="button"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Choose Files
        </button>
      </div>

      {/* File Lists */}
      <div className="mt-8 space-y-6">
        {/* Excel File */}
        {files.excel && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-3 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-green-600" />
              Excel File
            </h4>
            <div className="flex items-center justify-between bg-white rounded p-3 border">
              <div className="flex items-center">
                <FileText className="h-6 w-6 text-green-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-800">{files.excel.name}</p>
                  <p className="text-sm text-gray-500">
                    {(files.excel.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeFile('excel')}
                className="text-red-500 hover:text-red-700 p-1"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* Images */}
        {files.images.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-3 flex items-center">
              <Image className="h-5 w-5 mr-2 text-blue-600" />
              Images ({files.images.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {files.images.map((image, index) => (
                <div key={index} className="flex items-center justify-between bg-white rounded p-3 border">
                  <div className="flex items-center min-w-0 flex-1">
                    <Image className="h-6 w-6 text-blue-600 mr-3 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-800 truncate">{image.name}</p>
                      <p className="text-sm text-gray-500">
                        {(image.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile('image', index)}
                    className="text-red-500 hover:text-red-700 p-1 flex-shrink-0 ml-2"
                  >
                    <XCircle className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Status Message */}
      {uploadStatus && (
        <div className={`mt-6 p-4 rounded-lg flex items-center ${
          uploadStatus.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {uploadStatus.type === 'success' ? (
            <CheckCircle className="h-5 w-5 mr-2" />
          ) : (
            <AlertCircle className="h-5 w-5 mr-2" />
          )}
          <span>{uploadStatus.message}</span>
        </div>
      )}

      {/* Upload Button */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={uploadFiles}
          disabled={uploading || !files.excel}
          className={`px-8 py-3 rounded-lg font-medium transition-all flex items-center ${
            uploading || !files.excel
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
          }`}
        >
          {uploading ? (
            <>
              <Loader className="animate-spin h-5 w-5 mr-2" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-5 w-5 mr-2" />
              Upload Resources
            </>
          )}
        </button>
      </div>

      {/* Instructions */}
      <div className="mt-8 bg-blue-50 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-2">Upload Instructions:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Excel file should contain columns: Item Name/Title, Description, Inventory Location/Storage Number, Quantity in Stock, Condition</li>
          <li>• Image files should be named to match the item names in your Excel file</li>
          <li>• Supported image formats: JPG, PNG, GIF</li>
          <li>• Maximum file size: 10MB per file</li>
        </ul>
      </div>
    </div>
  );
};

export default ResourcesUpload;