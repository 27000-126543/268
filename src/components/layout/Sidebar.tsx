import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building2, Target, Shield, UtensilsCrossed,
  AlertTriangle, Users, Play, Square, Download, FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useEmergencyStore } from '../../store/useEmergencyStore';
import { ROLE_PERMISSIONS } from '../../utils/constants';

interface MenuItem {
  icon: any;
  label: string;
  id: string;
  permission?: keyof typeof ROLE_PERMISSIONS['班长'];
}

interface Props {
  onOpenPurchaseApproval?: () => void;
}

const Sidebar = ({ onOpenPurchaseApproval }: Props) => {
  const navigate = useNavigate();
  const { currentUser } = useAuthStore();
  const { drill, startDrill, endDrill } = useEmergencyStore();
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const permissions = currentUser ? ROLE_PERMISSIONS[currentUser.role] : null;

  const menuItems: MenuItem[] = [
    { icon: Building2, label: '营房管理', id: 'barracks', permission: 'canViewBarracks' },
    { icon: Target, label: '训练场', id: 'training', permission: 'canViewTraining' },
    { icon: Shield, label: '武器库', id: 'armory', permission: 'canViewArmory' },
    { icon: UtensilsCrossed, label: '食堂', id: 'canteen', permission: 'canViewCanteen' },
    { icon: Users, label: '岗哨管理', id: 'guard', permission: 'canViewGuardPost' },
  ];

  const hasPermission = (permission?: keyof typeof ROLE_PERMISSIONS['班长']) => {
    if (!permission || !permissions) return true;
    return permissions[permission];
  };

  return (
    <aside className="w-20 bg-navy-900/90 backdrop-blur-md border-r border-military-500/30 flex flex-col items-center py-4 gap-2">
      {menuItems
        .filter(item => hasPermission(item.permission))
        .map((item) => (
          <motion.button
            key={item.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveItem(activeItem === item.id ? null : item.id)}
            className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
              activeItem === item.id
                ? 'bg-military-600 text-white shadow-glow'
                : 'text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
            title={item.label}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-[10px]">{item.label}</span>
          </motion.button>
        ))}

      <div className="flex-1" />

      {onOpenPurchaseApproval && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpenPurchaseApproval}
          className="w-14 h-14 rounded-xl flex flex-col items-center justify-center gap-1 text-orange-400 hover:bg-orange-500/20 transition-all mb-2"
          title="采购审批"
        >
          <FileText className="w-6 h-6" />
          <span className="text-[10px]">审批</span>
        </motion.button>
      )}

      {currentUser && ROLE_PERMISSIONS[currentUser.role].canStartEmergency && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={drill.isActive ? endDrill : startDrill}
          className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
            drill.isActive
              ? 'bg-red-600 text-white animate-pulse shadow-glow-red'
              : 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30'
          }`}
          title={drill.isActive ? '结束演练' : '一键演练'}
        >
          {drill.isActive ? (
            <Square className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6" />
          )}
          <span className="text-[10px]">{drill.isActive ? '结束' : '演练'}</span>
        </motion.button>
      )}

      {currentUser && ROLE_PERMISSIONS[currentUser.role].canExportData && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/export')}
          className="w-14 h-14 rounded-xl flex flex-col items-center justify-center gap-1 text-gray-400 hover:bg-white/10 hover:text-white transition-all"
          title="数据导出"
        >
          <Download className="w-6 h-6" />
          <span className="text-[10px]">导出</span>
        </motion.button>
      )}
    </aside>
  );
};

export default Sidebar;
