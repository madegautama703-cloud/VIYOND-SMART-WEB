'use client';

import React, { useState } from 'react';
import { Maximize2, Minimize2, Sparkles, ChevronDown, CheckCircle2 } from 'lucide-react';
import {
  SiteConfig,
  defaultSiteConfig,
  BILINGUAL_COPY,
} from '@/config/siteConfig';

export interface GlassHeroProps {
  siteConfig?: SiteConfig;
  lang?: 'en' | 'id';
  onExploreClick?: () => void;
  onCheckStockClick?: () => void;
  isSyncing?: boolean;
  className?: string;
  children?: React.ReactNode;
  defaultFullBleed?: boolean;
  asBackground?: boolean;
}

/**
 * Utility to convert Hex color to RGBA string with custom opacity
 */
function hexToRgba(hex: string, alpha: number): string {
  if (!hex) return `rgba(27, 95, 212, ${alpha})`;
  let clean = hex.replace('#', '');
  if (clean.length === 3) {
    clean = clean
      .split('')
      .map((c) => c + c)
      .join('');
  }
  const r = parseInt(clean.substring(0, 2), 16) || 27;
  const g = parseInt(clean.substring(2, 4), 16) || 95;
  const b = parseInt(clean.substring(4, 6), 16) || 212;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260210_031346_d87182fb-b0af-4273-84d1-c6fd17d6bf0f.mp4';

export const GlassHero: React.FC<GlassHeroProps> = ({
  siteConfig = defaultSiteConfig,
  lang = 'en',
  onExploreClick,
  onCheckStockClick,
  isSyncing = false,
  className = '',
  children,
  defaultFullBleed = true,
  asBackground = false,
}) => {
  const [fullBleed, setFullBleed] = useState<boolean>(defaultFullBleed);

  // Dynamic color palette from siteConfig
  const primaryColor = siteConfig.primaryColor || '#1b5fd4';
  const secondaryColor = siteConfig.secondaryColor || '#0a1d45';
  const accentColor = siteConfig.accentColor || '#2f7bff';

  // Multilingual copy lookup from siteConfig
  const t = BILINGUAL_COPY[lang] || BILINGUAL_COPY.en;

  const isBackgroundMode = asBackground || className.includes('absolute');

  if (isBackgroundMode) {
    return (
      <div
        className={`pointer-events-none absolute inset-0 z-0 w-full min-h-screen md:h-screen overflow-hidden ${className}`}
        style={
          {
            '--primary-color': primaryColor,
            '--secondary-color': secondaryColor,
            '--accent-color': accentColor,
          } as React.CSSProperties
        }
      >
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-screen z-0"
        >
          <source src={VIDEO_URL} type="video/mp4" />
        </video>

        {/* VIYOND Deep Blue Glass Dynamic Gradient Overlays */}
        {/* 1. Base Navy Gelap (#000b29) */}
        <div
          className="absolute inset-0 pointer-events-none z-[1]"
          style={{
            background:
              'linear-gradient(180deg, rgba(0,11,41,0.2) 0%, rgba(0,11,41,0.65) 60%, #000b29 100%)',
          }}
        />

        {/* 2. Pendaran tengah Biru Utama (#0f70d7) dengan radial-gradient dan blur-3xl */}
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full pointer-events-none z-[2] blur-3xl opacity-80"
          style={{
            background:
              'radial-gradient(circle, #0f70d7 0%, rgba(15,112,215,0.4) 50%, transparent 75%)',
          }}
        />

        {/* 3. Sorotan cahaya atas/bawah Biru Muda Cyan (#5ce1e6) dengan radial-gradient dan blur-3xl */}
        <div
          className="absolute -top-12 left-1/2 -translate-x-1/2 w-[280px] h-[190px] rounded-full pointer-events-none z-[3] blur-3xl opacity-60"
          style={{
            background:
              'radial-gradient(ellipse at center, #5ce1e6 0%, rgba(92,225,230,0.3) 55%, transparent 80%)',
          }}
        />
        <div
          className="absolute top-[390px] left-1/2 -translate-x-1/2 w-[300px] h-[160px] rounded-full pointer-events-none z-[2] blur-3xl opacity-40"
          style={{
            background:
              'radial-gradient(ellipse at center, #5ce1e6 0%, rgba(15,112,215,0.25) 60%, transparent 85%)',
          }}
        />

        {/* 4. Subtle Glass Grid / Noise shimmer */}
        <div
          className="absolute inset-0 pointer-events-none z-[3] opacity-20 mix-blend-overlay"
          style={{
            backgroundImage:
              'radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />
      </div>
    );
  }

  return (
    <section
      className={`relative w-full overflow-hidden transition-all duration-500 ease-in-out ${
        fullBleed ? 'min-h-[520px] sm:min-h-[640px] lg:min-h-screen' : 'py-16 lg:py-24'
      } ${className}`}
      style={
        {
          '--primary-color': primaryColor,
          '--secondary-color': secondaryColor,
          '--accent-color': accentColor,
        } as React.CSSProperties
      }
    >
      {/* Height / Full-Bleed Toggle Pill */}
      <button
        type="button"
        onClick={() => setFullBleed(!fullBleed)}
        aria-label={fullBleed ? 'Switch to fit-to-content' : 'Switch to full-bleed'}
        className="absolute top-4 right-4 z-20 p-2.5 rounded-[12px] backdrop-blur-xl text-white transition-all hover:scale-105 active:scale-95 focus:outline-none cursor-pointer"
        style={{
          backgroundColor: hexToRgba(secondaryColor, 0.55),
          borderColor: hexToRgba(accentColor, 0.4),
          borderWidth: '1px',
          borderStyle: 'solid',
          boxShadow: `0 4px 20px ${hexToRgba(secondaryColor, 0.5)}, inset 0 1px 0 rgba(255,255,255,0.15)`,
        }}
        title={fullBleed ? 'Fit to content' : 'Expand full bleed'}
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

      {/* VIYOND Deep Blue Glass Dynamic Gradient Overlays */}
      {/* 1. Base Dark Vignette & Edge Shadow Layer (secondaryColor) */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background: `linear-gradient(180deg, ${hexToRgba(
            secondaryColor,
            0.8
          )} 0%, ${hexToRgba(secondaryColor, 0.55)} 35%, ${hexToRgba(
            secondaryColor,
            0.85
          )} 75%, #050b16 100%)`,
        }}
      />

      {/* 2. Main Center Glow (accentColor & primaryColor) */}
      <div
        className="absolute inset-0 pointer-events-none z-[2]"
        style={{
          background: `radial-gradient(circle at 50% 30%, ${hexToRgba(
            accentColor,
            0.22
          )} 0%, ${hexToRgba(primaryColor, 0.15)} 45%, transparent 75%)`,
        }}
      />

      {/* 3. Subtle Glass Grid / Noise shimmer */}
      <div
        className="absolute inset-0 pointer-events-none z-[2] opacity-30 mix-blend-overlay"
        style={{
          backgroundImage:
            'radial-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Hero Content Container */}
      <div className="relative z-10 flex flex-col items-center text-center mt-12 sm:mt-20 lg:mt-28 px-4 sm:px-6 max-w-5xl mx-auto">
        {/* Tagline Pill */}
        <div
          className="inline-flex items-center gap-2.5 h-[38px] px-3.5 rounded-[12px] backdrop-blur-xl transition-all"
          style={{
            backgroundColor: hexToRgba(secondaryColor, 0.65),
            borderColor: hexToRgba(accentColor, 0.45),
            borderWidth: '1px',
            borderStyle: 'solid',
            boxShadow: `0 0 25px ${hexToRgba(
              primaryColor,
              0.25
            )}, inset 0 1px 0 rgba(255, 255, 255, 0.15)`,
          }}
        >
          <span
            className="text-white font-medium text-xs px-2.5 py-1 rounded-[6px] tracking-wide flex items-center gap-1"
            style={{
              backgroundColor: primaryColor,
              boxShadow: `0 0 10px ${hexToRgba(primaryColor, 0.6)}`,
            }}
          >
            <Sparkles className="w-3 h-3" />
            <span>LIVE 24/7</span>
          </span>
          <span className="font-medium text-xs sm:text-sm text-blue-100 tracking-wide truncate max-w-[240px] sm:max-w-none">
            {siteConfig.brandTagline || 'Vision & Beyond · Bali Smart Mobility'}
          </span>
        </div>

        {/* Dynamic Multilingual Headline */}
        <h1 className="text-white text-3xl sm:text-5xl lg:text-[76px] font-bold leading-[1.08] tracking-[-0.02em] mt-7 max-w-4xl text-balance">
          {t.heroTitleLine1}{' '}
          <br className="hidden sm:block" />
          <span
            className="italic relative inline-block px-1"
            style={{
              textShadow: `0 0 40px ${hexToRgba(accentColor, 0.6)}`,
              color: '#ffffff',
            }}
          >
            {t.heroTitleLine2}
          </span>
        </h1>

        {/* Dynamic Multilingual Subtext */}
        <p className="text-sm sm:text-base lg:text-lg text-[#b9ccf0] mt-5 max-w-[660px] leading-relaxed text-balance">
          {t.heroSubtitle}
        </p>

        {/* Trust Badges Row */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6 text-xs text-blue-100">
          <div
            className="px-3 py-1.5 rounded-full backdrop-blur-md flex items-center gap-1.5"
            style={{
              backgroundColor: hexToRgba(secondaryColor, 0.6),
              borderColor: hexToRgba(accentColor, 0.25),
              borderWidth: '1px',
            }}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t.trustGoogle}</span>
          </div>
          <div
            className="px-3 py-1.5 rounded-full backdrop-blur-md flex items-center gap-1.5"
            style={{
              backgroundColor: hexToRgba(secondaryColor, 0.6),
              borderColor: hexToRgba(accentColor, 0.25),
              borderWidth: '1px',
            }}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-300" />
            <span>{t.trustHelmet}</span>
          </div>
          <div
            className="px-3 py-1.5 rounded-full backdrop-blur-md flex items-center gap-1.5"
            style={{
              backgroundColor: hexToRgba(secondaryColor, 0.6),
              borderColor: hexToRgba(accentColor, 0.25),
              borderWidth: '1px',
            }}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-300" />
            <span>{t.trustInstant}</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3.5 mt-8 w-full sm:w-auto">
          <button
            type="button"
            onClick={onExploreClick}
            className="w-full sm:w-auto px-8 py-3.5 rounded-[12px] text-white font-semibold text-sm sm:text-base transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
            style={{
              backgroundColor: primaryColor,
              boxShadow: `0 8px 25px ${hexToRgba(primaryColor, 0.45)}`,
            }}
          >
            <span>{lang === 'id' ? 'Jelajahi Armada Motor' : 'Explore Fleet & Book'}</span>
            <ChevronDown className="w-4 h-4 animate-bounce" />
          </button>

          <button
            type="button"
            onClick={onCheckStockClick}
            disabled={isSyncing}
            className="w-full sm:w-auto px-8 py-3.5 rounded-[12px] text-white font-medium text-sm sm:text-base backdrop-blur-xl transition-all hover:brightness-125 cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
            style={{
              backgroundColor: hexToRgba(secondaryColor, 0.75),
              borderColor: hexToRgba(accentColor, 0.4),
              borderWidth: '1px',
              borderStyle: 'solid',
              boxShadow: `0 4px 20px ${hexToRgba(secondaryColor, 0.4)}`,
            }}
          >
            {isSyncing ? (
              <span>{t.syncingStock}</span>
            ) : (
              <span>{t.checkLiveStockBtn}</span>
            )}
          </button>
        </div>

        {/* Optional Nested Children slot (e.g. for rental calendar or embedded widget) */}
        {children && <div className="w-full mt-10">{children}</div>}
      </div>
    </section>
  );
};

export const HeroSection = GlassHero;
export default GlassHero;
