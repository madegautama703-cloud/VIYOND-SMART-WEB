'use client';

import React from 'react';
import { CardContainer, CardBody, CardItem } from '@/components/ui/3d-card';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import { ArrowUpRight, RefreshCw } from 'lucide-react';

export interface Step3SubmitButtonProps {
  onSubmit: () => void;
  isSubmitting: boolean;
  buttonText?: string;
  disabled?: boolean;
}

/**
 * 3D Card + Magic UI Shimmer Button Component
 * Replaces the standard submit button with 3D perspective floating effect
 * and shimmering glowing border, perfectly wired to n8n webhook booking submission.
 */
export function Step3SubmitButton({
  onSubmit,
  isSubmitting,
  buttonText = 'Submit and Verify My Booking',
  disabled = false,
}: Step3SubmitButtonProps) {
  return (
    <CardContainer className="w-full py-1">
      <CardBody className="w-full relative group/card flex items-center gap-2">
        {/* 3D Floating Main Shimmer CTA */}
        <CardItem
          translateZ={50}
          className="flex-1 w-full"
        >
          <ShimmerButton
            onClick={onSubmit}
            disabled={disabled || isSubmitting}
            className="w-full h-13 text-sm font-bold flex items-center justify-center gap-2.5 rounded-full"
            shimmerColor="#93c5fd"
            shimmerDuration="2.5s"
            background="radial-gradient(ellipse 90% 60% at 50% 120%, rgba(37, 99, 235, 0.8), rgba(8, 22, 54, 0.98))"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-blue-300" />
                <span className="font-semibold text-blue-100">Sedang Mengirim ke n8n...</span>
              </>
            ) : (
              <span className="tracking-wide text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.3)]">
                {buttonText}
              </span>
            )}
          </ShimmerButton>
        </CardItem>

        {/* 3D Floating Pill Action Icon Button */}
        <CardItem
          translateZ={75}
          className="shrink-0"
        >
          <button
            type="button"
            onClick={onSubmit}
            disabled={disabled || isSubmitting}
            aria-label="Submit Booking"
            className="w-13 h-13 rounded-full bg-blue-500 hover:bg-blue-400 text-white flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:shadow-[0_0_30px_rgba(96,165,250,0.8)] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group-hover/card:scale-105 active:scale-95"
          >
            <ArrowUpRight className="w-5 h-5 text-white stroke-[2.5]" />
          </button>
        </CardItem>
      </CardBody>
    </CardContainer>
  );
}

export default Step3SubmitButton;
