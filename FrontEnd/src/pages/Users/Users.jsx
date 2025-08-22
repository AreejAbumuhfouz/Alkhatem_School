import React, { useState, useEffect } from 'react';
import SignUp from "./CreateUser"
import UsersManagment from "./UsersManagment"

export default function Users() {
  const [tab, setTab] = useState('UsersManagment');

  // Load tab from localStorage on component mount
  useEffect(() => {
    const savedTab = localStorage.getItem('activeUsersTab');
    if (savedTab) {
      setTab(savedTab);
    }
  }, []);

  // Save tab to localStorage whenever it changes
  const handleTabChange = (newTab) => {
    setTab(newTab);
    localStorage.setItem('activeUsersTab', newTab);
  };

  return (
    <div className="p-4">
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => handleTabChange('UsersManagment')}
          className={`px-4 py-2 rounded ${tab === 'UsersManagment' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          ➕ Users Managment
        </button>
       
        <button
          onClick={() => handleTabChange('SignUp')}
          className={`px-4 py-2 rounded ${tab === 'SignUp' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          🎓 SignUp
        </button>
      </div>

      <div className="bg-white shadow-md rounded p-2">
        {tab === 'SignUp' && <SignUp />}
        {tab === 'UsersManagment' && <UsersManagment />}
      </div>
    </div>
  ); 
}
