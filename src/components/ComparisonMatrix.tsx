import React from 'react';
import { 
  BarChart3, 
  Check, 
  X, 
  Sparkles, 
  Award, 
  Clock, 
  Coins, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { ActiveTab } from '../types';

interface ComparisonMatrixProps {
  onSelectTab: (tab: ActiveTab) => void;
}

export const ComparisonMatrix: React.FC<ComparisonMatrixProps> = ({ onSelectTab }) => {
  const methods = [
    {
      title: '방법 1. Google Apps Script + 시트',
      badge: '가장 추천 (BEST)',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      cost: '완전 무료 (0원)',
      time: '약 3분',
      difficulty: '쉬움 (코드 복사만 하면 끝)',
      dataDetails: '스프레드시트에 일시, 파일명, 횟수 자동 표 정리',
      externalDependency: '없음 (순수 구글 생태계)',
      recommendedFor: '일반 교사, 연구원, 학생, 소규모 팀, 누구나',
      tabTarget: 'appsScript' as ActiveTab,
      highlight: true,
    },
    {
      title: '방법 2. Google Workspace 감사 로그',
      badge: '기관/관리자 전용',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      cost: '기존 Workspace 구독 포함',
      time: '즉시 조회 가능',
      difficulty: '보통 (관리 콘솔 접근 필요)',
      dataDetails: '계정 이메일, IP, 일시, 브라우저 전체 상세 기록',
      externalDependency: '없음 (구글 자체 로그)',
      recommendedFor: '학교 정보부장, 전산 관리자, 공식 감사/보안 점검',
      tabTarget: 'workspace' as ActiveTab,
      highlight: false,
    },
    {
      title: '방법 3. 자체 웹서버 API 중계',
      badge: '개발자/서비스 운영자',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      cost: '서버 호스팅 비용 필요',
      time: '1~2시간 (개발 필요)',
      difficulty: '어려움 (코딩 및 서버 배포)',
      dataDetails: 'DB 원하는 스키마대로 자유롭게 축적',
      externalDependency: '자체 호스팅 인프라 필요',
      recommendedFor: '자체 웹사이트/앱을 운영 중인 개발자',
      tabTarget: 'developer' as ActiveTab,
      highlight: false,
    },
    {
      title: '방법 4. Bitly 단축 링크 서비스',
      badge: '초간단 1분 컷',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      cost: '무료 (월 링크 수 제한)',
      time: '1분',
      difficulty: '매우 쉬움 (링크 붙여넣기)',
      dataDetails: '단순 클릭 횟수 & 국가/일별 그래프',
      externalDependency: '외부 단축 서비스에 의존',
      recommendedFor: '코딩 없이 지금 당장 1개 파일 다운로드 수만 볼 때',
      tabTarget: 'developer' as ActiveTab,
      highlight: false,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3 border border-blue-400/20">
            <BarChart3 className="w-3.5 h-3.5" />
            한눈에 보는 비교 분석
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            구글 드라이브 다운로드 추적 4대 방식 비교
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4">
            사용 목적과 상황(일반 개인, 학교 교사, 전산 관리자, 웹 개발자)에 맞는 최적의 방법을 선택하세요.
          </p>
        </div>
      </div>

      {/* Comparison Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {methods.map((m, idx) => (
          <div
            key={idx}
            className={`bg-white rounded-2xl p-5 border flex flex-col justify-between transition-all shadow-xs ${
              m.highlight
                ? 'border-emerald-500 ring-2 ring-emerald-100 shadow-md'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${m.badgeColor}`}
                >
                  {m.badge}
                </span>
                {m.highlight && (
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                )}
              </div>

              <h3 className="font-bold text-slate-900 text-sm mb-3">
                {m.title}
              </h3>

              <div className="space-y-2.5 text-xs text-slate-600 mb-4">
                <div>
                  <span className="text-slate-400 block text-[11px]">비용</span>
                  <span className="font-semibold text-slate-800">{m.cost}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">소요 시간</span>
                  <span className="font-semibold text-slate-800">{m.time}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">난이도</span>
                  <span className="font-semibold text-slate-800">{m.difficulty}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">기록 데이터</span>
                  <span className="text-slate-700">{m.dataDetails}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">추천 대상</span>
                  <span className="font-medium text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded inline-block">
                    {m.recommendedFor}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectTab(m.tabTarget)}
              className={`w-full py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                m.highlight
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
              }`}
            >
              상세 설명 및 가이드 보기 &rarr;
            </button>
          </div>
        ))}
      </div>

      {/* Decision Tree / Recommendation Summary */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          상황별 1줄 추천 가이드
        </h3>

        <div className="space-y-2.5 text-xs sm:text-sm text-slate-700">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong>&quot;별도 프로그램 설치나 서버 없이 내 구글 계정으로 끝내고 싶어요&quot;</strong>
              <div className="text-xs text-slate-500 mt-0.5">
                👉 <strong>방법 1 (Google Apps Script + 스프레드시트)</strong>을 사용하세요. 3분이면 완성되며 엑셀처럼 실시간 다운로드 숫자가 누적됩니다.
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <strong>&quot;학교나 회사에서 이미 공유된 파일의 과거 다운로드 내역을 역추적해야 해요&quot;</strong>
              <div className="text-xs text-slate-500 mt-0.5">
                👉 <strong>방법 2 (Google Workspace 관리자 감사 로그)</strong>를 확인하세요. 관리 콘솔에서 과거 다운로드 이력이 모두 남아있습니다.
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong>&quot;지금 당장 30초 안에 파일 1개의 클릭 수만 가볍게 보고 싶어요&quot;</strong>
              <div className="text-xs text-slate-500 mt-0.5">
                👉 <strong>방법 4 (Bitly 단축 링크)</strong>에 구글 드라이브 직다운로드 링크를 넣고 배포하세요.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
