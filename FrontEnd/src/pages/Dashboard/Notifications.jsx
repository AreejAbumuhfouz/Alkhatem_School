import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Base URL for API
axios.defaults.baseURL = 'https://alkhatem-school.onrender.com/api';

export default function NotificationsPage({ adminId }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = () => {
    setLoading(true);
    axios
      .get(`/notifications?recipient_id=${adminId}`)
      .then(res => setNotifications(res.data))
      .catch(err => console.error('Fetch notifications error:', err))
      .finally(() => setLoading(false));
  };

  const markAsRead = (id) => {
    axios
      .post(`/notifications/${id}/markRead`)
      .then(() => {
        setNotifications(prev => prev.map(n =>
          n.id === id ? { ...n, is_read: true } : n
        ));
      })
      .catch(err => console.error('Mark read error:', err));
  };

  if (loading) return <p className="p-4 text-center">Loading notifications…</p>;
  if (notifications.length === 0) return <p className="p-4 text-center">No notifications.</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Notifications</h2>
      <ul className="space-y-2">
        {notifications.map(note => (
          <li key={note.id} className={`p-3 border rounded ${note.is_read ? 'bg-gray-100' : 'bg-white'}`}>
            <div className="flex justify-between items-start">
              <p className="text-sm">{note.message}</p>
              {!note.is_read && (
                <button
                  onClick={() => markAsRead(note.id)}
                  className="ml-2 text-blue-500 underline text-xs"
                >
                  Mark as read
                </button>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">{new Date(note.created_at).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
