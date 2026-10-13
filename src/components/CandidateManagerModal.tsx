import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Upload, RotateCcw, X, Check, Users, Award } from 'lucide-react';
import { StudentCandidate, PoomDanGrade } from '../types';
import { DEFAULT_CANDIDATES } from '../defaultData';
import { readImageAsDataUrl } from '../utils/imageUtils';

interface CandidateManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidates: StudentCandidate[];
  currentCandidateId: string;
  onSelectCandidate: (id: string) => void;
  onUpdateCandidates: (candidates: StudentCandidate[]) => void;
}

const AVAILABLE_GRADES: PoomDanGrade[] = [
  '1품', '2품', '3품', '4품', '1단', '2단', '3단', '4단'
];

export const CandidateManagerModal: React.FC<CandidateManagerModalProps> = ({
  isOpen,
  onClose,
  candidates,
  currentCandidateId,
  onSelectCandidate,
  onUpdateCandidates,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [grade, setGrade] = useState<PoomDanGrade>('1품');
  const [cheer, setCheer] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  if (!isOpen) return null;

  const handleStartAdd = () => {
    setEditingId('new');
    setName('');
    setGrade('1품');
    setCheer('');
    setPhotoUrl('');
  };

  const handleStartEdit = (c: StudentCandidate) => {
    setEditingId(c.id);
    setName(c.name);
    setGrade(c.targetGrade);
    setCheer(c.customCheer || '');
    setPhotoUrl(c.photoUrl || '');
  };

  const handleSaveCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const isDan = grade.includes('단');
    const beltType = isDan ? 'black' : 'poom';

    if (editingId === 'new') {
      const newCandidate: StudentCandidate = {
        id: `student-${Date.now()}`,
        name: name.trim(),
        targetGrade: grade,
        beltType,
        customCheer: cheer.trim() || `${grade} 승품·단 심사 합격을 진심으로 축하합니다!`,
        photoUrl: photoUrl || undefined,
        revealed: false,
      };
      onUpdateCandidates([...candidates, newCandidate]);
      onSelectCandidate(newCandidate.id);
    } else if (editingId) {
      const updated = candidates.map((c) => {
        if (c.id === editingId) {
          return {
            ...c,
            name: name.trim(),
            targetGrade: grade,
            beltType,
            customCheer: cheer.trim(),
            photoUrl: photoUrl || undefined,
          };
        }
        return c;
      });
      onUpdateCandidates(updated);
    }

    setEditingId(null);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (candidates.length <= 1) {
      alert('최소 1명의 심사 대상 수련생이 필요합니다.');
      return;
    }
    const updated = candidates.filter((c) => c.id !== id);
    onUpdateCandidates(updated);
    if (currentCandidateId === id) {
      onSelectCandidate(updated[0].id);
    }
  };

  const handleResetDefaults = () => {
    if (confirm(`기본 예시 수련생 명단(${DEFAULT_CANDIDATES[0].name} ${DEFAULT_CANDIDATES[0].targetGrade} 등 ${DEFAULT_CANDIDATES.length}명)으로 초기화하시겠습니까?`)) {
      onUpdateCandidates(DEFAULT_CANDIDATES);
      onSelectCandidate(DEFAULT_CANDIDATES[0].id);
      setEditingId(null);
    }
  };

  const handleResetRevealed = () => {
    if (confirm('모든 수련생의 결과 공개 상태를 초기화하시겠습니까? (명단과 사진은 유지됩니다)')) {
      onUpdateCandidates(candidates.map((c) => ({ ...c, revealed: false })));
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    readImageAsDataUrl(file)
      .then(setPhotoUrl)
      .catch(() => alert('이미지 파일만 선택해주세요.'));
    e.target.value = '';
  };

  return (
    <div
      id="candidate-manager-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in select-none"
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">승품·단 심사 대상자 관리</h3>
              <p className="text-xs text-slate-300">총 {candidates.length}명의 수련생 등록됨</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Add / Edit Form */}
          {editingId ? (
            <form onSubmit={handleSaveCandidate} className="bg-slate-800/60 rounded-xl p-4 border border-slate-700 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-700">
                <h4 className="text-sm font-bold text-amber-400">
                  {editingId === 'new' ? '새 수련생 등록' : '수련생 정보 수정'}
                </h4>
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="text-xs text-slate-400 hover:text-slate-200"
                >
                  취소
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    수련생 이름 <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="예: 장재욱"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Grade */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    응시 품/단 <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value as PoomDanGrade)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400"
                  >
                    {AVAILABLE_GRADES.map((g) => (
                      <option key={g} value={g}>
                        {g} ({g.includes('단') ? '검은띠' : '품띠'})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Photo Upload & Preview Dropzone */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  수련생 사진 등록 <span className="text-slate-400 font-normal">(선택 사항)</span>
                </label>
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const file = e.dataTransfer.files?.[0];
                    if (file && file.type.startsWith('image/')) {
                      readImageAsDataUrl(file).then(setPhotoUrl).catch(() => {});
                    }
                  }}
                  className="relative flex items-center gap-4 p-3 rounded-xl bg-slate-900/90 border-2 border-dashed border-slate-700 hover:border-amber-400 transition-colors"
                >
                  {photoUrl ? (
                    <div className="relative group/thumb shrink-0">
                      <img
                        src={photoUrl}
                        alt="미리보기"
                        className="w-16 h-20 object-cover rounded-lg border-2 border-amber-400 shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => setPhotoUrl('')}
                        className="absolute -top-1.5 -right-1.5 p-1 rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow transition-transform hover:scale-110"
                        title="사진 삭제"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-16 h-20 rounded-lg bg-slate-800 border border-slate-700 flex flex-col items-center justify-center text-slate-400 shrink-0">
                      <Award className="w-6 h-6 text-amber-400 mb-1" />
                      <span className="text-[10px] text-center leading-tight">기본 캐릭터</span>
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold cursor-pointer transition-all shadow hover:scale-105">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{photoUrl ? '사진 파일 변경' : '사진 파일 선택'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handlePhotoUpload}
                        />
                      </label>
                      {photoUrl && (
                        <button
                          type="button"
                          onClick={() => setPhotoUrl('')}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-300 text-xs font-medium transition-colors"
                        >
                          기본 캐릭터로 복원
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                      💡 사진 파일을 이 상자 안으로 직접 끌어다 놓거나(드래그) 위 버튼을 눌러 스마트폰 앨범 또는 컴퓨터에서 선택하세요.
                    </p>
                  </div>
                </div>
              </div>

              {/* Custom Cheer */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  맞춤 축하 메시지
                </label>
                <input
                  type="text"
                  value={cheer}
                  onChange={(e) => setCheer(e.target.value)}
                  placeholder="예: 열정과 끈기로 이뤄낸 자랑스러운 1품 합격을 축하합니다!"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-700 text-slate-300 text-xs font-medium hover:bg-slate-600"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>저장 완료</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">
                발표할 수련생을 클릭하여 바로 선택하거나 수정하세요.
              </span>
              <button
                type="button"
                id="btn-add-candidate"
                onClick={handleStartAdd}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow transition-transform hover:scale-105"
              >
                <Plus className="w-4 h-4" />
                <span>수련생 추가</span>
              </button>
            </div>
          )}

          {/* Candidate List Cards */}
          <div className="space-y-2">
            {candidates.map((c, idx) => {
              const isSelected = c.id === currentCandidateId;
              const isPoom = c.beltType === 'poom' || c.targetGrade.includes('품');

              return (
                <div
                  key={c.id}
                  onClick={() => onSelectCandidate(c.id)}
                  className={`group flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-400 shadow-md'
                      : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-center text-xs font-bold text-slate-500">
                      {idx + 1}
                    </span>

                    {/* Thumbnail */}
                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-600 bg-slate-800 flex items-center justify-center shrink-0">
                      {c.photoUrl ? (
                        <img src={c.photoUrl} alt={c.name} className="w-full h-full object-cover" />
                      ) : (
                        <Award className={`w-5 h-5 ${isPoom ? 'text-amber-400' : 'text-slate-300'}`} />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{c.name}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            isPoom ? 'bg-red-500/20 text-red-400' : 'bg-slate-700 text-slate-200'
                          }`}
                        >
                          {c.targetGrade}
                        </span>
                        {isSelected && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black">
                            현재 화면
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                        {c.customCheer || '승품 심사 합격 축하'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartEdit(c);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700"
                      title="수정"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDelete(c.id, e)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-700"
                      title="삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>기본 예시 명단 복원</span>
            </button>
            <button
              type="button"
              onClick={handleResetRevealed}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>공개 상태 초기화</span>
            </button>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow transition-all"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
