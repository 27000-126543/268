import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Award, Target, Calendar } from 'lucide-react';
import { usePersonnelStore } from '../../store/usePersonnelStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SoldierDetailModal = () => {
  const { selectedSoldier, setSelectedSoldier } = usePersonnelStore();

  if (!selectedSoldier) return null;

  const chartData = selectedSoldier.trainingScores.map(score => ({
    name: score.subject,
    score: score.score,
    fullMark: 100,
  }));

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedSoldier(null)}
        />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-2xl glass-panel rounded-2xl overflow-hidden shadow-2xl"
        >
          <div className="p-6 border-b border-military-500/30 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-military-600 flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{selectedSoldier.name}</h2>
              <p className="text-gray-400">{selectedSoldier.rank} · {selectedSoldier.unit}</p>
            </div>
          </div>
          <button
            onClick={() => setSelectedSoldier(null)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-white/5 rounded-xl">
              <div className="flex items-center gap-2 text-military-400 mb-2">
                <Target className="w-5 h-5" />
                <span className="text-sm text-gray-400">当前位置</span>
              </div>
              <p className="text-white font-medium">
                X: {selectedSoldier.position.x.toFixed(1)}, Z: {selectedSoldier.position.z.toFixed(1)}
              </p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl">
              <div className="flex items-center gap-2 text-military-400 mb-2">
                <Award className="w-5 h-5" />
                <span className="text-sm text-gray-400">平均成绩</span>
              </div>
              <p className="text-white font-medium text-xl">
                {selectedSoldier.trainingScores.reduce((sum, s) => sum + s.score, 0) / selectedSoldier.trainingScores.length | 0}分
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-military-400" />
              训练成绩
            </h3>
            <div className="h-64 bg-white/5 rounded-xl p-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="name" stroke="#888" />
                  <YAxis stroke="#888" domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1a2e',
                      border: '1px solid #2C5F2D',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="score" fill="#2C5F2D" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-military-400" />
              成绩详情
            </h3>
            <div className="space-y-2">
              {selectedSoldier.trainingScores.map((score, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                >
                  <span className="text-white">{score.subject}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-400 text-sm">{score.date}</span>
                    <span
                      className={`font-bold ${
                        score.score >= 90 ? 'text-green-500' :
                        score.score >= 80 ? 'text-blue-500' :
                        score.score >= 70 ? 'text-yellow-500' : 'text-red-500'
                      }`}
                    >
                      {score.score}分
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SoldierDetailModal;
