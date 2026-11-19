import React from 'react';
import { AmazonLogo } from './AmazonPrimitives';

export function Footer({ onOpenLocation }: { onOpenLocation: () => void }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-10 text-white">
      <button
        type="button"
        onClick={scrollToTop}
        className="w-full py-3.5 bg-[#37475A] hover:bg-[#485769] text-[13px] font-medium text-white transition-colors cursor-pointer"
      >
        Back to top
      </button>

      <div className="bg-[#232F3E] py-10 px-4 border-b border-[#3A4553]">
        <div className="max-w-[1000px] mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-[13px]">
          <div>
            <h3 className="font-bold text-[15px] mb-2.5">Get to Know Us</h3>
            <ul className="space-y-1.5 text-[#DDDDDD]">
              <li><a href="#top" onClick={(e) => { e.preventDefault(); scrollToTop(); }} className="hover:underline">About Amazon Singapore</a></li>
              <li><a href="#top" onClick={(e) => { e.preventDefault(); scrollToTop(); }} className="hover:underline">Careers</a></li>
              <li><a href="#top" onClick={(e) => { e.preventDefault(); scrollToTop(); }} className="hover:underline">Amazon Science</a></li>
              <li><a href="#top" onClick={(e) => { e.preventDefault(); scrollToTop(); }} className="hover:underline">Sustainability</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-[15px] mb-2.5">Make Money with Us</h3>
            <ul className="space-y-1.5 text-[#DDDDDD]">
              <li><a href="#top" onClick={(e) => { e.preventDefault(); scrollToTop(); }} className="hover:underline">Sell on Amazon.sg</a></li>
              <li><a href="#top" onClick={(e) => { e.preventDefault(); scrollToTop(); }} className="hover:underline">Sell under Amazon Accelerator</a></li>
              <li><a href="#top" onClick={(e) => { e.preventDefault(); scrollToTop(); }} className="hover:underline">Protect and Build Your Brand</a></li>
              <li><a href="#top" onClick={(e) => { e.preventDefault(); scrollToTop(); }} className="hover:underline">Fulfilment by Amazon</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-[15px] mb-2.5">Amazon Payment Products</h3>
            <ul className="space-y-1.5 text-[#DDDDDD]">
              <li><a href="#top" onClick={(e) => { e.preventDefault(); scrollToTop(); }} className="hover:underline">Amazon.sg Gift Cards</a></li>
              <li><a href="#top" onClick={(e) => { e.preventDefault(); scrollToTop(); }} className="hover:underline">Shop with Points</a></li>
              <li><a href="#top" onClick={(e) => { e.preventDefault(); scrollToTop(); }} className="hover:underline">PayNow & GrabPay</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-[15px] mb-2.5">Let Us Help You</h3>
            <ul className="space-y-1.5 text-[#DDDDDD]">
              <li><a href="#top" onClick={(e) => { e.preventDefault(); scrollToTop(); }} className="hover:underline">Your Account</a></li>
              <li><a href="#top" onClick={(e) => { e.preventDefault(); scrollToTop(); }} className="hover:underline">Your Orders</a></li>
              <li><a href="#top" onClick={(e) => { e.preventDefault(); scrollToTop(); }} className="hover:underline">Shipping Rates & Policies</a></li>
              <li><a href="#top" onClick={(e) => { e.preventDefault(); scrollToTop(); }} className="hover:underline">Returns & Replacements</a></li>
              <li><a href="#top" onClick={(e) => { e.preventDefault(); scrollToTop(); }} className="hover:underline">Help</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-[#131921] py-7 px-4 text-center">
        <div className="max-w-[1000px] mx-auto flex flex-col sm:flex-row items-center justify-center gap-6 mb-5">
          <AmazonLogo light />
          <button
            type="button"
            onClick={onOpenLocation}
            className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#848688] rounded-xs text-[12px] text-[#CCCCCC] hover:text-white hover:border-white cursor-pointer"
          >
            <span
              className="inline-block w-4 h-3 rounded-[1px] overflow-hidden border border-white/30"
              aria-hidden="true"
            >
              <span className="block h-1/2 bg-[#EF3340]" />
              <span className="block h-1/2 bg-white" />
            </span>
            <span>Singapore</span>
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-4 text-[12px] text-[#DDDDDD] mb-1.5">
          <span>Conditions of Use & Sale</span>
          <span>Privacy Notice</span>
          <span>Interest-Based Ads</span>
        </div>
        <p className="text-[12px] text-[#CCCCCC]">
          © 1996-2026, Amazon.com, Inc. or its affiliates · Amazon Singapore Showcase
        </p>
      </div>
    </footer>
  );
}
