import React, { useState, useEffect } from 'react';
import AddResource from "./AddResource";
import GetAllResources from "./Getallresources";
import ClaimResourceForm from "./TeacherResources";
import ResourceList from "./Teacher&Resource";

export default function Resources() {
  const [tab, setTab] = useState('add');

  // Load tab from localStorage on component mount
  useEffect(() => {
    const savedTab = localStorage.getItem('activeResourceTab');
    if (savedTab) {
      setTab(savedTab);
    }
  }, []);

  // Save tab to localStorage whenever it changes
  const handleTabChange = (newTab) => {
    setTab(newTab);
    localStorage.setItem('activeResourceTab', newTab);
  };

  return (
    <div className="p-4">
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => handleTabChange('add')}
          className={`px-4 py-2 rounded ${tab === 'add' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          ➕ Add Resource
        </button>
        <button
          onClick={() => handleTabChange('list')}
          className={`px-4 py-2 rounded ${tab === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          📋 Resources Management
        </button>
        <button
          onClick={() => handleTabChange('assign')}
          className={`px-4 py-2 rounded ${tab === 'assign' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          🎓 Teacher Assignments
        </button>
        <button
          onClick={() => handleTabChange('ResourceList')}
          className={`px-4 py-2 rounded ${tab === 'ResourceList' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          who took resource
        </button>
      </div>

      <div className="bg-white shadow-md rounded p-2">
        {tab === 'add' && <AddResource />}
        {tab === 'list' && <GetAllResources />}
        {tab === 'assign' && <ClaimResourceForm />}
        {tab === 'ResourceList' && <ResourceList />}
      </div>
    </div>
  );
}
