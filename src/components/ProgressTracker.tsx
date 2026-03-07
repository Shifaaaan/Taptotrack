import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTimerStore } from '../store';
import { cn, springConfig, formatTime } from '../utils';

interface ProgressTrackerProps {
  isOpen: boolean;
  onClose: () => void;
}

type SortOption = 'Time (Low to High)' | 'Time (High to Low)' | 'Question #';

export function ProgressTracker({ isOpen, onClose }: ProgressTrackerProps) {
  const records = useTimerStore((state) => state.records);
  const clearRecords = useTimerStore((state) => state.clearRecords);
  const [sortOption, setSortOption] = useState<SortOption>('Time (Low to High)');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const sortedRecords = useMemo(() => {
    return [...records].sort((a, b) => {
      if (sortOption === 'Time (Low to High)') return a.timeMs - b.timeMs;
      if (sortOption === 'Time (High to Low)') return b.timeMs - a.timeMs;
      return a.questionNumber - b.questionNumber;
    });
  }, [records, sortOption]);

  const maxTime = useMemo(() => {
    if (records.length === 0) return 1;
    return Math.max(...records.map(r => r.timeMs));
  }, [records]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xl z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={springConfig}
            className="fixed inset-x-0 bottom-0 top-24 bg-[#0a0a0a] rounded-t-[2.5rem] ring-1 ring-white/10 shadow-[0_-20px_40px_rgba(0,0,0,0.5)] z-[101] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-8 border-b border-white/5">
              <h2 className="text-2xl font-semibold tracking-tight">Session Progress</h2>
              
              <div className="flex items-center gap-4">
                {/* Sort Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 ring-1 ring-white/10 transition-colors text-sm font-medium"
                  >
                    {sortOption}
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("transition-transform", isDropdownOpen && "rotate-180")}>
                      <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-48 bg-[#141414]/80 backdrop-blur-xl rounded-2xl ring-1 ring-white/10 shadow-2xl overflow-hidden z-50"
                      >
                        {(['Time (Low to High)', 'Time (High to Low)', 'Question #'] as SortOption[]).map((opt) => (
                          <button
                            key={opt}
                            onClick={() => { setSortOption(opt); setIsDropdownOpen(false); }}
                            className={cn(
                              "w-full text-left px-4 py-3 text-sm transition-colors hover:bg-white/5",
                              sortOption === opt ? "text-white font-medium bg-white/5" : "text-white/60"
                            )}
                          >
                            {opt}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button 
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 13L13 1M1 1L13 13" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* List View */}
            <div className="flex-1 overflow-y-auto p-8 space-y-4">
              {sortedRecords.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-white/40">
                  <div className="w-16 h-16 mb-4 rounded-full bg-white/5 flex items-center justify-center ring-1 ring-white/10">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  </div>
                  <p>No records yet. Start solving!</p>
                </div>
              ) : (
                sortedRecords.map((record, index) => {
                  const widthPercent = Math.max(2, (record.timeMs / maxTime) * 100);
                  return (
                    <motion.div
                      key={record.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, ...springConfig }}
                      className="flex items-center gap-6 p-4 rounded-2xl bg-white/[0.02] ring-1 ring-white/5 hover:bg-white/[0.04] transition-colors"
                    >
                      <div className="w-16 text-left">
                        <span className="text-white/40 text-xs font-medium uppercase tracking-wider block mb-1">Q{record.questionNumber}</span>
                        <span className={cn(
                          "text-xs font-semibold px-2 py-0.5 rounded-full ring-1",
                          record.difficulty === 'Easy' ? "text-emerald-400 ring-emerald-400/30 bg-emerald-400/10" :
                          record.difficulty === 'Normal' ? "text-amber-400 ring-amber-400/30 bg-amber-400/10" :
                          "text-rose-400 ring-rose-400/30 bg-rose-400/10"
                        )}>
                          {record.difficulty}
                        </span>
                      </div>

                      <div className="flex-1 h-12 relative flex items-center">
                        <motion.div 
                          className="absolute left-0 h-full bg-white/10 rounded-lg ring-1 ring-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
                          initial={{ width: 0 }}
                          animate={{ width: `${widthPercent}%` }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                        />
                        <span className="absolute left-4 font-mono text-sm tracking-tight font-medium z-10 mix-blend-difference text-white">
                          {formatTime(record.timeMs)}
                        </span>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
            
            {records.length > 0 && (
              <div className="p-6 border-t border-white/5 flex justify-center">
                <button
                  onClick={clearRecords}
                  className="text-sm text-rose-500 font-medium hover:text-rose-400 transition-colors"
                >
                  Clear All Records
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
