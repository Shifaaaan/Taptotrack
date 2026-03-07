import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { cn, formatTime, springConfig } from '../utils';

interface TimerDisplayProps {
  status: 'IDLE' | 'RUNNING' | 'STOPPED';
  onTimeUpdate: (timeMs: number) => void;
  initialTime?: number;
}

export function TimerDisplay({ status, onTimeUpdate, initialTime = 0 }: TimerDisplayProps) {
  const [timeMs, setTimeMs] = useState(initialTime);
  const requestRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const onTimeUpdateRef = useRef(onTimeUpdate);

  useEffect(() => {
    onTimeUpdateRef.current = onTimeUpdate;
  }, [onTimeUpdate]);

  useEffect(() => {
    if (status === 'IDLE') {
      setTimeMs(0);
    } else if (status === 'RUNNING') {
      startTimeRef.current = performance.now();
      const updateTimer = () => {
        const current = performance.now() - startTimeRef.current;
        setTimeMs(current);
        requestRef.current = requestAnimationFrame(updateTimer);
      };
      requestRef.current = requestAnimationFrame(updateTimer);
    } else if (status === 'STOPPED') {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      const finalTime = performance.now() - startTimeRef.current;
      setTimeMs(finalTime);
      onTimeUpdateRef.current(finalTime);
    }

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [status]);

  let timerColor = 'text-white';
  if (status === 'RUNNING') timerColor = 'text-emerald-500';

  return (
    <motion.div 
      className={cn(
        "text-[20vw] md:text-[12rem] leading-none font-medium tracking-tighter tabular-nums font-timer inline-block scale-y-105",
        timerColor
      )}
      style={{ fontStretch: 'condensed' }}
      animate={{ scale: status === 'RUNNING' ? 1.02 : 1 }}
      transition={springConfig}
    >
      {formatTime(timeMs)}
    </motion.div>
  );
}
