import React, { useState, useEffect, useRef } from 'react';
import marixLogoM from '../images/marix-logo-m.png';
import Navbar from '../components/Navbar';

export default function Homepage({ 
  products = [], 
  setProducts,
  isLoggedIn, 
  setIsLoggedIn, 
  userName,
  showCreateModal,
  setShowCreateModal,
  activeTab,       
  setActiveTab,    
  userUploads,     
  savedProducts = [],
  setSavedProducts,
  onNavigateToLogin, 
  onNavigateToSignup,
  onNavigateToExplore,
  onNavigateToView,
  activeSearchTerm,
  setActiveSearchTerm
}) {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isAtAbsoluteBottom, setIsAtAbsoluteBottom] = useState(false); 
  const scrollContainerRef = useRef(null);

  const handleTabChange = (newTab) => {
    if (!newTab) return;
    
    if (scrollContainerRef.current) {
      sessionStorage.setItem(`marix_scroll_${activeTab}`, scrollContainerRef.current.scrollTop);
    }

    if (newTab === 'explore') {
      if (onNavigateToExplore) onNavigateToExplore();
      return;
    }
    
    setActiveTab(newTab);
  };

  useEffect(() => {
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

    if (activeTab === 'browse') {
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

    function easeOutQuad(t) {
      return t * (2 - t);
    }

    function animateStep(currentTime) {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      
      container.scrollTop = startPosition * (1 - easeOutQuad(progress));

      if (progress < 1) {
        window.requestAnimationFrame(animateStep);
      }
    }

    window.requestAnimationFrame(animateStep);
  };

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

  const defaultFeaturedProducts = [
    { id: 'f-1', productTitle: 'Shawarma Deluxe Combo', price: '₦2,000', shopName: 'Melts & Bites', campus: 'ABSU, Uturu', colorVariants: [{ isMain: true, imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80' }] },
    { id: 'f-2', productTitle: 'Vintage Denim Jacket', price: '₦12,500', shopName: 'ThriftByFaith', campus: 'ABSU, Uturu', colorVariants: [{ isMain: true, imageUrl: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500&q=80' }] },
    { id: 'f-3', productTitle: 'Acoustic Guitar (Natural)', price: '₦45,000', shopName: 'Strings Plug', campus: 'IMSU, Owerri', colorVariants: [{ isMain: true, imageUrl: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=500&q=80' }] },
    { id: 'f-4', productTitle: 'Anker PowerBank 20k', price: '₦18,000', shopName: 'Gadget Vault', campus: 'FUTO, Owerri', colorVariants: [{ isMain: true, imageUrl: 'https://images.unsplash.com/photo-1609592424109-dd9892f1b177?w=500&q=80' }] },
    { id: 'f-5', productTitle: 'Silver Cuban Link Chain', price: '₦4,500', shopName: 'Ice Palace', campus: 'ABSU, Uturu', colorVariants: [{ isMain: true, imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&q=80' }] },
    { id: 'f-6', productTitle: 'Mattress Protector Pack', price: '₦7,500', shopName: 'Bed Bedding Depot', campus: 'UniAbuja', colorVariants: [{ isMain: true, imageUrl: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&q=80' }] }
  ];

  const defaultTrendingProducts = [
    { id: 't-1', productTitle: 'Nike Air Force 1 Retro', price: '₦28,500', shopName: 'KicksPlug', campus: 'FUTO, Owerri', colorVariants: [{ isMain: true, imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80' }] },
    { id: 't-2', productTitle: 'AirPods Pro 2nd Gen', price: '₦35,000', shopName: 'Apple Hub', campus: 'ABSU, Uturu', colorVariants: [{ isMain: true, imageUrl: 'https://images.unsplash.com/photo-1588449668365-d15e397f6787?w=500&q=80' }] },
    { id: 't-3', productTitle: 'Minimalist Leather Watch', price: '₦14,000', shopName: 'Chrono Studio', campus: 'IMSU, Owerri', colorVariants: [{ isMain: true, imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&q=80' }] },
    { id: 't-4', productTitle: 'Victoria Secret Scented', price: '₦12,000', shopName: 'Glow Essence', campus: 'UniAbuja', colorVariants: [{ isMain: true, imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&q=80' }] },
    { id: 't-5', productTitle: 'Mechanical Keyboard RGB', price: '₦22,500', shopName: 'Tech Central', campus: 'FUTO, Owerri', colorVariants: [{ isMain: true, imageUrl: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=500&q=80' }] },
    { id: 't-6', productTitle: 'Oversized Cotton Hoodie', price: '₦8,000', shopName: 'StreetWear Co', campus: 'ABSU, Uturu', colorVariants: [{ isMain: true, imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&q=80' }] }
  ];

  const featuredDeck = products.length > 0 ? products.slice(0, 6) : defaultFeaturedProducts;
  const trendingDeck = products.length > 0 ? products.slice(6, 12) : defaultTrendingProducts;

  const currentTabItemsList = activeTab === 'saved-mobile' ? savedProducts : userUploads;

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
        `}</style>
        
        <div className="w-full flex-1 flex flex-col">
          
          <Navbar 
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
            userName={userName}
            activeTab={activeTab}
            handleTabChange={handleTabChange}
            savedCount={savedProducts.length}
            showCreateModal={showCreateModal}
            setShowCreateModal={setShowCreateModal}
            onNavigateToLogin={onNavigateToLogin}
            onNavigateToSignup={onNavigateToSignup}
            activeSearchTerm={activeSearchTerm}
            setActiveSearchTerm={setActiveSearchTerm}
            onNavigateToExplore={onNavigateToExplore}
          />

          <div className="w-full pt-[4px] md:pt-[84px] flex-1 flex flex-col">
            
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
                    <p className="text-xs md:text-sm text-gray-600 max-w-md leading-relaxed font-medium">
                      Find amazing products from trusted campus sellers. Chat directly on WhatsApp. It's that easy.
                    </p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <button onClick={onNavigateToExplore} className="bg-marix-brown text-white font-bold text-xs md:text-sm px-5 py-3 rounded-xl shadow-md hover:opacity-95 transition-opacity flex items-center gap-2 focus:outline-none">
                        Explore Products <span>→</span>
                      </button>
                      <button onClick={() => isLoggedIn ? setShowCreateModal(true) : onNavigateToLogin()} className="bg-white border border-gray-200 text-[#111111] font-bold text-xs md:text-sm px-5 py-3 rounded-xl shadow-sm hover:bg-gray-50 transition-colors focus:outline-none">
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

                    <div className="hidden min-[1025px]:block w-full h-full relative">
                      <div className="absolute top-[6%] left-[2%] w-[155px] bg-white p-2 rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.04)] border border-gray-100/60 transform -rotate-[6deg] hover:-translate-y-2 hover:rotate-0 hover:z-30 transition-all duration-300 ease-out">
                        <div className="w-full aspect-square rounded-xl bg-gray-50 overflow-hidden mb-1.5"><img src={showcaseItems[0].img} alt="" className="w-full h-full object-cover" /></div>
                        <h5 className="text-xs font-bold text-[#111111] truncate">{showcaseItems[0].name}</h5>
                        <span className="text-xs font-black text-marix-teal">{showcaseItems[0].price}</span>
                      </div>
                      <div className="absolute top-[0%] left-[44%] w-[165px] bg-white p-2 rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.05)] border border-gray-100/60 transform rotate-[4deg] hover:-translate-y-2 hover:rotate-0 hover:z-30 transition-all duration-300 ease-out z-10">
                        <div className="w-full aspect-square rounded-xl bg-gray-50 overflow-hidden mb-1.5"><img src={showcaseItems[1].img} alt="" className="w-full h-full object-cover" /></div>
                        <h5 className="text-xs font-bold text-[#111111] truncate">{showcaseItems[1].name}</h5>
                        <span className="text-xs font-black text-marix-teal">{showcaseItems[1].price}</span>
                      </div>
                      <div className="absolute top-[14%] right-[2%] w-[145px] bg-white p-2 rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.04)] border border-gray-100/60 transform -rotate-[3deg] hover:-translate-y-2 hover:rotate-0 hover:z-30 transition-all duration-300 ease-out">
                        <div className="w-full aspect-square rounded-xl bg-gray-50 overflow-hidden mb-1.5"><img src={showcaseItems[2].img} alt="" className="w-full h-full object-cover" /></div>
                        <h5 className="text-xs font-bold text-[#111111] truncate">{showcaseItems[2].name}</h5>
                        <span className="text-xs font-black text-marix-teal">{showcaseItems[2].price}</span>
                      </div>
                      <div className="absolute top-[44%] left-[28%] w-[165px] bg-white p-2 rounded-2xl shadow-[0_16px_36px_rgba(69,43,31,0.08)] border border-gray-100 transform -rotate-[2deg] hover:-translate-y-2 hover:rotate-0 hover:z-30 transition-all duration-300 ease-out z-20">
                        <div className="w-full aspect-square rounded-xl bg-gray-50 overflow-hidden mb-1.5"><img src={showcaseItems[3].img} alt="" className="w-full h-full object-cover" /></div>
                        <h5 className="text-xs font-bold text-[#111111] truncate">{showcaseItems[3].name}</h5>
                        <span className="text-xs font-black text-marix-teal">{showcaseItems[3].price}</span>
                      </div>
                      <div className="absolute bottom-[4%] left-[4%] w-[145px] bg-white p-2 rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.04)] border border-gray-100/60 transform rotate-[5deg] hover:-translate-y-2 hover:rotate-0 hover:z-30 transition-all duration-300 ease-out">
                        <div className="w-full aspect-square rounded-xl bg-gray-50 overflow-hidden mb-1.5"><img src={showcaseItems[4].img} alt="" className="w-full h-full object-cover" /></div>
                        <h5 className="text-xs font-bold text-[#111111] truncate">{showcaseItems[4].name}</h5>
                        <span className="text-xs font-black text-marix-teal">{showcaseItems[4].price}</span>
                      </div>
                      <div className="absolute bottom-[6%] right-[4%] w-[145px] bg-white p-2 rounded-2xl shadow-[0_10px_28px_rgba(0,0,0,0.05)] border border-gray-100/60 transform -rotate-[4deg] hover:-translate-y-2 hover:rotate-0 hover:z-30 transition-all duration-300 ease-out z-10">
                        <div className="w-full aspect-square rounded-xl bg-gray-50 overflow-hidden mb-1.5"><img src={showcaseItems[5].img} alt="" className="w-full h-full object-cover" /></div>
                        <h5 className="text-xs font-bold text-[#111111] truncate">{showcaseItems[5].name}</h5>
                        <span className="text-xs font-black text-marix-teal">{showcaseItems[5].price}</span>
                      </div>
                    </div>
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

                {/* Featured Cards */}
                <section className="w-full max-w-[95%] mx-auto px-2 lg:px-4 py-6 text-left">
                  <div className="flex justify-between items-center w-full mb-5 select-none">
                    <h3 className="text-base md:text-lg font-black tracking-tight text-[#111111]">Featured Products</h3>
                    <span className="text-[11px] font-bold text-gray-400 cursor-pointer" onClick={onNavigateToExplore}>See All</span>
                  </div>
                  <div className="flex overflow-x-auto min-[1025px]:grid min-[1025px]:grid-cols-6 gap-3.5 md:gap-5 pb-3 scrollbar-none snap-x snap-mandatory">
                    {featuredDeck.map((product) => {
                      const primaryImgObj = product.colorVariants?.find(v => v.isMain) || product.colorVariants?.[0];
                      return (
                        <div key={product.id} className="shrink-0 snap-start max-[599px]:w-[46%] min-[600px]:max-[829px]:w-[31%] min-[830px]:max-[1024px]:w-[23%] min-[1025px]:w-full">
                          <VolcanoCard product={product} targetImageSrc={primaryImgObj ? primaryImgObj.imageUrl : "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&q=80"} savedProducts={savedProducts} onToggleSave={setSavedProducts} />
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* Categories */}
                <section className="w-full max-w-[95%] mx-auto px-2 lg:px-4 py-6 text-left">
                  <h3 className="text-base md:text-lg font-black tracking-tight text-[#111111] mb-4 select-none">Explore by Category</h3>
                  <div className="grid grid-cols-4 min-[1025px]:grid-cols-8 gap-2.5 md:gap-3 select-none">
                    {categories.map((cat, i) => (
                      <div key={i} onClick={onNavigateToExplore} className="bg-white p-3 rounded-xl border border-gray-200/60 text-center flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm active:scale-98 group">
                        <div className="w-10 h-10 rounded-xl bg-marix-teal/10 text-marix-teal flex items-center justify-center text-xl">
                          <i className={`ph ${cat.iconClass} font-bold`}></i>
                        </div>
                        <span className="text-[10px] md:text-xs font-bold text-[#111111] truncate max-w-full">{cat.name}</span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Trending Feed */}
                <section className="w-full max-w-[95%] mx-auto px-2 lg:px-4 py-6 text-left pb-24 md:pb-12">
                  <div className="flex justify-between items-center w-full mb-5 select-none">
                    <h3 className="text-base md:text-lg font-black tracking-tight text-[#111111]">Trending This Week 🔥</h3>
                    <span className="text-[11px] font-bold text-gray-400 cursor-pointer" onClick={onNavigateToExplore}>See All</span>
                  </div>
                  <div className="flex overflow-x-auto min-[1025px]:grid min-[1025px]:grid-cols-6 gap-3.5 md:gap-5 pb-3 scrollbar-none snap-x snap-mandatory">
                    {trendingDeck.map((product) => {
                      const primaryImgObj = product.colorVariants?.find(v => v.isMain) || product.colorVariants?.[0];
                      return (
                        <div key={product.id} className="shrink-0 snap-start max-[599px]:w-[46%] min-[600px]:max-[829px]:w-[31%] min-[830px]:max-[1024px]:w-[23%] min-[1025px]:w-full">
                          <VolcanoCard product={product} targetImageSrc={primaryImgObj ? primaryImgObj.imageUrl : "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&q=80"} savedProducts={savedProducts} onToggleSave={setSavedProducts} />
                        </div>
                      );
                    })}
                  </div>
                </section>
              </>
            )}

            {/* Uploads and Profile Tabs View Frame Sections */}
            {(activeTab === 'uploads' || activeTab === 'saved-mobile') && (
              <section className="w-full max-w-[95%] mx-auto px-2 lg:px-4 pt-6 pb-6 flex-1 text-left relative min-h-[55vh]">
                <div className="border-b border-gray-200/60 pb-4 mb-6 select-none relative z-10">
                  <h2 className="text-xl md:text-2xl font-black tracking-tight text-[#111111]">
                    {activeTab === 'saved-mobile' ? 'Your Saved Items' : 'Your Listings'}
                  </h2>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">
                    {activeTab === 'saved-mobile' ? 'Track your favorite bookmarked campus discoveries.' : 'Manage and view your live product listings on campus.'}
                  </p>
                </div>

                {currentTabItemsList.length === 0 ? (
                  <div className="w-full py-20 flex flex-col items-center justify-center text-center select-none z-10">
                    <div className="w-16 h-16 rounded-2xl bg-marix-teal/10 text-marix-teal flex items-center justify-center text-3xl mb-4">
                      <i className={`ph font-bold ${activeTab === 'saved-mobile' ? 'ph-heart-break' : 'ph-tray'}`}></i>
                    </div>
                    <h4 className="text-base font-black text-[#111111] tracking-tight">
                      {activeTab === 'saved-mobile' ? 'Your saved shelf is empty' : 'No active uploads found'}
                    </h4>
                    <p className="text-xs text-gray-500 max-w-xs leading-relaxed font-medium mt-1 mb-5">
                      {activeTab === 'saved-mobile' ? 'Tap the heart icon on cards while browsing to save products you want to keep track of here.' : "You haven't posted any items yet. Create your first marketplace entry to showcase products to campus shoppers instantly."}
                    </p>
                    <button onClick={() => activeTab === 'saved-mobile' ? handleTabChange('browse') : setShowCreateModal(true)} className="bg-marix-brown hover:bg-marix-brown/95 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all active:scale-95 focus:outline-none">
                      {activeTab === 'saved-mobile' ? 'Explore Products' : 'List your products'}
                    </button>
                  </div>
                ) : (
                  <div className="relative z-10">
                    <div className="grid grid-cols-2 min-[600px]:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
                      {currentTabItemsList.map((product) => {
                        const primaryImg = product.colorVariants?.find(v => v.isMain) || product.colorVariants?.[0];
                        return (
                          <VolcanoCard 
                            key={product.id} 
                            product={product} 
                            targetImageSrc={primaryImg ? primaryImg.imageUrl : "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&q=80"} 
                            savedProducts={savedProducts}
                            onToggleSave={setSavedProducts}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}
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
                    <li className="hover:text-marix-teal cursor-pointer transition-colors" onClick={() => handleTabChange('browse')}>Products</li>
                    <li className="hover:text-marix-teal cursor-pointer transition-colors" onClick={onNavigateToExplore}>Categories</li>
                    <li className="hover:text-marix-teal cursor-pointer transition-colors" onClick={() => onNavigateToView('about')}>How it Works</li>
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
          <footer className="w-full bg-white border-t border-gray-100 py-6 text-center select-none mt-auto z-20 shrink-0 pb-[24px] md:pb-8">
            <p className="text-[11px] font-bold text-gray-400 tracking-tight">&copy; {new Date().getFullYear()} <span className="text-marix-teal font-bold">Marix</span>. Built for Campus Commerce.</p>
          </footer>
        )}

      </div>

      {/* Mobile Bottom Navigation Layout Bars */}
      {isLoggedIn && (
        <div className={`md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 pt-1 z-50 flex items-center justify-around select-none shadow-[0_-4px_12px_rgba(0,0,0,0.05)] pb-[calc(env(safe-area-inset-bottom)+8px)] transition-transform duration-300 ${isAtAbsoluteBottom ? 'translate-y-full' : 'translate-y-0'}`}>
          <button onClick={() => handleTabChange('browse')} className={`flex flex-col items-center gap-0.5 py-1 focus:outline-none ${activeTab === 'browse' ? 'text-marix-teal' : 'text-gray-400'}`}>
            <i className="ph ph-house text-xl"></i><span className="text-[10px] font-bold">Home</span>
          </button>
          <button onClick={onNavigateToExplore} className="flex flex-col items-center gap-0.5 py-1 text-gray-400 focus:outline-none">
            <i className="ph ph-squares-four text-xl"></i><span className="text-[10px] font-bold">Browse</span>
          </button>
          <button onClick={() => setShowCreateModal(!showCreateModal)} className="w-11 h-11 rounded-full bg-marix-brown text-white flex items-center justify-center shadow-md active:scale-90 transition-transform duration-300 -translate-y-2.5 border-4 border-marix-cream focus:outline-none z-50">
            <div className={`transition-transform duration-300 transform flex items-center justify-center ${showCreateModal ? 'rotate-90 scale-110' : 'rotate-0'}`}><i className="ph font-black text-xl ph-plus"></i></div>
          </button>
          <button onClick={() => handleTabChange('uploads')} className={`flex flex-col items-center gap-0.5 py-1 focus:outline-none ${activeTab === 'uploads' ? 'text-marix-teal' : 'text-gray-400'}`}>
            <i className="ph ph-tray text-xl"></i><span className="text-[10px] font-bold">Uploads</span>
          </button>
          <button onClick={() => handleTabChange('saved-mobile')} className={`flex flex-col items-center gap-0.5 py-1 focus:outline-none ${activeTab === 'saved-mobile' ? 'text-marix-teal' : 'text-gray-400'}`}>
            <i className="ph ph-user text-xl"></i><span className="text-[10px] font-bold">Profile</span>
          </button>
        </div>
      )}

      {/* FIXED UP-ARROW ACTION */}
      {showBackToTop && !showCreateModal && (
        <button
          onClick={handleFastScrollToTop}
          className="fixed bottom-24 right-5 w-12 h-12 bg-marix-brown text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all z-[100] focus:outline-none cursor-pointer"
          aria-label="Scroll back to top fast"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
          </svg>
        </button>
      )}

    </div>
  );
}

function VolcanoCard({ product, targetImageSrc, savedProducts, onToggleSave }) {
  const isLiked = savedProducts.some(p => p.id === product.id);
  const cleanCampusName = product.campus ? product.campus.split(',')[0].trim() : 'Campus';

  return (
    <div className="w-full flex flex-col gap-y-1 select-none group bg-white p-1.5 rounded-[18px] border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.01)] transition-all duration-300 ease-out text-left">
      <div className="w-full aspect-square rounded-[12px] overflow-hidden bg-marix-cream/40 relative shrink-0">
        <img src={targetImageSrc} alt={product.productTitle} className="w-full h-full object-cover" loading="lazy" />
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
          <button type="button" onClick={(e) => { e.stopPropagation(); onToggleSave(product); }} className={`w-[26px] h-[26px] sm:w-7 sm:h-7 rounded-full border flex items-center justify-center bg-white active:scale-90 focus:outline-none transition-colors ${isLiked ? 'border-marix-teal text-marix-teal' : 'border-gray-200 text-[#111111]/40'}`}>
            <svg className="w-[11px] h-[11px] sm:w-[13px] sm:h-[13px]" viewBox="0 0 24 24" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}