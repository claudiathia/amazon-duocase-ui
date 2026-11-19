import React, { useState } from 'react';
import { MapPin, Menu, Search, ShoppingCart, ChevronDown, X } from 'lucide-react';
import { AmazonLogo } from './AmazonPrimitives';
import { DeliveryLocation } from '../types/product';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSearchSubmit: (q: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  location: DeliveryLocation;
  onOpenLocation: () => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenOrders: () => void;
  ordersCount: number;
  onQuickFilter: (preset: 'all' | 'deals' | 'bestsellers' | 'prime' | 'new') => void;
  activeNavTab: string;
}

const CATEGORIES = ['All', 'Electronics', 'Mobile Accessories'];

const SUB_NAV_ITEMS: { id: 'all' | 'deals' | 'bestsellers' | 'prime' | 'new'; label: string }[] = [
  { id: 'deals', label: "Today's Deals" },
  { id: 'bestsellers', label: 'Best Sellers' },
  { id: 'prime', label: 'Prime' },
  { id: 'new', label: 'New Releases' },
];

export function Navbar({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  selectedCategory,
  onCategoryChange,
  location,
  onOpenLocation,
  cartCount,
  onOpenCart,
  onOpenOrders,
  ordersCount,
  onQuickFilter,
  activeNavTab,
}: NavbarProps) {
  const [inputValue, setInputValue] = useState(searchQuery);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(inputValue);
    onSearchSubmit(inputValue);
  };

  return (
    <>
      <header className="w-full bg-[#131921] text-white sticky top-0 z-40">
        {/* Top Belt */}
        <div className="max-w-[1600px] mx-auto px-3 sm:px-4 h-[60px] flex items-center gap-2 sm:gap-3">
          {/* Logo */}
          <button
            type="button"
            onClick={() => {
              setInputValue('iphone duo case');
              onSearchChange('iphone duo case');
              onCategoryChange('All');
              onQuickFilter('all');
            }}
            className="px-2 py-1.5 rounded-xs border border-transparent hover:border-white focus-visible:outline-2 focus-visible:outline-[#FF9900] transition-colors shrink-0 cursor-pointer"
            aria-label="Amazon.sg Home"
          >
            <AmazonLogo light />
          </button>

          {/* Deliver to Singapore */}
          <button
            type="button"
            onClick={onOpenLocation}
            className="hidden md:flex items-end gap-1 px-2 py-1.5 rounded-xs border border-transparent hover:border-white focus-visible:outline-2 focus-visible:outline-[#FF9900] transition-colors shrink-0 text-left cursor-pointer"
          >
            <MapPin className="w-4 h-4 text-white mb-0.5 shrink-0" />
            <div className="leading-tight">
              <div className="text-[11px] text-[#CCCCCC] whitespace-nowrap">Deliver to</div>
              <div className="text-[13px] font-bold text-white whitespace-nowrap">
                {location.city} {location.postalCode}
              </div>
            </div>
          </button>

          {/* Search Bar */}
          <form
            onSubmit={handleSubmit}
            className="flex-1 flex items-stretch h-[40px] rounded-md overflow-hidden bg-white focus-within:ring-2 focus-within:ring-[#FF9900]"
            role="search"
          >
            <div className="relative hidden sm:flex items-center bg-[#E6E6E6] hover:bg-[#D4D4D4] border-r border-[#CDCDCD] text-[#555555] transition-colors">
              <select
                aria-label="Search department"
                value={selectedCategory}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="appearance-none bg-transparent pl-3 pr-7 h-full text-[12px] font-medium text-[#0F1111] cursor-pointer focus:outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#555555] absolute right-2 pointer-events-none" />
            </div>

            <input
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                onSearchChange(e.target.value);
              }}
              placeholder="Search Amazon.sg"
              aria-label="Search Amazon.sg"
              className="flex-1 min-w-0 px-3 text-[14px] text-[#0F1111] bg-white placeholder:text-[#767676] focus:outline-none"
            />

            {inputValue && (
              <button
                type="button"
                onClick={() => {
                  setInputValue('');
                  onSearchChange('');
                }}
                aria-label="Clear search"
                className="px-2 text-[#565959] hover:text-[#0F1111] bg-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              type="submit"
              aria-label="Go"
              className="w-[45px] bg-[#FEBD69] hover:bg-[#F3A847] active:bg-[#E79634] text-[#131921] flex items-center justify-center transition-colors shrink-0 cursor-pointer"
            >
              <Search className="w-5 h-5 stroke-[2.2]" />
            </button>
          </form>

          {/* Language / Region */}
          <div className="hidden xl:flex items-center gap-1.5 px-2 py-2 rounded-xs border border-transparent hover:border-white shrink-0 select-none">
            <span
              className="inline-block w-5 h-3.5 rounded-[1px] overflow-hidden border border-white/30 relative"
              aria-hidden="true"
            >
              <span className="block h-1/2 bg-[#EF3340]" />
              <span className="block h-1/2 bg-white" />
            </span>
            <span className="text-[13px] font-bold">EN</span>
          </div>

          {/* Account */}
          <button
            type="button"
            onClick={onOpenOrders}
            className="hidden sm:flex flex-col items-start px-2 py-1 rounded-xs border border-transparent hover:border-white focus-visible:outline-2 focus-visible:outline-[#FF9900] transition-colors shrink-0 text-left leading-tight cursor-pointer"
          >
            <span className="text-[11px] text-[#CCCCCC] whitespace-nowrap">Hello, Singapore</span>
            <span className="text-[13px] font-bold text-white whitespace-nowrap inline-flex items-center gap-0.5">
              Account & Lists
            </span>
          </button>

          {/* Returns & Orders */}
          <button
            type="button"
            onClick={onOpenOrders}
            className="hidden lg:flex flex-col items-start px-2 py-1 rounded-xs border border-transparent hover:border-white focus-visible:outline-2 focus-visible:outline-[#FF9900] transition-colors shrink-0 text-left leading-tight cursor-pointer"
          >
            <span className="text-[11px] text-[#CCCCCC] whitespace-nowrap">Returns</span>
            <span className="text-[13px] font-bold text-white whitespace-nowrap">
              & Orders{ordersCount > 0 ? ` (${ordersCount})` : ''}
            </span>
          </button>

          {/* Cart */}
          <button
            type="button"
            onClick={onOpenCart}
            className="flex items-end gap-1 px-2 py-1.5 rounded-xs border border-transparent hover:border-white focus-visible:outline-2 focus-visible:outline-[#FF9900] transition-colors shrink-0 cursor-pointer"
            aria-label={`Shopping Cart, ${cartCount} items`}
          >
            <div className="relative flex items-center">
              <ShoppingCart className="w-7 h-7 text-white stroke-[1.75]" />
              <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 min-w-[18px] text-center text-[13px] font-bold text-[#FF9900] bg-[#131921] px-0.5 leading-none tabular-nums">
                {cartCount}
              </span>
            </div>
            <span className="hidden sm:inline text-[13px] font-bold text-white leading-none mb-0.5 whitespace-nowrap">
              Cart
            </span>
          </button>
        </div>

        {/* Sub-navigation Belt */}
        <nav
          aria-label="Primary departments"
          className="w-full bg-[#232F3E] text-white border-t border-white/10"
        >
          <div className="max-w-[1600px] mx-auto px-3 sm:px-4 h-[39px] flex items-center justify-between gap-4 overflow-x-auto">
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[13px] font-bold rounded-xs border border-transparent hover:border-white whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Menu className="w-4 h-4" />
                <span>All</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onQuickFilter('all');
                  onCategoryChange('All');
                }}
                className={`px-2.5 py-1 text-[13px] rounded-xs border whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                  activeNavTab === 'all'
                    ? 'border-white/70 font-semibold'
                    : 'border-transparent hover:border-white'
                }`}
              >
                All Results
              </button>

              {SUB_NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onQuickFilter(item.id)}
                  className={`px-2.5 py-1 text-[13px] rounded-xs border whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                    activeNavTab === item.id
                      ? 'border-white/70 font-semibold text-[#FF9900]'
                      : 'border-transparent hover:border-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}

              <button
                type="button"
                onClick={() => onCategoryChange('Electronics')}
                className={`hidden md:inline-block px-2.5 py-1 text-[13px] rounded-xs border whitespace-nowrap shrink-0 cursor-pointer ${
                  selectedCategory === 'Electronics'
                    ? 'border-white/70 font-semibold'
                    : 'border-transparent hover:border-white'
                }`}
              >
                Electronics
              </button>
              <button
                type="button"
                onClick={() => onCategoryChange('Mobile Accessories')}
                className={`hidden md:inline-block px-2.5 py-1 text-[13px] rounded-xs border whitespace-nowrap shrink-0 cursor-pointer ${
                  selectedCategory === 'Mobile Accessories'
                    ? 'border-white/70 font-semibold'
                    : 'border-transparent hover:border-white'
                }`}
              >
                Mobile Accessories
              </button>
            </div>

            <button
              type="button"
              onClick={onOpenLocation}
              className="hidden lg:inline-block text-[13px] font-medium text-[#E6E6E6] hover:text-white whitespace-nowrap shrink-0 cursor-pointer"
            >
              Free delivery on orders over S$40
            </button>
          </div>
        </nav>
      </header>

      {/* Slide-out "All" Department Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          <aside className="relative z-10 w-[320px] max-w-[85vw] bg-white text-[#0F1111] h-full flex flex-col shadow-2xl">
            <div className="bg-[#232F3E] text-white px-5 py-3.5 flex items-center justify-between">
              <span className="text-[16px] font-bold">Browse Amazon.sg</span>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close menu"
                className="p-1 rounded hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-[#E7E7E7] amazon-scroll">
              <div className="py-3 px-5">
                <h3 className="text-[14px] font-bold text-[#0F1111] mb-2">Shop by Department</h3>
                <ul className="space-y-1 text-[14px]">
                  {CATEGORIES.map((cat) => (
                    <li key={cat}>
                      <button
                        type="button"
                        onClick={() => {
                          onCategoryChange(cat);
                          setDrawerOpen(false);
                        }}
                        className="w-full text-left py-1.5 px-2 rounded hover:bg-[#EAEDED] text-[#0F1111] cursor-pointer"
                      >
                        {cat}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="py-3 px-5">
                <h3 className="text-[14px] font-bold text-[#0F1111] mb-2">Popular Searches</h3>
                <ul className="space-y-1 text-[14px]">
                  {[
                    'iphone duo case',
                    'spigen ultra hybrid pro',
                    'pitaka aramid case',
                    'torras kickstand case',
                    'magsafe hinge protection',
                  ].map((term) => (
                    <li key={term}>
                      <button
                        type="button"
                        onClick={() => {
                          setInputValue(term);
                          onSearchChange(term);
                          onSearchSubmit(term);
                          setDrawerOpen(false);
                        }}
                        className="w-full text-left py-1.5 px-2 rounded hover:bg-[#EAEDED] text-[#007185] hover:text-[#C7511F] cursor-pointer"
                      >
                        {term}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="py-3 px-5">
                <h3 className="text-[14px] font-bold text-[#0F1111] mb-2">Your Account</h3>
                <ul className="space-y-1 text-[14px]">
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        setDrawerOpen(false);
                        onOpenLocation();
                      }}
                      className="w-full text-left py-1.5 px-2 rounded hover:bg-[#EAEDED] cursor-pointer"
                    >
                      Delivery Postal Code ({location.postalCode})
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        setDrawerOpen(false);
                        onOpenOrders();
                      }}
                      className="w-full text-left py-1.5 px-2 rounded hover:bg-[#EAEDED] cursor-pointer"
                    >
                      Your Orders ({ordersCount})
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
