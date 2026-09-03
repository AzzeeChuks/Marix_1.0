import React, { useState, useLayoutEffect, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Profile from '../components/Profile';
import Notifications from '../components/Notifications';
import Uploads from '../components/Uploads'; 

export default function Homepage({ 
  products = [], 
  isLoggedIn, 
  setIsLoggedIn,
  activeUploadsCount, 
  userName,
  userEmail,
  showCreateModal,
  setShowCreateModal,
  activeTab,       
  setActiveTab,
  recentlyViewed = [],
  onProductCardClick,    
  userUploads = [],     
  savedProducts = [],
  setSavedProducts,
  onNavigateToLogin, 
  onNavigateToSignup,
  onNavigateToExplore, 
  onNavigateToView,
  activeSearchTerm,
  setActiveSearchTerm,
  onSignOut,
  notifications = [], 
  onClearNotificationsCount, 
  historyFallbackTab = 'browse',
  editingProductData,
  setEditingProductData,
  onProductDeleted,
  hasCompletedSellerOnboarding,
  onBecomeSellerTrigger,
  shopDetails,
  setShopDetails,
  onOpenCreateListingModal,
  setHasCompletedSellerOnboarding,
  userLocation,
  setUserLocation,
  onUpdateUserName
}) {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isAtAbsoluteBottom, setIsAtAbsoluteBottom] = useState(false); 
  const scrollContainerRef = useRef(null);
  const [profileSubView, setProfileSubView] = useState('main');
  const [productToDelete, setProductToDelete] = useState(null);

  // 🚀 ISOLATED SEARCH STATE FOR SAVED ITEMS TAB ONLY
  const [savedSearchQuery, setSavedSearchQuery] = useState('');

  // 🚀 PREVENT AUTO-FOCUSING & OUTLINE RE-APPEARANCE ON APP/TAB SWITCH
  useEffect(() => {
    const handleBlurOnWindowSwitch = () => {
      if (document.activeElement && document.activeElement.tagName === 'INPUT') {
        document.activeElement.blur();
      }
    };

    window.addEventListener('blur', handleBlurOnWindowSwitch);
    return () => window.removeEventListener('blur', handleBlurOnWindowSwitch);
  }, []);

  const handleTabChange = (newTab) => {
    if (!newTab) return;
    if (scrollContainerRef.current) {
      sessionStorage.setItem(`marix_scroll_${activeTab}`, scrollContainerRef.current.scrollTop);
    }
    if (newTab === 'explore') {
      if (onNavigateToExplore) onNavigateToExplore('All', 'All Categories');
      return;
    }
    setActiveTab(newTab);
    if (newTab === 'notifications' && onClearNotificationsCount) {
      onClearNotificationsCount();
    }
    if (newTab !== 'profile') {
      setProfileSubView('main');
    }
  };

  useLayoutEffect(() => {
    const savedDepth = sessionStorage.getItem(`marix_scroll_${activeTab}`);
    if (savedDepth && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = parseInt(savedDepth, 10);
    } else if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [activeTab]);

  const handleScrollPhysics = (e) => {
    const target = e.currentTarget;
    const currentScrollY = target.scrollTop;
    const containerHeight = target.clientHeight;
    const totalContentHeight = target.scrollHeight;

    if (activeTab === 'browse' || activeTab === 'profile' || activeTab === 'notifications') {
      setShowBackToTop(false);
    } else {
      setShowBackToTop(currentScrollY > 300);
    }

    if (containerHeight + currentScrollY >= totalContentHeight - 40) {
      setIsAtAbsoluteBottom(true);
    } else {
      setIsAtAbsoluteBottom(false);
    }
  };

  const handleFastScrollToTop = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const startPosition = container.scrollTop;
    const duration = 450;
    const startTime = performance.now();

    function easeOutQuad(t) { return t * (2 - t); }
    function animateStep(currentTime) {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const ease = easeOutQuad(progress);
      container.scrollTop = startPosition * (1 - ease);
      if (progress < 1) window.requestAnimationFrame(animateStep);
    }
    window.requestAnimationFrame(animateStep);
  };

  const executeLocalDelete = () => {
    if (!productToDelete) return;
    if (onProductDeleted) {
      onProductDeleted(productToDelete.id);
    }
    setProductToDelete(null);
  };

  // 🚀 FILTER SAVED PRODUCTS IN REAL-TIME
  const filteredSavedProducts = savedProducts.filter((product) => {
    if (!savedSearchQuery.trim()) return true;
    const term = savedSearchQuery.toLowerCase().trim();
    const matchTitle = (product.productTitle || product.name || '').toLowerCase().includes(term);
    const matchDesc = (product.description || '').toLowerCase().includes(term);
    return matchTitle || matchDesc;
  });

  const categories = [
    { name: 'Fashion', iconClass: 'ph-t-shirt' },
    { name: 'Footwears', iconClass: 'ph-sneaker' },
    { name: 'Gadgets', iconClass: 'ph-device-mobile' },
    { name: 'Accessories', iconClass: 'ph-watch' },
    { name: 'Beauty', iconClass: 'ph-flower' }, 
    { name: 'Food & Snacks', iconClass: 'ph-hamburger' },
    { name: 'Home & Kitchen', iconClass: 'ph-cooking-pot' },
    { name: 'Other', iconClass: 'ph-dots-three-circle' }
  ];

  const showcaseItems = [
    { name: 'Acoustic Guitar', price: '₦35,000', img: 'https://images.unsplash.com/photo-1588449668365-d15e397f6787?w=300&q=80' },
    { name: 'Nike Air Force 1', price: '₦28,500', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=80' },
    { name: "Victoria's Secret", price: '₦12,000', img: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=300&q=80' },
    { name: 'Shawarma Deluxe', price: '₦3,200', img: 'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'Ring Chain', price: '₦2,500', img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&q=80' },
    { name: 'Minimal Chain/Watch', price: '₦6,500', img: 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=500' }
  ];

  const featuredDeck = products.slice(0, 6);
  const trendingDeck = products.slice(6, 12);
  const firstLetter = userName ? userName.charAt(0).toUpperCase() : 'M';

  return (
    <div className="w-full h-full flex flex-col relative overflow-hidden bg-marix-cream">
      <div 
        ref={scrollContainerRef}
        onScroll={handleScrollPhysics}
        className="w-full flex-1 overflow-y-auto overflow-x-hidden scrollbar-none flex flex-col justify-between"
      >
        <style>{`
          .scrollbar-none::-webkit-scrollbar { display: none; }
          .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
          /* Global fix to ensure native black outlines never flash on focus */
          input:focus, textarea:focus, select:focus, button:focus {
            outline: none !important;
            -webkit-tap-highlight-color: transparent;
          }
        `}</style>
        
        <div className="w-full flex-1 flex flex-col">
          <Navbar 
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
            userName={userName}
            activeTab={activeTab}
            handleTabChange={handleTabChange}
            savedCount={savedProducts ? savedProducts.length : 0}
            showCreateModal={showCreateModal}
            setShowCreateModal={setShowCreateModal}
            onNavigateToLogin={onNavigateToLogin}
            onNavigateToSignup={onNavigateToSignup}
            activeSearchTerm={activeSearchTerm}
            setActiveSearchTerm={setActiveSearchTerm}
            onNavigateToExplore={() => onNavigateToExplore('All', 'All Categories')}
            onNavigateToNotifications={() => handleTabChange('notifications')}
            onNavigateToProfile={() => handleTabChange('profile')}
            editInitialData={editingProductData}
          />

          <div className="w-full pt-[4px] md:pt-[84px] flex-1 flex flex-col">
            
            {/* VIEW A: BROWSE MAIN HUB */}
            {activeTab === 'browse' && (
              <>
                {/* Hero Section */}
                <section className="w-full max-w-[95%] mx-auto px-2 lg:px-4 pt-6 pb-12 block md:grid md:grid-cols-12 md:items-center gap-8">
                  <div className="md:col-span-6 flex flex-col gap-4 text-left z-10">
                    <div className="inline-flex items-center gap-1.5 bg-marix-teal/10 text-marix-teal border border-marix-teal/20 px-3 py-1 rounded-full text-xs font-bold w-fit select-none">
                      <span>🏫</span> The #1 Campus Marketplace
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#111111] w-full flex flex-wrap gap-x-2 gap-y-1 leading-[1.15] mb-1">
                      Discover. Connect. Trade with <span className="text-marix-teal">Students.</span>
                    </h1>
                    <div className="text-xs md:text-sm text-gray-600 max-w-md leading-relaxed font-medium">
                      Find amazing products from trusted campus sellers. Chat directly on WhatsApp. It's that easy.
                    </div>
                    <div className="flex items-center gap-3 mt-1.5">
                      <button onClick={() => onNavigateToExplore('All', 'All Categories')} className="bg-marix-brown text-white font-bold text-xs md:text-sm px-5 py-3 rounded-xl shadow-md hover:opacity-95 transition-opacity flex items-center gap-2 focus:outline-none cursor-pointer">
                        Explore Products <span>→</span>
                      </button>
                      <button onClick={() => setShowCreateModal(true)} className="bg-white border border-gray-200 text-[#111111] font-bold text-xs md:text-sm px-5 py-3 rounded-xl shadow-sm hover:bg-gray-50 transition-colors focus:outline-none cursor-pointer">
                        Start Selling
                      </button>
                    </div>
                  </div>

                  <div className="md:col-span-6 relative w-full overflow-visible select-none mt-10 md:mt-0 flex items-center justify-center h-[340px] sm:h-[420px] md:h-[460px] lg:h-[480px]">
                    <div className="min-[1025px]:hidden w-full max-w-[420px] lg:max-w-[480px] flex flex-col gap-y-3.5 transform -rotate-[4deg] skew-x-1">
                      <div className="grid grid-cols-3 gap-3 w-full translate-x-2">
                        {showcaseItems.slice(0, 3).map((item, idx) => (
                          <div key={idx} className="bg-white p-2 rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.03)] border border-gray-100/70 flex flex-col gap-1 text-left">
                            <div className="w-full aspect-square rounded-xl bg-gray-50 overflow-hidden"><img src={item.img} alt="" className="w-full h-full object-cover" /></div>
                            <h5 className="text-[10px] sm:text-xs font-bold text-[#111111] truncate mt-0.5">{item.name}</h5>
                            <span className="text-[10px] sm:text-xs font-black text-marix-teal">{item.price}</span>
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-3 gap-3 w-full -translate-x-2">
                        {showcaseItems.slice(3, 6).map((item, idx) => (
                          <div key={idx} className="bg-white p-2 rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.03)] border border-gray-100/70 flex flex-col gap-1 text-left">
                            <div className="w-full aspect-square rounded-xl bg-gray-50 overflow-hidden"><img src={item.img} alt="" className="w-full h-full object-cover" /></div>
                            <h5 className="text-[10px] sm:text-xs font-bold text-[#111111] truncate mt-0.5">{item.name}</h5>
                            <span className="text-[10px] sm:text-xs font-black text-marix-teal">{item.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {typeof window !== 'undefined' && window.innerWidth >= 1025 && (
                      <div className="hidden min-[1025px]:block w-full h-full relative">
                        <div className="absolute top-[6%] left-[2%] w-[155px] bg-white p-2 rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.04)] border border-gray-100/60 transform -rotate-[6deg] hover:-translate-y-2 hover:rotate-0 hover:z-30 transition-transform duration-300 ease-out">
                          <div className="w-full aspect-square rounded-xl bg-gray-50 overflow-hidden mb-1.5"><img src={showcaseItems[0].img} alt="" className="w-full h-full object-cover" /></div>
                          <h5 className="text-xs font-bold text-[#111111] truncate">{showcaseItems[0].name}</h5>
                          <span className="text-xs font-black text-marix-teal">{showcaseItems[0].price}</span>
                        </div>
                        <div className="absolute top-[0%] left-[44%] w-[165px] bg-white p-2 rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.05)] border border-gray-100/60 transform rotate-[4deg] hover:-translate-y-2 hover:rotate-0 hover:z-30 transition-transform duration-300 ease-out z-10">
                          <div className="w-full aspect-square rounded-xl bg-gray-50 overflow-hidden mb-1.5"><img src={showcaseItems[1].img} alt="" className="w-full h-full object-cover" /></div>
                          <h5 className="text-xs font-bold text-[#111111] truncate">{showcaseItems[1].name}</h5>
                          <span className="text-xs font-black text-marix-teal">{showcaseItems[1].price}</span>
                        </div>
                        <div className="absolute top-[14%] right-[2%] w-[145px] bg-white p-2 rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.04)] border border-gray-100/60 transform -rotate-[3deg] hover:-translate-y-2 hover:rotate-0 hover:z-30 transition-transform duration-300 ease-out">
                          <div className="w-full aspect-square rounded-xl bg-gray-50 overflow-hidden mb-1.5"><img src={showcaseItems[2].img} alt="" className="w-full h-full object-cover" /></div>
                          <h5 className="text-xs font-bold text-[#111111] truncate">{showcaseItems[2].name}</h5>
                          <span className="text-xs font-black text-marix-teal">{showcaseItems[2].price}</span>
                        </div>
                        <div className="absolute top-[44%] left-[28%] w-[165px] bg-white p-2 rounded-2xl shadow-[0_16px_36px_rgba(69,43,31,0.08)] border border-gray-100 transform -rotate-[2deg] hover:-translate-y-2 hover:rotate-0 hover:z-30 transition-transform duration-300 ease-out z-20">
                          <div className="w-full aspect-square rounded-xl bg-gray-50 overflow-hidden mb-1.5"><img src={showcaseItems[3].img} alt="" className="w-full h-full object-cover" /></div>
                          <h5 className="text-xs font-bold text-[#111111] truncate">{showcaseItems[3].name}</h5>
                          <span className="text-xs font-black text-marix-teal">{showcaseItems[3].price}</span>
                        </div>
                        <div className="absolute bottom-[4%] left-[4%] w-[145px] bg-white p-2 rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.04)] border border-gray-100/60 transform rotate-[5deg] hover:-translate-y-2 hover:rotate-0 hover:z-30 transition-transform duration-300 ease-out">
                          <div className="w-full aspect-square rounded-xl bg-gray-50 overflow-hidden mb-1.5"><img src={showcaseItems[4].img} alt="" className="w-full h-full object-cover" /></div>
                          <h5 className="text-xs font-bold text-[#111111] truncate">{showcaseItems[4].name}</h5>
                          <span className="text-xs font-black text-marix-teal">{showcaseItems[4].price}</span>
                        </div>
                        <div className="absolute bottom-[6%] right-[4%] w-[145px] bg-white p-2 rounded-2xl shadow-[0_10px_28px_rgba(0,0,0,0.05)] border border-gray-100/60 transform -rotate-[4deg] hover:-translate-y-2 hover:rotate-0 hover:z-30 transition-transform duration-300 ease-out z-10">
                          <div className="w-full aspect-square rounded-xl bg-gray-50 overflow-hidden mb-1.5"><img src={showcaseItems[5].img} alt="" className="w-full h-full object-cover" /></div>
                          <h5 className="text-xs font-bold text-[#111111] truncate">{showcaseItems[5].name}</h5>
                          <span className="text-xs font-black text-marix-teal">{showcaseItems[5].price}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </section>

                {/* Stats Section */}
                <section className="w-full max-w-[95%] mx-auto px-2 lg:px-4 py-2 grid grid-cols-2 md:grid-cols-4 gap-3 select-none">
                  {[
                    { metric: '120+', text: 'Products Listed', icon: 'ph-shopping-bag' },
                    { metric: '25+', text: 'Campus Sellers', icon: 'ph-storefront' },
                    { metric: '100%', text: 'WhatsApp Contact', icon: 'ph-whatsapp-logo' },
                    { metric: 'Built for', text: 'Students', icon: 'ph-graduation-cap' }
                  ].map((stat, i) => (
                    <div key={i} className="bg-white p-3 md:p-4 rounded-xl border border-gray-200/70 shadow-sm flex items-center gap-2.5 text-left">
                      <div className="w-9 h-9 rounded-xl bg-marix-teal/10 text-marix-teal flex items-center justify-center text-lg shrink-0">
                        <i className={`ph ${stat.icon} font-bold`}></i>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-black text-xs md:text-sm text-[#111111]">{stat.metric}</h4>
                        <p className="text-[10px] md:text-[11px] text-gray-500 font-bold tracking-tight truncate">{stat.text}</p>
                      </div>
                    </div>
                  ))}
                </section>

                {/* Featured Products */}
                <section className="w-full max-w-[95%] mx-auto px-2 lg:px-4 pt-10 text-left">
                  <div className="flex justify-between items-center w-full mb-5 select-none">
                    <h3 className="text-base md:text-lg font-black tracking-tight text-[#111111]">Featured Products</h3>
                    <span className="text-[11px] font-bold text-gray-400 cursor-pointer md:hover:text-marix-teal transition-colors" onClick={() => onNavigateToExplore('Featured', 'All Categories')}>See All</span>
                  </div>
                  <div className="flex overflow-x-auto min-[1025px]:grid min-[1025px]:grid-cols-6 gap-3.5 md:gap-5 pb-3 scrollbar-none snap-x snap-mandatory">
                    {featuredDeck.map((product) => {
                      const primaryImgObj = product.colorVariants?.find(v => v.isMain) || product.colorVariants?.[0];
                      const fallbackImg = product.images?.find(img => img.isCover) || product.images?.[0];
                      const finalTargetSrc = primaryImgObj ? primaryImgObj.imageUrl : (fallbackImg ? fallbackImg.imageUrl : "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&q=80");

                      return (
                        <div key={product.id} className="shrink-0 snap-start max-[599px]:w-[46%] min-[600px]:max-[829px]:w-[31%] min-[830px]:max-[1024px]:w-[23%] min-[1025px]:w-full">
                          <VolcanoCard product={product} targetImageSrc={finalTargetSrc} savedProducts={savedProducts} onToggleSave={setSavedProducts} onProductClick={onProductCardClick} />
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* Categories */}
                <section className="w-full max-w-[95%] mx-auto px-2 lg:px-4 pt-10 text-left">
                  <h3 className="text-base md:text-lg font-black tracking-tight text-[#111111] mb-4 select-none">Explore by Category</h3>
                  <div className="grid grid-cols-4 min-[1025px]:grid-cols-8 gap-2.5 md:gap-3 select-none">
                    {categories.map((cat, i) => (
                      <div 
                        key={i} 
                        onClick={() => onNavigateToExplore('All', cat.name)} 
                        className="bg-white p-3 rounded-xl border border-gray-200/60 text-center flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm active:scale-98 group md:hover:border-marix-teal/50"
                      >
                        <div className="w-10 h-10 rounded-xl bg-marix-teal/10 text-marix-teal flex items-center justify-center text-xl">
                          <i className={`ph ${cat.iconClass} font-bold`}></i>
                        </div>
                        <span className="text-[10px] md:text-xs font-bold text-[#111111] truncate max-w-full">{cat.name}</span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Trending Feed */}
                <section className="w-full max-w-[95%] mx-auto px-2 lg:px-4 pt-12 text-left pb-24 md:pb-12">
                  <div className="flex justify-between items-center w-full mb-5 select-none">
                    <h3 className="text-base md:text-lg font-black tracking-tight text-[#111111]">Trending This Week 🔥</h3>
                    <span className="text-[11px] font-bold text-gray-400 cursor-pointer md:hover:text-marix-teal transition-colors" onClick={() => onNavigateToExplore('Trending', 'All Categories')}>See All</span>
                  </div>
                  <div className="flex overflow-x-auto min-[1025px]:grid min-[1025px]:grid-cols-6 gap-3.5 md:gap-5 pb-3 scrollbar-none snap-x snap-mandatory">
                    {trendingDeck.map((product) => {
                      const primaryImgObj = product.colorVariants?.find(v => v.isMain) || product.colorVariants?.[0];
                      const fallbackImg = product.images?.find(img => img.isCover) || product.images?.[0];
                      const finalTargetSrc = primaryImgObj ? primaryImgObj.imageUrl : (fallbackImg ? fallbackImg.imageUrl : "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&q=80");

                      return (
                        <div key={product.id} className="shrink-0 snap-start max-[599px]:w-[46%] min-[600px]:max-[829px]:w-[31%] min-[830px]:max-[1024px]:w-[23%] min-[1025px]:w-full">
                          <VolcanoCard product={product} targetImageSrc={finalTargetSrc} savedProducts={savedProducts} onToggleSave={setSavedProducts} onProductClick={onProductCardClick} />
                        </div>
                      );
                    })}
                  </div>
                </section>
              </>
            )}

            {/* VIEW B: SAVED ITEMS TAB */}
            {activeTab === 'saved-mobile' && (
              <section className="w-full max-w-[95%] mx-auto px-2 lg:px-4 pt-6 pb-6 flex-1 text-left relative min-h-[55vh]">
                
                {/* SAVED ITEMS HEADER & COUNTER */}
                <div className="border-b border-gray-200/60 pb-4 mb-5 select-none flex items-center justify-between relative z-10">
                  <div className="flex flex-col text-left">
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl md:text-2xl font-black tracking-tight text-[#111111]">Your Saved Items</h2>
                      <span className="text-xs font-black bg-marix-teal/10 text-marix-teal px-2.5 py-0.5 rounded-full">
                        {savedProducts.length} {savedProducts.length === 1 ? 'product saved' : 'products saved'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">Track your favorite bookmarked campus discoveries.</p>
                  </div>
                </div>

                {/* 🚀 FIXED SAVED ITEMS SEARCH INPUT */}
                {savedProducts.length > 0 && (
                  <div className="w-full mb-6 relative z-10">
                    <div className="relative flex items-center w-full max-w-md">
                      <i className="ph ph-magnifying-glass absolute left-3.5 text-gray-400 text-base font-bold"></i>
                      <input 
                        type="text"
                        placeholder="Search saved items..."
                        value={savedSearchQuery}
                        onChange={(e) => setSavedSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') e.target.blur();
                        }}
                        className="w-full bg-white border border-gray-200/80 rounded-xl pl-10 pr-9 py-2.5 text-base md:text-sm text-[#111111] font-medium placeholder:text-gray-400/60 outline-none focus:outline-none focus:ring-0 focus:border-marix-teal shadow-none transition-colors"
                        style={{ outline: 'none', WebkitTapHighlightColor: 'transparent' }}
                      />
                      {savedSearchQuery && (
                        <button 
                          type="button" 
                          onClick={() => setSavedSearchQuery('')}
                          className="absolute right-3 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer p-0.5"
                        >
                          <i className="ph ph-x-circle text-base font-bold"></i>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {savedProducts.length === 0 ? (
                  <div className="w-full py-20 flex flex-col items-center justify-center text-center select-none z-10">
                    <div className="w-16 h-16 rounded-2xl bg-marix-teal/10 text-marix-teal flex items-center justify-center text-3xl mb-4">
                      <i className="ph font-bold ph-heart-break"></i>
                    </div>
                    <h4 className="text-base font-black text-[#111111] tracking-tight">Your saved shelf is empty</h4>
                    <p className="text-xs text-gray-500 max-w-xs leading-relaxed font-medium mt-1 mb-5">
                      Tap the heart icon on cards while browsing to save products.
                    </p>
                    <button onClick={() => handleTabChange('browse')} className="bg-marix-brown hover:bg-marix-brown/95 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all active:scale-95 focus:outline-none cursor-pointer">
                      Explore Products
                    </button>
                  </div>
                ) : filteredSavedProducts.length === 0 ? (
                  <div className="w-full py-12 bg-white border border-gray-200/60 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm max-w-md mx-auto z-10">
                    <i className="ph ph-magnifying-glass-plus text-3xl text-gray-300 mb-2"></i>
                    <h4 className="text-sm font-black text-[#111111]">No matching saved items</h4>
                    <p className="text-xs text-gray-400 font-medium mt-1 mb-4">No saved products matched "{savedSearchQuery}".</p>
                    <button 
                      onClick={() => setSavedSearchQuery('')}
                      className="text-xs font-bold text-marix-teal hover:underline focus:outline-none cursor-pointer"
                    >
                      Clear search
                    </button>
                  </div>
                ) : (
                  <div className="relative z-10">
                    <div className="grid grid-cols-2 min-[600px]:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
                      {filteredSavedProducts.map((product) => {
                        const primaryImg = product.colorVariants?.find(v => v.isMain) || product.colorVariants?.[0];
                        const fallbackImg = product.images?.find(img => img.isCover) || product.images?.[0];
                        const finalTargetSrc = primaryImg ? primaryImg.imageUrl : (fallbackImg ? fallbackImg.imageUrl : "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&q=80");

                        return (
                          <VolcanoCard 
                            key={product.id} 
                            product={product} 
                            targetImageSrc={finalTargetSrc} 
                            savedProducts={savedProducts}
                            onToggleSave={setSavedProducts}
                            onProductClick={onProductCardClick} 
                            isManageMode={false}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* UPLOADS MOUNT */}
            {activeTab === 'uploads' && (
              <div className="w-full flex flex-col items-center justify-start">
                <Uploads 
                  userUploads={userUploads}
                  onEditTrigger={(prod) => {
                    if (typeof setEditingProductData === 'function') {
                      setEditingProductData(prod);
                    }
                  }}
                  onDeleteTrigger={(prod) => setProductToDelete(prod)}
                  onProductCardClick={onProductCardClick}
                />
              </div>
            )}

            {/* VIEW D: NOTIFICATION MODULE */}
            {activeTab === 'notifications' && (
              <section className="w-full max-w-[95%] mx-auto px-2 lg:px-4 pt-6 pb-16 flex-1 text-left relative animate-fadeIn">
                <Notifications 
                  notifications={notifications}
                  firstLetter={firstLetter}
                  onBack={() => handleTabChange(historyFallbackTab)} 
                />
              </section>
            )}

            {/* VIEW E: PROFILE PANEL */}
            {activeTab === 'profile' && (
              <section className="w-full max-w-[95%] mx-auto px-2 lg:px-4 pt-6 pb-16 flex-1 text-left relative">
                <Profile 
                  userName={userName}
                  userEmail={userEmail}
                  userLocation={userLocation}
                  setUserLocation={setUserLocation}
                  onUpdateUserName={onUpdateUserName}
                  onNavigateTab={(targetTab) => handleTabChange(targetTab)}
                  onLogOut={onSignOut}
                  forcedView={profileSubView}
                  setForcedView={setProfileSubView}
                  isSeller={hasCompletedSellerOnboarding}
                  onBecomeSellerTrigger={onBecomeSellerTrigger}
                  shopDetails={shopDetails}
                  activeUploadsCount={activeUploadsCount}
                  setShopDetails={setShopDetails}
                  onOpenCreateListingModal={onOpenCreateListingModal}
                  recentlyViewed={recentlyViewed} 
                  onProductCardClick={onProductCardClick}
                  savedProducts={savedProducts}
                  onToggleSave={setSavedProducts}
                />
              </section>
            )}

          </div>
        </div>

        {activeTab === 'browse' ? (
          <footer className="w-full bg-white border-t border-gray-200/80 py-10 select-none text-left text-[#111111] mt-auto relative z-20 shrink-0">
            <div className="max-w-[95%] mx-auto px-2 lg:px-4">
              <div className="grid grid-cols-2 md:grid-cols-12 gap-8 md:gap-6">
                <div className="col-span-2 md:col-span-4 flex flex-col gap-2.5">
                  <div className="flex items-center cursor-pointer w-fit" onClick={() => handleTabChange('browse')}>
                    <span style={{ fontSize: '1.2rem', color: '#452b1f', fontWeight: '800', letterSpacing: '2px' }} className="tracking-tight"><span className="text-marix-teal">MARIX</span></span>
                  </div>
                  <p className="text-xs text-gray-500 font-medium max-w-xs leading-relaxed">Campus Marketplace built for students.</p>
                </div>
                <div className="col-span-1 md:col-span-2 flex flex-col gap-3">
                  <h4 className="text-xs font-black tracking-wider text-gray-400 uppercase">Explore</h4>
                  <ul className="flex flex-col gap-2 text-xs font-bold text-gray-600">
                    <li className="hover:text-marix-teal cursor-pointer transition-colors" onClick={() => onNavigateToExplore('All', 'All Categories')}>Products</li>
                    <li className="hover:text-marix-teal cursor-pointer transition-colors" onClick={() => onNavigateToView('how-it-works')}>How it Works</li>
                  </ul>
                </div>
                <div className="col-span-1 md:col-span-2 flex flex-col gap-3">
                  <h4 className="text-xs font-black tracking-wider text-gray-400 uppercase">Sellers</h4>
                  <ul className="flex flex-col gap-2 text-xs font-bold text-gray-600">
                    <li className="text-gray-400 cursor-not-allowed flex items-center gap-1"><span>Pricing</span><span className="text-[9px] bg-marix-cream text-[#452b1f] px-1.5 py-0.5 rounded-full font-black scale-90">Soon</span></li>
                    <li className="hover:text-marix-teal cursor-pointer transition-colors"><a href="https://whatsapp.com/channel/0029Vb83DEN4IBhAifBHRU19" target="_blank" rel="noopener noreferrer">Community</a></li>
                  </ul>
                </div>
                <div className="col-span-1 md:col-span-2 flex flex-col gap-3">
                  <h4 className="text-xs font-black tracking-wider text-gray-400 uppercase">Company</h4>
                  <ul className="flex flex-col gap-2 text-xs font-bold text-gray-600">
                    <li className="hover:text-marix-teal cursor-pointer transition-colors" onClick={() => onNavigateToView('faq')}>FAQs</li>
                    <li className="hover:text-marix-teal cursor-pointer transition-colors" onClick={() => onNavigateToView('about')}>About</li>
                    <li className="hover:text-marix-teal cursor-pointer transition-colors"><a href="tel:07069563733">Contact</a></li>
                  </ul>
                </div>
                <div className="col-span-1 md:col-span-2 flex flex-col gap-3">
                  <h4 className="text-xs font-black tracking-wider text-gray-400 uppercase">Legal</h4>
                  <ul className="flex flex-col gap-2 text-xs font-bold text-gray-600">
                    <li className="hover:text-marix-teal cursor-pointer transition-colors" onClick={() => onNavigateToView('privacy')}>Privacy Policy</li>
                    <li className="hover:text-marix-teal cursor-pointer transition-colors" onClick={() => onNavigateToView('terms')}>Terms of Use</li>
                  </ul>
                </div>
              </div>
              <div className="w-full text-center text-[11px] text-gray-400 font-bold tracking-tight pt-8 mt-8 border-t border-gray-100">
                <span>&copy; {new Date().getFullYear()} <span className="text-marix-teal font-bold">Marix</span>. Built for Campus Commerce.</span>
              </div>
            </div>
          </footer>
        ) : (
          <footer className="w-full bg-marix-cream border-t bg-white border-gray-200/30 py-6 text-center select-none mt-auto z-20 shrink-0 pb-[24px] md:pb-8">
            <p className="text-[11px] font-bold text-gray-400 tracking-tight">&copy; {new Date().getFullYear()} <span className="text-marix-teal font-bold">Marix</span>. Built for Campus Commerce.</p>
          </footer>
        )}

      </div>

      {/* Mobile Bottom Navigation Layout Bars */}
      {isLoggedIn && (
        <div className={`md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 pt-1 z-50 flex items-center justify-around select-none shadow-[0_-4px_12px_rgba(0,0,0,0.05)] pb-[calc(env(safe-area-inset-bottom)+8px)] transition-transform duration-300 ${isAtAbsoluteBottom ? 'translate-y-full' : 'translate-y-0'}`}>
          <button onClick={() => handleTabChange('browse')} className={`flex flex-col items-center gap-0.5 py-1 focus:outline-none cursor-pointer ${activeTab === 'browse' ? 'text-marix-teal' : 'text-gray-400'}`}>
            <i className="ph ph-house text-xl"></i><span className="text-[10px] font-bold">Home</span>
          </button>
          <button onClick={() => onNavigateToExplore('All', 'All Categories')} className="flex flex-col items-center gap-0.5 py-1 text-gray-400 focus:outline-none cursor-pointer">
            <i className="ph ph-squares-four text-xl"></i><span className="text-[10px] font-bold">Browse</span>
          </button>
          <button onClick={() => setShowCreateModal(!showCreateModal)} className="w-11 h-11 rounded-full bg-marix-brown text-white flex items-center justify-center shadow-md active:scale-90 transition-transform duration-300 -translate-y-2.5 border-4 border-marix-cream focus:outline-none cursor-pointer z-50">
            <div className={`transition-transform duration-300 transform flex items-center justify-center ${showCreateModal ? 'rotate-90 scale-110' : 'rotate-0'}`}><i className="ph font-black text-xl ph-plus"></i></div>
          </button>
          <button onClick={() => handleTabChange('uploads')} className={`flex flex-col items-center gap-0.5 py-1 focus:outline-none cursor-pointer ${activeTab === 'uploads' ? 'text-marix-teal' : 'text-gray-400'}`}>
            <i className="ph ph-tray text-xl"></i><span className="text-[10px] font-bold">Uploads</span>
          </button>
          <button onClick={() => handleTabChange('profile')} className={`flex flex-col items-center gap-0.5 py-1 focus:outline-none cursor-pointer ${activeTab === 'profile' ? 'text-marix-teal' : 'text-gray-400'}`}>
            <i className="ph ph-user text-xl"></i><span className="text-[10px] font-bold">Profile</span>
          </button>
        </div>
      )}

      {showBackToTop && !showCreateModal && (
        <button
          onClick={handleFastScrollToTop}
          className="fixed bottom-24 right-5 w-12 h-12 bg-marix-brown text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all z-[100] focus:outline-none cursor-pointer"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
          </svg>
        </button>
      )}

      {/* DELETE LISTING MODAL */}
      {productToDelete && (
        <div className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-[4px] flex items-center justify-center p-4 select-none animate-fadeIn">
          <div className="w-full max-w-[320px] bg-white p-6 rounded-2xl border border-gray-100 shadow-2xl text-center flex flex-col items-center animate-scaleIn">
            <div className="w-12 h-12 rounded-full bg-marix-teal/5 text-marix-teal flex items-center justify-center text-xl mb-3.5">
              <i className="ph ph-warning-circle font-bold"></i>
            </div>
            <h3 className="text-sm font-black text-[#111111] tracking-tight">Delete Listing?</h3>
            <p className="text-xs text-gray-500 max-w-[240px] mt-1.5 leading-relaxed font-semibold">
              Are you sure you want to delete <span className="text-[#111111] font-black">"{productToDelete.productTitle}"</span>? This action cannot be undone.
            </p>
            
            <div className="grid grid-cols-2 gap-3 w-full mt-6">
              <button 
                onClick={() => setProductToDelete(null)}
                className="w-full bg-marix-teal/10 hover:bg-marix-teal/20 text-marix-teal font-black text-xs py-3 rounded-xl transition-colors focus:outline-none cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={executeLocalDelete}
                className="w-full bg-marix-brown hover:opacity-95 text-white font-black text-xs py-3 rounded-xl shadow-md transition-all focus:outline-none cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function VolcanoCard({ product, targetImageSrc, savedProducts = [], onToggleSave, onProductClick, isManageMode, onDeleteTrigger, onEditTrigger }) {
  const isLiked = savedProducts && Array.isArray(savedProducts) ? savedProducts.some(p => p.id === product.id) : false;
  const cleanCampusName = product.campus ? product.campus.split(',')[0].trim() : 'Campus';

  return (
    <div 
      onClick={() => {
        if (!isManageMode && onProductClick) onProductClick(product);
      }} 
      className={`w-full relative transition-transform duration-200 flex flex-col gap-y-1 select-none group bg-white p-1.5 rounded-[18px] border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.01)] text-left ${isManageMode ? 'cursor-default' : 'cursor-pointer hover:scale-[1.01] active:scale-[0.99]'}`}
    >
      <div className="w-full aspect-square rounded-[12px] overflow-hidden bg-marix-cream/40 relative shrink-0">
        <img src={targetImageSrc} alt={product.productTitle} className="w-full h-full object-cover animate-fadeIn" loading="lazy" />

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
          <h4 className="text-[11px] sm:text-xs md:text-sm font-semibold text-[#111111] truncate tracking-tight mt-1">{product.productTitle}</h4>
          <div className="flex items-center gap-x-1 text-[9px] sm:text-[10px] md:text-[11px] text-[#111111]/45 font-bold min-w-0 mt-[2px]">
            <span className="flex items-center gap-x-0.5 min-w-0 max-w-[50%]"><i className="ph ph-storefront text-xs text-[#111111]/35 shrink-0"></i><span className="truncate">{product.shopName}</span></span>
            <span className="text-[#111111]/20 select-none">•</span>
            <span className="flex items-center gap-x-0.5 min-w-0 flex-1"><i className="ph ph-map-pin text-xs text-[#111111]/35 shrink-0"></i><span className="truncate">{cleanCampusName}</span></span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-gray-100/50 shrink-0">
          <span className="text-[11px] sm:text-xs md:text-sm font-black text-marix-teal tracking-tight">{product.price}</span>
          <button 
            type="button" 
            disabled={isManageMode}
            onClick={(e) => { 
              e.stopPropagation(); 
              if (onToggleSave) onToggleSave(product); 
            }} 
            className={`w-[26px] h-[26px] sm:w-7 sm:h-7 rounded-full border flex items-center justify-center bg-white focus:outline-none transition-colors ${isManageMode ? 'opacity-30 cursor-not-allowed border-gray-100 text-gray-300' : 'active:scale-90 cursor-pointer ' + (isLiked ? 'border-marix-teal text-marix-teal' : 'border-gray-200 text-[#111111]/40')}`}
          >
            <svg className="w-[11px] h-[11px] sm:w-[13px] sm:h-[13px]" viewBox="0 0 24 24" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}