import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTimerStore } from '../store';

export function Onboarding() {
  const hasCompletedOnboarding = useTimerStore((state) => state.hasCompletedOnboarding);
  const onboardingStep = useTimerStore((state) => state.onboardingStep);

  if (hasCompletedOnboarding) return null;

  return (
    <>
      {/* Dark Overlay - sits below the highlighted elements (z-150) */}
      <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-sm pointer-events-auto transition-opacity duration-500" />
      
      {/* Tooltips - sit above the highlighted elements (z-220 to be above everything including modals) */}
      <div className="fixed inset-0 z-[220] pointer-events-none flex items-center justify-center">
        <AnimatePresence mode="wait">
          {onboardingStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute bottom-[40%] text-center pointer-events-none"
            >
              <div className="bg-white text-black px-6 py-4 rounded-2xl max-w-xs mx-auto shadow-2xl">
                <p className="font-semibold text-lg mb-1">Tap to Start</p>
                <p className="text-sm opacity-80">This is your interaction pad. Tap it to start or stop the timer.</p>
                <div className="mt-3 text-xs font-bold uppercase tracking-widest text-emerald-600 animate-pulse">Tap the pad to continue</div>
              </div>
              {/* Arrow pointing down */}
              <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[15px] border-t-white mx-auto mt-2" />
            </motion.div>
          )}
          {onboardingStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute top-[100px] text-center pointer-events-none"
            >
              {/* Arrow pointing up */}
              <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[15px] border-b-white mx-auto mb-2" />
              <div className="bg-white text-black px-6 py-4 rounded-2xl max-w-xs mx-auto shadow-2xl">
                <p className="font-semibold text-lg mb-1">Dynamic Island</p>
                <p className="text-sm opacity-80">Tap to open the difficulty settings.</p>
                <div className="mt-3 text-xs font-bold uppercase tracking-widest text-emerald-600 animate-pulse">Tap the island</div>
              </div>
            </motion.div>
          )}
          {onboardingStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute top-[260px] text-center pointer-events-none"
            >
              {/* Arrow pointing up */}
              <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[15px] border-b-white mx-auto mb-2" />
              <div className="bg-white text-black px-6 py-4 rounded-2xl max-w-xs mx-auto shadow-2xl">
                <p className="font-semibold text-lg mb-1">Select Difficulty</p>
                <p className="text-sm opacity-80">Choose your focus mode. Harder modes might track stricter times.</p>
                <div className="mt-3 text-xs font-bold uppercase tracking-widest text-emerald-600 animate-pulse">Select an option</div>
              </div>
            </motion.div>
          )}
          {onboardingStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute top-[80px] left-[20px] pointer-events-none"
            >
              {/* Arrow pointing up-left */}
              <div className="w-0 h-0 border-r-[15px] border-r-transparent border-b-[15px] border-b-white ml-4 mb-2" />
              <div className="bg-white text-black px-6 py-4 rounded-2xl max-w-xs shadow-2xl">
                <p className="font-semibold text-lg mb-1">Track Progress</p>
                <p className="text-sm opacity-80">Tap here to view your past sessions and analyze your study patterns.</p>
                <div className="mt-3 text-xs font-bold uppercase tracking-widest text-emerald-600 animate-pulse">Tap to open tracker</div>
              </div>
            </motion.div>
          )}
          {onboardingStep === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="absolute top-[80px] right-[20px] pointer-events-none"
            >
              {/* Arrow pointing up-right */}
              <div className="w-0 h-0 border-l-[15px] border-l-transparent border-b-[15px] border-b-white mr-4 mb-2 float-right clear-both" />
              <div className="bg-white text-black px-6 py-4 rounded-2xl max-w-xs shadow-2xl clear-both">
                <p className="font-semibold text-lg mb-1">You're All Set!</p>
                <p className="text-sm opacity-80">This is your progress dashboard. Close it to finish the tutorial and start studying.</p>
                <div className="mt-3 text-xs font-bold uppercase tracking-widest text-emerald-600 animate-pulse">Tap close to finish</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
