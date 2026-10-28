'use client';

import React, { useState } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';
import { defaultSiteConfig, BILINGUAL_COPY, SiteConfig } from '@/config/siteConfig';

export interface HeroSectionProps {
  siteConfig?: SiteConfig;
  lang?: 'en' | 'id';
  className?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  siteConfig = defaultSiteConfig,
  lang = 'en',
  className = '',
}) => {
  const [fullBleed, setFullBleed] = useState(true);
  const t = BILINGUAL_COPY[lang] || BILINGUAL_COPY.en;

  const VIDEO_URL =
    'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260210_031346_d87182fb-b0af-4273-84d1-c6fd17d6bf0f.mp4';

  return (
    <section
      className={`relative w-full overflow-hidden transition-all duration-500 ease-in-out ${
        fullBleed ? 'min-h-screen' : 'py-32 lg:py-40'
      } ${className}`}
    >
      {/* Height Toggle */}
      <button
        onClick={() => setFullBleed(!fullBleed)}
        aria-label={fullBleed ? 'Switch to fit-to-content' : 'Switch to full-bleed'}
        className="absolute top-4 right-4 z-20 p-2.5 rounded-[10px] backdrop-blur-xl border border-[rgba(92,225,230,0.4)] bg-[rgba(0,11,41,0.55)] text-white hover:bg-[rgba(15,112,215,0.4)] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer shadow-lg"
      >
        {fullBleed ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
      </button>

      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src={VIDEO_URL} type="video/mp4" />
      </video>

      {/* VIYOND Aurora High-Contrast Overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-[1] opacity-75"
        style={{
          background:
            'linear-gradient(135deg, rgba(92,225,230,0.25) 0%, rgba(21,151,229,0.3) 35%, rgba(15,112,215,0.45) 70%, rgba(0,11,41,0.9) 100%)',
        }}
      />

      {/* Breathing Flare */}
      <div
        className="absolute top-[280px] left-1/2 -translate-x-1/2 w-[400px] h-[260px] rounded-full blur-[40px] pointer-events-none z-[2] animate-aurora-breathe"
        style={{
          background:
            'radial-gradient(circle, #ffffff 0%, #bef8fd 35%, #5ce1e6 65%, transparent 100%)',
        }}
      />

      {/* Vertical Ribbed Glass Texture */}
      <div
        className="absolute inset-0 pointer-events-none z-[2] opacity-30 mix-blend-overlay"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, rgba(255,255,255,0.65) 0px, rgba(255,255,255,0.65) 1px, transparent 1px, transparent 9px, rgba(0,11,41,0.4) 9px, rgba(0,11,41,0.4) 12px)',
        }}
      />

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center text-center mt-32 px-6">
        {/* Tagline Pill */}
        <div className="inline-flex items-center gap-2.5 h-[38px] px-3.5 rounded-[10px] backdrop-blur-xl border border-[rgba(92,225,230,0.4)] bg-[rgba(0,11,41,0.6)] shadow-[0_0_20px_rgba(15,112,215,0.25),inset_0_1px_0_rgba(255,255,255,0.15)]">
          <span className="bg-[#0f70d7] text-white font-medium text-xs px-2.5 py-1 rounded-[6px] shadow-[0_0_10px_rgba(92,225,230,0.5)]">
            New
          </span>
          <span className="font-medium text-sm text-blue-100 tracking-wide">
            {siteConfig.brandTagline}
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-white text-5xl lg:text-[96px] leading-[1.05] tracking-[-0.02em] mt-8 max-w-5xl font-bold">
          {t.heroTitleLine1}
          <br className="hidden lg:block" />
          <em
            className="italic mx-[0.08em] relative inline-block text-cyan-300"
            style={{ fontStyle: 'italic', textShadow: '0 0 35px rgba(92,225,230,0.5)' }}
          >
            {t.heroTitleLine2}
          </em>
        </h1>

        {/* Subtext */}
        <p className="font-normal text-lg text-blue-100/90 mt-6 max-w-[662px] leading-relaxed">
          {t.heroSubtitle}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
          <button className="px-8 py-3.5 rounded-[12px] bg-[#0f70d7] text-white font-semibold text-base hover:brightness-110 transition-all shadow-lg shadow-[#0f70d7]/40 cursor-pointer">
            {lang === 'id' ? 'Jelajahi Armada Motor' : 'Explore Fleet & Book'}
          </button>
          <button className="px-8 py-3.5 rounded-[12px] bg-[#061539]/80 border border-white/20 text-white font-semibold text-base hover:brightness-125 transition-all backdrop-blur-xl cursor-pointer">
            {t.checkLiveStockBtn}
          </button>
        </div>
      </div>
    </section>
  );
};

export { HeroSection };
export default HeroSection;
