import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTimerStore, Difficulty } from '../store';
import { cn, springConfig } from '../utils';

export function DynamicIsland() {
  const [isExpanded, setIsExpanded] = useState(false);
  const difficulty = useTimerStore((state) => state.difficulty);
  const setDifficulty = useTimerStore((state) => state.setDifficulty);
  const islandRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (islandRef.current && !islandRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const difficulties: { label: Difficulty; color: string; activeColor: string }[] = [
    { label: 'Easy', color: 'text-emerald-500', activeColor: 'bg-emerald-500' },
    { label: 'Normal', color: 'text-amber-500', activeColor: 'bg-amber-500' },
    { label: 'Hard', color: 'text-rose-500', activeColor: 'bg-rose-500' },
  ];

  const butterySpring = {
    type: "spring",
    stiffness: 200,
    damping: 24,
    mass: 0.6,
    restDelta: 0.001
  };

  return (
    <motion.div
      ref={islandRef}
      layout
      initial={false}
      animate={{
        width: isExpanded ? 300 : 160,
        height: isExpanded ? 200 : 36,
        borderRadius: isExpanded ? 32 : 18,
      }}
      transition={butterySpring}
      onClick={() => !isExpanded && setIsExpanded(true)}
      className={cn(
        "bg-black ring-1 ring-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_10px_40px_rgba(0,0,0,0.5)]",
        "flex flex-col overflow-hidden cursor-pointer relative z-50",
        !isExpanded && "items-center justify-center hover:bg-white/[0.02]"
      )}
    >
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          <motion.div
            key="collapsed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-2"
          >
            <div className={cn(
              "w-2 h-2 rounded-full",
              difficulty === 'Easy' ? 'bg-emerald-500' :
              difficulty === 'Normal' ? 'bg-amber-500' : 'bg-rose-500'
            )} />
            <span className="text-sm font-medium text-white/80">{difficulty}</span>
          </motion.div>
        ) : (
          <motion.div
            key="expanded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            className="flex flex-col p-6 w-full h-full cursor-default"
          >
            <div className="flex justify-between items-center mb-6">
              <span className="text-white/60 text-sm font-medium uppercase tracking-wider">Difficulty</span>
              <button 
                onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }}
                className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20"
              >
                <svg width="10" height="10" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 13L13 1M1 1L13 13" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            <div className="relative h-14 flex items-center bg-white/5 rounded-full p-1 ring-1 ring-white/10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] mt-auto mb-4">
              {difficulties.map((diff) => {
                const isActive = difficulty === diff.label;
                return (
                  <button
                    key={diff.label}
                    onClick={(e) => { e.stopPropagation(); setDifficulty(diff.label); }}
                    className="relative flex-1 h-full flex items-center justify-center z-10"
                  >
                    <span className={cn(
                      "text-sm font-medium z-20 transition-colors duration-300",
                      isActive ? diff.color : "text-white/60 hover:text-white"
                    )}>
                      {diff.label}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="active-difficulty"
                        className="absolute inset-0 bg-white rounded-full shadow-sm"
                        transition={butterySpring}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
