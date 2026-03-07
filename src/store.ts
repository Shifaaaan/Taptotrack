import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Difficulty = 'Easy' | 'Normal' | 'Hard';

export interface Record {
  id: string;
  questionNumber: number;
  timeMs: number;
  difficulty: Difficulty;
  timestamp: number;
}

interface TimerState {
  records: Record[];
  difficulty: Difficulty;
  nextQuestionNumber: number;
  hasCompletedOnboarding: boolean;
  onboardingStep: number;
  setDifficulty: (diff: Difficulty) => void;
  addRecord: (timeMs: number) => void;
  clearRecords: () => void;
  advanceOnboarding: () => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

export const useTimerStore = create<TimerState>()(
  persist(
    (set) => ({
      records: [],
      difficulty: 'Normal',
      nextQuestionNumber: 1,
      hasCompletedOnboarding: false,
      onboardingStep: 1,
      setDifficulty: (diff) => set({ difficulty: diff }),
      addRecord: (timeMs) =>
        set((state) => ({
          records: [
            ...state.records,
            {
              id: crypto.randomUUID(),
              questionNumber: state.nextQuestionNumber,
              timeMs,
              difficulty: state.difficulty,
              timestamp: Date.now(),
            },
          ],
          nextQuestionNumber: state.nextQuestionNumber + 1,
        })),
      clearRecords: () => set({ records: [], nextQuestionNumber: 1 }),
      advanceOnboarding: () => set((state) => ({ onboardingStep: state.onboardingStep + 1 })),
      completeOnboarding: () => set({ hasCompletedOnboarding: true, onboardingStep: 0 }),
      resetOnboarding: () => set({ hasCompletedOnboarding: false, onboardingStep: 1 }),
    }),
    {
      name: 'study-timer-storage',
    }
  )
);

