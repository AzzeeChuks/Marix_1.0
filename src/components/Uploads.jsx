import React, { useState } from 'react';

export default function Uploads({ userUploads = [] }) {
  return (
    <section className="w-full max-w-[95%] mx-auto px-2 lg:px-4 py-10 flex-1 text-left pb-28 md:pb-16 animate-fadeIn min-h-screen bg-marix-cream text-[#111111]">
      {/* 🚀 Pristine Clean Layout Header Section */}
      <div className="border-b border-gray-200/60 pb-4 mb-6 select-none max-w-[95%] mx-auto">
        <h2 className="text-xl md:text-2xl font-black tracking-tight text-[#111111]">Your Listings</h2>
        <p className="text-xs text-gray-400 font-medium mt-0.5">Manage and view your live product listings on campus.</p>
      </div>

      <div className="max-w-[95%] mx-auto">
        {userUploads.length === 0 ? (
          /* Empty Shelf Dashboard Flag */
          <div className="w-full min-h-[340px] bg-white border border-gray-200/60 rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-sm max-w-xl mx-auto mt-6">
            <div className="w-16 h-16 rounded-2xl bg-marix-teal/10 text-marix-teal flex items-center justify-center text-3xl mb-4">
              <i className="ph ph-tray font-bold"></i>
            </div>
            <h4 className="text-base font-black text-[#111111] tracking-tight">No active uploads found</h4>
            <p className="text-xs text-gray-500 max-w-xs leading-relaxed font-medium mt-1">
              You haven't posted any items yet. Create your first marketplace entry to showcase products instantly.
            </p>
          </div>
        ) : (
          /* Live Shop Grid Core Rendering Deck */
          <div className="grid grid-cols-2 min-[600px]:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
            {userUploads.map((product) => (
              <VolcanoCard 
                key={product.id} 
                product={product} 
                targetImageSrc={product.colorVariants?.[0]?.imageUrl || "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&q=80"} 
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function VolcanoCard({ product, targetImageSrc }) {
  const [isLiked, setIsLiked] = useState(false);
  const cleanCampusName = product.campus ? product.campus.split(',')[0].trim() : 'Campus';

  return (
    <div className="w-full flex flex-col gap-y-1.5 select-none group bg-white p-1.5 rounded-[18px] border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.01)] transition-all duration-300 ease-out text-left">
      <div className="w-full aspect-square rounded-[12px] overflow-hidden bg-marix-cream/40 relative shrink-0">
        <img src={targetImageSrc} alt={product.productTitle} className="w-full h-full object-cover transform scale-100 group-hover:scale-[1.04] transition-transform duration-500 ease-out" loading="lazy" />
      </div>
      <div className="flex flex-col gap-y-0.5 px-1 pb-1 flex-1 justify-between">
        <div className="flex flex-col min-w-0">
          <h4 className="text-xs md:text-sm font-medium text-[#111111] truncate tracking-tight">{product.productTitle}</h4>
          <div className="flex items-center gap-x-1 text-[10px] md:text-[11px] text-[#111111]/45 font-semibold min-w-0 mt-[3px]">
            <span className="flex items-center gap-x-0.5 min-w-0 max-w-[50%]">
              <i className="ph ph-storefront text-xs text-[#111111]/35"></i>
              <span className="truncate">{product.shopName}</span>
            </span>
            <span className="text-[#111111]/20">•</span>
            <span className="flex items-center gap-x-0.5 min-w-0 flex-1">
              <i className="ph ph-map-pin text-xs text-[#111111]/35"></i>
              <span className="truncate">{cleanCampusName}</span>
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-gray-50">
          <span className="text-xs md:text-sm font-black text-marix-teal tracking-tight">{product.price}</span>
          <button type="button" onClick={() => setIsLiked(!isLiked)} className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all duration-200 bg-white ${isLiked ? 'border-marix-teal text-marix-teal' : 'border-gray-200 text-[#111111]/40'}`}>
            <svg className="w-[14px] h-[14px]" viewBox="0 0 24 24" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}