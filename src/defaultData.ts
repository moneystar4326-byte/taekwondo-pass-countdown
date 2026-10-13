import { StudentCandidate, DojangConfig } from './types';

export const DEFAULT_DOJANG_CONFIG: DojangConfig = {
  dojangName: '경희대 보람 태권도',
  eventTitle: '2026년 정기 승품·단 심사 결과 발표',
  countdownSeconds: 5,
  soundEnabled: true,
  theme: 'signature-navy',
  autoAdvance: false,
  autoAdvanceDelaySec: 6,
};

export const DEFAULT_CANDIDATES: StudentCandidate[] = [
  {
    id: 'student-1',
    name: '장재욱',
    targetGrade: '1품',
    testDate: '2026년 제3차 승품심사',
    beltType: 'poom',
    customCheer: '열정과 끈기로 이뤄낸 자랑스러운 1품 합격을 축하합니다!',
    revealed: false,
  },
  {
    id: 'student-2',
    name: '김민준',
    targetGrade: '1품',
    testDate: '2026년 제3차 승품심사',
    beltType: 'poom',
    customCheer: '성실한 수련으로 멋지게 합격한 민준이 수고 많았어요!',
    revealed: false,
  },
  {
    id: 'student-3',
    name: '이서연',
    targetGrade: '2품',
    testDate: '2026년 제3차 승품심사',
    beltType: 'poom',
    customCheer: '한 단계 더 도약한 2품 합격! 진심으로 자랑스럽습니다.',
    revealed: false,
  },
  {
    id: 'student-4',
    name: '박도현',
    targetGrade: '3품',
    testDate: '2026년 제3차 승품심사',
    beltType: 'poom',
    customCheer: '후배들의 훌륭한 본보기가 되는 3품 합격을 축하합니다!',
    revealed: false,
  },
  {
    id: 'student-5',
    name: '최예준',
    targetGrade: '1단',
    testDate: '2026년 제3차 승품심사',
    beltType: 'black',
    customCheer: '진정한 무도인의 길, 1단 유단자 등극을 축하합니다!',
    revealed: false,
  },
];
