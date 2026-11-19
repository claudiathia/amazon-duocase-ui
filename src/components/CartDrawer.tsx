import React, { useState } from 'react';
import { CheckCircle2, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { CartItem, DeliveryLocation, OrderRecord } from '../types/product';
import { PrimeBadge } from './AmazonPrimitives';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  location: DeliveryLocation;
  onUpdateQty: (productId: string, variantName: string, model: string, delta: number) => void;
  onRemoveItem: (productId: string, variantName: string, model: string) => void;
  onCompleteOrder: () => OrderRecord;
}

export function CartDrawer({
  isOpen,
  onClose,
  items,
  location,
  onUpdateQty,
  onRemoveItem,
  onCompleteOrder,
}: CartDrawerProps) {
  const [confirmedOrder, setConfirmedOrder] = useState<OrderRecord | null>(null);

  if (!isOpen) return null;

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const freeShippingThreshold = 40;
  const remainingForFree = Math.max(0, freeShippingThreshold - subtotal);
  const qualifiesFreeShipping = subtotal >= freeShippingThreshold || items.every((i) => i.product.isPrime);

  const handleCheckout = () => {
    const order = onCompleteOrder();
    setConfirmedOrder(order);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Shopping Cart">
      <div
        className="fixed inset-0 bg-black/55"
        onClick={() => {
          setConfirmedOrder(null);
          onClose();
        }}
        aria-hidden="true"
      />

      <aside className="relative z-10 w-full max-w-[440px] bg-white h-full flex flex-col shadow-2xl">
        <div className="px-5 py-4 bg-[#131921] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#FF9900]" />
            <h2 className="text-[16px] font-bold">
              Shopping Cart <span className="font-normal text-[#CCCCCC] tabular-nums">({totalItems})</span>
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              setConfirmedOrder(null);
              onClose();
            }}
            aria-label="Close cart"
            className="p-1 rounded hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {confirmedOrder ? (
          <div className="flex-1 p-6 flex flex-col justify-center items-center text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-[#067D62]" />
            <div className="space-y-1">
              <h3 className="text-[18px] font-bold text-[#0F1111]">
                Order #{confirmedOrder.id} Confirmed
              </h3>
              <p className="text-[13px] text-[#565959]">
                Preparing shipment to Singapore {confirmedOrder.postalCode}
              </p>
            </div>
            <div className="w-full border border-[#D5D9D9] rounded-md p-4 text-left text-[13px] space-y-2 bg-[#FAFAFA]">
              <div className="flex justify-between font-semibold text-[#0F1111]">
                <span>Order Total</span>
                <span className="tabular-nums">S${confirmedOrder.total.toFixed(2)}</span>
              </div>
              <div className="text-[#565959] text-[12px]">
                {confirmedOrder.items.length} item(s) · Estimated arrival: Tomorrow, 19 Nov
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setConfirmedOrder(null);
                onClose();
              }}
              className="px-6 py-2 rounded-full bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-[13px] font-medium text-[#0F1111] cursor-pointer"
            >
              Continue shopping
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-3">
            <ShoppingBag className="w-12 h-12 text-[#888C8C] stroke-[1.4]" />
            <h3 className="text-[17px] font-semibold text-[#0F1111]">Your Amazon.sg Cart is empty</h3>
            <p className="text-[13px] text-[#565959] max-w-[260px]">
              Add iPhone Duo cases from the search results to compare prices and check delivery to {location.postalCode}.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-2 px-5 py-2 rounded-full bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-[13px] font-medium cursor-pointer"
            >
              Shop iPhone Duo cases
            </button>
          </div>
        ) : (
          <>
            {/* Free Shipping Progress Banner */}
            <div className="px-5 py-3 bg-[#F7FAFA] border-b border-[#E7E7E7] text-[13px]">
              {qualifiesFreeShipping ? (
                <p className="text-[#067D62] font-medium">
                  Your order qualifies for FREE Delivery to Singapore {location.postalCode}.
                </p>
              ) : (
                <div className="space-y-1.5">
                  <p className="text-[#0F1111]">
                    Add <span className="font-bold text-[#B12704] tabular-nums">S${remainingForFree.toFixed(2)}</span> of eligible items for FREE Delivery.
                  </p>
                  <div className="w-full h-1.5 bg-[#E7E7E7] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#067D62] transition-all duration-300"
                      style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto divide-y divide-[#E7E7E7] px-5 amazon-scroll">
              {items.map((item) => (
                <div
                  key={`${item.product.id}-${item.variant.name}-${item.model}`}
                  className="py-4 flex gap-3"
                >
                  <div className="w-20 h-20 bg-[#F7F7F7] rounded-xs p-1.5 shrink-0 flex items-center justify-center">
                    <img
                      src={item.variant.image}
                      alt={item.product.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain mix-blend-multiply"
                    />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <h4 className="text-[13px] font-medium text-[#0F1111] line-clamp-2 leading-snug">
                      {item.product.title}
                    </h4>
                    <p className="text-[12px] text-[#565959]">
                      {item.variant.name} · {item.model}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-[15px] font-bold text-[#0F1111] tabular-nums">
                        S${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                      {item.product.isPrime && <PrimeBadge />}
                    </div>

                    <div className="flex items-center gap-3 pt-1">
                      <div className="inline-flex items-center border border-[#D5D9D9] rounded-full bg-[#F0F2F2]">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() =>
                            onUpdateQty(item.product.id, item.variant.name, item.model, -1)
                          }
                          className="p-1.5 hover:bg-[#E3E6E6] rounded-l-full cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-[13px] font-semibold tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() =>
                            onUpdateQty(item.product.id, item.variant.name, item.model, 1)
                          }
                          className="p-1.5 hover:bg-[#E3E6E6] rounded-r-full cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          onRemoveItem(item.product.id, item.variant.name, item.model)
                        }
                        className="inline-flex items-center gap-1 text-[12px] text-[#007185] hover:text-[#C7511F] hover:underline cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Checkout Box */}
            <div className="p-5 border-t border-[#E7E7E7] bg-[#F7F7F7] space-y-3">
              <div className="flex items-baseline justify-between text-[16px]">
                <span>
                  Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'}):
                </span>
                <span className="font-bold text-[18px] text-[#0F1111] tabular-nums">
                  S${subtotal.toFixed(2)}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCheckout}
                className="w-full py-2.5 px-4 rounded-full bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-[14px] font-medium text-[#0F1111] transition-colors cursor-pointer"
              >
                Proceed to checkout
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
