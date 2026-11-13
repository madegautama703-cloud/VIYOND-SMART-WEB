'use client';

import React, { useState } from 'react';
import { motion, useScroll, useMotionValueEvent, type Variants } from 'framer-motion';
import {
  ArrowDown,
  Clock,
  HardHat,
  MapPin,
  ScanFace,
  Sparkles,
  Star,
  Wrench,
} from 'lucide-react';
import Velaris from '@/components/ui/velaris';
import type { CategoryId, ShowroomViewModel } from './types';

/**
 * Framer Motion orchestration variants (queried via Context7 /websites/motion_dev):
 * - Staggered blur-to-clear fade-up for headline words/blocks
 * - Staggered spring entrance for floating trust badges & Bento cards
 */
const PAGE_CONTAINER_VARIANTS: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.11,
      delayChildren: 0.06,
    },
  },
};

const BLUR_FADE_UP_VARIANTS: Variants = {
  hidden: {
    opacity: 0,
    y: 26,
    filter: 'blur(12px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.72,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const TRUST_BADGE_LIST_VARIANTS: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.28,
    },
  },
};

const TRUST_BADGE_ITEM_VARIANTS: Variants = {
  hidden: {
    opacity: 0,
    y: 18,
    scale: 0.92,
    filter: 'blur(8px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      stiffness: 150,
      damping: 17,
      mass: 0.8,
    },
  },
};

const SPRING_VISUAL_VARIANTS: Variants = {
  hidden: {
    opacity: 0,
    y: 34,
    scale: 0.94,
    filter: 'blur(10px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      stiffness: 105,
      damping: 18,
      mass: 0.95,
    },
  },
};

const BENTO_GRID_VARIANTS: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.13,
      delayChildren: 0.42,
    },
  },
};

const BENTO_CARD_VARIANTS: Variants = {
  hidden: {
    opacity: 0,
    y: 28,
    scale: 0.96,
    filter: 'blur(8px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      stiffness: 120,
      damping: 18,
      mass: 0.85,
    },
  },
};

