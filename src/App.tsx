import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTimerStore } from './store';
import { cn, springConfig } from './utils';
import { DynamicIsland } from './components/DynamicIsland';
import { ProgressTracker } from './components/ProgressTracker';
import { TimerDisplay } from './components/TimerDisplay';
import { Onboarding } from './components/Onboarding';
import { BarChart2 } from 'lucide-react';

type TimerStatus = 'IDLE' | 'RUNNING' | 'STOPPED';

export default function App() {
  const [status, setStatus] = useState<TimerStatus>('IDLE');
  const [finalTimeMs, setFinalTimeMs] = useState(0);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  
  const addRecord = useTimerStore((state) => state.addRecord);
  const hasCompletedOnboarding = useTimerStore((state) => state.hasCompletedOnboarding);
  const onboardingStep = useTimerStore((state) => state.onboardingStep);
  const advanceOnboarding = useTimerStore((state) => state.advanceOnboarding);
  const completeOnboarding = useTimerStore((state) => state.completeOnboarding);

  const holdTimeoutRef = useRef<number | null>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    
    if (!hasCompletedOnboarding) {
      if (onboardingStep === 1) advanceOnboarding();
      return;
    }

    if (status === 'IDLE' || status === 'STOPPED') {
      // Instant start on tap
      setStatus('RUNNING');
    } else if (status === 'RUNNING') {
      setStatus('STOPPED');
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    e.preventDefault();
    // No longer needed for tap-to-start
  };

  const handleReject = () => {
    setStatus('IDLE');
    setFinalTimeMs(0);
  };

  const handleApprove = () => {
    addRecord(finalTimeMs);
    setStatus('IDLE');
    setFinalTimeMs(0);
  };

  useEffect(() => {
    return () => {
      if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black text-white overflow-hidden font-sans selection:bg-white/20 flex flex-col">
      {/* Atmospheric Violet Gradient */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-500/10 via-purple-900/5 to-transparent opacity-50" />
      
      {/* Dot Grid Background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: 'radial-gradient(circle at center, white 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* Top Bar */}
      <div className={cn(
        "relative flex items-start justify-between p-6 pointer-events-none",
        !hasCompletedOnboarding && (onboardingStep === 2 || onboardingStep === 3 || onboardingStep === 4) ? "z-[160]" : "z-50"
      )}>
        <div className={cn(
          "pointer-events-auto rounded-full transition-all duration-300",
          !hasCompletedOnboarding && onboardingStep === 4 && "ring-4 ring-emerald-500/50 bg-white/10"
        )}>
          <button 
            onClick={() => {
              if (!hasCompletedOnboarding) {
                if (onboardingStep === 4) {
                  setIsTrackerOpen(true);
                  advanceOnboarding();
                }
                return;
              }
              setIsTrackerOpen(true);
            }}
            className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md hover:bg-white/10 transition-colors shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
          >
            <BarChart2 className="w-6 h-6 text-white opacity-80" />
          </button>
        </div>
        
        <div className="pointer-events-auto flex-1 flex justify-center">
          <DynamicIsland />
        </div>
        
        <div className="w-12 h-12" /> {/* Spacer for balance */}
      </div>

      {/* Main Layout Grid */}
      <div className={cn(
        "flex-1 flex flex-col px-6 pb-6 relative",
        !hasCompletedOnboarding && onboardingStep === 1 ? "z-[160]" : "z-10"
      )}>
        {/* Display Zone (Top 50%) */}
        <div className="flex-1 flex items-center justify-center min-h-0">
          <TimerDisplay 
            status={status} 
            onTimeUpdate={(time) => setFinalTimeMs(time)} 
          />
        </div>

        {/* Interaction Pad (Bottom 50%) */}
        <motion.div
          className={cn(
            "flex-1 relative min-h-0",
            !hasCompletedOnboarding && onboardingStep === 1 ? "z-[160]" : "z-10"
          )}
          animate={{
            paddingBottom: status === 'STOPPED' ? '120px' : '16px'
          }}
          transition={springConfig}
        >
          <motion.div
            onPointerDown={handlePointerDown}
            className={cn(
              "w-full h-full rounded-[2rem] md:rounded-[3rem] bg-white/[0.02] backdrop-blur-sm",
              "ring-1 ring-white/10 shadow-[inset_0_2px_10px_rgba(255,255,255,0.05)]",
              "flex items-center justify-center cursor-pointer touch-none",
              !hasCompletedOnboarding && onboardingStep === 1 && "ring-4 ring-emerald-500/50 bg-white/10"
            )}
            whileTap={{ scale: 0.98, backgroundColor: 'rgba(255,255,255,0.05)' }}
            animate={{
              backgroundColor: status === 'RUNNING' ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)'
            }}
            transition={springConfig}
          >
            {status === 'IDLE' && (
              <span className="text-white/20 font-medium tracking-widest uppercase text-sm md:text-base">
                Tap to Start
              </span>
            )}
            {status === 'STOPPED' && (
              <span className="text-white/20 font-medium tracking-widest uppercase text-sm md:text-base">
                Tap to Resume
              </span>
            )}
          </motion.div>

          {/* Action Bar */}
          <AnimatePresence>
            {status === 'STOPPED' && (
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 40, scale: 0.95 }}
                transition={springConfig}
                className="absolute bottom-8 left-0 right-0 flex justify-center gap-4 px-4 pointer-events-auto"
              >
                <div className="flex p-2 bg-black/80 backdrop-blur-xl rounded-full ring-1 ring-white/10 shadow-2xl">
                  <button
                    onClick={handleReject}
                    className="px-8 py-4 rounded-full text-rose-500 font-semibold hover:bg-white/5 transition-colors"
                  >
                    Reject / Reset
                  </button>
                  <div className="w-px bg-white/10 my-2 mx-2" />
                  <button
                    onClick={handleApprove}
                    className="px-8 py-4 rounded-full text-emerald-500 font-semibold hover:bg-white/5 transition-colors"
                  >
                    Approve / Save
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Progress Tracker Modal */}
      <ProgressTracker isOpen={isTrackerOpen} onClose={() => setIsTrackerOpen(false)} />

      {/* One-time Onboarding Overlay */}
      <Onboarding />
    </div>
  );
}
