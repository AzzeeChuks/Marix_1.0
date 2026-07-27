import React, { useState } from 'react';

export default function Uploads({ userUploads = [], onEditTrigger, onDeleteTrigger, onProductCardClick }) {
  const [isManageMode, setIsManageMode] = useState(false);
  const [uploadsSearchTerm, setUploadsSearchTerm] = useState('');

  // 🚀 REAL-TIME IN-TAB SEARCH FILTERING
  const filteredUploads = userUploads.filter((product) => {
    if (!uploadsSearchTerm.trim()) return true;
    const term = uploadsSearchTerm.toLowerCase().trim();
    const matchTitle = (product.productTitle || product.name || '').toLowerCase().includes(term);
    const matchDesc = (product.description || '').toLowerCase().includes(term);
    const matchCategory = (product.category || '').toLowerCase().includes(term);
    return matchTitle || matchDesc || matchCategory;
  });

  return (
    <section className="w-full max-w-[95%] mx-auto px-2 lg:px-4 py-6 flex-1 text-left pb-28 md:pb-16 animate-fadeIn bg-marix-cream text-[#111111]">
      
      {/* 🚀 HEADER & COUNTER */}
      <div className="border-b border-gray-200/60 pb-4 mb-5 select-none flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-2">
            <h2 className="text-xl md:text-2xl font-black tracking-tight text-[#111111]">Your Listings</h2>
            <span className="text-xs font-black bg-marix-teal/10 text-marix-teal px-2.5 py-0.5 rounded-full">
              {userUploads.length} {userUploads.length === 1 ? 'product' : 'products'}
            </span>
          </div>
          <p className="text-xs text-gray-400 font-medium mt-0.5">Manage and view your live product listings on campus.</p>
        </div>
        
        {userUploads.length > 0 && (
          <button 
            onClick={() => setIsManageMode(!isManageMode)}
            className={`text-xs font-black px-4 py-2 rounded-xl border transition-all shrink-0 ${isManageMode ? 'border-marix-teal bg-marix-teal/5 text-marix-teal' : 'border-gray-200 text-gray-600 bg-white hover:bg-gray-50'}`}
          >
            {isManageMode ? 'Done' : 'Manage'}
          </button>
        )}
      </div>

      {/* 🚀 ISOLATED IN-TAB SEARCH INPUT */}
      {userUploads.length > 0 && (
        <div className="w-full mb-6 relative">
          <div className="relative flex items-center w-full max-w-md">
            <i className="ph ph-magnifying-glass absolute left-3.5 text-gray-400 text-base font-bold"></i>
            <input 
              type="text"
              placeholder="Search your uploads..."
              value={uploadsSearchTerm}
              onChange={(e) => setUploadsSearchTerm(e.target.value)}
              className="w-full bg-white border border-gray-200/80 rounded-xl pl-10 pr-9 py-2.5 text-base md:text-sm text-[#111111] font-medium placeholder:text-gray-400/60 focus:outline-none focus:border-marix-teal shadow-sm transition-all"
            />
            {uploadsSearchTerm && (
              <button 
                type="button" 
                onClick={() => setUploadsSearchTerm('')}
                className="absolute right-3 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer p-0.5"
              >
                <i className="ph ph-x-circle text-base font-bold"></i>
              </button>
            )}
          </div>
        </div>
      )}

      <div>
        {userUploads.length === 0 ? (
          <div className="w-full min-h-[340px] bg-white border border-gray-200/60 rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-sm max-w-xl mx-auto mt-6">
            <div className="w-16 h-16 rounded-2xl bg-marix-teal/10 text-marix-teal flex items-center justify-center text-3xl mb-4">
              <i className="ph ph-tray font-bold"></i>
            </div>
            <h4 className="text-base font-black text-[#111111] tracking-tight">No active uploads found</h4>
            <p className="text-xs text-gray-500 max-w-xs leading-relaxed font-medium mt-1">
              You haven't posted any items yet. Create your first marketplace entry to showcase products instantly.
            </p>
          </div>
        ) : filteredUploads.length === 0 ? (
          <div className="w-full py-12 bg-white border border-gray-200/60 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm max-w-md mx-auto">
            <i className="ph ph-magnifying-glass-plus text-3xl text-gray-300 mb-2"></i>
            <h4 className="text-sm font-black text-[#111111]">No matching listings found</h4>
            <p className="text-xs text-gray-400 font-medium mt-1 mb-4">No uploaded products matched "{uploadsSearchTerm}".</p>
            <button 
              onClick={() => setUploadsSearchTerm('')}
              className="text-xs font-bold text-marix-teal hover:underline focus:outline-none"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 min-[600px]:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
            {filteredUploads.map((product) => {
              const primaryImgObj = product.colorVariants?.find(v => v.isMain) || product.colorVariants?.[0];
              const fallbackImg = product.images?.find(img => img.isCover) || product.images?.[0];
              const finalTargetSrc = primaryImgObj ? primaryImgObj.imageUrl : (fallbackImg ? fallbackImg.imageUrl : "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&q=80");

              return (
                <VolcanoCard 
                  key={product.id} 
                  product={product} 
                  targetImageSrc={finalTargetSrc} 
                  isManageMode={isManageMode}
                  onDeleteTrigger={() => onDeleteTrigger?.(product)}
                  onEditTrigger={() => onEditTrigger?.(product)}
                  onProductClick={onProductCardClick}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

function VolcanoCard({ product, targetImageSrc, isManageMode, onDeleteTrigger, onEditTrigger, onProductClick }) {
  const cleanCampusName = product.campus ? product.campus.split(',')[0].trim() : 'Campus';

  return (
    <div 
      onClick={() => {
        if (!isManageMode && onProductClick) onProductClick(product);
      }}
      className={`w-full relative flex flex-col gap-y-1.5 select-none group bg-white p-1.5 rounded-[18px] border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.01)] transition-all duration-300 ease-out text-left ${isManageMode ? 'cursor-default' : 'cursor-pointer hover:scale-[1.01]'}`}
    >
      <div className="w-full aspect-square rounded-[12px] overflow-hidden bg-marix-cream/40 relative shrink-0">
        <img src={targetImageSrc} alt={product.productTitle} className="w-full h-full object-cover" loading="lazy" />

        {isManageMode && (
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center p-2 animate-fadeIn z-20 select-none">
            <div className="bg-white rounded-xl shadow-xl border border-gray-200/80 p-1 flex items-center divide-x divide-gray-100 max-w-[120px] w-full transform scale-95 md:scale-100">
              <button 
                type="button"
                onClick={(e) => { e.stopPropagation(); onEditTrigger?.(); }}
                className="flex-1 h-9 flex items-center justify-center text-gray-600 hover:text-marix-teal active:scale-90 transition-all focus:outline-none cursor-pointer"
              >
                <i className="ph ph-pencil-simple text-base font-bold"></i>
              </button>
              <button 
                type="button"
                onClick={(e) => { e.stopPropagation(); onDeleteTrigger?.(); }}
                className="flex-1 h-9 flex items-center justify-center text-red-500 hover:text-red-600 active:scale-90 transition-all focus:outline-none cursor-pointer"
              >
                <i className="ph ph-trash text-base font-bold"></i>
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-y-0.5 px-1 pb-1 flex-1 justify-between min-w-0">
        <div className="flex flex-col min-w-0">
          <h4 className="text-xs md:text-sm font-semibold text-[#111111] truncate tracking-tight">{product.productTitle || product.name}</h4>
          <div className="flex items-center gap-x-1 text-[10px] md:text-[11px] text-[#111111]/45 font-bold min-w-0 mt-[3px]">
            <span className="flex items-center gap-x-0.5 min-w-0 max-w-[50%]">
              <i className="ph ph-storefront text-xs text-[#111111]/35"></i>
              <span className="truncate">{product.shopName || 'Merchant'}</span>
            </span>
            <span className="text-[#111111]/20">•</span>
            <span className="flex items-center gap-x-0.5 min-w-0 flex-1">
              <i className="ph ph-map-pin text-xs text-[#111111]/35"></i>
              <span className="truncate">{cleanCampusName}</span>
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-gray-50">
          <span className="text-xs md:text-sm font-black text-marix-teal tracking-tight">{product.price || '₦0'}</span>
        </div>
      </div>
    </div>
  );
}