export function GlobalStickyHeader({ vm }: { vm: ShowroomViewModel }) {
  const { lang, setLang, siteConfig, categories } = vm;
  const [pastHero, setPastHero] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (latest) => {
    const threshold = typeof window !== 'undefined' ? window.innerHeight - 120 : 600;
    setPastHero(latest > threshold);
  });

  const totalReadyUnits = categories.reduce(
    (sum, cat) => sum + (cat.availableUnits || 0),
    0
  );

  const scrollToShowroom = () => {
    const target = document.getElementById('wizard-canvas');
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-4 inset-x-4 sm:inset-x-6 z-50 mx-auto max-w-[1440px] rounded-full backdrop-blur-md border border-white/10 px-4 sm:px-6 py-3 text-white transition-colors duration-300 ${
        pastHero ? 'bg-[#14171F]/80 shadow-lg' : 'bg-black/30'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-3 text-left cursor-pointer group"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={siteConfig.logoUrl || '/your-brand-white.png'}
            alt={siteConfig.brandName}
            className="h-8 sm:h-9 w-auto object-contain transition-transform group-hover:scale-105"
          />
          <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/90">
            <span className="h-1.5 w-1.5 rounded-full bg-[#34D399]" />
            {totalReadyUnits} {lang === 'id' ? 'Unit Ready' : 'Units Live'}
          </span>
        </button>

        <div className="flex items-center gap-2.5">
          <div className="hidden md:flex items-center gap-2 rounded-full bg-white/10 border border-white/10 px-4 py-1.5 text-xs text-white/80">
            <MapPin className="h-3.5 w-3.5 text-[#34D399]" />
            <span>{lang === 'id' ? 'Lokasi:' : 'Location:'}</span>
            <strong className="font-semibold text-white">Bali, Indonesia</strong>
          </div>

          <button
            type="button"
            onClick={scrollToShowroom}
            className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/10 px-4 py-1.5 text-xs font-semibold text-white hover:bg-white/20 transition-colors cursor-pointer"
          >
            <span>{lang === 'id' ? 'Buka Showroom' : 'Open Showroom'}</span>
            <ArrowDown className="h-3.5 w-3.5" />
          </button>

          <div className="flex items-center rounded-full bg-white/10 border border-white/10 p-0.5">
            {(['en', 'id'] as const).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setLang(code)}
                className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase transition-all cursor-pointer ${
                  lang === code ? 'bg-white text-[#064E3B]' : 'text-white/70 hover:text-white'
                }`}
              >
                {code}
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.header>
  );
}

export function HeroLandingCover({ vm }: { vm: ShowroomViewModel }) {
  const { lang } = vm;

  const scrollToShowroom = () => {
    const target = document.getElementById('showroom-start');
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const headlineSegments =
    lang === 'id'
      ? ['Sewa Motor di Bali —', 'Verifikasi Online Instan', '& Gratis Antar ke Hotel.']
      : ['Rent a Scooter in Bali —', 'Instant Online Verification', '& Free Hotel Delivery.'];

  const subHeadline =
    lang === 'id'
      ? 'Nikmati perjalanan di Bali tanpa antre dan tanpa tahan paspor fisik. Pilih unit armada live kami, unggah dokumen KYC dengan verifikasi AI dalam hitungan menit, dan motor diantar langsung ke lobi hotel atau vila Anda.'
      : 'Experience Bali with zero paperwork hassle and no physical passport deposit. Pick your live fleet unit, complete AI-powered KYC verification in minutes, and get your scooter delivered straight to your hotel or villa lobby.';

  const trustBadges = ['★ 4.9/5 Google Reviews', 'Helmet & Phone Holder Included', '24/7 Instant Booking'];

  return (
    <section id="hero-landing-cover" className="relative w-full overflow-hidden bg-black text-white">
      <Velaris
        bg="#000000"
        colors={['#86efac', '#4ade80', '#059669', '#000000']}
        speed={2.0}
        grain={0.3}
        height="100vh"
        className="min-h-screen w-full"
      >
        <motion.div
          variants={PAGE_CONTAINER_VARIANTS}
          initial="hidden"
          animate="visible"
          className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center gap-6 px-6 pt-24 pb-16 text-center"
        >
          <motion.div variants={BLUR_FADE_UP_VARIANTS}>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-white" />
              Smart Web Scooter Booking Engine · Bali Showroom
            </span>
          </motion.div>

          <motion.h1
            variants={PAGE_CONTAINER_VARIANTS}
            className="text-[36px] font-semibold leading-[1.1] tracking-tight text-[#FFFFFF] drop-shadow-sm sm:text-[52px] xl:text-[64px]"
          >
            {headlineSegments.map((line) => (
              <motion.span key={line} variants={BLUR_FADE_UP_VARIANTS} className="block">
                {line}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p
            variants={BLUR_FADE_UP_VARIANTS}
            className="max-w-2xl text-[15px] leading-relaxed text-white/80 sm:text-[17px]"
          >
            {subHeadline}
          </motion.p>

          <motion.div variants={SPRING_VISUAL_VARIANTS} className="pt-2">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={scrollToShowroom}
              className="rounded-full bg-white px-8 py-4 text-[15px] font-medium text-[#064E3B] shadow-xl hover:bg-white/90 transition-colors cursor-pointer"
            >
              Explore Live Fleet & Book Now ↓
            </motion.button>
          </motion.div>

          <motion.ul
            variants={TRUST_BADGE_LIST_VARIANTS}
            className="mt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] text-white/75"
          >
            {trustBadges.map((label) => (
              <motion.li key={label} variants={TRUST_BADGE_ITEM_VARIANTS}>
                {label}
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </Velaris>
    </section>
  );
}

/**
 * Highlight strip (3 Bento cards) — sits at the top of the light #E6E8EA showroom section,
 * acting as the transition below the dark Living Gradient hero.
 */
export function HighlightStrip({ vm }: { vm: ShowroomViewModel }) {
  const { lang } = vm;
  const cards = [
    {
      icon: Wrench,
      badge: lang === 'id' ? 'ARMADA PRIMA' : 'FLEET QUALITY',
      title: '100% Well-Maintained Scooters',
      subtitle:
        lang === 'id'
          ? 'Seluruh unit NMAX, PCX, Scoopy, Vario & Fazzio melewati inspeksi berkala resmi, rem ABS/CBS pakem, dan kondisi ban prima.'
          : 'Every NMAX, PCX, Scoopy, Vario & Fazzio undergoes scheduled workshop inspection, crisp ABS/CBS braking, and sanitized touchpoints.',
    },
    {
      icon: HardHat,
      badge: lang === 'id' ? 'FASILITAS LENGKAP' : 'FREE ACCESSORIES',
      title: 'Free Helmet & Phone Holder',
      subtitle:
        lang === 'id'
          ? 'Sudah termasuk 2 helm SNI bersih berstandar higienis, phone holder navigasi anti-getar, serta port USB charger di unit pilihan.'
          : 'Comes standard with 2 sanitized SNI helmets, sturdy navigation phone mount, and built-in USB charging on select models.',
    },
    {
      icon: ScanFace,
      badge: 'AI VISION OCR',
      title: 'Instant AI Passport/ID Verification',
      subtitle:
        lang === 'id'
          ? 'Tanpa tahan KTP atau paspor asli. Sistem AI Vision memvalidasi kejelasan dokumen Anda secara instan dengan kompresi aman di browser.'
          : 'Keep your physical passport safe with you. Our AI Vision OCR verifies document clarity in seconds with client-side privacy compression.',
    },
  ];

  return (
    <div id="showroom-start" className="scroll-mt-0 bg-[#E6E8EA] px-4 pt-10 sm:px-8 xl:px-12">
      <motion.div
        variants={BENTO_GRID_VARIANTS}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="mx-auto grid max-w-[1440px] grid-cols-1 gap-4 md:grid-cols-3 lg:gap-6"
      >
        {cards.map(({ icon: Icon, badge, title, subtitle }) => (
          <motion.div
            key={title}
            variants={BENTO_CARD_VARIANTS}
            whileHover={{ y: -3 }}
            className="group rounded-3xl border border-white/50 bg-white/90 p-5 shadow-sm backdrop-blur-md transition-shadow hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#14171F] text-white transition-colors group-hover:bg-[#10B981]">
                <Icon className="h-5 w-5" />
              </div>
              <span className="rounded-full bg-[#D1FAE5] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#065F46]">
                {badge}
              </span>
            </div>
            <h3 className="mt-3.5 text-[16px] font-semibold tracking-tight text-[#14171F]">{title}</h3>
            <p className="mt-1 text-[12px] leading-relaxed text-[#6B7280]">{subtitle}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
