/**
 * Google AdSense & Smart Display Ad Placement Slot.
 * Engineered for Core Web Vitals (CLS Prevention) and FormulaCalcKit Clean Minimalist Design.
 * Features:
 * - Fixed/Min reserve bounding box to avoid Cumulative Layout Shift (CLS).
 * - Complies with Google AdSense Policies (ad label, responsive scaling).
 * - Easy drop-in for AdSense script & publisher ID (`ca-pub-xxxxxxx`).
 */
import React from 'react';

interface AdSlotProps {
  slotId?: string;
  format?: 'horizontal-banner' | 'in-feed' | 'rectangle';
  className?: string;
  lang?: 'zh' | 'en';
}

export const AdSlot: React.FC<AdSlotProps> = ({
  slotId = 'default-ad-slot',
  format = 'horizontal-banner',
  className = '',
  lang = 'zh',
}) => {
  // If you have your Google AdSense Publisher ID ready, uncomment the useEffect below:
  /*
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      // ignore
    }
  }, []);
  */

  return (
    <div
      className={`w-full mx-auto my-6 overflow-hidden rounded-2xl border border-slate-200/60 bg-slate-50/50 p-2 sm:p-3 transition-all ${
        format === 'horizontal-banner'
          ? 'min-h-[100px] sm:min-h-[110px] max-w-5xl'
          : 'min-h-[250px] max-w-md'
      } ${className}`}
      data-ad-slot={slotId}
    >
      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 px-1 pb-1.5 uppercase tracking-wider">
        <span>{lang === 'zh' ? '赞助商广告 / 推广' : 'Sponsored Advertisement'}</span>
        <span className="text-[9px] bg-slate-200/60 px-1.5 py-0.2 rounded text-slate-500 font-sans">
          AdSense Ready
        </span>
      </div>

      {/* Ad Placement Area - Injects Google AdSense or Custom Smart Ads */}
      <div className="w-full flex items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white/70 py-4 sm:py-6 px-4 text-center">
        {/* Placeholder container when ads are pending approval */}
        <div className="text-slate-400 text-xs space-y-1 font-sans">
          <p className="font-medium text-slate-500">
            {lang === 'zh'
              ? '【广告展示位已预留 · 智能自适应防抖动】'
              : '【Responsive Ad Slot Reserved · Zero CLS Layout】'}
          </p>
          <p className="text-[11px] text-slate-400">
            {lang === 'zh'
              ? '上线 Google AdSense 后填入客户端 client 与 slot ID 即可无缝生效，绝不影响现有排版与计算。'
              : 'Add your AdSense ad client and slot ID when approved; layout remains 100% stable.'}
          </p>
        </div>

        {/* 
          When your Google AdSense account is approved, replace the placeholder above with:
          <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
            data-ad-slot={slotId}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        */}
      </div>
    </div>
  );
};
