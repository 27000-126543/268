import { useState, useEffect } from 'react';
import { Wifi, Cpu, Users, AlertTriangle, Clock } from 'lucide-react';
import { usePersonnelStore } from '../../store/usePersonnelStore';
import { useBuildingStore } from '../../store/useBuildingStore';
import { useNotificationStore } from '../../store/useNotificationStore';

const StatusBar = () => {
  const { soldiers } = usePersonnelStore();
  const { guardPosts, trainingGround } = useBuildingStore();
  const { unreadCount } = useNotificationStore();
  const [fps, setFps] = useState(60);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();

    const updateFps = () => {
      frameCount++;
      const now = performance.now();
      if (now - lastTime >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastTime = now;
      }
      requestAnimationFrame(updateFps);
    };

    const id = requestAnimationFrame(updateFps);
    return () => cancelAnimationFrame(id);
  }, []);

  const warningCount = guardPosts.filter(g => g.needsRelief).length +
    (trainingGround.occupancyRate >= 80 ? 1 : 0);

  const personnelInForbidden = soldiers.filter(s => s.isInForbiddenZone).length;

  return (
    <footer className="h-10 bg-navy-900/90 backdrop-blur-md border-t border-military-500/30 flex items-center justify-between px-6 text-sm">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-green-500">
          <Wifi className="w-4 h-4" />
          <span>系统正常</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <Cpu className="w-4 h-4" />
          <span>{fps} FPS</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <Users className="w-4 h-4" />
          <span>在线人员: {soldiers.length}人</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {warningCount > 0 && (
          <div className="flex items-center gap-2 text-orange-500">
            <AlertTriangle className="w-4 h-4 animate-pulse" />
            <span>{warningCount} 项预警</span>
          </div>
        )}
        {personnelInForbidden > 0 && (
          <div className="flex items-center gap-2 text-red-500 animate-pulse">
            <AlertTriangle className="w-4 h-4" />
            <span>{personnelInForbidden} 人进入禁区</span>
          </div>
        )}
        <div className="text-gray-400">
          未读通知: <span className="text-white font-medium">{unreadCount}</span>
        </div>
      </div>
    </footer>
  );
};

export default StatusBar;
