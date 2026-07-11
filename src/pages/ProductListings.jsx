import React, { useState, useMemo, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import { initialProducts } from '../data/products';

const allCampusesList = ["Absu, Uturu", "Imsu, Owerri", "Futo, Owerri", "UniUyo, Uyo", "UniPort, Harcourt"];
const allCategoriesList = ["Fashion", "Footwears", "Gadgets", "Accessories", "Beauty", "Food & Snacks", "Home & Kitchen", "Other"];

const baseline = [...(initialProducts || [])];
for (let i = baseline.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [baseline[i], baseline[j]] = [baseline[j], baseline[i]];
}
const staticShuffledProducts = baseline;

export default function ProductListings({ 
  isLoggedIn, 
  setIsLoggedIn,
  userName, 
  onNavigateHome, 
  savedProducts = [], 
  setSavedProducts, 
  showCreateModal,
  setShowCreateModal,
  onNavigateToLogin,
  onNavigateToSignup,
  onNavigateToUploadsTab,
  onNavigateToSavedTab,
  activeSearchTerm = "",
  setActiveSearchTerm,
  recentSearches = [],
  setRecentSearches
}) {
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isAtAbsoluteBottom, setIsAtAbsoluteBottom] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const scrollContainerRef = useRef(null);

  const [stagedCategory, setStagedCategory] = useState('All Categories');
  const [stagedCondition, setStagedCondition] = useState('');
  const [stagedCampuses, setStagedCampuses] = useState([]);
  const [priceMax, setPriceMax] = useState(500000);

  const [activeCategory, setActiveCategory] = useState('All Categories');
  const [activeCondition, setActiveCondition] = useState('');
  const [activeCampuses, setActiveCampuses] = useState([]);
  const [activePriceMax, setActivePriceMax] = useState(500000);

  const [sortBy, setSortBy] = useState('Newest');
  const [visibleCount, setVisibleCount] = useState(20);

  const handleContainerScrollPhysics = (e) => {
    const target = e.currentTarget;
    const currentScrollY = target.scrollTop;
    const containerHeight = target.clientHeight;
    const totalContentHeight = target.scrollHeight;

    sessionStorage.setItem('marix_explore_scroll_pos', currentScrollY);
    setShowScrollTop(currentScrollY > 300);

    // Optimized threshold calculation to catch bottom touch seamlessly
    if (containerHeight + currentScrollY >= totalContentHeight - 40) {
      setIsAtAbsoluteBottom(true);
    } else {
      setIsAtAbsoluteBottom(false);
    }
  };

  useEffect(() => {
    const savedScrollPos = sessionStorage.getItem('marix_explore_scroll_pos');
    if (savedScrollPos && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = parseInt(savedScrollPos, 10);
    }
  }, []);

  useEffect(() => {
    if (activeSearchTerm) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        setIsSearching(false);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setIsSearching(false);
    }
  }, [activeSearchTerm]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (activeCategory !== 'All Categories') count++;
    if (activeCondition) count++;
    if (activeCampuses.length > 0) count += activeCampuses.length;
    if (activePriceMax !== 500000) count++;
    return count;
  }, [activeCategory, activeCondition, activeCampuses, activePriceMax]);

  const filteredProducts = useMemo(() => {
    let result = [...staticShuffledProducts];

    if (activeSearchTerm && activeSearchTerm.trim()) {
      const query = activeSearchTerm.toLowerCase().trim();
      result = result.filter(product => (
        (product.productTitle || "").toLowerCase().includes(query) ||
        (product.description || "").toLowerCase().includes(query) ||
        (product.category || "").toLowerCase().includes(query) ||
        (product.shopName || "").toLowerCase().includes(query) ||
        (product.condition || "").toLowerCase().includes(query) ||
        (product.campus || "").toLowerCase().includes(query)
      ));
    }

    if (activeCategory !== 'All Categories') {
      result = result.filter(product => product.category === activeCategory);
    }
    if (activeCondition) {
      result = result.filter(product => product.condition === activeCondition);
    }
    if (activeCampuses.length > 0) {
      result = result.filter(product => activeCampuses.includes(product.campus));
    }
    
    result = result.filter(product => {
      const numericPrice = parseInt(product.price.replace(/[^\d]/g, ''), 10);
      return numericPrice <= activePriceMax;
    });

    if (sortBy === 'Newest') result.sort((a, b) => b.id - a.id);
    else if (sortBy === 'Oldest') result.sort((a, b) => a.id - b.id);
    else if (sortBy === 'Price: Low to High') result.sort((a, b) => parseInt(a.price.replace(/[^\d]/g, ''), 10) - parseInt(b.price.replace(/[^\d]/g, ''), 10));
    else if (sortBy === 'Price: High to Low') result.sort((a, b) => parseInt(b.price.replace(/[^\d]/g, ''), 10) - parseInt(a.price.replace(/[^\d]/g, ''), 10));

    return result;
  }, [activeSearchTerm, activeCategory, activeCondition, activeCampuses, activePriceMax, sortBy]);

  const paginatedProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);

  // 🚀 DYNAMIC RECOMMENDATION LOGIC: Filter recommendations based on active search categories
  const recommendedProducts = useMemo(() => {
    if (activeSearchTerm.trim() && filteredProducts.length > 0) {
      const detectedCategory = filteredProducts[0].category;
      const sameCategoryProducts = staticShuffledProducts.filter(
        product => product.category === detectedCategory
      );
      return sameCategoryProducts.slice(0, 6);
    }
    return staticShuffledProducts.slice(22, 28);
  }, [activeSearchTerm, filteredProducts]);

  const handleApplyFilters = () => {
    setActiveCategory(stagedCategory);
    setActiveCondition(stagedCondition);
    setActiveCampuses(stagedCampuses);
    setActivePriceMax(priceMax);
    setVisibleCount(20);
    setIsFilterDrawerOpen(false);
  };

  const handleResetFilters = () => {
    setStagedCategory('All Categories');
    setStagedCondition('');
    setStagedCampuses([]);
    setPriceMax(500000);
    setActiveCategory('All Categories');
    setActiveCondition('');
    setActiveCampuses([]);
    setActivePriceMax(500000);
    setVisibleCount(20);
    setIsFilterDrawerOpen(false);
  };

  const toggleCampusStaging = (campus) => {
    setStagedCampuses(prev => 
      prev.includes(campus) ? prev.filter(c => c !== campus) : [...prev, campus]
    );
  };

  const handleFastContainerScrollToTop = () => {
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

  return (
    <div className="w-full h-full flex flex-col relative overflow-hidden bg-marix-cream">
      
      <div 
        ref={scrollContainerRef}
        onScroll={handleContainerScrollPhysics}
        className="w-full flex-1 overflow-y-auto overflow-x-hidden scrollbar-none flex flex-col justify-between"
      >
        <style>{`
          .marix-slider::-webkit-slider-runnable-track { background: #008080; height: 2px; border-radius: 99px; }
          .marix-slider::-moz-range-track { background: #008080; height: 2px; border-radius: 99px; }
          .marix-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 14px; height: 14px; border-radius: 50%; background: #ffffff; border: 2px solid #008080; margin-top: -6px; cursor: pointer; }
          .marix-slider::-moz-range-thumb { width: 14px; height: 14px; border-radius: 50%; background: #ffffff; border: 2px solid #008080; cursor: pointer; }
          .scrollbar-none::-webkit-scrollbar { display: none; }
          .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>

        <div>
          <Navbar 
            isLoggedIn={isLoggedIn} 
            setIsLoggedIn={setIsLoggedIn} 
            userName={userName} 
            activeTab="explore"
            handleTabChange={(tab) => {
              if (tab === 'browse' || tab === 'home') onNavigateHome?.();
              else if (tab === 'uploads') onNavigateToUploadsTab?.();
              else if (tab === 'saved-mobile') onNavigateToSavedTab?.();
            }}
            savedCount={savedProducts.length} 
            showCreateModal={showCreateModal} 
            setShowCreateModal={setShowCreateModal}
            onNavigateToLogin={onNavigateToLogin} 
            onNavigateToSignup={onNavigateToSignup}
            activeSearchTerm={activeSearchTerm} 
            setActiveSearchTerm={setActiveSearchTerm}
            recentSearches={recentSearches}
            setRecentSearches={setRecentSearches}
            onNavigateToExplore={() => {}} 
          />

          <main className="w-full max-w-[95%] mx-auto px-2 lg:px-4 flex flex-col pt-4 md:pt-24 animate-fadeIn flex-1">
            
            <div className="flex flex-col gap-1.5 mt-2 mb-6 select-none w-full">
              {activeSearchTerm.trim() ? (
                <div className="w-full flex items-baseline justify-between">
                  <h1 className="text-xl md:text-2xl font-bold text-gray-500 tracking-tight">
                    Results for <span className="text-marix-teal font-black">"{activeSearchTerm}"</span>
                  </h1>
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[#111111]">
                    All Products
                  </h1>
                  <p className="text-xs md:text-sm font-medium text-gray-500 tracking-tight">
                    Discover great deals from trusted sellers around you.
                  </p>
                </div>
              )}
            </div>

            <div className="w-full flex items-center justify-between border-b border-gray-200/40 pb-4 mb-6 select-none">
              <div className="flex items-center gap-2.5">
                <button 
                  onClick={() => setIsFilterDrawerOpen(true)}
                  className="h-9 px-4 bg-white border border-gray-200 hover:border-gray-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors focus:outline-none shadow-sm"
                >
                  <svg className="w-3.5 h-3.5 text-[#111111]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                  </svg>
                  <span>Filters</span>
                  {activeFiltersCount > 0 && (
                    <span className="ml-1 bg-marix-teal text-white text-[9px] font-black h-3.5 px-1.5 rounded-full flex items-center justify-center">{activeFiltersCount}</span>
                  )}
                </button>

                <div className="relative">
                  <select 
                    value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                    className="h-9 pl-3 pr-8 bg-white border border-gray-200 rounded-xl text-xs font-bold outline-none appearance-none cursor-pointer focus:border-gray-300 transition-colors"
                  >
                    <option>Newest</option>
                    <option>Oldest</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                  </select>
                  <div className="absolute inset-y-0 right-2.5 flex items-center pointer-events-none text-gray-400 text-[9px]"><i className="ph ph-caret-down font-bold"></i></div>
                </div>
              </div>

              {!isSearching && (
                <span className="text-xs font-semibold text-gray-400 tracking-tight">{filteredProducts.length.toLocaleString()} Products</span>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
              {paginatedProducts.map((product) => {
                const primaryImgObj = product.colorVariants?.find(v => v.isMain) || product.colorVariants?.[0];
                return (
                  <div key={product.id} className="w-full">
                    <VolcanoCard 
                      product={product} 
                      targetImageSrc={primaryImgObj ? primaryImgObj.imageUrl : "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&q=80"} 
                      savedProducts={savedProducts} onToggleSave={setSavedProducts} 
                    />
                  </div>
                );
              })}
            </div>

            {filteredProducts.length === 0 && (
              <div className="w-full py-16 text-center select-none">
                <h4 className="text-xs font-bold text-gray-400 tracking-tight mb-2">No listings found matching your active selection criteria.</h4>
                <button onClick={handleResetFilters} className="text-xs text-marix-teal font-black underline focus:outline-none">Clear Active Settings</button>
              </div>
            )}

            <div className="w-full flex flex-col items-center justify-center pt-12 pb-14 border-b border-gray-200/40 select-none">
              {filteredProducts.length > visibleCount ? (
                <button 
                  onClick={() => setVisibleCount(prev => prev + 20)}
                  className="w-full max-w-[260px] h-10 border border-gray-200 bg-white text-xs font-bold text-[#111111] hover:opacity-85 transition-opacity rounded-xl focus:outline-none flex items-center justify-center gap-1.5 shadow-sm active:scale-98"
                >
                  <span>View More</span>
                  <div className="text-[9px] pt-0.5"><i className="ph ph-caret-down font-bold"></i></div>
                </button>
              ) : filteredProducts.length > 20 ? (
                <button 
                  onClick={() => setVisibleCount(20)}
                  className="w-full max-w-[260px] h-10 border border-gray-200 bg-white text-xs font-bold text-[#111111] hover:opacity-85 transition-opacity rounded-xl focus:outline-none flex items-center justify-center gap-1.5 shadow-sm active:scale-98"
                >
                  <span>View Less</span>
                  <div className="text-[9px] pt-0.5"><i className="ph ph-caret-up font-bold"></i></div>
                </button>
              ) : null}
            </div>

{/* 🚀 DYNAMIC RECOMMENDATION ENGINE WITH ADAPTIVE LAYOUT MATRIX */}
{activeSearchTerm.trim() !== "" && recommendedProducts.length > 0 && (
  <div className="mt-14 mb-14 select-none w-full overflow-hidden">
    <h3 className="text-base md:text-lg font-black text-[#111111] tracking-tight mb-5">Recommended for You</h3>
    
    {/* 🚀 FIXED: Explicit Tailwind lookups so static compilation catches the classes perfectly */}
    <div className={`
      w-full pb-4 scrollbar-none snap-x snap-mandatory 
      ${recommendedProducts.length < 5 
        ? `grid gap-3.5 md:gap-5 max-[599px]:grid-cols-2 min-[600px]:max-[829px]:grid-cols-3 min-[830px]:max-[1024px]:grid-cols-4 ${
            {
              1: 'min-[1025px]:grid-cols-1 max-w-[320px] mx-auto',
              2: 'min-[1025px]:grid-cols-2',
              3: 'min-[1025px]:grid-cols-3',
              4: 'min-[1025px]:grid-cols-4'
            }[recommendedProducts.length] || 'min-[1025px]:grid-cols-4'
          }`
        : 'flex md:grid md:grid-cols-6 gap-3.5 md:gap-5 overflow-x-auto'
      }
    `}>
      {recommendedProducts.map((product) => {
        const primaryImgObj = product.colorVariants?.find(v => v.isMain) || product.colorVariants?.[0];
        return (
          <div 
            key={`rec-${product.id}`} 
            className={`
              shrink-0 snap-start 
              ${recommendedProducts.length < 5 
                ? 'w-full' 
                : 'max-[599px]:w-[46%] min-[600px]:max-[829px]:w-[31%] min-[830px]:max-[1024px]:w-[23%] min-[1025px]:w-full'
              }
            `}
          >
            <VolcanoCard 
              product={product} 
              targetImageSrc={primaryImgObj ? primaryImgObj.imageUrl : "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&q=80"} 
              savedProducts={savedProducts} 
              onToggleSave={setSavedProducts} 
            />
          </div>
        );
      })}
    </div>
  </div>
)}
          </main>
        </div>

        {/* 🚀 FIXED COPYRIGHT CLEAR LAYER */}
        <div className="w-full text-center text-[11px] text-gray-400 font-bold tracking-tight py-6 border-t border-gray-100 bg-white z-30 relative shrink-0">
          <span>&copy; {new Date().getFullYear()} <span className="text-marix-teal font-bold">Marix</span>. Built for Campus Commerce.</span>
        </div>

      </div>

      {/* 🚀 FILTER DRAWER INTERFACE */}
      <div className={`fixed inset-0 z-50 flex justify-end select-none transition-opacity duration-300 ${isFilterDrawerOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <div onClick={() => setIsFilterDrawerOpen(false)} className={`absolute inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity duration-300 ease-in-out ${isFilterDrawerOpen ? 'opacity-100' : 'opacity-0'}`} />
        <div className={`w-full max-w-full md:max-w-[420px] h-[85vh] md:h-full bg-white shadow-2xl relative z-10 flex flex-col justify-between transform transition-transform duration-300 ease-out mt-auto md:mt-0 rounded-t-[24px] md:rounded-t-none ${isFilterDrawerOpen ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-y-0 md:translate-x-full'}`}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-black text-[#111111] tracking-tight">Filters</h2>
            <button onClick={() => setIsFilterDrawerOpen(false)} className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center font-semibold text-xs text-gray-500 transition-colors">✕</button>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 text-left scrollbar-none">
            
            {/* Category Dropdown */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Category</label>
              <div className="relative w-full">
                <select value={stagedCategory} onChange={(e) => setStagedCategory(e.target.value)} className="w-full h-10 border border-gray-200 rounded-xl pl-3 pr-10 bg-white text-xs font-semibold outline-none appearance-none cursor-pointer focus:border-marix-teal transition-colors">
                  <option>All Categories</option>
                  {allCategoriesList.map(cat => <option key={cat}>{cat}</option>)}
                </select>
                <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none text-gray-400 text-[10px]"><i className="ph ph-caret-down font-bold"></i></div>
              </div>
            </div>

            {/* Condition Selection Pills */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Item Condition</label>
              <div className="grid grid-cols-3 gap-2">
                {['New', 'Like New', 'Fair'].map((cond) => (
                  <button
                    key={cond}
                    type="button"
                    onClick={() => setStagedCondition(stagedCondition === cond ? '' : cond)}
                    className={`h-9 rounded-xl border text-xs font-bold transition-all ${stagedCondition === cond ? 'bg-marix-teal/10 border-marix-teal text-marix-teal' : 'bg-white border-gray-200 text-gray-600'}`}
                  >
                    {cond}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Max Slider */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center w-full">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Max Price</label>
                <span className="text-xs font-black text-marix-teal">₦{priceMax.toLocaleString()}</span>
              </div>
              <input 
                type="range" 
                min="500" 
                max="500000" 
                step="500"
                value={priceMax} 
                onChange={(e) => setPriceMax(parseInt(e.target.value, 10))}
                className="w-full h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer marix-slider outline-none mt-2"
              />
            </div>

            {/* Campus Selection Stacks */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Campus Location</label>
              <div className="flex flex-col gap-2 bg-gray-50/50 rounded-2xl p-3 border border-gray-100/50 max-h-[160px] overflow-y-auto scrollbar-none">
                {allCampusesList.map((campus) => {
                  const isChecked = stagedCampuses.includes(campus);
                  return (
                    <label key={campus} className="flex items-center gap-3 py-1 cursor-pointer group select-none">
                      <input 
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleCampusStaging(campus)}
                        className="hidden"
                      />
                      <div className={`w-4 h-4 rounded-[6px] border flex items-center justify-center transition-all ${isChecked ? 'bg-marix-teal border-marix-teal text-white' : 'border-gray-300 bg-white group-hover:border-gray-400'}`}>
                        {isChecked && <i className="ph ph-check font-black text-[10px]"></i>}
                      </div>
                      <span className="text-xs font-bold text-gray-700">{campus}</span>
                    </label>
                  );
                })}
              </div>
            </div>

          </div>
          <div className="border-t border-gray-100 p-4 grid grid-cols-3 gap-3 items-center bg-gray-50/50">
            <button onClick={handleResetFilters} className="h-10 text-xs font-bold text-gray-500 hover:text-black transition-colors">Reset</button>
            <button onClick={handleApplyFilters} className="h-10 col-span-2 bg-marix-brown text-white text-xs font-black rounded-xl shadow-md">Apply Filters</button>
          </div>
        </div>
      </div>

      {showScrollTop && !isFilterDrawerOpen && (
        <button 
          onClick={handleFastContainerScrollToTop}
          className="fixed bottom-24 md:bottom-8 right-5 w-12 h-12 bg-marix-brown text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all z-50 focus:outline-none border border-white/10 cursor-pointer"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
          </svg>
        </button>
      )}

      {isLoggedIn && (
        <div className={`md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 pt-1 z-40 flex items-center justify-around select-none shadow-[0_-4px_12px_rgba(0,0,0,0.05)] pb-[calc(env(safe-area-inset-bottom)+8px)] transition-transform duration-300 ${isAtAbsoluteBottom ? 'translate-y-full' : 'translate-y-0'}`}>
          <button onClick={onNavigateHome} className="flex flex-col items-center gap-0.5 py-1 text-gray-400 focus:outline-none"><i className="ph ph-house text-xl"></i><span className="text-[10px] font-bold">Home</span></button>
          <button className="flex flex-col items-center gap-0.5 py-1 text-marix-teal focus:outline-none"><i className="ph ph-squares-four text-xl"></i><span className="text-[10px] font-bold">Browse</span></button>
          <button onClick={() => setShowCreateModal(!showCreateModal)} className="w-11 h-11 rounded-full bg-marix-brown text-white flex items-center justify-center shadow-md -translate-y-2.5 border-4 border-marix-cream focus:outline-none z-50"><i className="ph font-black text-xl ph-plus"></i></button>
          <button onClick={onNavigateToUploadsTab} className="flex flex-col items-center gap-0.5 py-1 text-gray-400 focus:outline-none"><i className="ph ph-tray text-xl"></i><span className="text-[10px] font-bold">Uploads</span></button>
          <button onClick={onNavigateToSavedTab} className="flex flex-col items-center gap-0.5 py-1 text-gray-400 focus:outline-none"><i className="ph ph-user text-xl"></i><span className="text-[10px] font-bold">Profile</span></button>
        </div>
      )}

    </div>
  );
}

function VolcanoCard({ product, targetImageSrc, savedProducts, onToggleSave }) {
  const isLiked = savedProducts.some(p => p.id === product.id);
  const cleanCampusName = product.campus ? product.campus.split(',')[0].trim() : 'Campus';

  return (
    <div className="w-full flex flex-col gap-y-1 select-none group bg-white p-1.5 rounded-[18px] border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.01)] text-left">
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