import React, { useState, useEffect, useRef, useMemo } from 'react';
import Navbar from './Navbar';

export default function ProductOverview({ 
  product, 
  allProducts = [], 
  isLoggedIn,
  setIsLoggedIn,
  userName,
  showCreateModal,
  setShowCreateModal,
  onNavigateToLogin,
  onNavigateToSignup,
  activeSearchTerm,
  setActiveSearchTerm,
  onNavigateToExplore,
  onNavigateToUploadsTab,
  onNavigateToSavedTab,
  onNavigateToProfileTab,
  onNavigateToNotificationsTab,
  onNavigateHome,
  savedProducts = [], 
  onToggleSave, 
  onBack, 
  onSelectRecommendedProduct,
  activeTab = "browse",
  onViewSellerShop
}) {
  if (!product) return null;

  const wrapperRef = useRef(null);

  // --- EARLY ADOPTER ENGINE (LOCAL STORAGE) ---
  const [userRegistrationIndex, setUserRegistrationIndex] = useState(null);

  useEffect(() => {
    let registrationIndex = localStorage.getItem('marix_user_registration_index');
    if (!registrationIndex) {
      const mockIndex = Math.floor(Math.random() * 80) + 1;
      localStorage.setItem('marix_user_registration_index', mockIndex.toString());
      registrationIndex = mockIndex.toString();
    }
    setUserRegistrationIndex(parseInt(registrationIndex, 10));
  }, []);

  const isEarlySeller = userRegistrationIndex !== null && userRegistrationIndex <= 50;

  // Extract initial layout arrays safely
  const hasExtendedGallery = product.images && product.images.length > 0;
  const uniqueVariantNames = product.variants || (product.colorVariants ? product.colorVariants.map(v => v.colorName) : []);
  
  const defaultVariant = uniqueVariantNames.length > 0 ? uniqueVariantNames[0] : null;

  const [selectedVariant, setSelectedVariant] = useState(defaultVariant);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  // --- SCROLL PRESERVATION ENGINE ---
  useEffect(() => {
    const scrollContainer = wrapperRef.current?.parentElement;
    if (scrollContainer && scrollContainer !== window) {
      sessionStorage.setItem(`marix_scroll_${activeTab}`, scrollContainer.scrollTop);
    }
  }, [product, activeTab]);

  // Handle active sizes list mapped specifically to the currently selected color variant
  const activeSizesList = useMemo(() => {
    if (product.colorVariants && product.colorVariants.length > 0 && selectedVariant) {
      const activeVariantData = product.colorVariants.find(v => v.colorName === selectedVariant);
      if (activeVariantData && activeVariantData.sizes) {
        return activeVariantData.sizes;
      }
    }
    return product.availableSizes || [];
  }, [product, selectedVariant]);

  // Sync component state cleanly whenever the product changes
  useEffect(() => {
    const newDefault = uniqueVariantNames.length > 0 ? uniqueVariantNames[0] : null;
    setSelectedVariant(newDefault);
    setActiveImageIndex(0);
    setIsDescExpanded(false);
    
    let initialSizes = product.availableSizes || [];
    if (product.colorVariants && product.colorVariants.length > 0 && newDefault) {
      const activeVariantData = product.colorVariants.find(v => v.colorName === newDefault);
      if (activeVariantData && activeVariantData.sizes) {
        initialSizes = activeVariantData.sizes;
      }
    }
    setSelectedSize(initialSizes.length > 0 ? initialSizes[0] : null);

    if (wrapperRef.current) {
      wrapperRef.current.scrollTop = 0;
    }
  }, [product, uniqueVariantNames]);

  // Auto-select first available option when user swaps color variants
  useEffect(() => {
    if (activeSizesList.length > 0) {
      if (!activeSizesList.includes(selectedSize)) {
        setSelectedSize(activeSizesList[0]);
      }
    } else {
      setSelectedSize(null);
    }
  }, [selectedVariant, activeSizesList]);

  // --- DYNAMIC PRICE EVALUATION ENGINE ---
  const displayedPrice = useMemo(() => {
    if (product.colorVariants && product.colorVariants.length > 0 && selectedVariant) {
      const activeVariantData = product.colorVariants.find(v => v.colorName === selectedVariant);
      if (activeVariantData) {
        if (selectedSize && activeVariantData.optionPrices && activeVariantData.optionPrices[selectedSize]) {
          return `₦${Number(activeVariantData.optionPrices[selectedSize]).toLocaleString()}`;
        }
        if (activeVariantData.overridePrice && activeVariantData.customPrice) {
          return activeVariantData.customPrice;
        }
      }
    }
    return product.price || 'Contact Seller';
  }, [product, selectedVariant, selectedSize]);

  const handleBackWithScrollPreservation = () => {
    onBack();
    requestAnimationFrame(() => {
      setTimeout(() => {
        const scrollContainer = document.querySelector('.overflow-y-auto');
        const savedPos = sessionStorage.getItem(`marix_scroll_${activeTab}`) || sessionStorage.getItem('marix_browse_isolated_scroll_pos');
        if (scrollContainer && savedPos) {
          scrollContainer.scrollTop = parseInt(savedPos, 10);
        }
      }, 35); 
    });
  };

  // Gallery resolution logic based on variant assignment
  let displayImages = [];
  if (hasExtendedGallery) {
    displayImages = product.images.filter(img => img.variantName === selectedVariant);
    if (displayImages.length === 0) displayImages = product.images;
  } else if (product.colorVariants && product.colorVariants.length > 0) {
    displayImages = product.colorVariants.map((v, idx) => ({ id: `fallback-${idx}`, imageUrl: v.imageUrl, variantName: v.colorName }));
  } else {
    displayImages = [{ id: 'fallback-absolute', imageUrl: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&q=80", variantName: "Standard" }];
  }

  const activeImage = displayImages[activeImageIndex] || displayImages[0] || {};
  const activeImageSrc = activeImage.imageUrl;

  const variantVisuals = uniqueVariantNames.map(vName => {
    let vImg = product.images?.find(img => img.variantName === vName)?.imageUrl;
    if (!vImg) vImg = product.colorVariants?.find(cv => cv.colorName === vName)?.imageUrl;
    if (!vImg) vImg = activeImageSrc; 
    return { name: vName, img: vImg };
  });

  const handleWhatsAppChat = () => {
    const cleanNumber = product.whatsappNumber ? product.whatsappNumber.replace(/\D/g, '') : "2348012345678";
    const variantDetail = selectedVariant ? `\n- Variant: ${selectedVariant}` : "";
    const sizeDetail = selectedSize ? `\n- Option/Size: ${selectedSize}` : "";
    const message = `Hello, I saw your listing for "${product.productTitle}" (${displayedPrice}) on Marix.${variantDetail}${sizeDetail}\n\nIs this item still available?`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${cleanNumber}?text=${encodedMessage}`, '_blank');
  };

  const recommendations = useMemo(() => {
    const shuffleArray = (arr) => {
      const copy = [...arr];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    };

    const currentCampusClean = (product.campus || '').trim().toLowerCase();

    const sameCampusPool = allProducts.filter(item => {
      const itemCampusClean = (item.campus || '').trim().toLowerCase();
      return item.id !== product.id && itemCampusClean === currentCampusClean;
    });

    const sameCategoryAndCampus = shuffleArray(sameCampusPool.filter(item => item.category === product.category));
    const differentCategoryAndCampus = shuffleArray(sameCampusPool.filter(item => item.category !== product.category));

    const selectedCategoryItems = sameCategoryAndCampus.slice(0, 4);
    const selectedDiffItems = differentCategoryAndCampus.slice(0, 2);
    let combined = [...selectedCategoryItems, ...selectedDiffItems];

    if (combined.length < 6) {
      const currentCombinedIds = new Set(combined.map(item => item.id));
      const fallbackCampusListings = shuffleArray(sameCampusPool.filter(item => !currentCombinedIds.has(item.id)));
      combined = [...combined, ...fallbackCampusListings].slice(0, 6);
    }
    return combined;
  }, [product, allProducts]);

  const isLiked = savedProducts.some(p => p.id === product.id);
  const rawCampus = product.campus || 'Campus';
  const cleanCampusName = rawCampus.split(',')[0].trim().toUpperCase();

  const descriptionText = product.description || '';
  const descriptionWords = descriptionText.split(/\s+/);
  const isLongDescription = descriptionWords.length > 20;
  
  const displayedDescription = useMemo(() => {
    if (!isLongDescription || isDescExpanded) return descriptionText;
    return descriptionWords.slice(0, 20).join(' ') + '...';
  }, [descriptionText, descriptionWords, isLongDescription, isDescExpanded]);

  const handleNavbarNavigation = (targetTab) => {
    if (targetTab === 'uploads') {
      onNavigateToUploadsTab?.();
    } else if (targetTab === 'saved-mobile') {
      onNavigateToSavedTab?.();
    } else if (targetTab === 'profile') {
      onNavigateToProfileTab?.();
    } else if (targetTab === 'notifications') {
      onNavigateToNotificationsTab?.();
    } else if (targetTab === 'home' || targetTab === 'browse') {
      onNavigateHome?.();
    }
  };

  return (
    <div 
      ref={wrapperRef}
      className="w-full h-full overflow-y-auto overflow-x-hidden scrollbar-none bg-marix-cream flex flex-col text-[#111111] animate-fadeIn relative text-left"
    >
      <style>{`
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* NAVBAR */}
      <div className="w-full md:sticky md:top-0 z-50">
        <Navbar 
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          userName={userName}
          activeTab={activeTab} 
          onNavigateToNotifications={onNavigateToNotificationsTab}
          onNavigateToProfile={onNavigateToProfileTab}
          handleTabChange={(tab) => handleNavbarNavigation(tab)} 
          savedCount={savedProducts.length}
          showCreateModal={showCreateModal}
          setShowCreateModal={setShowCreateModal}
          onNavigateToLogin={onNavigateToLogin}
          onNavigateToSignup={onNavigateToSignup}
          activeSearchTerm={activeSearchTerm}
          setActiveSearchTerm={setActiveSearchTerm}
          onNavigateToExplore={() => onNavigateToExplore('All', 'All Categories')}
          onLogoClick={() => {
            window.dispatchEvent(new CustomEvent('marix_force_home_reset'));
          }}
        />
      </div>

      <div className="w-full pt-[4px] md:pt-[84px] flex flex-col">
        
        {/* ACTION CONTROL BAR */}
        <div className="w-full max-w-[95%] mx-auto px-2 lg:px-4 py-4 flex items-center justify-between select-none">
          <button 
            onClick={handleBackWithScrollPreservation} 
            className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-600 hover:text-marix-teal hover:border-marix-teal transition-all focus:outline-none cursor-pointer"
          >
            <i className="ph ph-arrow-left text-lg font-bold"></i>
          </button>
          
          <span className="text-[10px] md:text-xs font-black bg-marix-teal/10 text-marix-teal px-3 md:px-4 py-1.5 md:py-2 rounded-full uppercase tracking-wider">
            {product.category}
          </span>
        </div>

        <main className="w-full max-w-[95%] mx-auto px-2 lg:px-4 flex-1 flex flex-col gap-8">
          
          <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* LEFT COLUMN: GALLERY */}
            <div className="md:col-span-7 flex flex-col gap-3 select-none">
              <div className="w-full aspect-square rounded-[24px] overflow-hidden bg-white border border-gray-200/50 shadow-sm relative group">
                <img 
                  src={activeImageSrc} 
                  alt={product.productTitle} 
                  className="w-full h-full object-cover transition-transform duration-500 ease-out md:group-hover:scale-[1.03]" 
                />
                
                {product.category !== 'Food & Snacks' && product.condition && (
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider whitespace-nowrap flex-shrink-0 z-10">
                    {product.condition}
                  </div>
                )}

                <button 
                  onClick={() => onToggleSave(product)}
                  className={`absolute top-4 right-4 w-10 h-10 rounded-full border shadow-md flex items-center justify-center bg-white active:scale-90 transition-all cursor-pointer z-10 ${isLiked ? 'border-marix-teal text-marix-teal' : 'border-gray-200 text-gray-400 hover:text-gray-600'}`}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </button>
              </div>

              {displayImages.length > 1 && (
                <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
                  {displayImages.map((img, idx) => (
                    <button
                      key={img.id || idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 bg-white shrink-0 transition-all focus:outline-none cursor-pointer ${
                        activeImageIndex === idx 
                          ? 'border-marix-teal scale-98 shadow-sm' 
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: DETAILS */}
            <div className="md:col-span-5 flex flex-col gap-6 text-left">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1 text-xs text-gray-500 font-bold">
                  <i className="ph ph-map-pin text-sm text-marix-teal"></i>
                  <span>{product.campus}</span>
                </div>
                
                <h1 className="text-2xl md:text-3xl font-black tracking-tight leading-tight text-[#111111]">
                  {product.productTitle}
                </h1>

                <div className="flex items-center justify-between mt-1 pb-4 border-b border-gray-200/60">
                  <span className="text-2xl font-black text-marix-teal tracking-tight">
                    {displayedPrice}
                  </span>
                </div>
              </div>

              {/* DYNAMIC IMAGE VARIANT CHIPS */}
              {variantVisuals.length > 0 && (
                <div className="flex flex-col gap-2.5 select-none">
                  <span className="text-xs font-black tracking-wider uppercase text-gray-400">
                    Select Variant
                  </span>
                  <div className="flex flex-wrap gap-3">
                    {variantVisuals.map((variant, index) => {
                      const isSelected = selectedVariant === variant.name;
                      return (
                        <div key={index} className="flex flex-col items-center gap-1">
                          <button
                            onClick={() => {
                              setSelectedVariant(variant.name);
                              setActiveImageIndex(0);
                            }}
                            className={`w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden border-2 transition-all focus:outline-none cursor-pointer ${
                              isSelected 
                                ? 'border-marix-teal shadow-md scale-95' 
                                : 'border-gray-200 opacity-60 hover:opacity-100 bg-white'
                            }`}
                          >
                            <img src={variant.img} alt={variant.name} className="w-full h-full object-cover" />
                          </button>
                          <span className={`text-[10px] font-bold ${isSelected ? 'text-marix-teal' : 'text-gray-400'}`}>
                            {variant.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* DYNAMIC SIZE CHIPS */}
              {activeSizesList && activeSizesList.length > 0 && (
                <div className="flex flex-col gap-2.5 select-none mt-2 animate-fadeIn">
                  <span className="text-xs font-black tracking-wider uppercase text-gray-400">
                    Select Option
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {activeSizesList.map((size, index) => {
                      const isSelected = selectedSize === size;
                      return (
                        <button
                          key={index}
                          onClick={() => setSelectedSize(size)}
                          className={`min-w-[2.75rem] px-3.5 h-11 text-xs font-black rounded-xl border flex items-center justify-center transition-all focus:outline-none w-auto cursor-pointer ${
                            isSelected 
                              ? 'border-marix-teal bg-marix-teal/5 text-marix-teal shadow-sm' 
                              : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-white'
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* WHATSAPP CTA */}
              <button
                onClick={handleWhatsAppChat}
                className="w-full bg-marix-brown text-white font-black text-sm py-4 rounded-2xl shadow-md hover:opacity-95 transition-opacity flex items-center justify-center gap-2.5 focus:outline-none mt-2 cursor-pointer"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.458L0 24zm6.59-4.846c1.66.986 3.293 1.493 4.813 1.494 5.372 0 9.733-4.331 9.736-9.654.002-2.58-1.001-5.006-2.825-6.83-1.824-1.823-4.25-2.825-6.83-2.827-5.374 0-9.735 4.332-9.738 9.655-.001 1.62.457 3.203 1.325 4.582l-.999 3.647 3.73-.974.24-.143zM15.8 13.56c-.328-.164-1.94-.957-2.24-1.066-.3-.11-.519-.164-.738.164-.219.328-.849 1.066-1.04 1.284-.19.219-.383.246-.71.082-1.393-.698-2.31-1.229-3.232-2.816-.243-.418.243-.388.696-1.293.077-.164.038-.3-.019-.41-.058-.11-.519-1.258-.711-1.723-.187-.45-.378-.39-.519-.398h-.442c-.154 0-.405.058-.616.287-.21.23-.804.787-.804 1.917s.822 2.213.937 2.37c.115.157 1.618 2.47 3.92 3.467 1.83.792 2.507.854 3.411.72.636-.094 1.94-.793 2.213-1.558.273-.765.273-1.422.191-1.558-.081-.137-.3-.219-.628-.383z"/>
                </svg>
                <span>Chat on WhatsApp</span>
              </button>

              {/* PRODUCT DESCRIPTION */}
              <div className="flex flex-col gap-2 pt-4 border-t border-gray-200/60 mt-2">
                <span className="text-xs font-black tracking-wider uppercase text-gray-400">
                  Product Description
                </span>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed font-medium transition-all">
                  {displayedDescription}
                  {isLongDescription && (
                    <button
                      onClick={() => setIsDescExpanded(!isDescExpanded)}
                      className="ml-1.5 text-marix-teal font-black hover:underline focus:outline-none inline-block text-[11px] uppercase tracking-wide cursor-pointer"
                    >
                      {isDescExpanded ? 'Read Less' : 'Read More'}
                    </button>
                  )}
                </p>
              </div>

              {/* SELLER CARD */}
              <div className="mt-4 pt-6 border-t border-gray-200/60 select-none">
                <span className="text-xs font-black tracking-wider uppercase text-gray-400 mb-4 block">
                  Seller Information
                </span>
                
                <div className="bg-white border border-gray-200 shadow-[0_4px_16px_rgba(0,0,0,0.02)] rounded-2xl p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-12 h-12 rounded-full bg-marix-teal/10 text-marix-teal flex items-center justify-center text-base font-black shrink-0">
                      {product.shopName?.charAt(0).toUpperCase() || 'S'}
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <h4 className="text-sm font-black text-[#111111] truncate max-w-[110px] sm:max-w-[170px] md:max-w-none">
                          {product.shopName}
                        </h4>
                        {isEarlySeller && (
                          <span className="text-[8px] bg-marix-teal/10 border border-marix-teal/20 text-marix-teal font-black px-1.5 py-0.5 rounded-full uppercase tracking-wide flex-shrink-0">
                            Early Seller
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-gray-500 font-bold mt-0.5 min-w-0">
                        <i className="ph ph-circle-dashed text-gray-400 text-xs shrink-0"></i>
                        <span className="truncate">Active Campus Merchant</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* 🛍️ VIEW SHOP BUTTON BINDING */}
                  <button 
                    onClick={() => onViewSellerShop?.(product)}
                    className="bg-marix-cream text-[#111111] text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-gray-100 transition-colors focus:outline-none shrink-0 border border-gray-200/50 cursor-pointer flex-shrink-0"
                  >
                    View Shop
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* RECOMMENDATIONS */}
          {recommendations.length > 0 && (
            <section className="w-full border-t border-gray-200/60 pt-8 mt-6 text-left select-none pb-8">
              <h3 className="text-base md:text-lg font-black tracking-tight text-[#111111] mb-5">
                More from <span className="text-marix-teal font-black">{cleanCampusName}</span>
              </h3>
              
              <div className="flex overflow-x-auto min-[1025px]:grid min-[1025px]:grid-cols-6 gap-3.5 md:gap-5 pb-3 scrollbar-none snap-x snap-mandatory">
                {recommendations.map((rec) => {
                  const primaryImg = rec.colorVariants?.find(v => v.isMain) || rec.colorVariants?.[0];
                  const fallbackImg = rec.images?.find(img => img.isCover) || rec.images?.[0];
                  const finalTargetSrc = primaryImg ? primaryImg.imageUrl : (fallbackImg ? fallbackImg.imageUrl : "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&q=80");
                  const recCampus = rec.campus ? rec.campus.split(',')[0].trim() : 'Campus';
                  const isRecLiked = savedProducts.some(p => p.id === rec.id);

                  return (
                    <div 
                      key={rec.id}
                      onClick={() => onSelectRecommendedProduct && onSelectRecommendedProduct(rec)}
                      className="shrink-0 snap-start max-[599px]:w-[46%] min-[600px]:max-[829px]:w-[31%] min-[830px]:max-[1024px]:w-[23%] min-[1025px]:w-full cursor-pointer bg-white p-1.5 rounded-[18px] border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:scale-[1.01] active:scale-[0.99] transition-all flex flex-col gap-1 group"
                    >
                      <div className="w-full aspect-square rounded-[12px] overflow-hidden bg-marix-cream/40 relative shrink-0">
                        <img src={finalTargetSrc} alt={rec.productTitle} className="w-full h-full object-cover animate-fadeIn" />
                      </div>
                      <div className="flex flex-col gap-y-0.5 px-1 pb-1 flex-1 justify-between min-w-0">
                        <div className="flex flex-col min-w-0">
                          <h4 className="text-[11px] sm:text-xs md:text-sm font-semibold text-[#111111] truncate tracking-tight mt-1">{rec.productTitle}</h4>
                          <div className="flex items-center gap-x-1 text-[9px] sm:text-[10px] md:text-[11px] text-[#111111]/45 font-bold min-w-0 mt-[2px]">
                            <span className="flex items-center gap-x-0.5 min-w-0 max-w-[50%]"><i className="ph ph-storefront text-xs text-[#111111]/35 shrink-0"></i><span className="truncate">{rec.shopName}</span></span>
                            <span className="text-[#111111]/20 select-none">•</span>
                            <span className="flex items-center gap-x-0.5 min-w-0 flex-1"><i className="ph ph-map-pin text-xs text-[#111111]/35 shrink-0"></i><span className="truncate">{recCampus}</span></span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-gray-100/50 shrink-0">
                          <span className="text-[11px] sm:text-xs md:text-sm font-black text-marix-teal tracking-tight">{rec.price}</span>
                          <button 
                            type="button" 
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              onToggleSave(rec); 
                            }} 
                            className={`w-[26px] h-[26px] sm:w-7 sm:h-7 rounded-full border flex items-center justify-center bg-white active:scale-90 focus:outline-none transition-colors cursor-pointer ${isRecLiked ? 'border-marix-teal text-marix-teal' : 'border-gray-200 text-[#111111]/40'}`}
                          >
                            <svg className="w-[11px] h-[11px] sm:w-[13px] sm:h-[13px]" viewBox="0 0 24 24" fill={isRecLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* FOOTER */}
          <div className="w-full text-center text-[11px] text-gray-400 font-bold tracking-tight py-6 border-t border-gray-100 bg-white z-30 relative shrink-0 -mx-4 px-4">
            <span>&copy; {new Date().getFullYear()} <span className="text-marix-teal font-bold">Marix</span>. Built for Campus Commerce.</span>
          </div>

        </main>
      </div>

    </div>
  );
}