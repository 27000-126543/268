import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import StatusBar from '../components/layout/StatusBar';
import InfoPanel from '../components/panels/InfoPanel';
import PurchaseApprovalPanel from '../components/panels/PurchaseApprovalPanel';
import SoldierDetailModal from '../components/modals/SoldierDetailModal';
import CampusScene from '../scenes/CampusScene';
import { useEmergencyStore } from '../store/useEmergencyStore';
import { usePersonnelStore } from '../store/usePersonnelStore';
import { AlertTriangle } from 'lucide-react';

const DashboardPage = () => {
  const { drill, notifications } = useEmergencyStore();
  const { selectedSoldier } = usePersonnelStore();
  const [showPurchaseApproval, setShowPurchaseApproval] = useState(false);

  return (
    <div className="w-full h-full flex flex-col bg-background-dark">
      <Header />

      <div className="flex-1 flex overflow-hidden relative">
        <Sidebar onOpenPurchaseApproval={() => setShowPurchaseApproval(true)} />

        <main className="flex-1 relative">
          <CampusScene />

          <InfoPanel />

          <AnimatePresence>
            {drill.isActive && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute top-4 left-1/2 -translate-x-1/2 z-30"
              >
                <div className="bg-red-600/90 backdrop-blur-md px-6 py-3 rounded-xl shadow-2xl border border-red-400/50 animate-pulse">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-6 h-6 text-white animate-bounce" />
                    <div>
                      <p className="text-white font-bold text-lg">【紧急警报】营区遇袭模拟演练</p>
                      <p className="text-red-200 text-sm">请所有人员立即沿绿色疏散路线撤离至安全区域</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {drill.isActive && notifications.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="absolute top-20 left-4 z-30 space-y-2 max-w-sm"
              >
                {notifications.map((msg, i) => (
                  <div
                    key={i}
                    className="bg-black/80 backdrop-blur-md px-4 py-2 rounded-lg border border-red-500/30 text-white text-sm"
                  >
                    {msg}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      <StatusBar />

      <SoldierDetailModal />

      <AnimatePresence>
        {showPurchaseApproval && (
          <PurchaseApprovalPanel onClose={() => setShowPurchaseApproval(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardPage;
