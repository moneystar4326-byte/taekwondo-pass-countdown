import React from 'react';
import { X, Volume2, VolumeX, Sliders, ShieldAlert, Palette, Clock, Check, Upload, Trash2, Image as ImageIcon } from 'lucide-react';
import { DojangConfig, ScreenTheme } from '../types';
import { readImageAsDataUrl } from '../utils/imageUtils';
import { TaegeukMark } from './TaegeukMark';

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  config: DojangConfig;
  onUpdateConfig: (config: DojangConfig) => void;
}

const THEMES: { id: ScreenTheme; name: string; previewColor: string; description: string }[] = [
  {
    id: 'signature-navy',
    name: '시그니처 네이비 (기본)',
    previewColor: 'from-[#0b1a3a] to-[#060f24]',
    description: '태극 레드·블루 포인트의 딥 네이비. 빔프로젝터에서 글자가 가장 또렷합니다',
  },
  {
    id: 'periwinkle',
    name: '퍼플블루 (부드러운 톤)',
    previewColor: 'from-[#798ea8] to-[#596d85]',
    description: '빔프로젝터에 가장 자연스럽고 눈이 편안한 감성 라벤더 블루',
  },
  {
    id: 'midnight',
    name: '미드나잇 다크 (선명한 명암비)',
    previewColor: 'from-slate-900 to-slate-950',
    description: '어두운 도장에서 불을 끄고 상영할 때 극적인 몰입감',
  },
  {
    id: 'gold-stadium',
    name: '골드 챔피언십 (황금빛 축제)',
    previewColor: 'from-[#2b2416] to-[#120f09]',
    description: '황금빛 엠블럼과 금메달이 돋보이는 웅장한 테마',
  },
  {
    id: 'pure-clean',
    name: '소프트 라이트 (화사한 무대)',
    previewColor: 'from-slate-100 to-slate-300',
    description: '낮 시간대 밝은 조명 환경에 적합한 화이트 톤',
  },
];

export const SettingsDrawer: React.FC<SettingsDrawerProps> = ({
  isOpen,
  onClose,
  config,
  onUpdateConfig,
}) => {
  if (!isOpen) return null;

  const handleChange = <K extends keyof DojangConfig>(key: K, value: DojangConfig[K]) => {
    onUpdateConfig({
      ...config,
      [key]: value,
    });
  };

  const handleLogoFile = (file: File | undefined) => {
    if (!file) return;
    readImageAsDataUrl(file, { maxDimension: 400, format: 'png' })
      .then((dataUrl) => handleChange('logoUrl', dataUrl))
      .catch(() => alert('이미지 파일(PNG, JPG, SVG 등)만 선택해주세요.'));
  };

  return (
    <div
      id="settings-drawer-backdrop"
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-xs select-none animate-in fade-in"
    >
      <div
        id="settings-drawer-panel"
        className="w-full max-w-md h-full bg-slate-900 border-l border-slate-700/80 shadow-2xl flex flex-col text-slate-100 animate-in slide-in-from-right"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">화면 및 발표 설정</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Dojang Logo */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-amber-400" />
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                도장 로고
              </label>
            </div>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleLogoFile(e.dataTransfer.files?.[0]);
              }}
              className="flex items-center gap-4 p-3 rounded-xl bg-slate-800/60 border-2 border-dashed border-slate-700 hover:border-amber-400 transition-colors"
            >
              <div className="w-16 h-16 rounded-lg bg-brand-navy flex items-center justify-center shrink-0 p-1.5">
                {config.logoUrl ? (
                  <img src={config.logoUrl} alt="도장 로고 미리보기" className="max-w-full max-h-full object-contain" />
                ) : (
                  <TaegeukMark className="w-12 h-12" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold cursor-pointer transition-all">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{config.logoUrl ? '로고 변경' : '로고 파일 선택'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        handleLogoFile(e.target.files?.[0]);
                        e.target.value = '';
                      }}
                    />
                  </label>
                  {config.logoUrl && (
                    <button
                      type="button"
                      onClick={() => handleChange('logoUrl', undefined)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-300 text-xs font-medium transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>기본 태극 마크로</span>
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                  배경이 투명한 PNG를 추천합니다. 상단 바와 합격증서에 표시됩니다. 이 상자에 끌어다 놓아도 됩니다.
                </p>
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-800" />

          {/* Dojang & Event Name */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              도장 및 행사 명칭
            </label>
            <div>
              <span className="text-xs text-slate-400">도장 이름</span>
              <input
                type="text"
                value={config.dojangName}
                onChange={(e) => handleChange('dojangName', e.target.value)}
                placeholder="예: 경희대 보람 태권도"
                className="mt-1 w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <span className="text-xs text-slate-400">행사 명칭 (상단 표시)</span>
              <input
                type="text"
                value={config.eventTitle}
                onChange={(e) => handleChange('eventTitle', e.target.value)}
                placeholder="예: 2026년 정기 승품·단 심사 결과 발표"
                className="mt-1 w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="h-px bg-slate-800" />

          {/* Countdown Length */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                카운트다운 시간 설정
              </label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[3, 5].map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => handleChange('countdownSeconds', sec)}
                  className={`py-2.5 px-4 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    config.countdownSeconds === sec
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md scale-102'
                      : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  <span>{sec}초 카운트다운</span>
                  {config.countdownSeconds === sec && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400">
              추천: 3초는 빠른 템포, 5초는 도장 아이들과 호흡하며 함께 외치기에 좋습니다.
            </p>
          </div>

          <div className="h-px bg-slate-800" />

          {/* Sound Effect Toggle */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {config.soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-amber-400" />
                ) : (
                  <VolumeX className="w-4 h-4 text-slate-500" />
                )}
                <div>
                  <h4 className="text-sm font-bold text-white">사운드 효과 (드럼롤 & 팡파레)</h4>
                  <p className="text-xs text-slate-400">카운트다운 긴장감 비프음 및 승리 나팔 소리</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleChange('soundEnabled', !config.soundEnabled)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  config.soundEnabled ? 'bg-amber-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    config.soundEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="h-px bg-slate-800" />

          {/* Background Theme Selector */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-amber-400" />
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                스크린 배경 테마
              </label>
            </div>
            <div className="space-y-2">
              {THEMES.map((th) => (
                <button
                  key={th.id}
                  type="button"
                  onClick={() => handleChange('theme', th.id)}
                  className={`w-full p-3 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                    config.theme === th.id
                      ? 'bg-amber-500/10 border-amber-400 shadow-md ring-1 ring-amber-400/40'
                      : 'bg-slate-800/50 border-slate-700/80 hover:bg-slate-800'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${th.previewColor} border border-white/20 shrink-0 shadow-xs`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-white">{th.name}</span>
                      {config.theme === th.id && <Check className="w-4 h-4 text-amber-400" />}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{th.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow transition-all"
          >
            설정 완료
          </button>
        </div>
      </div>
    </div>
  );
};
