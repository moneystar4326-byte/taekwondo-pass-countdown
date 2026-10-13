import React from 'react';
import { motion } from 'motion/react';
import { Award, Sparkles, Volume2, RotateCcw, PartyPopper, FileBadge, ChevronLeft, ChevronRight } from 'lucide-react';
import { StudentCandidate, DojangConfig } from '../types';
import { TaekwondoAvatar } from './TaekwondoAvatar';
import { fireCelebrationConfetti } from '../utils/confettiHelper';
import { soundEffects } from '../utils/soundEffects';

interface PassRevealCardProps {
  candidate: StudentCandidate;
  config: DojangConfig;
  currentIndex: number;
  totalCandidates: number;
  onPrev: () => void;
  onNext: () => void;
  onRestartCountdown: () => void;
  onOpenCertificate: () => void;
  onPhotoUpload: (dataUrl: string) => void;
  onPhotoRemove?: () => void;
}

export const PassRevealCard: React.FC<PassRevealCardProps> = ({
  candidate,
  config,
  currentIndex,
  totalCandidates,
  onPrev,
  onNext,
  onRestartCountdown,
  onOpenCertificate,
  onPhotoUpload,
  onPhotoRemove,
}) => {
  const isPoom = candidate.beltType === 'poom' || candidate.targetGrade.includes('품');

  const handleReplayFanfare = () => {
    if (config.soundEnabled) {
      soundEffects.playFanfare();
    }
    fireCelebrationConfetti();
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center justify-center p-4 sm:p-6 select-none">
      {/* Top Dojang Title & Event Banner */}
      <div className="text-center mb-4 sm:mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/15 text-brand-mist text-xs sm:text-sm font-semibold mb-2">
          <span className="w-2 h-2 rounded-full bg-brand-gold" />
          <span>{config.dojangName}</span>
          <span className="opacity-60">•</span>
          <span>{config.eventTitle}</span>
        </div>
      </div>

      {/* Main Presentation Stage */}
      <div className="relative w-full flex flex-col items-center">
        {/* Animated Celebration Aura */}

        {/* Floating Sparkle Highlights */}
        <motion.div
          animate={{ y: [-8, 8, -8], rotate: [0, 10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-4 right-10 sm:right-24 hidden sm:flex items-center gap-1 text-amber-300 pointer-events-none"
        >
          <Sparkles className="w-8 h-8 fill-amber-300" />
        </motion.div>

        {/* Student Avatar / Photo Card */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 260 }}
          className="relative z-10"
        >
          <TaekwondoAvatar
            photoUrl={candidate.photoUrl}
            name={candidate.name}
            grade={candidate.targetGrade}
            beltType={candidate.beltType}
            size="large"
            editable={true}
            onPhotoUpload={onPhotoUpload}
            onPhotoRemove={onPhotoRemove}
          />
        </motion.div>

        {/* Grade Pill Badge */}
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, type: 'spring', damping: 15 }}
          className="mt-6 sm:mt-7 z-10"
        >
          <div className="inline-flex items-center gap-2 px-5 py-1.5 sm:px-6 sm:py-2 rounded-full bg-brand-red text-white font-bold text-sm sm:text-base tracking-wide">
            <Award className="w-4 h-4" />
            <span>{candidate.targetGrade} 심사 결과</span>
          </div>
        </motion.div>

        {/* Candidate Name (White bold clean display) */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-normal font-display mt-3 sm:mt-4 text-center"
        >
          {candidate.name}
        </motion.h1>

        {/* Grand "합격!" Victory Banner (Golden yellow vibrant banner with celebration bounce) */}
        <motion.div
          initial={{ scale: 0.2, opacity: 0, rotate: -5 }}
          animate={{ scale: [0.2, 1.25, 1], opacity: 1, rotate: [0, -3, 0] }}
          transition={{ delay: 0.4, duration: 0.6, ease: 'easeOut' }}
          className="relative mt-2 sm:mt-3 flex items-center justify-center"
        >
          {/* Backing yellow glow */}

          <div className="relative px-8 py-1 sm:px-12 sm:py-2">
            <span
              id="result-pass-text"
              className="text-6xl sm:text-7xl md:text-8xl font-black font-display tracking-tight text-brand-gold"
            >
              합격!
            </span>
          </div>
        </motion.div>

        {/* Custom Congratulatory Message & Belt Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-3 text-center max-w-lg px-4"
        >
          <p className="text-white text-base sm:text-lg font-medium leading-relaxed font-sans-kr">
            {candidate.customCheer || `${candidate.name} 수련생의 ${candidate.targetGrade} 합격을 진심으로 축하합니다!`}
          </p>
          <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/5 border border-white/10 text-brand-mist text-xs sm:text-sm font-semibold">
            <span>단·품증 발급 대상</span>
            <span>•</span>
            <span>{isPoom ? '품띠(적/흑)' : '검은띠'} 착용 자격 부여</span>
          </div>
        </motion.div>
      </div>

      {/* Screen Navigation & Presentation Action Bar */}
      <div className="mt-8 sm:mt-10 w-full flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-brand-navy-deep/80 rounded-2xl border border-white/10">
        {/* Previous Candidate */}
        <button
          type="button"
          id="btn-prev-candidate"
          onClick={onPrev}
          disabled={currentIndex <= 0}
          className="inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">이전 수련생</span>
          <span className="sm:hidden">이전</span>
        </button>

        {/* Center Action Controls: Fanfare, Confetti, Re-countdown */}
        <div className="flex items-center gap-2">
          {/* Confetti & Fanfare Replay */}
          <button
            type="button"
            id="btn-replay-fanfare"
            onClick={handleReplayFanfare}
            title="팡파레 & 축하 폭죽 다시 터뜨리기"
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-brand-gold hover:brightness-110 text-brand-navy-deep font-bold text-xs sm:text-sm transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            <PartyPopper className="w-4 h-4" />
            <span>축하 팡파레</span>
          </button>

          {/* Re-run countdown */}
          <button
            type="button"
            id="btn-restart-countdown"
            onClick={onRestartCountdown}
            title="카운트다운 다시 진행"
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden md:inline">카운트다운 다시하기</span>
            <span className="md:hidden">다시</span>
          </button>

          {/* Certificate View */}
          <button
            type="button"
            id="btn-view-certificate"
            onClick={onOpenCertificate}
            title="합격 증서 확인 및 저장"
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm shadow transition-all cursor-pointer"
          >
            <FileBadge className="w-4 h-4" />
            <span className="hidden sm:inline">합격증서 보기</span>
            <span className="sm:hidden">증서</span>
          </button>
        </div>

        {/* Next Candidate */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/70 font-medium">
            {currentIndex + 1} / {totalCandidates}
          </span>
          <button
            type="button"
            id="btn-next-candidate"
            onClick={onNext}
            disabled={currentIndex >= totalCandidates - 1}
            className="inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl bg-brand-blue hover:brightness-110 disabled:opacity-30 disabled:pointer-events-none text-white text-xs sm:text-sm font-bold transition-all cursor-pointer"
          >
            <span className="hidden sm:inline">다음 수련생</span>
            <span className="sm:hidden">다음</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
