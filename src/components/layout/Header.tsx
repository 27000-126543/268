import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Bell, User, LogOut, FileText, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useNotificationStore } from '../../store/useNotificationStore';
import { formatDateTime } from '../../utils/helpers';

const Header = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuthStore();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'danger': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <header className="h-16 bg-navy-900/90 backdrop-blur-md border-b border-military-500/30 flex items-center justify-between px-6 relative z-50">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Shield className="w-8 h-8 text-military-400" />
          <h1 className="text-xl font-bold font-orbitron text-white tracking-wide">
            智慧军营管理平台
          </h1>
        </div>
        <div className="h-6 w-px bg-gray-600 mx-2" />
        <span className="text-sm text-gray-400">3D可视化综合调度系统</span>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="text-sm text-gray-400">{formatDateTime(currentTime)}</p>
        </div>

        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="relative p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <Bell className="w-6 h-6 text-gray-300" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 top-12 w-80 glass-panel rounded-xl overflow-hidden shadow-2xl"
              >
                <div className="p-3 border-b border-military-500/30 flex items-center justify-between">
                  <h3 className="font-bold text-white">通知中心</h3>
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-military-400 hover:text-military-300"
                  >
                    全部已读
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="p-4 text-center text-gray-500">暂无通知</p>
                  ) : (
                    notifications.slice(0, 10).map(notif => (
                      <div
                        key={notif.id}
                        onClick={() => markAsRead(notif.id)}
                        className={`p-3 border-b border-military-500/10 hover:bg-white/5 cursor-pointer ${
                          !notif.read ? 'bg-military-500/10' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {getNotificationIcon(notif.type)}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white">{notif.title}</p>
                            <p className="text-xs text-gray-400 truncate">{notif.message}</p>
                            <p className="text-xs text-gray-600 mt-1">{notif.time}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-military-600 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-white">{currentUser?.name}</p>
              <p className="text-xs text-gray-400">{currentUser?.rank} · {currentUser?.role}</p>
            </div>
          </button>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 top-14 w-48 glass-panel rounded-xl overflow-hidden shadow-2xl"
              >
                <button
                  onClick={() => {
                    navigate('/export');
                    setShowUserMenu(false);
                  }}
                  className="w-full p-3 text-left text-sm text-gray-300 hover:bg-white/10 flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  数据导出
                </button>
                <div className="border-t border-military-500/30" />
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="w-full p-3 text-left text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  退出登录
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Header;
