import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, FileSpreadsheet, Calendar, Building2, Target, Shield, Users, CheckCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useBuildingStore } from '../store/useBuildingStore';
import { usePersonnelStore } from '../store/usePersonnelStore';
import { formatDate } from '../utils/helpers';

const ExportPage = () => {
  const navigate = useNavigate();
  const { barracks, trainingGround, armory, guardPosts } = useBuildingStore();
  const { soldiers } = usePersonnelStore();
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [exporting, setExporting] = useState(false);

  const handleExport = () => {
    setExporting(true);

    setTimeout(() => {
      const wb = XLSX.utils.book_new();

      const barracksData = barracks.flatMap(b =>
        b.rooms.map(r => ({
          '营房名称': b.name,
          '房间编号': r.roomNumber,
          '入住人数': r.bedOccupancy,
          '总床位数': r.maxBeds,
          '入住率(%)': ((r.bedOccupancy / r.maxBeds) * 100).toFixed(1),
          '入住人员': r.soldiers.map(s => s.name).join(', ') || '无',
        }))
      );
      const ws1 = XLSX.utils.json_to_sheet(barracksData);
      XLSX.utils.book_append_sheet(wb, ws1, '营房统计');

      const trainingData = [
        {
          '训练场名称': trainingGround.name,
          '当前科目': trainingGround.currentSubject,
          '参训人数': trainingGround.participantCount,
          '容量': trainingGround.capacity,
          '占用率(%)': trainingGround.occupancyRate,
        },
        ...trainingGround.schedule.map(s => ({
          '训练场名称': '',
          '当前科目': s.subject,
          '参训人数': s.participants,
          '容量': s.unit,
          '占用率(%)': `${s.startTime} - ${s.endTime}`,
        })),
      ];
      const ws2 = XLSX.utils.json_to_sheet(trainingData);
      XLSX.utils.book_append_sheet(wb, ws2, '训练场统计');

      const armoryData = armory.cabinets.map(c => ({
        '武器柜编号': c.cabinetNumber,
        '武器类型': c.weaponType,
        '数量': c.quantity,
        '上次保养日期': c.lastMaintenanceDate,
        '下次保养日期': c.nextMaintenanceDate,
        '剩余保养天数': c.daysUntilMaintenance,
        '是否需要保养': c.needsMaintenance ? '是' : '否',
      }));
      const ws3 = XLSX.utils.json_to_sheet(armoryData);
      XLSX.utils.book_append_sheet(wb, ws3, '武器保养统计');

      const guardData = guardPosts.map(g => ({
        '岗哨名称': g.name,
        '值班人员': g.guard.name,
        '军衔': g.guard.rank,
        '所属单位': g.guard.unit,
        '当班时长(小时)': g.shiftDuration.toFixed(1),
        '是否需要换岗': g.needsRelief ? '是' : '否',
      }));
      const ws4 = XLSX.utils.json_to_sheet(guardData);
      XLSX.utils.book_append_sheet(wb, ws4, '岗哨统计');

      const summaryData = [{
        '统计日期': selectedDate,
        '营房总数': barracks.length,
        '房间总数': barracks.reduce((s, b) => s + b.rooms.length, 0),
        '总床位数': barracks.reduce((s, b) => s + b.rooms.reduce((s2, r) => s2 + r.maxBeds, 0), 0),
        '平均入住率(%)': (
          barracks.reduce((s, b) =>
            s + b.rooms.reduce((s2, r) => s2 + (r.bedOccupancy / r.maxBeds * 100), 0), 0) /
          barracks.reduce((s, b) => s + b.rooms.length, 0)
        ).toFixed(1),
        '武器总数': armory.cabinets.reduce((s, c) => s + c.quantity, 0),
        '待保养武器柜数': armory.cabinets.filter(c => c.needsMaintenance).length,
        '岗哨总数': guardPosts.length,
        '需换岗数': guardPosts.filter(g => g.needsRelief).length,
        '人员总数': soldiers.length,
      }];
      const ws5 = XLSX.utils.json_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(wb, ws5, '综合汇总');

      XLSX.writeFile(wb, `智慧军营日报_${selectedDate}.xlsx`);
      setExporting(false);
    }, 1000);
  };

  const stats = [
    {
      icon: Building2,
      label: '营房数量',
      value: barracks.length,
      subtext: `${barracks.reduce((s, b) => s + b.rooms.length, 0)}个房间`,
      color: 'text-military-400',
    },
    {
      icon: Target,
      label: '训练场使用',
      value: `${trainingGround.occupancyRate}%`,
      subtext: `${trainingGround.participantCount}人参训`,
      color: 'text-blue-400',
    },
    {
      icon: Shield,
      label: '武器总数',
      value: armory.cabinets.reduce((s, c) => s + c.quantity, 0),
      subtext: `${armory.cabinets.filter(c => c.needsMaintenance).length}个待保养`,
      color: 'text-orange-400',
    },
    {
      icon: Users,
      label: '岗哨数量',
      value: guardPosts.length,
      subtext: `${guardPosts.filter(g => g.needsRelief).length}个需换岗`,
      color: 'text-green-400',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-military-900 p-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white font-orbitron">数据导出</h1>
            <p className="text-gray-400">导出智慧军营综合日报Excel</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-4 gap-4 mb-8"
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="glass-panel rounded-xl p-5 border border-white/10"
            >
              <stat.icon className={`w-8 h-8 mb-3 ${stat.color}`} />
              <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-sm text-gray-400">{stat.label}</p>
              <p className="text-xs text-gray-500">{stat.subtext}</p>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-panel rounded-2xl p-8 border border-white/10"
        >
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-military-400" />
            导出配置
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                选择日期
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-military-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">包含内容</label>
              <div className="space-y-2">
                {['营房入住统计', '训练场使用统计', '武器保养统计', '岗哨值班统计'].map((item, i) => (
                  <label key={i} className="flex items-center gap-2 text-gray-300">
                    <input type="checkbox" defaultChecked className="rounded bg-white/5" />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">导出文件</p>
                <p className="text-sm text-gray-500">Excel格式 (.xlsx)，包含5个工作表</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExport}
                disabled={exporting}
                className="px-8 py-3 bg-military-600 hover:bg-military-500 text-white rounded-xl font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                {exporting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    导出中...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    导出Excel
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 p-4 bg-military-500/10 border border-military-500/30 rounded-xl"
        >
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-military-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-military-300 font-medium">数据说明</p>
              <p className="text-sm text-gray-400">
                导出的Excel文件包含营房入住率、训练场使用情况、武器保养情况和岗哨统计等综合数据。
                所有数据均为系统实时数据，导出时间以导出时刻为准。
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ExportPage;
