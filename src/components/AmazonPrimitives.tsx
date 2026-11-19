import React from 'react';

export function AmazonLogo({ light = true }: { light?: boolean }) {
  const textColor = light ? 'text-white' : 'text-[#0F1111]';
  const dotSgColor = light ? 'text-white/90' : 'text-[#0F1111]';
  return (
    <span className="inline-flex flex-col items-start leading-none select-none">
      <span className={`inline-flex items-baseline tracking-tight font-bold text-[21px] ${textColor}`}>
        amazon
        <span className={`text-[13px] font-semibold ml-0.5 ${dotSgColor}`}>.sg</span>
      </span>
      <svg
        viewBox="0 0 92 14"
        className="w-[74px] h-[11px] -mt-0.5 ml-0.5"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M4 3.5C22 12.5 54 13.5 79 4.5"
          stroke="#FF9900"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        <path
          d="M73.5 2.5L81.5 4L78.2 10.8"
          stroke="#FF9900"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export function PrimeBadge() {
  return (
    <span
      className="inline-flex items-center gap-0.5 select-none whitespace-nowrap"
      aria-label="Amazon Prime"
    >
      <svg className="w-3.5 h-3.5 text-[#FF9900]" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M2.5 8.5L6.2 12.2L13.5 4.2"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="text-[13px] font-bold tracking-tight text-[#00A8E1] lowercase leading-none">
        prime
      </span>
    </span>
  );
}

export function StarRating({
  rating,
  size = 'sm',
}: {
  rating: number;
  size?: 'xs' | 'sm' | 'md';
}) {
  const dim = size === 'xs' ? 'w-3.5 h-3.5' : size === 'md' ? 'w-4.5 h-4.5' : 'w-4 h-4';
  const stars = [1, 2, 3, 4, 5];

  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {stars.map((idx) => {
        const fillRatio = Math.max(0, Math.min(1, rating - (idx - 1)));
        const gradId = `star-${idx}-${Math.round(rating * 10)}`;
        return (
          <svg key={idx} viewBox="0 0 20 20" className={dim} aria-hidden="true">
            <defs>
              <linearGradient id={gradId} x1="0" x2="1" y1="0" y2="0">
                <stop offset={`${fillRatio * 100}%`} stopColor="#FFA41C" />
                <stop offset={`${fillRatio * 100}%`} stopColor="#E5E7EB" />
              </linearGradient>
            </defs>
            <path
              d="M10 1.6l2.47 5.01 5.53.8-4 3.9.94 5.51L10 14.22l-4.94 2.6.94-5.51-4-3.9 5.53-.8L10 1.6z"
              fill={`url(#${gradId})`}
              stroke="#DE7921"
              strokeWidth="0.9"
              strokeLinejoin="round"
            />
          </svg>
        );
      })}
    </span>
  );
}

export function PriceDisplay({
  price,
  listPrice,
  size = 'md',
}: {
  price: number;
  listPrice?: number;
  size?: 'sm' | 'md' | 'lg';
}) {
  const formatted = price.toFixed(2);
  const [whole, cents] = formatted.split('.');
  const discountPct =
    listPrice && listPrice > price ? Math.round(((listPrice - price) / listPrice) * 100) : null;

  const wholeSize =
    size === 'lg' ? 'text-[28px]' : size === 'sm' ? 'text-[20px]' : 'text-[24px]';
  const symSize = size === 'lg' ? 'text-[13px]' : 'text-[12px]';

  return (
    <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5 tabular-nums">
      <span className="inline-flex items-start text-[#0F1111] leading-none">
        <span className={`${symSize} font-medium mt-1 mr-0.5`}>S$</span>
        <span className={`${wholeSize} font-semibold tracking-tight leading-none`}>{whole}</span>
        <span className={`${symSize} font-medium mt-0.5 ml-0.5`}>{cents}</span>
      </span>

      {listPrice && listPrice > price && (
        <span className="inline-flex items-baseline gap-1.5 text-[12px] text-[#565959]">
          <span>
            List: <span className="line-through">S${listPrice.toFixed(2)}</span>
          </span>
          {discountPct && discountPct > 0 && (
            <span className="text-[#CC0C39] font-medium">(-{discountPct}%)</span>
          )}
        </span>
      )}
    </div>
  );
}

export function OneClickButton({
  onClick,
  confirmed = false,
  confirmedLabel = 'Ordered with 1-Click',
  label = 'Buy now with 1-Click',
  className = '',
}: {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  confirmed?: boolean;
  confirmedLabel?: React.ReactNode;
  label?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`oneclick-btn w-full rounded-full border font-bold transition-colors cursor-pointer whitespace-nowrap select-none ${
        confirmed
          ? 'bg-[#067D62] text-white border-[#067D62]'
          : 'bg-[#FFA41C] hover:bg-[#FA8900] active:bg-[#F08000] text-[#0F1111] border-[#FF8F00] shadow-[0_1px_3px_rgba(255,164,28,0.35)]'
      } ${className}`}
    >
      {!confirmed && (
        <>
          <span className="oneclick-sheen" aria-hidden="true" />
          <svg
            viewBox="0 0 16 16"
            className="oneclick-sparkle w-2.5 h-2.5 text-white/95 top-1.5 left-4"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M8 0L9.8 6.2L16 8L9.8 9.8L8 16L6.2 9.8L0 8L6.2 6.2L8 0Z" />
          </svg>
          <svg
            viewBox="0 0 16 16"
            className="oneclick-sparkle oneclick-sparkle-delay-1 w-2 h-2 text-[#FFF7D6] bottom-1.5 left-8"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M8 0L9.8 6.2L16 8L9.8 9.8L8 16L6.2 9.8L0 8L6.2 6.2L8 0Z" />
          </svg>
          <svg
            viewBox="0 0 16 16"
            className="oneclick-sparkle oneclick-sparkle-delay-2 w-2.5 h-2.5 text-white/95 top-1.5 right-5"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M8 0L9.8 6.2L16 8L9.8 9.8L8 16L6.2 9.8L0 8L6.2 6.2L8 0Z" />
          </svg>
          <svg
            viewBox="0 0 16 16"
            className="oneclick-sparkle oneclick-sparkle-delay-3 w-2 h-2 text-[#FFF7D6] bottom-1.5 right-9"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M8 0L9.8 6.2L16 8L9.8 9.8L8 16L6.2 9.8L0 8L6.2 6.2L8 0Z" />
          </svg>
        </>
      )}
      <span className="relative z-10 inline-flex items-center justify-center gap-1">
        {confirmed ? confirmedLabel : label}
      </span>
    </button>
  );
}

