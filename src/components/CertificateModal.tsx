import React, { useRef } from 'react';
import { X, Printer, Award, Download, CheckCircle } from 'lucide-react';
import { StudentCandidate, DojangConfig } from '../types';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: StudentCandidate;
  config: DojangConfig;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  candidate,
  config,
}) => {
  const certRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const isPoom = candidate.beltType === 'poom' || candidate.targetGrade.includes('품');

  return (
    <div
      id="certificate-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm select-none overflow-y-auto"
    >
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-slate-900/90 print:hidden">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-sm">승품·단 심사 합격 증서</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>인쇄 / PDF 저장</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Area */}
        <div className="p-4 sm:p-6 bg-slate-950/40 flex justify-center">
          <div
            ref={certRef}
            id="printable-certificate"
            className="w-full max-w-[500px] aspect-[1/1.38] bg-gradient-to-b from-amber-50/95 via-yellow-50/90 to-amber-100/95 text-slate-900 rounded-xl p-6 sm:p-8 border-8 border-double border-amber-600/80 shadow-2xl relative flex flex-col justify-between"
          >
            {/* Corner traditional patterns */}
            <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-amber-800" />
            <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-amber-800" />
            <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-amber-800" />
            <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-amber-800" />

            {/* Taegeuk background watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
              <div className="w-64 h-64 rounded-full border-8 border-slate-900 flex items-center justify-center">
                <span className="text-8xl font-black font-display">武</span>
              </div>
            </div>

            {/* Certificate Header */}
            <div className="text-center relative z-10">
              {config.logoUrl && (
                <img
                  src={config.logoUrl}
                  alt={`${config.dojangName} 로고`}
                  className="h-10 sm:h-12 w-auto max-w-[140px] object-contain mx-auto mb-2"
                />
              )}
              <div className="text-[11px] tracking-widest text-amber-900 font-bold uppercase mb-1">
                TAEKWONDO PROMOTION CERTIFICATE
              </div>
              <h2 className="text-3xl font-black font-display text-amber-950 tracking-wider">
                합 격 증 서
              </h2>
              <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-700 to-transparent mx-auto mt-2" />
            </div>

            {/* Certificate Details */}
            <div className="relative z-10 text-center my-3 space-y-3">
              <div className="text-xs text-slate-700">
                제 2026-{candidate.name.charCodeAt(0) || '7'}-심사호
              </div>

              <div className="py-2">
                <div className="text-xs font-semibold text-slate-600">성 명</div>
                <div className="text-2xl sm:text-3xl font-black text-slate-950 font-display mt-0.5 tracking-wide">
                  {candidate.name}
                </div>
              </div>

              <div className="inline-block px-4 py-1 rounded-full bg-amber-500/20 border border-amber-600/40 text-amber-950 font-black text-sm">
                취득 자격 : 태권도 {candidate.targetGrade}
              </div>

              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-serif px-2 mt-3">
                위 수련생은 평소 성실하고 불굴의 태권도 정신으로
                수련에 정진하여, 국기원 승품·단 심사 기준에 따라
                위와 같이 <strong>{candidate.targetGrade}</strong>에 우수한 성적으로 
                <strong> 최종 합격</strong>하였음을 증명합니다.
              </p>
            </div>

            {/* Certificate Footer & Seal */}
            <div className="relative z-10 pt-2 border-t border-amber-800/30 flex items-end justify-between">
              <div className="text-left">
                <div className="text-[11px] text-slate-600 font-medium">
                  {candidate.testDate || '2026년 정기 심사'}
                </div>
                <div className="text-sm font-black text-slate-900 font-display mt-0.5">
                  {config.dojangName}
                </div>
              </div>

              {/* Master Korean Seal (직인 도장) */}
              <div className="relative flex items-center justify-center">
                <div className="w-12 h-12 rounded-lg border-2 border-red-700 bg-red-600/10 text-red-700 flex flex-col items-center justify-center font-bold text-[10px] leading-tight shadow-sm rotate-3">
                  <span>관장</span>
                  <span>직인</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info note */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 text-center text-xs text-slate-400 print:hidden">
          축하합니다! 합격 증서를 인쇄하여 수련생과 학부모님께 특별한 선물로 전달하세요.
        </div>
      </div>
    </div>
  );
};
