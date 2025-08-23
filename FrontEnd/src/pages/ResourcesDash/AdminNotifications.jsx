
import { useEffect, useState, useRef } from 'react';
import { Bell, BellRing, Check, User, Package, Calendar, X, Settings } from 'lucide-react';

const AdminNotifications = ({ adminId }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPanel, setShowPanel] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioRef = useRef(null);
  const prevNotificationCount = useRef(0);

  // Create notification sound using Web Audio API
  const playNotificationSound = () => {
    if (!soundEnabled) return;
    
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!adminId) return;
    try {
      const response = await fetch(`https://alkhatem-school.onrender.com/api/admin/${adminId}`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to fetch notifications');
      const data = await response.json();
      const newNotifications = Array.isArray(data.notifications) ? data.notifications : [];
      
      // Check if new notifications arrived
      const currentCount = newNotifications.length;
      if (currentCount > prevNotificationCount.current && prevNotificationCount.current > 0) {
        playNotificationSound();
      }
      prevNotificationCount.current = currentCount;
      
      setNotifications(newNotifications);
    } catch (error) {
      console.error(error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      const response = await fetch(`https://alkhatem-school.onrender.com/api/read/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to mark as read');
      setNotifications((prev) =>
        prev.map((notif) => (notif.id === id ? { ...notif, is_read: true } : notif))
      );
    } catch (error) {
      console.error(error);
    }
  };

  const markAllAsRead = async () => {
    const unreadNotifications = notifications.filter(notif => !notif.is_read);
    for (const notif of unreadNotifications) {
      await markAsRead(notif.id);
    }
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [adminId]);

  const unreadCount = notifications.filter(notif => !notif.is_read).length;
  const formatDate = (dateString) => {
    if (!dateString) return 'Just now';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <div className="relative">
        <button
          onClick={() => setShowPanel(!showPanel)}
          className="relative p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          {unreadCount > 0 ? (
            <BellRing className="w-6 h-6 animate-pulse" />
          ) : (
            <Bell className="w-6 h-6" />
          )}
          
          {/* Notification Counter Badge */}
          {unreadCount > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold animate-bounce">
              {unreadCount > 99 ? '99+' : unreadCount}
            </div>
          )}
        </button>
      </div>

      {/* Notification Panel */}
      {showPanel && (
        <div className="absolute top-16 right-0 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BellRing className="w-6 h-6" />
                <div>
                  <h3 className="font-bold text-lg">Notifications</h3>
                  <p className="text-blue-100 text-sm">{unreadCount} unread messages</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                  title={soundEnabled ? "Disable sound" : "Enable sound"}
                >
                  <Settings className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowPanel(false)}
                  className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Action Buttons */}
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="mt-3 px-4 py-2 bg-white/20 text-white rounded-lg text-sm font-medium hover:bg-white/30 transition-colors flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Mark all as read
              </button>
            )}
          </div>

          {/* Content */}
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No notifications yet</p>
                <p className="text-gray-400 text-sm">You're all caught up!</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 hover:bg-gray-50 transition-colors relative ${
                      !notif.is_read ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${
                        !notif.is_read ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                      }`}>
                        <Package className="w-4 h-4" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900 truncate">
                            Resource Update
                          </h4>
                          {!notif.is_read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                          )}
                        </div>
                        
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Package className="w-3 h-3" />
                            <span className="font-medium">{notif.resource?.name || 'Unknown Resource'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">Quantity:</span>
                            <span className="font-medium text-gray-900">{notif.quantity}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="w-3 h-3" />
                            <span className="text-gray-500">By:</span>
                            <span className="font-medium text-gray-900">{notif.actor?.name || 'Unknown'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(notif.created_at)}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 mt-3">
                          {!notif.is_read && (
                            <button
                              onClick={() => markAsRead(notif.id)}
                              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium hover:bg-blue-200 transition-colors flex items-center gap-1"
                            >
                              <Check className="w-3 h-3" />
                              Mark as read
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notif.id)}
                            className="px-3 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium hover:bg-red-100 hover:text-red-600 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-gray-50 rounded-b-2xl border-t border-gray-100">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Sound notifications: {soundEnabled ? 'On' : 'Off'}</span>
              <span>Auto-refresh: 30s</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNotifications;