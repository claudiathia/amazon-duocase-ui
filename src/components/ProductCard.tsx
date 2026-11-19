import React, { useState } from 'react';
import { Check, Smartphone } from 'lucide-react';
import { ColorVariant, DeliveryLocation, Product } from '../types/product';
import { OneClickButton, PriceDisplay, PrimeBadge, StarRating } from './AmazonPrimitives';

interface ProductCardProps {
  product: Product;
  viewMode: 'grid' | 'list';
  location: DeliveryLocation;
  onSelectProduct: (product: Product, variant: ColorVariant) => void;
  onAddToCart: (product: Product, variant: ColorVariant) => void;
  onOneClickBuy: (product: Product, variant: ColorVariant) => void;
}

export function ProductCard({
  product,
  viewMode,
  location,
  onSelectProduct,
  onAddToCart,
  onOneClickBuy,
}: ProductCardProps) {
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [imgError, setImgError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [justOrdered, setJustOrdered] = useState(false);

  const variant = product.variants[selectedVariantIdx] ?? product.variants[0];

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, variant);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1400);
  };

  const handleOneClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOneClickBuy(product, variant);
    setJustOrdered(true);
    window.setTimeout(() => setJustOrdered(false), 1800);
  };

  const renderBadge = () => {
    if (!product.badge) return null;
    if (product.badge === "Amazon's Choice") {
      return (
        <span className="inline-flex items-center bg-[#232F3E] text-white text-[11px] font-medium px-2 py-0.5 rounded-xs w-fit">
          Amazon&apos;s <span className="text-[#FF9900] ml-1">Choice</span>
        </span>
      );
    }
    if (product.badge === 'Best Seller') {
      return (
        <span className="inline-flex items-center bg-[#C45500] text-white text-[11px] font-semibold px-2 py-0.5 rounded-xs w-fit">
          Best Seller
        </span>
      );
    }
    return (
      <span className="inline-flex items-center bg-[#CC0C39] text-white text-[11px] font-semibold px-2 py-0.5 rounded-xs w-fit">
        Limited time deal
      </span>
    );
  };

  if (viewMode === 'list') {
    return (
      <article className="border border-[#E7E7E7] rounded-sm bg-white p-3 sm:p-4 flex flex-col sm:flex-row gap-4 hover:border-[#C7CCCC] transition-colors">
        <div
          onClick={() => onSelectProduct(product, variant)}
          className="w-full sm:w-[220px] h-[220px] bg-[#F7F7F7] rounded-xs p-3 flex items-center justify-center shrink-0 cursor-pointer relative"
        >
          {!imgError ? (
            <img
              src={variant.image}
              alt={`${product.brand} ${product.title}`}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-full h-full object-contain mix-blend-multiply transition-transform duration-200 hover:scale-[1.03]"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-center text-[#565959] gap-2">
              <Smartphone className="w-10 h-10 stroke-[1.4]" />
              <span className="text-[12px] font-medium">{product.brand} Duo Case</span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1.5 min-h-[20px]">
              {renderBadge()}
              {product.isSponsored && (
                <span className="text-[11px] text-[#565959]">Sponsored</span>
              )}
            </div>

            <button
              type="button"
              onClick={() => onSelectProduct(product, variant)}
              className="text-left text-[16px] font-medium text-[#0F1111] hover:text-[#C7511F] leading-snug cursor-pointer"
            >
              {product.title}
            </button>

            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="text-[13px] font-medium text-[#0F1111] tabular-nums">
                {product.rating.toFixed(1)}
              </span>
              <StarRating rating={product.rating} size="sm" />
              <button
                type="button"
                onClick={() => onSelectProduct(product, variant)}
                className="text-[13px] text-[#007185] hover:text-[#C7511F] tabular-nums cursor-pointer"
              >
                ({product.reviewCount.toLocaleString()})
              </button>
            </div>

            {product.boughtLastMonth && (
              <p className="text-[12px] text-[#565959] mt-0.5">{product.boughtLastMonth}</p>
            )}

            <div className="mt-2.5">
              <PriceDisplay price={product.price} listPrice={product.listPrice} size="md" />
            </div>

            <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px]">
              {product.isPrime && <PrimeBadge />}
              <span className="text-[#0F1111]">
                {product.deliveryText}{' '}
                <span className="text-[#565959]">to {location.postalCode}</span>
              </span>
            </div>

            {product.stockNote && (
              <p className="text-[12px] text-[#B12704] font-medium mt-1">{product.stockNote}</p>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            {/* Color Swatches */}
            <div className="flex items-center gap-1.5">
              <span className="text-[12px] text-[#565959] mr-1">Colour: {variant.name}</span>
              {product.variants.map((v, idx) => (
                <button
                  key={v.name}
                  type="button"
                  title={v.name}
                  aria-label={`Select ${v.name}`}
                  onClick={() => {
                    setSelectedVariantIdx(idx);
                    setImgError(false);
                  }}
                  className={`w-5 h-5 rounded-full border cursor-pointer transition-transform ${
                    idx === selectedVariantIdx
                      ? 'ring-2 ring-offset-1 ring-[#007185] border-[#007185]'
                      : 'border-[#888C8C] hover:scale-110'
                  }`}
                  style={{ backgroundColor: v.hex }}
                />
              ))}
            </div>

            <div className="flex flex-col gap-1.5 min-w-[195px]">
              <button
                type="button"
                onClick={handleAdd}
                className={`px-4 py-1.5 text-[13px] font-medium rounded-full border transition-colors cursor-pointer whitespace-nowrap ${
                  justAdded
                    ? 'bg-[#067D62] text-white border-[#067D62]'
                    : 'bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111] border-[#FCD200]'
                }`}
              >
                {justAdded ? (
                  <span className="inline-flex items-center justify-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Added to cart
                  </span>
                ) : (
                  'Add to cart'
                )}
              </button>

              <OneClickButton
                onClick={handleOneClick}
                confirmed={justOrdered}
                confirmedLabel={
                  <>
                    <Check className="w-3.5 h-3.5" /> Ordered with 1-Click
                  </>
                }
                className="py-2.5 px-4 text-[14px]"
              />
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="border border-[#E7E7E7] rounded-sm bg-white flex flex-col justify-between hover:border-[#C7CCCC] transition-colors overflow-hidden">
      {/* Image Well */}
      <div>
        <div
          onClick={() => onSelectProduct(product, variant)}
          className="relative w-full aspect-square bg-[#F7F7F7] p-4 flex items-center justify-center cursor-pointer"
        >
          {product.badge && (
            <div className="absolute top-2 left-2 z-10">{renderBadge()}</div>
          )}

          {!imgError ? (
            <img
              src={variant.image}
              alt={`${product.brand} ${product.title}`}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-full h-full object-contain mix-blend-multiply transition-transform duration-200 hover:scale-[1.03]"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-center text-[#565959] gap-2">
              <Smartphone className="w-10 h-10 stroke-[1.4]" />
              <span className="text-[12px] font-medium">{product.brand} Duo Case</span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="p-3 pb-2 space-y-1.5">
          {product.isSponsored && (
            <div className="text-[11px] text-[#565959] leading-none">Sponsored</div>
          )}

          {/* Color Swatches Row */}
          {product.variants.length > 1 && (
            <div className="flex items-center gap-1.5 pt-0.5">
              {product.variants.map((v, idx) => (
                <button
                  key={v.name}
                  type="button"
                  title={v.name}
                  aria-label={`Select ${v.name}`}
                  onClick={() => {
                    setSelectedVariantIdx(idx);
                    setImgError(false);
                  }}
                  className={`w-4 h-4 rounded-full border cursor-pointer transition-transform ${
                    idx === selectedVariantIdx
                      ? 'ring-2 ring-offset-1 ring-[#007185] border-[#007185]'
                      : 'border-[#888C8C] hover:scale-110'
                  }`}
                  style={{ backgroundColor: v.hex }}
                />
              ))}
              <span className="text-[11px] text-[#565959] truncate ml-1">{variant.name}</span>
            </div>
          )}

          <button
            type="button"
            onClick={() => onSelectProduct(product, variant)}
            className="text-left text-[14px] font-normal text-[#0F1111] hover:text-[#C7511F] leading-[1.35] line-clamp-3 cursor-pointer"
          >
            {product.title}
          </button>

          {/* Rating */}
          <div className="flex items-center gap-1 pt-0.5">
            <StarRating rating={product.rating} size="sm" />
            <button
              type="button"
              onClick={() => onSelectProduct(product, variant)}
              className="text-[12px] text-[#007185] hover:text-[#C7511F] tabular-nums cursor-pointer"
            >
              {product.reviewCount.toLocaleString()}
            </button>
          </div>

          {product.boughtLastMonth && (
            <p className="text-[12px] text-[#565959]">{product.boughtLastMonth}</p>
          )}

          {/* Price */}
          <div className="pt-1">
            <PriceDisplay price={product.price} listPrice={product.listPrice} size="md" />
          </div>

          {/* Prime & Delivery */}
          <div className="pt-0.5 space-y-0.5 text-[12px]">
            {product.isPrime && (
              <div className="flex items-center gap-1.5">
                <PrimeBadge />
                <span className="text-[#565959]">SG</span>
              </div>
            )}
            <p className="text-[#0F1111] leading-snug">
              <span className="font-medium">{product.deliveryText}</span>
            </p>
            {product.stockNote && (
              <p className="text-[#B12704] font-medium">{product.stockNote}</p>
            )}
          </div>
        </div>
      </div>

      {/* Add to Cart & 1-Click Footer */}
      <div className="px-3 pb-3 pt-1 space-y-1.5">
        <button
          type="button"
          onClick={handleAdd}
          className={`w-full py-1.5 px-3 text-[13px] font-medium rounded-full border transition-colors cursor-pointer whitespace-nowrap ${
            justAdded
              ? 'bg-[#067D62] text-white border-[#067D62]'
              : 'bg-[#FFD814] hover:bg-[#F7CA00] active:bg-[#F0B800] text-[#0F1111] border-[#FCD200]'
          }`}
        >
          {justAdded ? (
            <span className="inline-flex items-center justify-center gap-1">
              <Check className="w-3.5 h-3.5" /> Added to cart
            </span>
          ) : (
            'Add to cart'
          )}
        </button>

        <OneClickButton
          onClick={handleOneClick}
          confirmed={justOrdered}
          confirmedLabel={
            <>
              <Check className="w-3.5 h-3.5" /> Ordered with 1-Click
            </>
          }
          className="py-2.5 px-4 text-[14px]"
        />
      </div>
    </article>
  );
}
