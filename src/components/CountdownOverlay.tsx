import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundEffects } from '../utils/soundEffects';
import { StudentCandidate } from '../types';
import { Sparkles, Zap } from 'lucide-react';

interface CountdownOverlayProps {
  candidate: StudentCandidate;
  initialSeconds: number;
  soundEnabled: boolean;
  onComplete: () => void;
  onCancel: () => void;
}

export const CountdownOverlay: React.FC<CountdownOverlayProps> = ({
  candidate,
  initialSeconds,
  soundEnabled,
  onComplete,
  onCancel,
}) => {
  const [count, setCount] = useState(initialSeconds);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // Timer only decrements; state updaters must stay pure (StrictMode runs them twice)
  useEffect(() => {
    if (soundEnabled) {
      soundEffects.startDrumRoll(initialSeconds + 0.5);
    }

    const interval = window.setInterval(() => {
      setCount((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => {
      window.clearInterval(interval);
      if (soundEnabled) {
        soundEffects.stopDrumRoll();
      }
    };
  }, [initialSeconds, soundEnabled]);

  // Side effects for each tick, and a single reveal when we hit zero
  useEffect(() => {
    if (count > 0) {
      if (soundEnabled) {
        soundEffects.playCountdownTick(count);
      }
      return;
    }
    if (soundEnabled) {
      soundEffects.stopDrumRoll();
    }
    onCompleteRef.current();
  }, [count, soundEnabled]);

  return (
    <div
      id="countdown-overlay"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-brand-navy-deep/95 text-white select-none overflow-hidden"
    >
      {/* Background martial arts dynamic energy rings */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.15, 0.35, 0.15],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          className="w-[600px] h-[600px] md:w-[850px] md:h-[850px] rounded-full border border-brand-red/25 border-dashed"
        />
        <motion.div
          animate={{
            scale: [1.2, 0.9, 1.2],
            opacity: [0.2, 0.45, 0.2],
            rotate: [360, 180, 0],
          }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'linear' }}
          className="w-[450px] h-[450px] md:w-[650px] md:h-[650px] rounded-full border-2 border-brand-blue/30"
        />
      </div>

      {/* Target candidate banner header */}
      <div className="relative z-10 text-center mb-6 px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-red text-white text-sm md:text-base font-semibold mb-3">
          <Sparkles className="w-4 h-4" />
          <span>{candidate.targetGrade} 승품·단 심사 결과</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-100 font-display">
          <span className="text-brand-gold font-black">{candidate.name}</span> 수련생
        </h2>
        <p className="text-brand-mist text-base sm:text-lg mt-2 font-medium">
          모두 함께 큰 목소리로 카운트다운을 외쳐주세요!
        </p>
      </div>

      {/* Center Giant Animated Number */}
      <div className="relative z-10 my-4 flex items-center justify-center">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={count}
            initial={{ scale: 0.3, opacity: 0, y: 40 }}
            animate={{ scale: [1.4, 1], opacity: 1, y: 0 }}
            exit={{ scale: 1.8, opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative flex items-center justify-center"
          >
            {/* Pulsing Backing Glow */}

            {/* Giant Number Display */}
            <span className="text-[120px] sm:text-[160px] md:text-[220px] font-black leading-none font-display tracking-tighter text-brand-gold">
              {count > 0 ? count : '⚡'}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress Dots */}
      <div className="relative z-10 flex gap-3 mt-4">
        {Array.from({ length: initialSeconds }).map((_, idx) => {
          const stepNumber = initialSeconds - idx;
          const isPassed = count < stepNumber;
          const isCurrent = count === stepNumber;

          return (
            <div
              key={idx}
              className={`w-3 h-3 md:w-4 md:h-4 rounded-full transition-all duration-300 ${
                isCurrent
                  ? 'bg-brand-gold scale-125'
                  : isPassed
                  ? 'bg-white/15'
                  : 'bg-brand-gold/40'
              }`}
            />
          );
        })}
      </div>

      {/* Manual Quick Action Controls */}
      <div className="relative z-10 mt-10 flex items-center gap-4">
        <button
          type="button"
          id="btn-skip-countdown"
          onClick={onComplete}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-gold hover:brightness-110 text-brand-navy-deep font-bold text-sm md:text-base transition-all cursor-pointer hover:scale-105 active:scale-95"
        >
          <Zap className="w-4 h-4 fill-brand-navy-deep" />
          <span>즉시 결과 공개</span>
        </button>
        <button
          type="button"
          id="btn-cancel-countdown"
          onClick={onCancel}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm transition-all cursor-pointer"
        >
          취소
        </button>
      </div>

      <div className="absolute bottom-6 text-xs text-brand-mist tracking-wider">
        스페이스바(Space) 또는 '즉시 결과 공개' 버튼으로 언제든 바로 공개할 수 있습니다.
      </div>
    </div>
  );
};
