import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, XCircle, Clock, ChevronRight, User, FileText } from 'lucide-react';
import { useBuildingStore } from '../../store/useBuildingStore';
import { useAuthStore } from '../../store/useAuthStore';
import { PurchaseRequest } from '../../utils/types';

interface Props {
  onClose: () => void;
}

const PurchaseApprovalPanel = ({ onClose }: Props) => {
  const { purchaseRequests, approvePurchaseRequest, rejectPurchaseRequest } = useBuildingStore();
  const { currentUser } = useAuthStore();
  const [selectedRequest, setSelectedRequest] = useState<PurchaseRequest | null>(null);
  const [comment, setComment] = useState('');

  const getApprovalStep = (status: string) => {
    if (status === 'pending') return 0;
    if (status === 'approved1') return 1;
    if (status === 'approved2') return 2;
    if (status === 'approved') return 3;
    if (status === 'rejected') return -1;
    return 0;
  };

  const getCurrentStep = (req: PurchaseRequest) => getApprovalStep(req.status);

  const canApprove = (req: PurchaseRequest) => {
    if (!currentUser) return false;
    const step = getCurrentStep(req);
    if (step === 0 && currentUser.role === '连长') return true;
    if (step === 1 && currentUser.role === '营长') return true;
    if (step === 2 && currentUser.role === '旅长') return true;
    return false;
  };

  const getRoleLabel = (index: number) => {
    const roles = ['司务长提交', '后勤处长审批', '政委审批', '完成'];
    return roles[index];
  };

  const handleApprove = () => {
    if (!selectedRequest || !currentUser) return;
    const roleMap: Record<string, string> = {
      '连长': '司务长',
      '营长': '后勤处长',
      '旅长': '政委',
    };
    approvePurchaseRequest(selectedRequest.id, roleMap[currentUser.role] || currentUser.role, comment);
    setComment('');
    setSelectedRequest(null);
  };

  const handleReject = () => {
    if (!selectedRequest || !currentUser) return;
    const roleMap: Record<string, string> = {
      '连长': '司务长',
      '营长': '后勤处长',
      '旅长': '政委',
    };
    rejectPurchaseRequest(selectedRequest.id, roleMap[currentUser.role] || currentUser.role, comment);
    setComment('');
    setSelectedRequest(null);
  };

  const steps = [
    { key: 'submit', label: '司务长提交' },
    { key: 'logistics', label: '后勤处长审批' },
    { key: 'political', label: '政委审批' },
    { key: 'complete', label: '完成' },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-navy-900/95 border border-military-500/30 rounded-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-military-400" />
              <h2 className="text-xl font-bold text-white">食堂采购审批</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="flex h-[65vh]">
            <div className="w-2/5 border-r border-white/10 overflow-y-auto p-4 space-y-3">
              <p className="text-sm text-gray-400 mb-2">采购申请列表</p>
              {purchaseRequests.map((req) => {
                const step = getCurrentStep(req);
                const isRejected = step === -1;
                return (
                  <div
                    key={req.id}
                    onClick={() => setSelectedRequest(req)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedRequest?.id === req.id
                        ? 'bg-military-600/30 border-military-500'
                        : 'bg-white/5 border-white/10 hover:border-military-500/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">{req.dishName}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        isRejected
                          ? 'bg-red-500/20 text-red-400'
                          : step >= 3
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-orange-500/20 text-orange-400'
                      }`}>
                        {isRejected ? '已拒绝' : step >= 3 ? '已完成' : `第${step + 1}步`}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">
                      数量: {req.quantity}{req.unit} · 申请人: {req.applicant}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{req.applyTime}</p>
                  </div>
                );
              })}
            </div>

            <div className="w-3/5 p-6 overflow-y-auto">
              {selectedRequest ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">{selectedRequest.dishName}</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-3 bg-white/5 rounded-lg">
                        <p className="text-2xl font-bold text-white">{selectedRequest.quantity}</p>
                        <p className="text-xs text-gray-400">采购数量</p>
                      </div>
                      <div className="p-3 bg-white/5 rounded-lg">
                        <p className="text-2xl font-bold text-white">{selectedRequest.unit}</p>
                        <p className="text-xs text-gray-400">单位</p>
                      </div>
                      <div className="p-3 bg-white/5 rounded-lg">
                        <p className="text-lg font-bold text-military-400">{selectedRequest.applicant}</p>
                        <p className="text-xs text-gray-400">申请人</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400 mb-4">审批流程</p>
                    <div className="relative">
                      <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-700" />
                      <div className="flex justify-between relative">
                        {steps.map((step, index) => {
                          const currentStep = getCurrentStep(selectedRequest);
                          const isCompleted = currentStep > index || currentStep >= 3;
                          const isCurrent = currentStep === index;
                          const isRejected = currentStep === -1;
                          
                          return (
                            <div key={step.key} className="flex flex-col items-center z-10">
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                                  isRejected
                                    ? 'bg-red-500 border-red-500 text-white'
                                    : isCompleted
                                    ? 'bg-military-500 border-military-500 text-white'
                                    : isCurrent
                                    ? 'bg-navy-800 border-military-500 text-military-400 animate-pulse'
                                    : 'bg-navy-800 border-gray-600 text-gray-500'
                                }`}
                              >
                                {isRejected ? (
                                  <XCircle className="w-5 h-5" />
                                ) : isCompleted ? (
                                  <Check className="w-5 h-5" />
                                ) : (
                                  <Clock className="w-5 h-5" />
                                )}
                              </div>
                              <p className={`text-xs mt-2 text-center ${
                                isCompleted || isCurrent ? 'text-white' : 'text-gray-500'
                              }`}>
                                {step.label}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm text-gray-400">审批记录</p>
                    {selectedRequest.approvals.map((approval, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border ${
                          approval.status === 'approved'
                            ? 'bg-green-500/10 border-green-500/30'
                            : approval.status === 'rejected'
                            ? 'bg-red-500/10 border-red-500/30'
                            : 'bg-white/5 border-white/10'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="text-white text-sm">{approval.role}</span>
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            approval.status === 'approved'
                              ? 'bg-green-500/20 text-green-400'
                              : approval.status === 'rejected'
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-gray-500/20 text-gray-400'
                          }`}>
                            {approval.status === 'approved' ? '已通过' : approval.status === 'rejected' ? '已拒绝' : '待审批'}
                          </span>
                        </div>
                        {approval.time && (
                          <>
                            <p className="text-xs text-gray-400">{approval.time}</p>
                            {approval.comment && (
                              <p className="text-xs text-gray-300 mt-1">备注: {approval.comment}</p>
                            )}
                          </>
                        )}
                      </div>
                    ))}
                  </div>

                  {canApprove(selectedRequest) && (
                    <div className="pt-4 border-t border-white/10">
                      <p className="text-sm text-gray-400 mb-3">您的审批意见</p>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="请输入审批备注（可选）"
                        className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-military-500 resize-none"
                        rows={3}
                      />
                      <div className="flex gap-3 mt-4">
                        <button
                          onClick={handleReject}
                          className="flex-1 py-3 bg-red-600/20 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors flex items-center justify-center gap-2"
                        >
                          <XCircle className="w-5 h-5" />
                          拒绝
                        </button>
                        <button
                          onClick={handleApprove}
                          className="flex-1 py-3 bg-military-600 text-white rounded-lg hover:bg-military-500 transition-colors flex items-center justify-center gap-2"
                        >
                          <Check className="w-5 h-5" />
                          通过
                        </button>
                      </div>
                    </div>
                  )}

                  {!canApprove(selectedRequest) && getCurrentStep(selectedRequest) < 3 && getCurrentStep(selectedRequest) !== -1 && (
                    <div className="pt-4 border-t border-white/10">
                      <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                        <p className="text-orange-400 text-sm flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          当前审批需由 {getRoleLabel(getCurrentStep(selectedRequest) + 1).replace('审批', '')} 处理
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <FileText className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-500">请选择一个采购申请查看详情</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PurchaseApprovalPanel;
