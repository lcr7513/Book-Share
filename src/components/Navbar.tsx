import React from 'react';
import { ActiveTab } from '../types';
import { 
  FileText, 
  Code2, 
  ShieldCheck, 
  Terminal, 
  BarChart3, 
  HardDriveDownload,
  Sparkles,
  AlertTriangle,
  Globe,
  Copy,
  Check
} from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  totalDownloads: number;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, totalDownloads }) => {
  const [copiedUrl, setCopiedUrl] = React.useState(false);

  const handleCopyCurrentUrl = () => {
    // Current working live URL (dev URL or current origin)
    const liveUrl = typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : 'https://ais-dev-dfycvqsuilwbhjt6s4xsrc-657342148388.asia-northeast1.run.app';
    navigator.clipboard.writeText(liveUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const tabs = [
    { id: 'simulator' as ActiveTab, label: '실시간 카운터 도구', icon: HardDriveDownload, badge: '기본' },
    { id: 'appsScript' as ActiveTab, label: '방법 1. 구글 앱스 스크립트', icon: Code2, badge: '가장 추천 (무료)' },
    { id: 'workspace' as ActiveTab, label: '방법 2. Workspace 감사 로그', icon: ShieldCheck, badge: '교육청/기관' },
    { id: 'developer' as ActiveTab, label: '방법 3 & 4. 웹서버 / 단축URL', icon: Terminal },
    { id: 'comparison' as ActiveTab, label: '방법별 장단점 비교', icon: BarChart3 },
    { id: 'diagnostic' as ActiveTab, label: '🔍 다운로드 안 될 때 문제 해결', icon: AlertTriangle, badge: '오류 점검' },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3.5 gap-3">
          
          {/* Logo & Main Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <HardDriveDownload className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                  구글 드라이브 다운로드 카운터 & 추적 가이드
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  <Sparkles className="w-3 h-3 text-emerald-600" /> 완벽 솔루션
                </span>
              </div>
              <p className="text-xs text-slate-500">
                구글 드라이브 파일 다운로드 시 횟수를 자동 기록·집계하는 가장 실용적인 방법 총정리
              </p>
            </div>
          </div>

          {/* Quick Stats & Live URL Copy */}
          <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
            <button
              onClick={handleCopyCurrentUrl}
              title="현재 정상 작동 중인 실시간 웹 앱 주소 복사"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-xs text-blue-700 font-medium transition-colors cursor-pointer"
            >
              {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Globe className="w-3.5 h-3.5 text-blue-600" />}
              <span>{copiedUrl ? '실시간 웹앱 주소 복사됨!' : '실시간 접속 주소 복사'}</span>
            </button>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>전체 누적 다운로드:</span>
              <span className="font-bold text-blue-600 font-mono text-sm">{totalDownloads}회</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto no-scrollbar pt-1 pb-2 -mb-px">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-normal ${
                      isActive
                        ? 'bg-blue-700 text-blue-100'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
