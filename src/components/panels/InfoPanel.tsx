import { motion, AnimatePresence } from 'framer-motion';
import { X, Bed, Users, Target, Shield, UtensilsCrossed, User, Clock, Wrench, AlertTriangle, CheckCircle } from 'lucide-react';
import { useBuildingStore } from '../../store/useBuildingStore';
import { usePersonnelStore } from '../../store/usePersonnelStore';
import { getOccupancyColor, getMaintenanceColor, getStockColor } from '../../utils/helpers';
import { useAuthStore } from '../../store/useAuthStore';
import { ROLE_PERMISSIONS } from '../../utils/constants';

const InfoPanel = () => {
  const { selectedBuilding, setSelectedBuilding, barracks, trainingGround, armory, canteen, guardPosts, reliefGuard } = useBuildingStore();
  const { setSelectedSoldier } = usePersonnelStore();
  const { currentUser } = useAuthStore();

  if (!selectedBuilding) return null;

  const permissions = currentUser ? ROLE_PERMISSIONS[currentUser.role] : null;

  const getBuildingData = () => {
    switch (selectedBuilding.type) {
      case 'barracks':
        return barracks.find(b => b.id === selectedBuilding.id);
      case 'trainingGround':
        return trainingGround;
      case 'armory':
        return armory;
      case 'canteen':
        return canteen;
      case 'guardPost':
        return guardPosts.find(g => g.id === selectedBuilding.id);
      case 'commandCenter':
        return { name: '指挥中心' };
      default:
        return null;
    }
  };

  const data = getBuildingData();
  if (!data) return null;

  const renderBarracksContent = (barrack: any) => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-military-400">
        <Bed className="w-5 h-5" />
        <span className="font-bold">{barrack.name}</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {barrack.rooms.map((room: any) => {
          const occupancyRate = (room.bedOccupancy / room.maxBeds) * 100;
          return (
            <div
              key={room.id}
              className="p-3 bg-white/5 rounded-lg border border-white/10 hover:border-military-500/50 cursor-pointer transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">{room.roomNumber}</span>
                <span
                  className="text-xs px-2 py-0.5 rounded"
                  style={{ backgroundColor: getOccupancyColor(occupancyRate) + '30', color: getOccupancyColor(occupancyRate) }}
                >
                  {occupancyRate.toFixed(0)}%
                </span>
              </div>
              <div className="text-xs text-gray-400 mb-2">
                {room.bedOccupancy}/{room.maxBeds} 床位
              </div>
              {room.soldiers.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {room.soldiers.slice(0, 4).map((s: any) => (
                    <span
                      key={s.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSoldier(s);
                      }}
                      className="text-xs px-1.5 py-0.5 bg-military-600/50 rounded cursor-pointer hover:bg-military-600 transition-colors"
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderTrainingContent = (tg: any) => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-military-400">
        <Target className="w-5 h-5" />
        <span className="font-bold">{tg.name}</span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 bg-white/5 rounded-lg text-center">
          <p className="text-2xl font-bold text-white">{tg.currentSubject}</p>
          <p className="text-xs text-gray-400">当前科目</p>
        </div>
        <div className="p-3 bg-white/5 rounded-lg text-center">
          <p className="text-2xl font-bold text-white">{tg.participantCount}</p>
          <p className="text-xs text-gray-400">参训人数</p>
        </div>
        <div className="p-3 bg-white/5 rounded-lg text-center">
          <p
            className="text-2xl font-bold"
            style={{ color: getOccupancyColor(tg.occupancyRate) }}
          >
            {tg.occupancyRate}%
          </p>
          <p className="text-xs text-gray-400">占用率</p>
        </div>
      </div>

      {tg.occupancyRate >= 80 && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <div className="flex items-center gap-2 text-red-400">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-medium">场地占用率超过80%，已自动调整后续排课</span>
          </div>
        </div>
      )}

      <div>
        <p className="text-sm text-gray-400 mb-2">今日排课</p>
        <div className="space-y-2">
          {tg.schedule.map((sch: any) => (
            <div key={sch.id} className="flex items-center justify-between p-2 bg-white/5 rounded">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-military-500" />
                <span className="text-white text-sm">{sch.subject}</span>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">{sch.startTime} - {sch.endTime}</p>
                <p className="text-xs text-gray-500">{sch.participants}人 · {sch.unit}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderArmoryContent = (arm: any) => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-military-400">
        <Shield className="w-5 h-5" />
        <span className="font-bold">{arm.name}</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {arm.cabinets.map((cab: any) => (
          <div
            key={cab.id}
            className={`p-3 rounded-lg border transition-all ${
              cab.needsMaintenance
                ? 'bg-orange-500/10 border-orange-500/30'
                : 'bg-white/5 border-white/10'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-medium">{cab.cabinetNumber}</span>
              {cab.needsMaintenance && (
                <Wrench className="w-4 h-4 text-orange-500 animate-pulse" />
              )}
            </div>
            <p className="text-sm text-gray-300">{cab.weaponType}</p>
            <p className="text-xs text-gray-400">数量: {cab.quantity}</p>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs text-gray-500">下次保养</span>
              <span
                className="text-xs font-medium"
                style={{ color: getMaintenanceColor(cab.daysUntilMaintenance) }}
              >
                {cab.daysUntilMaintenance}天后
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCanteenContent = (can: any) => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-military-400">
        <UtensilsCrossed className="w-5 h-5" />
        <span className="font-bold">{can.name}</span>
      </div>

      <div className="space-y-3">
        {can.windows.map((win: any) => (
          <div key={win.id} className="p-3 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white font-medium">{win.windowNumber}</span>
              <span className="text-xs text-gray-400">排队: {win.queueCount}人</span>
            </div>
            <div className="space-y-2">
              {win.dishes.map((dish: any) => (
                <div key={dish.id} className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">{dish.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all"
                        style={{
                          width: `${Math.min(100, (dish.stock / dish.safetyThreshold) * 50)}%`,
                          backgroundColor: getStockColor(dish.stock, dish.safetyThreshold),
                        }}
                      />
                    </div>
                    <span
                      className="text-xs font-medium w-12 text-right"
                      style={{ color: getStockColor(dish.stock, dish.safetyThreshold) }}
                    >
                      {dish.stock}{dish.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderGuardPostContent = (gp: any) => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-military-400">
        <User className="w-5 h-5" />
        <span className="font-bold">{gp.name}</span>
      </div>

      <div className="p-4 bg-white/5 rounded-lg border border-white/10">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-full bg-military-600 flex items-center justify-center">
            <User className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-lg">{gp.guard.name}</p>
            <p className="text-sm text-gray-400">{gp.guard.rank} · {gp.guard.unit}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-2 bg-white/5 rounded">
            <p className="text-xl font-bold text-white">{gp.shiftDuration.toFixed(1)}小时</p>
            <p className="text-xs text-gray-400">当班时长</p>
          </div>
          <div className="text-center p-2 bg-white/5 rounded">
            <p className={`text-xl font-bold ${gp.needsRelief ? 'text-orange-500 animate-pulse' : 'text-green-500'}`}>
              {gp.needsRelief ? '需换岗' : '正常'}
            </p>
            <p className="text-xs text-gray-400">状态</p>
          </div>
        </div>

        {gp.needsRelief && permissions?.canApproveGuardRelief && (
          <button
            onClick={() => reliefGuard(gp.id)}
            className="w-full mt-4 py-2 bg-military-600 hover:bg-military-500 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            确认换岗
          </button>
        )}
      </div>
    </div>
  );

  const renderCommandCenterContent = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-military-400">
        <Shield className="w-5 h-5" />
        <span className="font-bold">指挥中心</span>
      </div>
      <p className="text-gray-400">营区指挥中枢，负责全营区的统一调度与指挥。</p>
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-white/5 rounded-lg text-center">
          <p className="text-2xl font-bold text-white">{barracks.length}</p>
          <p className="text-xs text-gray-400">营房数量</p>
        </div>
        <div className="p-3 bg-white/5 rounded-lg text-center">
          <p className="text-2xl font-bold text-white">{guardPosts.length}</p>
          <p className="text-xs text-gray-400">岗哨数量</p>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (selectedBuilding.type) {
      case 'barracks':
        return renderBarracksContent(data);
      case 'trainingGround':
        return renderTrainingContent(data);
      case 'armory':
        return renderArmoryContent(data);
      case 'canteen':
        return renderCanteenContent(data);
      case 'guardPost':
        return renderGuardPostContent(data);
      case 'commandCenter':
        return renderCommandCenterContent();
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 400, opacity: 0 }}
        className="absolute right-0 top-0 h-full w-96 glass-panel border-l border-military-500/30 overflow-y-auto z-40"
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">详细信息</h2>
            <button
              onClick={() => setSelectedBuilding(null)}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          {renderContent()}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default InfoPanel;
