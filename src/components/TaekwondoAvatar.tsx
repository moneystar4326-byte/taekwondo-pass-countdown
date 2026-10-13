import React, { useState } from 'react';
import { Award, Camera, Upload, Trash2, Image as ImageIcon } from 'lucide-react';
import { PoomDanGrade } from '../types';
import { readImageAsDataUrl } from '../utils/imageUtils';

interface TaekwondoAvatarProps {
  photoUrl?: string;
  name: string;
  grade: PoomDanGrade;
  beltType: 'poom' | 'black';
  size?: 'normal' | 'large' | 'compact';
  onPhotoUpload?: (dataUrl: string) => void;
  onPhotoRemove?: () => void;
  editable?: boolean;
  showControls?: boolean;
}

export const TaekwondoAvatar: React.FC<TaekwondoAvatarProps> = ({
  photoUrl,
  name,
  grade,
  beltType,
  size = 'large',
  onPhotoUpload,
  onPhotoRemove,
  editable = false,
  showControls = true,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = (file: File) => {
    if (!file || !onPhotoUpload) return;
    readImageAsDataUrl(file)
      .then(onPhotoUpload)
      .catch(() => alert('이미지 파일만 업로드할 수 있습니다.'));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (editable) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (!editable) return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const isPoom = beltType === 'poom' || grade.includes('품');

  // Dimensions
  const dimClasses = {
    compact: 'w-24 h-28',
    normal: 'w-44 h-56 md:w-52 md:h-64',
    large: 'w-60 h-72 sm:w-68 sm:h-80 md:w-76 md:h-92',
  }[size];

  return (
    <div className="relative flex flex-col items-center">
      {/* Outer Card / Photo Frame with soft shadow & gold accent */}
      <div
        id={`avatar-frame-${name}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative ${dimClasses} rounded-2xl md:rounded-3xl overflow-hidden bg-gradient-to-b from-amber-50/90 to-amber-100/90 shadow-2xl border-4 ${
          isDragging
            ? 'border-cyan-400 ring-8 ring-cyan-400/50 scale-[1.03]'
            : isPoom
            ? 'border-amber-400/90 ring-4 ring-amber-300/30'
            : 'border-slate-800 ring-4 ring-slate-700/30'
        } transition-all duration-200 cursor-pointer`}
        onClick={() => editable && fileInputRef.current?.click()}
        title={editable ? '클릭하거나 사진을 끌어다 놓아 변경하세요' : undefined}
      >
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={name}
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
        ) : (
          /* High-craft Taekwondo Uniform Illustration */
          <div className="w-full h-full flex flex-col items-center justify-between pt-4 pb-2 bg-gradient-to-b from-blue-50 via-slate-50 to-amber-50">
            {/* Student Head / Face */}
            <div className="relative flex flex-col items-center mt-2">
              {/* Hair */}
              <div className="w-20 h-14 bg-slate-900 rounded-t-full relative z-10">
                <div className="absolute -bottom-1 left-2 w-4 h-4 bg-slate-900 rotate-45" />
                <div className="absolute -bottom-1 left-7 w-5 h-5 bg-slate-900 rotate-45" />
                <div className="absolute -bottom-1 right-2 w-4 h-4 bg-slate-900 rotate-45" />
              </div>
              {/* Face */}
              <div className="w-16 h-16 bg-[#fcd5b5] rounded-b-2xl rounded-t-sm relative flex flex-col items-center justify-center -mt-4 z-20 shadow-inner">
                {/* Cheerful Eyes */}
                <div className="flex justify-between w-10 px-1 mb-1">
                  <div className="w-2.5 h-2 bg-slate-800 rounded-full" />
                  <div className="w-2.5 h-2 bg-slate-800 rounded-full" />
                </div>
                {/* Rosy Cheeks */}
                <div className="flex justify-between w-12 px-0.5">
                  <div className="w-2.5 h-1.5 bg-rose-300/80 rounded-full" />
                  <div className="w-2.5 h-1.5 bg-rose-300/80 rounded-full" />
                </div>
                {/* Confident Smile */}
                <div className="w-4 h-2 border-b-2 border-slate-800 rounded-full mt-0.5" />
              </div>
            </div>

            {/* Neck & Gold Medal Ribbon */}
            <div className="relative w-full flex flex-col items-center z-20 -mt-2">
              <div className="relative flex items-center justify-center">
                <div className="w-10 h-6 border-l-4 border-r-4 border-red-600 rounded-b-lg -mt-1" />
                <div className="absolute -bottom-2 w-7 h-7 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-200 border border-amber-300 shadow-md flex items-center justify-center animate-bounce">
                  <span className="text-[9px] font-black text-amber-950">1</span>
                </div>
              </div>
            </div>

            {/* Dobok Body */}
            <div className="relative w-full h-28 bg-white border-t border-slate-200 flex flex-col items-center overflow-hidden z-10 mt-1 shadow-md">
              <div className="relative w-28 h-20 flex justify-center">
                {isPoom ? (
                  <div className="relative w-20 h-16">
                    <div className="absolute top-0 left-3 w-6 h-16 bg-red-600 border-r border-black/40 rotate-[28deg] origin-top shadow-sm" />
                    <div className="absolute top-0 right-3 w-6 h-16 bg-slate-900 border-l border-red-500 -rotate-[28deg] origin-top shadow-sm" />
                  </div>
                ) : (
                  <div className="relative w-20 h-16">
                    <div className="absolute top-0 left-3 w-6 h-16 bg-slate-900 rotate-[28deg] origin-top shadow-sm" />
                    <div className="absolute top-0 right-3 w-6 h-16 bg-slate-900 -rotate-[28deg] origin-top shadow-sm" />
                  </div>
                )}
                <div className="absolute top-0 w-8 h-7 bg-white border-b border-slate-200" />
              </div>

              {/* Chest Taegeuk patch */}
              <div className="absolute top-10 left-6 w-5 h-5 rounded-full border border-slate-300 bg-white flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-gradient-to-b from-red-600 to-blue-600" />
              </div>

              {/* Belt */}
              <div className="absolute bottom-0 w-full h-5 flex items-center justify-center shadow-md">
                {isPoom ? (
                  <div className="w-full h-full flex flex-col">
                    <div className="w-full h-1/2 bg-red-600" />
                    <div className="w-full h-1/2 bg-slate-950" />
                  </div>
                ) : (
                  <div className="w-full h-full bg-slate-950" />
                )}
                <div className="absolute w-5 h-6 bg-slate-900 border border-slate-700 rounded-sm shadow" />
              </div>
            </div>
          </div>
        )}

        {/* Drag over overlay indicator */}
        {isDragging && (
          <div className="absolute inset-0 bg-cyan-950/85 backdrop-blur-xs flex flex-col items-center justify-center text-cyan-200 p-4 text-center z-30 animate-in fade-in">
            <Upload className="w-12 h-12 mb-2 text-cyan-300 animate-bounce" />
            <span className="font-bold text-sm">여기에 사진을 놓으세요!</span>
            <span className="text-xs text-cyan-400 mt-1">도복 사진으로 즉시 등록됩니다</span>
          </div>
        )}

        {/* Hover overlay hint */}
        {editable && !isDragging && (
          <div className="absolute inset-0 bg-slate-950/40 opacity-0 hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity duration-200 pointer-events-none z-20">
            <Camera className="w-8 h-8 mb-1 text-amber-300" />
            <span className="text-xs font-bold px-2 py-1 rounded bg-black/60">
              클릭하여 사진 선택
            </span>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Gold Medal Hanging Badge Icon */}
      <div className="absolute -top-3 -right-3 z-30 bg-gradient-to-r from-amber-400 to-yellow-300 text-amber-950 p-2 rounded-full shadow-lg border-2 border-white flex items-center justify-center pointer-events-none">
        <Award className="w-5 h-5 text-amber-900 fill-amber-400" />
      </div>

      {/* Always-visible prominent Photo Action Buttons (Right below the avatar frame) */}
      {editable && showControls && (
        <div className="mt-3 flex items-center gap-2 z-20">
          <button
            type="button"
            id={`btn-upload-photo-direct-${name}`}
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-900 text-amber-300 hover:text-amber-200 border border-amber-400/40 text-xs font-bold shadow-md transition-all cursor-pointer hover:scale-105"
            title="수련생 사진 파일 업로드"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{photoUrl ? '사진 변경하기' : '수련생 사진 올리기'}</span>
          </button>

          {photoUrl && onPhotoRemove && (
            <button
              type="button"
              id={`btn-remove-photo-${name}`}
              onClick={(e) => {
                e.stopPropagation();
                onPhotoRemove();
              }}
              className="p-1.5 rounded-full bg-slate-900/70 hover:bg-rose-950/80 text-slate-400 hover:text-rose-300 border border-slate-700 hover:border-rose-500/50 text-xs transition-all cursor-pointer"
              title="기본 도복 캐릭터로 복원"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

