import React, { useState } from 'react';
import { Check, MapPin, ShieldCheck, Smartphone, X } from 'lucide-react';
import { ColorVariant, DeliveryLocation, Product } from '../types/product';
import { OneClickButton, PriceDisplay, PrimeBadge, StarRating } from './AmazonPrimitives';

interface ProductModalProps {
  product: Product;
  initialVariant: ColorVariant;
  location: DeliveryLocation;
  onClose: () => void;
  onAddToCart: (product: Product, variant: ColorVariant, model: string, qty: number) => void;
  onBuyNow: (product: Product, variant: ColorVariant, model: string, qty: number) => void;
}

export function ProductModal({
  product,
  initialVariant,
  location,
  onClose,
  onAddToCart,
  onBuyNow,
}: ProductModalProps) {
  const [selectedVariant, setSelectedVariant] = useState<ColorVariant>(initialVariant);
  const [selectedModel, setSelectedModel] = useState<string>(product.compatibleModels[0]);
  const [quantity, setQuantity] = useState(1);
  const [imgError, setImgError] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);

  const handleAdd = () => {
    onAddToCart(product, selectedVariant, selectedModel, quantity);
    setAddedFeedback(true);
    window.setTimeout(() => setAddedFeedback(false), 1500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={product.title}
    >
      <div className="fixed inset-0 bg-black/60" onClick={onClose} aria-hidden="true" />

      <div className="relative z-10 w-full max-w-[980px] max-h-[90vh] bg-white rounded-md shadow-2xl overflow-hidden flex flex-col">
        <div className="px-5 py-3 bg-[#F7F7F7] border-b border-[#E7E7E7] flex items-center justify-between">
          <span className="text-[13px] text-[#565959]">
            {product.category} › {product.brand} ›{' '}
            <span className="text-[#0F1111] font-medium">{product.asin}</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close product details"
            className="p-1.5 rounded hover:bg-[#EAEDED] text-[#0F1111] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 sm:p-6 amazon-scroll">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Image Column */}
            <div className="lg:col-span-5 bg-[#F7F7F7] rounded-sm p-6 aspect-square flex items-center justify-center">
              {!imgError ? (
                <img
                  src={selectedVariant.image}
                  alt={product.title}
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="w-full h-full object-contain mix-blend-multiply"
                />
              ) : (
                <div className="flex flex-col items-center text-[#565959] gap-2">
                  <Smartphone className="w-14 h-14 stroke-[1.3]" />
                  <span className="text-[13px]">{product.brand}</span>
                </div>
              )}
            </div>

            {/* Center Info Column */}
            <div className="lg:col-span-4 space-y-3">
              <div>
                <p className="text-[13px] text-[#007185] font-medium">
                  Visit the {product.brand} Store
                </p>
                <h2 className="text-[19px] font-medium text-[#0F1111] leading-snug mt-0.5">
                  {product.title}
                </h2>
              </div>

              <div className="flex items-center gap-2 pb-2 border-b border-[#E7E7E7]">
                <span className="text-[14px] font-medium tabular-nums">
                  {product.rating.toFixed(1)}
                </span>
                <StarRating rating={product.rating} size="sm" />
                <span className="text-[13px] text-[#007185] tabular-nums">
                  {product.reviewCount.toLocaleString()} ratings
                </span>
              </div>

              <div>
                <PriceDisplay price={product.price} listPrice={product.listPrice} size="lg" />
                <p className="text-[12px] text-[#565959] mt-1">
                  All prices include GST.
                </p>
              </div>

              {/* Color Selection */}
              <div className="pt-1">
                <p className="text-[13px] text-[#565959] mb-1.5">
                  Colour: <span className="font-bold text-[#0F1111]">{selectedVariant.name}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => {
                    const active = v.name === selectedVariant.name;
                    return (
                      <button
                        key={v.name}
                        type="button"
                        onClick={() => {
                          setSelectedVariant(v);
                          setImgError(false);
                        }}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xs border text-[12px] cursor-pointer ${
                          active
                            ? 'border-[#E77600] ring-1 ring-[#E77600] bg-[#FEF8F2] font-semibold'
                            : 'border-[#D5D9D9] hover:border-[#888C8C]'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/20"
                          style={{ backgroundColor: v.hex }}
                        />
                        <span>{v.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Model Selection */}
              <div>
                <p className="text-[13px] text-[#565959] mb-1.5">
                  Model: <span className="font-bold text-[#0F1111]">{selectedModel}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.compatibleModels.map((mod) => {
                    const active = mod === selectedModel;
                    return (
                      <button
                        key={mod}
                        type="button"
                        onClick={() => setSelectedModel(mod)}
                        className={`px-3 py-1.5 rounded-xs border text-[12px] cursor-pointer ${
                          active
                            ? 'border-[#E77600] ring-1 ring-[#E77600] bg-[#FEF8F2] font-semibold'
                            : 'border-[#D5D9D9] hover:border-[#888C8C]'
                        }`}
                      >
                        {mod}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Specs */}
              <div className="pt-2 border-t border-[#E7E7E7]">
                <h3 className="text-[14px] font-bold text-[#0F1111] mb-1.5">About this item</h3>
                <ul className="list-disc pl-4 space-y-1.5 text-[13px] text-[#0F1111] leading-relaxed">
                  {product.bulletPoints.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Buy Box Column */}
            <div className="lg:col-span-3 border border-[#D5D9D9] rounded-lg p-4 space-y-3 bg-white">
              <PriceDisplay price={product.price} size="md" />

              {product.isPrime && (
                <div>
                  <PrimeBadge />
                </div>
              )}

              <p className="text-[13px] text-[#0F1111] leading-snug">
                <span className="font-semibold">{product.deliveryText}</span>
              </p>

              <div className="flex items-start gap-1.5 text-[12px] text-[#007185]">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-[#0F1111]" />
                <span>
                  Deliver to {location.city} {location.postalCode}
                </span>
              </div>

              <p className="text-[16px] font-medium text-[#007600]">
                {product.stockNote ? product.stockNote : 'In Stock'}
              </p>

              <div className="flex items-center gap-2 text-[13px]">
                <label htmlFor="modal-qty" className="text-[#0F1111]">
                  Quantity:
                </label>
                <select
                  id="modal-qty"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="border border-[#D5D9D9] bg-[#F0F2F2] rounded-md px-2.5 py-1 text-[13px] cursor-pointer focus:outline-none focus:border-[#007185]"
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={handleAdd}
                  className={`w-full py-2 px-4 rounded-full text-[13px] font-medium border transition-colors cursor-pointer ${
                    addedFeedback
                      ? 'bg-[#067D62] text-white border-[#067D62]'
                      : 'bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111] border-[#FCD200]'
                  }`}
                >
                  {addedFeedback ? (
                    <span className="inline-flex items-center justify-center gap-1">
                      <Check className="w-4 h-4" /> Added to Cart
                    </span>
                  ) : (
                    'Add to Cart'
                  )}
                </button>

                <OneClickButton
                  onClick={() => onBuyNow(product, selectedVariant, selectedModel, quantity)}
                  className="py-2.5 px-5 text-[14.5px]"
                />
              </div>

              <div className="pt-2 border-t border-[#E7E7E7] text-[12px] text-[#565959] space-y-1">
                <div className="flex justify-between">
                  <span>Ships from</span>
                  <span className="text-[#0F1111]">Amazon SG</span>
                </div>
                <div className="flex justify-between">
                  <span>Sold by</span>
                  <span className="text-[#0F1111]">{product.brand} Official</span>
                </div>
                <div className="flex items-center gap-1.5 pt-1 text-[#007185]">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>15-day Returns Eligible</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
