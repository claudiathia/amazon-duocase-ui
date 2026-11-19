import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { CaseFeature, CaseMaterial, FilterState } from '../types/product';
import { ALL_BRANDS, COLOR_FILTERS } from '../data/products';
import { PrimeBadge, StarRating } from './AmazonPrimitives';

interface FilterSidebarProps {
  filters: FilterState;
  onUpdateFilters: (next: FilterState) => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

const FEATURES_LIST: CaseFeature[] = [
  'MagSafe Compatible',
  'Hinge Protection',
  'Built-in Kickstand',
  'Clear / Transparent',
  'Ultra-Slim Aramid',
  'Folio & Wallet',
];

const MATERIALS_LIST: CaseMaterial[] = [
  'Polycarbonate',
  'TPU & Hybrid',
  'Aramid Fiber',
  'TechWoven / Fabric',
];

const PRICE_PRESETS: { label: string; min: number | null; max: number | null }[] = [
  { label: 'Under S$25', min: null, max: 25 },
  { label: 'S$25 to S$50', min: 25, max: 50 },
  { label: 'S$50 to S$100', min: 50, max: 100 },
  { label: 'S$100 & Above', min: 100, max: null },
];

export function FilterSidebar({
  filters,
  onUpdateFilters,
  onResetFilters,
  hasActiveFilters,
}: FilterSidebarProps) {
  const [minInput, setMinInput] = useState(
    filters.priceRange[0] !== null ? String(filters.priceRange[0]) : ''
  );
  const [maxInput, setMaxInput] = useState(
    filters.priceRange[1] !== null ? String(filters.priceRange[1]) : ''
  );

  const toggleArrayItem = <T extends string>(arr: T[], value: T): T[] =>
    arr.includes(value) ? arr.filter((item) => item !== value) : [...arr, value];

  const handlePriceForm = (e: React.FormEvent) => {
    e.preventDefault();
    const min = minInput.trim() ? Number(minInput) : null;
    const max = maxInput.trim() ? Number(maxInput) : null;
    onUpdateFilters({
      ...filters,
      priceRange: [
        min !== null && !Number.isNaN(min) ? min : null,
        max !== null && !Number.isNaN(max) ? max : null,
      ],
    });
  };

  return (
    <div className="space-y-5 text-[13px] text-[#0F1111]">
      {hasActiveFilters && (
        <div className="pb-2 border-b border-[#E7E7E7]">
          <button
            type="button"
            onClick={() => {
              setMinInput('');
              setMaxInput('');
              onResetFilters();
            }}
            className="text-[#007185] hover:text-[#C7511F] hover:underline font-medium cursor-pointer"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Delivery Day */}
      <div>
        <h3 className="font-bold text-[14px] mb-1.5">Delivery Day</h3>
        <label className="flex items-center gap-2 py-0.5 cursor-pointer group">
          <input
            type="checkbox"
            checked={filters.getItTomorrow}
            onChange={(e) =>
              onUpdateFilters({ ...filters, getItTomorrow: e.target.checked })
            }
            className="w-4 h-4 accent-[#007185] rounded-xs cursor-pointer"
          />
          <span className="group-hover:text-[#C7511F]">Get It by Tomorrow</span>
        </label>
      </div>

      {/* Amazon Prime */}
      <div>
        <h3 className="font-bold text-[14px] mb-1.5">Amazon Prime</h3>
        <label className="flex items-center gap-2 py-0.5 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.primeOnly}
            onChange={(e) =>
              onUpdateFilters({ ...filters, primeOnly: e.target.checked })
            }
            className="w-4 h-4 accent-[#007185] rounded-xs cursor-pointer"
          />
          <PrimeBadge />
        </label>
      </div>

      {/* Free Shipping */}
      <div>
        <h3 className="font-bold text-[14px] mb-1.5">Eligible for Free Shipping</h3>
        <label className="flex items-center gap-2 py-0.5 cursor-pointer group">
          <input
            type="checkbox"
            checked={filters.freeShippingOnly}
            onChange={(e) =>
              onUpdateFilters({ ...filters, freeShippingOnly: e.target.checked })
            }
            className="w-4 h-4 accent-[#007185] rounded-xs cursor-pointer"
          />
          <span className="group-hover:text-[#C7511F]">Free Shipping by Amazon</span>
        </label>
      </div>

      {/* Customer Reviews */}
      <div>
        <h3 className="font-bold text-[14px] mb-1.5">Customer Reviews</h3>
        <div className="space-y-1">
          {[4, 3, 2, 1].map((stars) => {
            const active = filters.minRating === stars;
            return (
              <button
                key={stars}
                type="button"
                onClick={() =>
                  onUpdateFilters({
                    ...filters,
                    minRating: active ? null : stars,
                  })
                }
                className={`flex items-center gap-1.5 py-0.5 text-left w-full cursor-pointer hover:text-[#C7511F] ${
                  active ? 'font-bold text-[#0F1111]' : 'text-[#0F1111]'
                }`}
              >
                <StarRating rating={stars} size="xs" />
                <span className="text-[12px]">& Up</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Brands */}
      <div>
        <h3 className="font-bold text-[14px] mb-1.5">Brand</h3>
        <div className="space-y-1">
          {ALL_BRANDS.map((brand) => (
            <label key={brand} className="flex items-center gap-2 py-0.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.brands.includes(brand)}
                onChange={() =>
                  onUpdateFilters({
                    ...filters,
                    brands: toggleArrayItem(filters.brands, brand),
                  })
                }
                className="w-4 h-4 accent-[#007185] rounded-xs cursor-pointer"
              />
              <span className="group-hover:text-[#C7511F]">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h3 className="font-bold text-[14px] mb-1.5">Price</h3>
        <ul className="space-y-1 mb-2.5">
          {PRICE_PRESETS.map((preset) => {
            const isSelected =
              filters.priceRange[0] === preset.min && filters.priceRange[1] === preset.max;
            return (
              <li key={preset.label}>
                <button
                  type="button"
                  onClick={() => {
                    if (isSelected) {
                      setMinInput('');
                      setMaxInput('');
                      onUpdateFilters({ ...filters, priceRange: [null, null] });
                    } else {
                      setMinInput(preset.min !== null ? String(preset.min) : '');
                      setMaxInput(preset.max !== null ? String(preset.max) : '');
                      onUpdateFilters({ ...filters, priceRange: [preset.min, preset.max] });
                    }
                  }}
                  className={`text-left hover:text-[#C7511F] cursor-pointer tabular-nums ${
                    isSelected ? 'font-bold text-[#C7511F]' : 'text-[#0F1111]'
                  }`}
                >
                  {preset.label}
                </button>
              </li>
            );
          })}
        </ul>
        <form onSubmit={handlePriceForm} className="flex items-center gap-1.5">
          <div className="relative flex-1">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[11px] text-[#565959]">
              S$
            </span>
            <input
              type="number"
              min="0"
              placeholder="Min"
              aria-label="Minimum price in SGD"
              value={minInput}
              onChange={(e) => setMinInput(e.target.value)}
              className="w-full pl-6 pr-1.5 py-1 text-[12px] border border-[#888C8C] rounded-xs focus:outline-none focus:border-[#007185] tabular-nums"
            />
          </div>
          <div className="relative flex-1">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[11px] text-[#565959]">
              S$
            </span>
            <input
              type="number"
              min="0"
              placeholder="Max"
              aria-label="Maximum price in SGD"
              value={maxInput}
              onChange={(e) => setMaxInput(e.target.value)}
              className="w-full pl-6 pr-1.5 py-1 text-[12px] border border-[#888C8C] rounded-xs focus:outline-none focus:border-[#007185] tabular-nums"
            />
          </div>
          <button
            type="submit"
            className="px-2.5 py-1 text-[12px] bg-[#FFFFFF] border border-[#D5D9D9] rounded-md shadow-2xs hover:bg-[#F7FAFA] cursor-pointer"
          >
            Go
          </button>
        </form>
      </div>

      {/* Case Features */}
      <div>
        <h3 className="font-bold text-[14px] mb-1.5">Special Features</h3>
        <div className="space-y-1">
          {FEATURES_LIST.map((feat) => (
            <label key={feat} className="flex items-center gap-2 py-0.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.features.includes(feat)}
                onChange={() =>
                  onUpdateFilters({
                    ...filters,
                    features: toggleArrayItem(filters.features, feat),
                  })
                }
                className="w-4 h-4 accent-[#007185] rounded-xs cursor-pointer"
              />
              <span className="group-hover:text-[#C7511F]">{feat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Material */}
      <div>
        <h3 className="font-bold text-[14px] mb-1.5">Material</h3>
        <div className="space-y-1">
          {MATERIALS_LIST.map((mat) => (
            <label key={mat} className="flex items-center gap-2 py-0.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.materials.includes(mat)}
                onChange={() =>
                  onUpdateFilters({
                    ...filters,
                    materials: toggleArrayItem(filters.materials, mat),
                  })
                }
                className="w-4 h-4 accent-[#007185] rounded-xs cursor-pointer"
              />
              <span className="group-hover:text-[#C7511F]">{mat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Color Swatches */}
      <div>
        <h3 className="font-bold text-[14px] mb-2">Colour</h3>
        <div className="flex flex-wrap gap-2">
          {COLOR_FILTERS.map((c) => {
            const active = filters.colorFamily === c.name;
            const isLight = c.name === 'Clear';
            return (
              <button
                key={c.name}
                type="button"
                title={c.name}
                aria-label={`Filter by ${c.name}`}
                onClick={() =>
                  onUpdateFilters({
                    ...filters,
                    colorFamily: active ? null : c.name,
                  })
                }
                className={`w-6 h-6 rounded-xs border flex items-center justify-center cursor-pointer transition-transform ${
                  active
                    ? 'ring-2 ring-offset-1 ring-[#007185] border-[#007185] scale-105'
                    : 'border-[#888C8C] hover:scale-105'
                }`}
                style={{ backgroundColor: c.hex }}
              >
                {active && (
                  <Check className={`w-3.5 h-3.5 ${isLight ? 'text-[#0F1111]' : 'text-white'}`} />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
