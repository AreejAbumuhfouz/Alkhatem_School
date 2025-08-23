import React from 'react';

const DownloadReport = () => {
  const handleDownload = async () => {
    try {
      const response = await fetch('https://alkhatem-school.onrender.com/api/report/download', {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to download report');
      }

      // Convert response to blob
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Create link element to trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = 'resources_report.xlsx';
      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('❌ Error downloading report:', error.message);
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
    >
      Download Report
    </button>
  );
};

export default DownloadReport;
