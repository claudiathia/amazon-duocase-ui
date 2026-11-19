import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Product } from '../types/product';
import { StarRating } from './AmazonPrimitives';

interface SponsoredBannerProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onFilterBrand: (brand: string) => void;
}

export function SponsoredBanner({
  products,
  onSelectProduct,
  onFilterBrand,
}: SponsoredBannerProps) {
  const spigenItems = products.filter((p) => p.brand === 'Spigen').slice(0, 2);
  const pitakaItem = products.find((p) => p.brand === 'PITAKA');
  const featured = [...spigenItems, ...(pitakaItem ? [pitakaItem] : [])].slice(0, 3);

  if (featured.length === 0) return null;

  return (
    <section
      aria-label="Sponsored brand showcase"
      className="mb-4 border border-[#E7E7E7] rounded-sm bg-[#FAFAFA] overflow-hidden"
    >
      <div className="px-4 py-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#EAEAEA] bg-white">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-sm bg-[#131921] text-white font-bold text-[13px] tracking-tight flex items-center justify-center shrink-0">
            SPIGEN
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-[#0F1111] leading-snug">
              Precision Hinge & MagSafe Armor for iPhone Duo
            </h2>
            <button
              type="button"
              onClick={() => onFilterBrand('Spigen')}
              className="inline-flex items-center gap-0.5 text-[13px] text-[#007185] hover:text-[#C7511F] hover:underline cursor-pointer"
            >
              <span>Shop the Spigen Collection on Amazon.sg</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <span className="text-[11px] text-[#565959] self-end md:self-center">Sponsored</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#EAEAEA] bg-white">
        {featured.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectProduct(item)}
            className="flex items-center gap-3 p-3 text-left hover:bg-[#F7FAFA] transition-colors cursor-pointer group"
          >
            <div className="w-20 h-20 bg-[#F7F7F7] rounded-xs p-1.5 flex items-center justify-center shrink-0">
              <img
                src={item.variants[0].image}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain mix-blend-multiply"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] text-[#0F1111] group-hover:text-[#C7511F] line-clamp-2 leading-snug mb-1">
                {item.title}
              </p>
              <div className="flex items-center gap-1 mb-0.5">
                <StarRating rating={item.rating} size="xs" />
                <span className="text-[11px] text-[#007185] tabular-nums">
                  {item.reviewCount.toLocaleString()}
                </span>
              </div>
              <div className="text-[14px] font-semibold text-[#0F1111] tabular-nums">
                S${item.price.toFixed(2)}
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
