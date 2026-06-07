import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Shield, User, LogIn } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { UserRole } from '../utils/types';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isFaceScanning, startFaceScan, stopFaceScan } = useAuthStore();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [scanProgress, setScanProgress] = useState(0);

  const roles: { role: UserRole; name: string; rank: string }[] = [
    { role: '班长', name: '赵班长', rank: '上士' },
    { role: '连长', name: '王连长', rank: '上尉' },
    { role: '营长', name: '李营长', rank: '中校' },
    { role: '旅长', name: '张旅长', rank: '大校' },
  ];

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isFaceScanning && selectedRole) {
      interval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            login(selectedRole);
            navigate('/dashboard');
            return 100;
          }
          return prev + 2;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isFaceScanning, selectedRole, login, navigate]);

  const handleStartScan = (role: UserRole) => {
    setSelectedRole(role);
    setScanProgress(0);
    startFaceScan();
  };

  const handleCancel = () => {
    stopFaceScan();
    setSelectedRole(null);
    setScanProgress(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-military-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-military-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-navy-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-military-500/10 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-military-500/5 rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-12 h-12 text-military-400" />
            <h1 className="text-4xl font-bold font-orbitron text-white tracking-wider">
              智慧军营综合管理平台
            </h1>
          </div>
          <p className="text-gray-400 text-lg">3D可视化 · 智能调度 · 应急指挥</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel rounded-2xl p-8 border-glow"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Camera className="w-6 h-6 text-military-400" />
              人脸识别登录
            </h2>

            <div className="relative">
              <div className="aspect-square rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-military-500/50 overflow-hidden relative">
                {isFaceScanning ? (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <div className="w-32 h-32 rounded-full border-4 border-military-400 flex items-center justify-center mb-4 relative">
                      <User className="w-16 h-16 text-military-400" />
                      <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-military-400 animate-spin" />
                    </div>
                    <p className="text-military-400 font-medium mb-2">正在识别中...</p>
                    <div className="w-48 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-military-500 to-military-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${scanProgress}%` }}
                      />
                    </div>
                    <p className="text-gray-400 text-sm mt-2">{scanProgress}%</p>
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <div className="w-32 h-32 rounded-full border-2 border-dashed border-gray-600 flex items-center justify-center mb-4">
                      <Camera className="w-16 h-16 text-gray-600" />
                    </div>
                    <p className="text-gray-500">请选择身份后开始人脸识别</p>
                  </div>
                )}

                {isFaceScanning && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-military-400 to-transparent animate-[scan_2s_linear_infinite]" />
                  </div>
                )}
              </div>

              {isFaceScanning && (
                <button
                  onClick={handleCancel}
                  className="mt-4 w-full py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  取消
                </button>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-panel rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <User className="w-6 h-6 text-military-400" />
              选择身份
            </h2>

            <div className="space-y-4">
              {roles.map((item, index) => (
                <motion.button
                  key={item.role}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  onClick={() => handleStartScan(item.role)}
                  disabled={isFaceScanning}
                  className={`w-full p-4 rounded-xl border transition-all text-left ${
                    selectedRole === item.role
                      ? 'border-military-500 bg-military-500/20 shadow-glow'
                      : 'border-gray-700 bg-gray-800/50 hover:border-military-500/50 hover:bg-gray-800'
                  } ${isFaceScanning ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-bold text-lg">{item.name}</p>
                      <p className="text-gray-400 text-sm">{item.rank} · {item.role}</p>
                    </div>
                    <LogIn className={`w-5 h-5 ${selectedRole === item.role ? 'text-military-400' : 'text-gray-500'}`} />
                  </div>
                </motion.button>
              ))}
            </div>

            <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
              <p className="text-yellow-400 text-sm">
                <strong>安全提示：</strong>系统已开启审计日志，所有操作将被记录。
              </p>
            </div>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-gray-600 text-sm mt-8"
        >
          © 2026 智慧军营综合管理平台 v1.0.0 | 涉密信息系统
        </motion.p>
      </div>
    </div>
  );
};

export default LoginPage;
