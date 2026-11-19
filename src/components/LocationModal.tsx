import React, { useState } from 'react';
import { MapPin, Package, X } from 'lucide-react';
import { DeliveryLocation, OrderRecord } from '../types/product';
import { SG_LOCATIONS } from '../data/products';

interface LocationModalProps {
  isOpen: boolean;
  currentLocation: DeliveryLocation;
  onClose: () => void;
  onSelectLocation: (loc: DeliveryLocation) => void;
}

export function LocationModal({
  isOpen,
  currentLocation,
  onClose,
  onSelectLocation,
}: LocationModalProps) {
  const [postalInput, setPostalInput] = useState(currentLocation.postalCode);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = postalInput.trim();
    if (!/^\d{6}$/.test(cleaned)) {
      setError('Please enter a valid 6-digit Singapore postal code.');
      return;
    }
    setError('');
    onSelectLocation({
      city: 'Singapore',
      postalCode: cleaned,
      label: `Postal ${cleaned}`,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Choose your location">
      <div className="fixed inset-0 bg-black/55" onClick={onClose} aria-hidden="true" />

      <div className="relative z-10 w-full max-w-[390px] bg-white rounded-lg shadow-2xl overflow-hidden border border-[#D5D9D9]">
        <div className="px-5 py-3.5 bg-[#F0F2F2] border-b border-[#D5D9D9] flex items-center justify-between">
          <h2 className="text-[15px] font-bold text-[#0F1111]">Choose your location</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close location modal"
            className="p-1 rounded hover:bg-[#E3E6E6] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-[13px]">
          <p className="text-[#565959] leading-snug">
            Delivery options and delivery speeds may vary for different Singapore postal codes.
          </p>

          <div className="space-y-1.5">
            {SG_LOCATIONS.map((loc) => {
              const active = loc.postalCode === currentLocation.postalCode;
              return (
                <button
                  key={loc.postalCode}
                  type="button"
                  onClick={() => {
                    onSelectLocation(loc);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md border text-left cursor-pointer ${
                    active
                      ? 'border-[#007185] bg-[#F7FAFA] font-semibold'
                      : 'border-[#D5D9D9] hover:bg-[#F7F7F7]'
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#007185]" />
                    <span>{loc.label}</span>
                  </span>
                  <span className="text-[#565959] tabular-nums">{loc.postalCode}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-[#E7E7E7]">
            <label htmlFor="sg-postal" className="block font-semibold text-[#0F1111] mb-1.5">
              Or enter a Singapore postal code
            </label>
            <form onSubmit={handleApply} className="flex gap-2">
              <input
                id="sg-postal"
                type="text"
                maxLength={6}
                value={postalInput}
                onChange={(e) => setPostalInput(e.target.value)}
                placeholder="e.g. 018956"
                className="flex-1 px-3 py-1.5 border border-[#888C8C] rounded-xs text-[13px] tabular-nums focus:outline-none focus:border-[#007185]"
              />
              <button
                type="submit"
                className="px-4 py-1.5 rounded-md border border-[#D5D9D9] bg-[#FFFFFF] hover:bg-[#F7FAFA] shadow-2xs font-medium cursor-pointer"
              >
                Apply
              </button>
            </form>
            {error && <p className="text-[12px] text-[#B12704] mt-1">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

interface OrdersModalProps {
  isOpen: boolean;
  orders: OrderRecord[];
  onClose: () => void;
}

export function OrdersModal({ isOpen, orders, onClose }: OrdersModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Your Orders">
      <div className="fixed inset-0 bg-black/55" onClick={onClose} aria-hidden="true" />
      <div className="relative z-10 w-full max-w-[540px] max-h-[85vh] bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col border border-[#D5D9D9]">
        <div className="px-5 py-3.5 bg-[#F0F2F2] border-b border-[#D5D9D9] flex items-center justify-between">
          <h2 className="text-[16px] font-bold text-[#0F1111]">Your Orders</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close orders"
            className="p-1 rounded hover:bg-[#E3E6E6] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4 amazon-scroll">
          {orders.length === 0 ? (
            <div className="py-10 text-center space-y-2">
              <Package className="w-10 h-10 text-[#888C8C] mx-auto stroke-[1.5]" />
              <p className="text-[15px] font-semibold text-[#0F1111]">No orders placed yet</p>
              <p className="text-[13px] text-[#565959]">
                Items checked out from your Shopping Cart will appear here.
              </p>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="border border-[#D5D9D9] rounded-md overflow-hidden">
                <div className="px-4 py-2.5 bg-[#F0F2F2] border-b border-[#D5D9D9] flex flex-wrap items-center justify-between gap-2 text-[12px] text-[#565959]">
                  <div>
                    <span className="font-semibold text-[#0F1111]">Order #{order.id}</span> · {order.date}
                  </div>
                  <div className="font-semibold text-[#0F1111] tabular-nums">
                    Total: S${order.total.toFixed(2)}
                  </div>
                </div>
                <div className="p-4 space-y-2.5 text-[13px]">
                  <p className="font-semibold text-[#067D62]">{order.status}</p>
                  {order.items.map((item) => (
                    <div
                      key={`${item.product.id}-${item.variant.name}`}
                      className="flex items-center gap-3"
                    >
                      <img
                        src={item.variant.image}
                        alt={item.product.title}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 object-contain bg-[#F7F7F7] rounded-xs p-1"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-[#0F1111]">{item.product.title}</p>
                        <p className="text-[12px] text-[#565959]">
                          {item.variant.name} · Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
