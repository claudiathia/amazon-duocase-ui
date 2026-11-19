import React, { useMemo, useState } from 'react';
import { LayoutGrid, List, Search, SlidersHorizontal, X } from 'lucide-react';
import {
  CartItem,
  ColorVariant,
  DeliveryLocation,
  FilterState,
  OrderRecord,
  Product,
  SortOption,
} from './types/product';
import { PRODUCTS, RELATED_SEARCHES, SG_LOCATIONS } from './data/products';
import { Navbar } from './components/Navbar';
import { FilterSidebar } from './components/FilterSidebar';
import { SponsoredBanner } from './components/SponsoredBanner';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { LocationModal, OrdersModal } from './components/LocationModal';
import { Footer } from './components/Footer';

const INITIAL_FILTERS: FilterState = {
  primeOnly: false,
  getItTomorrow: false,
  freeShippingOnly: false,
  minRating: null,
  brands: [],
  priceRange: [null, null],
  features: [],
  materials: [],
  colorFamily: null,
};

export default function App() {
  const [searchQuery, setSearchQuery] = useState('iphone duo case');
  const [committedQuery, setCommittedQuery] = useState('iphone duo case');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeNavTab, setActiveNavTab] = useState('all');
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);

  const [location, setLocation] = useState<DeliveryLocation>(SG_LOCATIONS[0]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);

  const [activeProductModal, setActiveProductModal] = useState<{
    product: Product;
    variant: ColorVariant;
  } | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const hasActiveFilters = useMemo(() => {
    return (
      filters.primeOnly ||
      filters.getItTomorrow ||
      filters.freeShippingOnly ||
      filters.minRating !== null ||
      filters.brands.length > 0 ||
      filters.priceRange[0] !== null ||
      filters.priceRange[1] !== null ||
      filters.features.length > 0 ||
      filters.materials.length > 0 ||
      filters.colorFamily !== null ||
      selectedCategory !== 'All' ||
      activeNavTab !== 'all'
    );
  }, [filters, selectedCategory, activeNavTab]);

  const resetAllFilters = () => {
    setFilters(INITIAL_FILTERS);
    setSelectedCategory('All');
    setActiveNavTab('all');
  };

  const handleQuickFilter = (preset: 'all' | 'deals' | 'bestsellers' | 'prime' | 'new') => {
    setActiveNavTab(preset);
    if (preset === 'all') {
      setFilters(INITIAL_FILTERS);
      setSortBy('featured');
    } else if (preset === 'prime') {
      setFilters({ ...INITIAL_FILTERS, primeOnly: true });
    } else if (preset === 'new') {
      setFilters(INITIAL_FILTERS);
      setSortBy('newest');
    } else {
      setFilters(INITIAL_FILTERS);
      setSortBy('featured');
    }
  };

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const tokens = q.split(/\s+/).filter(Boolean);

    const list = PRODUCTS.filter((p) => {
      if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;

      if (activeNavTab === 'deals' && !p.listPrice && p.badge !== 'Limited time deal') {
        return false;
      }
      if (activeNavTab === 'bestsellers' && p.badge !== 'Best Seller' && p.rating < 4.7) {
        return false;
      }

      if (tokens.length > 0 && q !== 'iphone duo case') {
        const haystack = [
          p.brand,
          p.title,
          p.material,
          ...p.features,
          ...p.variants.map((v) => v.name),
        ]
          .join(' ')
          .toLowerCase();
        const matchesAll = tokens.every((t) => haystack.includes(t));
        if (!matchesAll) return false;
      }

      if (filters.primeOnly && !p.isPrime) return false;
      if (filters.getItTomorrow && !p.getItTomorrow) return false;
      if (filters.freeShippingOnly && !p.freeShippingEligible) return false;
      if (filters.minRating !== null && p.rating < filters.minRating) return false;
      if (filters.brands.length > 0 && !filters.brands.includes(p.brand)) return false;

      const [minP, maxP] = filters.priceRange;
      if (minP !== null && p.price < minP) return false;
      if (maxP !== null && p.price > maxP) return false;

      if (
        filters.features.length > 0 &&
        !filters.features.every((f) => p.features.includes(f))
      ) {
        return false;
      }

      if (filters.materials.length > 0 && !filters.materials.includes(p.material)) {
        return false;
      }

      if (
        filters.colorFamily !== null &&
        !p.variants.some((v) => v.colorFamily === filters.colorFamily)
      ) {
        return false;
      }

      return true;
    });

    const sorted = [...list];
    switch (sortBy) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        sorted.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
        break;
      case 'newest':
        sorted.sort((a, b) => b.releaseOrder - a.releaseOrder);
        break;
      default:
        break;
    }
    return sorted;
  }, [searchQuery, selectedCategory, activeNavTab, filters, sortBy]);

  const pageSize = 8;
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedProducts = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, safePage]);

  const addToCart = (
    product: Product,
    variant: ColorVariant,
    model = product.compatibleModels[0],
    qty = 1
  ) => {
    setCart((prev) => {
      const idx = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.variant.name === variant.name &&
          item.model === model
      );
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + qty };
        return next;
      }
      return [...prev, { product, variant, model, quantity: qty }];
    });
  };

  const handleBuyNow = (
    product: Product,
    variant: ColorVariant,
    model: string,
    qty: number
  ) => {
    addToCart(product, variant, model, qty);
    setActiveProductModal(null);
    setIsCartOpen(true);
  };

  const updateCartQty = (
    productId: string,
    variantName: string,
    model: string,
    delta: number
  ) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (
            item.product.id === productId &&
            item.variant.name === variantName &&
            item.model === model
          ) {
            return { ...item, quantity: item.quantity + delta };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const removeCartItem = (productId: string, variantName: string, model: string) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.variant.name === variantName &&
            item.model === model
          )
      )
    );
  };

  const completeOrder = (): OrderRecord => {
    const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const newOrder: OrderRecord = {
      id: String(Math.floor(1000 + Math.random() * 9000)),
      date: '18 Nov 2026',
      total,
      items: [...cart],
      postalCode: location.postalCode,
      status: 'Confirmed — Preparing Shipment',
    };
    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    return newOrder;
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div id="top" className="min-h-screen flex flex-col bg-white text-[#0F1111]">
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={(q) => setSearchQuery(q)}
        onSearchSubmit={(q) => setCommittedQuery(q || 'iphone duo case')}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        location={location}
        onOpenLocation={() => setIsLocationOpen(true)}
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
        ordersCount={orders.length}
        onQuickFilter={handleQuickFilter}
        activeNavTab={activeNavTab}
      />

      {/* Results Summary Strip */}
      <div className="w-full bg-white border-b border-[#D5D9D9] shadow-[0_1px_2px_rgba(15,17,17,0.06)]">
        <div className="max-w-[1600px] mx-auto px-3 sm:px-5 py-2 flex flex-wrap items-center justify-between gap-3 text-[14px]">
          <div className="flex items-center gap-2 min-w-0">
            <span className="tabular-nums text-[#0F1111]">
              {filteredProducts.length > 0 ? (
                <>
                  {(safePage - 1) * pageSize + 1}-
                  {Math.min(safePage * pageSize, filteredProducts.length)} of{' '}
                  {hasActiveFilters || committedQuery.toLowerCase() !== 'iphone duo case'
                    ? `${filteredProducts.length} results`
                    : 'over 1,000 results'}{' '}
                  for{' '}
                </>
              ) : (
                <>0 results for </>
              )}
              <span className="font-bold text-[#C45500]">
                &ldquo;{committedQuery || 'iphone duo case'}&rdquo;
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Mobile Filter Trigger */}
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden inline-flex items-center gap-1.5 px-3 py-1 text-[13px] bg-[#F0F2F2] hover:bg-[#E3E6E6] border border-[#D5D9D9] rounded-md cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>

            {/* View Toggle */}
            <div className="hidden sm:inline-flex items-center border border-[#D5D9D9] rounded-md overflow-hidden bg-[#F0F2F2]">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
                className={`p-1.5 cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white text-[#007185] shadow-2xs'
                    : 'text-[#565959] hover:text-[#0F1111]'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                aria-label="List view"
                className={`p-1.5 cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-white text-[#007185] shadow-2xs'
                    : 'text-[#565959] hover:text-[#0F1111]'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Sort By Dropdown */}
            <div className="flex items-center gap-1.5">
              <label htmlFor="sort-select" className="text-[12px] text-[#565959] hidden sm:inline">
                Sort by:
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="text-[13px] bg-[#F0F2F2] hover:bg-[#E3E6E6] border border-[#D5D9D9] rounded-md px-2.5 py-1 text-[#0F1111] cursor-pointer focus:outline-none focus:border-[#007185]"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating-desc">Avg. Customer Review</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Search Results Layout */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto px-3 sm:px-5 py-4 flex gap-6">
        {/* Left Faceted Sidebar (Desktop) */}
        <aside className="hidden lg:block w-[235px] shrink-0 pr-2 border-r border-[#F0F2F2]">
          <FilterSidebar
            filters={filters}
            onUpdateFilters={setFilters}
            onResetFilters={resetAllFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </aside>

        {/* Right Main Results Column */}
        <div className="flex-1 min-w-0">
          {/* Active Filters Strip */}
          {hasActiveFilters && (
            <div className="mb-3 flex flex-wrap items-center gap-2 text-[12px]">
              <span className="text-[#565959] font-medium">Active filters:</span>
              {selectedCategory !== 'All' && (
                <button
                  type="button"
                  onClick={() => setSelectedCategory('All')}
                  className="inline-flex items-center gap-1 px-2 py-0.5 border border-[#D5D9D9] rounded-xs bg-[#F7FAFA] hover:bg-[#EAEDED] cursor-pointer"
                >
                  {selectedCategory} <X className="w-3 h-3" />
                </button>
              )}
              {filters.primeOnly && (
                <button
                  type="button"
                  onClick={() => setFilters({ ...filters, primeOnly: false })}
                  className="inline-flex items-center gap-1 px-2 py-0.5 border border-[#D5D9D9] rounded-xs bg-[#F7FAFA] hover:bg-[#EAEDED] cursor-pointer"
                >
                  Prime <X className="w-3 h-3" />
                </button>
              )}
              {filters.getItTomorrow && (
                <button
                  type="button"
                  onClick={() => setFilters({ ...filters, getItTomorrow: false })}
                  className="inline-flex items-center gap-1 px-2 py-0.5 border border-[#D5D9D9] rounded-xs bg-[#F7FAFA] hover:bg-[#EAEDED] cursor-pointer"
                >
                  Tomorrow <X className="w-3 h-3" />
                </button>
              )}
              {filters.brands.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() =>
                    setFilters({
                      ...filters,
                      brands: filters.brands.filter((item) => item !== b),
                    })
                  }
                  className="inline-flex items-center gap-1 px-2 py-0.5 border border-[#D5D9D9] rounded-xs bg-[#F7FAFA] hover:bg-[#EAEDED] cursor-pointer"
                >
                  {b} <X className="w-3 h-3" />
                </button>
              ))}
              {filters.colorFamily && (
                <button
                  type="button"
                  onClick={() => setFilters({ ...filters, colorFamily: null })}
                  className="inline-flex items-center gap-1 px-2 py-0.5 border border-[#D5D9D9] rounded-xs bg-[#F7FAFA] hover:bg-[#EAEDED] cursor-pointer"
                >
                  {filters.colorFamily} <X className="w-3 h-3" />
                </button>
              )}
              <button
                type="button"
                onClick={resetAllFilters}
                className="text-[#007185] hover:text-[#C7511F] hover:underline ml-1 cursor-pointer"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Top Sponsored Brand Showcase */}
          {!hasActiveFilters && (
            <SponsoredBanner
              products={PRODUCTS}
              onSelectProduct={(product) =>
                setActiveProductModal({ product, variant: product.variants[0] })
              }
              onFilterBrand={(brand) =>
                setFilters({ ...filters, brands: [brand] })
              }
            />
          )}

          {/* Results Heading */}
          <div className="mb-3">
            <h1 className="text-[20px] font-bold text-[#0F1111] leading-tight">Results</h1>
            <p className="text-[13px] text-[#565959]">
              Check each product page for other buying options. Price and other details may vary based on product size and colour.
            </p>
          </div>

          {/* Product Grid / List */}
          {filteredProducts.length === 0 ? (
            <div className="border border-[#E7E7E7] rounded-sm p-10 text-center space-y-3 bg-[#FAFAFA]">
              <p className="text-[17px] font-semibold text-[#0F1111]">
                No results for your selected filters.
              </p>
              <p className="text-[13px] text-[#565959]">
                Try removing a brand, price, or feature filter to see all iPhone Duo cases.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('iphone duo case');
                  setCommittedQuery('iphone duo case');
                  resetAllFilters();
                }}
                className="px-5 py-2 rounded-full bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-[13px] font-medium cursor-pointer"
              >
                Reset all filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
              {paginatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  viewMode="grid"
                  location={location}
                  onSelectProduct={(p, v) =>
                    setActiveProductModal({ product: p, variant: v })
                  }
                  onAddToCart={(p, v) => addToCart(p, v)}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {paginatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  viewMode="list"
                  location={location}
                  onSelectProduct={(p, v) =>
                    setActiveProductModal({ product: p, variant: v })
                  }
                  onAddToCart={(p, v) => addToCart(p, v)}
                />
              ))}
            </div>
          )}

          {/* Related Searches */}
          <section className="mt-8 pt-6 border-t border-[#E7E7E7]">
            <h2 className="text-[18px] font-bold text-[#0F1111] mb-3">Related searches</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {RELATED_SEARCHES.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => {
                    setSearchQuery(term);
                    setCommittedQuery(term);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 border border-[#E7E7E7] rounded-sm bg-white hover:bg-[#F7FAFA] hover:border-[#007185] text-left text-[13px] text-[#007185] hover:text-[#C7511F] cursor-pointer transition-colors"
                >
                  <Search className="w-4 h-4 text-[#565959] shrink-0" />
                  <span className="truncate font-medium">{term}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Amazon Pagination Bar */}
          {filteredProducts.length > 0 && (
            <div className="mt-8 flex justify-center">
              <nav
                aria-label="Pagination"
                className="inline-flex items-center border border-[#D5D9D9] rounded-md overflow-hidden bg-white shadow-2xs text-[14px]"
              >
                <button
                  type="button"
                  disabled={safePage <= 1}
                  onClick={() => {
                    setCurrentPage(Math.max(1, safePage - 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`px-4 py-2 border-r border-[#E7E7E7] ${
                    safePage <= 1
                      ? 'text-[#6F7373] cursor-default'
                      : 'text-[#0F1111] hover:bg-[#F7FAFA] cursor-pointer'
                  }`}
                >
                  ← Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    aria-current={pageNum === safePage ? 'page' : undefined}
                    onClick={() => {
                      setCurrentPage(pageNum);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`px-4 py-2 border-r border-[#E7E7E7] tabular-nums cursor-pointer ${
                      pageNum === safePage
                        ? 'font-bold text-[#0F1111] bg-[#F7F7F7] border-b-2 border-b-[#0F1111]'
                        : 'text-[#0F1111] hover:bg-[#F7FAFA]'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
                <button
                  type="button"
                  disabled={safePage >= totalPages}
                  onClick={() => {
                    setCurrentPage(Math.min(totalPages, safePage + 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`px-4 py-2 ${
                    safePage >= totalPages
                      ? 'text-[#6F7373] cursor-default'
                      : 'text-[#0F1111] hover:bg-[#F7FAFA] cursor-pointer'
                  }`}
                >
                  Next →
                </button>
              </nav>
            </div>
          )}
        </div>
      </main>

      <Footer onOpenLocation={() => setIsLocationOpen(true)} />

      {/* Mobile Filter Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/55"
            onClick={() => setMobileFiltersOpen(false)}
            aria-hidden="true"
          />
          <aside className="relative z-10 w-[300px] max-w-[85vw] bg-white h-full flex flex-col shadow-2xl">
            <div className="px-4 py-3 bg-[#232F3E] text-white flex items-center justify-between">
              <span className="font-bold text-[15px]">Filters</span>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                aria-label="Close filters"
                className="p-1 rounded hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 amazon-scroll">
              <FilterSidebar
                filters={filters}
                onUpdateFilters={setFilters}
                onResetFilters={resetAllFilters}
                hasActiveFilters={hasActiveFilters}
              />
            </div>
            <div className="p-3 border-t border-[#E7E7E7]">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full py-2 rounded-full bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-[13px] font-medium cursor-pointer"
              >
                Show {filteredProducts.length} results
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Product Detail Quick-View Modal */}
      {activeProductModal && (
        <ProductModal
          product={activeProductModal.product}
          initialVariant={activeProductModal.variant}
          location={location}
          onClose={() => setActiveProductModal(null)}
          onAddToCart={addToCart}
          onBuyNow={handleBuyNow}
        />
      )}

      {/* Shopping Cart Slide-Over Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        location={location}
        onUpdateQty={updateCartQty}
        onRemoveItem={removeCartItem}
        onCompleteOrder={completeOrder}
      />

      {/* Singapore Delivery Postal Code Modal */}
      <LocationModal
        isOpen={isLocationOpen}
        currentLocation={location}
        onClose={() => setIsLocationOpen(false)}
        onSelectLocation={setLocation}
      />

      {/* Orders Modal */}
      <OrdersModal
        isOpen={isOrdersOpen}
        orders={orders}
        onClose={() => setIsOrdersOpen(false)}
      />
    </div>
  );
}
