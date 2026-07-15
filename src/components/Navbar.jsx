import React, { useState, useEffect, useMemo } from 'react';
import marixLogoM from '../images/marix-logo-m.png';
import { initialProducts } from '../data/products';

export default function Navbar({
  isLoggedIn,
  setIsLoggedIn,
  userName,
  activeTab,
  handleTabChange,
  savedCount,
  showCreateModal,
  setShowCreateModal,
  onNavigateToLogin,
  onNavigateToSignup,
  activeSearchTerm = "",
  setActiveSearchTerm,
  onNavigateToExplore 
}) {
  const userInitial = (userName && typeof userName === 'string' && userName.trim().length > 0) 
    ? userName.trim().charAt(0).toUpperCase() 
    : 'M';
    
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [localSearchInput, setLocalSearchInput] = useState(activeSearchTerm);

  // 🚀 LOCAL BUT STORAGE-SYNCED STATE
  const [recentSearches, setRecentSearches] = useState(() => {
    const cached = localStorage.getItem('marix_recent_searches');
    if (cached) {
      try { return JSON.parse(cached); } catch (e) { return []; }
    }
    return [];
  });

  const popularSearches = ['iPhone', 'Sneakers', 'Wrist Watch', 'Backpack', 'Laptop', 'Jersey', 'Headphones', 'Books', 'Makeup', 'PS5'];

  const productSuggestions = useMemo(() => {
    const inputClean = localSearchInput.trim().toLowerCase();
    if (!inputClean) return [];

    const inputWords = inputClean.split(/\s+/);
    const primaryInputWord = inputWords[0];
    const secondaryInputWord = inputWords[1] || "";

    const uniquePhrases = new Set();
    const productsDB = initialProducts || [];

    productsDB.forEach(product => {
      const titleLower = (product.productTitle || "").toLowerCase();
      const catLower = (product.category || "").toLowerCase();
      const shopLower = (product.shopName || "").toLowerCase();
      const productTokens = `${titleLower} ${catLower} ${shopLower}`.split(/[\s,./-]+/);

      if (titleLower.includes(primaryInputWord) || catLower.includes(primaryInputWord)) {
        productTokens.forEach(token => {
          if (token !== primaryInputWord && token.length > 2) {
            if (!secondaryInputWord || token.startsWith(secondaryInputWord)) {
              const combinedPhrase = `${primaryInputWord} ${token}`;
              
              const queryMatchExists = productsDB.some(p => {
                const combinedMatchStr = `${p.productTitle} ${p.description || ''} ${p.category} ${p.shopName}`.toLowerCase();
                return combinedMatchStr.includes(combinedPhrase);
              });

              if (queryMatchExists) {
                uniquePhrases.add(combinedPhrase);
              }
            }
          }
        });
      }
    });

    if (uniquePhrases.size === 0) {
      productsDB.forEach(product => {
        if (product.productTitle?.toLowerCase().includes(inputClean)) {
          uniquePhrases.add(product.productTitle);
        }
      });
    }

    return Array.from(uniquePhrases)
      .map(phrase => phrase.replace(/\b\w/g, char => char.toUpperCase()))
      .slice(0, 5);
  }, [localSearchInput]);

  useEffect(() => {
    const syncStorage = () => {
      const cached = localStorage.getItem('marix_recent_searches');
      if (cached) {
        try { setRecentSearches(JSON.parse(cached)); } catch (e) {}
      }
    };
    window.addEventListener('storage', syncStorage);
    return () => window.removeEventListener('storage', syncStorage);
  }, []);

  useEffect(() => {
    setLocalSearchInput(activeSearchTerm);
  }, [activeSearchTerm]);

  const commitSearch = (term) => {
    const cleanTerm = term.trim();
    if (!cleanTerm) return;

    const updatedHistory = [
      cleanTerm,
      ...recentSearches.filter(item => item.toLowerCase() !== cleanTerm.toLowerCase())
    ].slice(0, 5);

    localStorage.setItem('marix_recent_searches', JSON.stringify(updatedHistory));
    setRecentSearches(updatedHistory);
    
    window.dispatchEvent(new Event('storage'));
    
    if (setActiveSearchTerm) setActiveSearchTerm(cleanTerm);
    setIsSearchFocused(false);

    if (onNavigateToExplore && typeof onNavigateToExplore === 'function') {
      onNavigateToExplore();
    } 
    else if (handleTabChange && typeof handleTabChange === 'function') {
      handleTabChange('browse'); 
    }
  };

  const clearRecentSearchItem = (e, targetTerm) => {
    e.stopPropagation();
    const updatedHistory = recentSearches.filter(item => item !== targetTerm);
    localStorage.setItem('marix_recent_searches', JSON.stringify(updatedHistory));
    setRecentSearches(updatedHistory);
    window.dispatchEvent(new Event('storage'));
  };

  const handleCancelSearch = () => {
    setLocalSearchInput('');
    if (setActiveSearchTerm) setActiveSearchTerm('');
  };

  const executeTabSwitch = (targetTab) => {
    if (handleTabChange && typeof handleTabChange === 'function') {
      handleTabChange(targetTab);
    }
  };

  const computeActiveZIndex = () => {
    if (isSearchFocused) return 9999; 
    if (showCreateModal) return 30;   
    return 40;                        
  };

  return (
    <>
      {isSearchFocused && (
        <div 
          onClick={() => setIsSearchFocused(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9998] animate-fadeIn"
        />
      )}

      <nav 
        style={{ zIndex: computeActiveZIndex() }}
        className="w-full border-b border-[#452b1f]/10 px-3 lg:px-4 pt-3 pb-3 md:py-4 select-none relative md:fixed md:top-0 md:left-0 md:right-0 bg-marix-cream md:bg-marix-cream/80 md:backdrop-blur-[6px] shadow-none md:shadow-sm"
      >
        <div className="max-w-[95%] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3.5 md:gap-4">
          
          <div className={`items-center justify-between w-full md:w-auto shrink-0 ${isSearchFocused ? 'hidden md:flex' : 'flex'}`}>
            <div className="flex items-center cursor-pointer" onClick={() => executeTabSwitch('browse')}>
              <img src={marixLogoM} alt="M" style={{ width: '52px', height: '52px', margin: '0 -8px', objectFit: 'contain' }} />
              <span style={{ fontSize: '1.05rem', color: '#452b1f', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }} className="tracking-tight pt-1">ARIX</span>
            </div>

            <div className="flex items-center gap-3 md:hidden">
              {isLoggedIn ? (
                <>
                  <button onClick={() => executeTabSwitch('saved-mobile')} className={`relative p-1 transition-colors focus:outline-none ${activeTab === 'saved-mobile' ? 'text-marix-teal' : 'text-gray-500'}`}>
                    <i className="ph ph-heart text-xl"></i>
                    {savedCount > 0 && (
                      <span className="absolute top-0 right-0 bg-marix-teal text-white font-bold text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center border border-white shadow-sm">
                        {savedCount}
                      </span>
                    )}
                  </button>
                  <button className="relative p-1 text-gray-500 transition-colors focus:outline-none">
                    <i className="ph ph-bell text-xl"></i>
                    {unreadNotifications > 0 && (
                      <span className="absolute top-0 right-0 bg-marix-teal text-white font-bold text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center border border-white shadow-sm">
                        {unreadNotifications}
                      </span>
                    )}
                  </button>
                </>
              ) : (
                <button onClick={onNavigateToLogin} className="p-2 text-gray-600 focus:outline-none">
                  <i className="ph ph-user text-xl"></i>
                </button>
              )}
            </div>
          </div>

          {/* 🚀 FIXED: Replaced transition-all with specific transitions to prevent layout flashes on mobile mounts */}
          <div className={`w-full transition-[max-width,transform] duration-300 relative flex flex-col pb-2 md:pb-0 mb-1 md:mb-0 ${isSearchFocused ? 'md:flex-1 md:max-w-2xl mx-auto' : 'md:flex-1 max-w-md mx-auto'}`}>
            <div className="w-full relative flex items-center">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                <i className="ph ph-magnifying-glass text-xs sm:text-sm font-bold"></i>
              </div>
              <input 
                type="text" 
                placeholder="Search campus discoveries..." 
                value={localSearchInput}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => setLocalSearchInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') commitSearch(localSearchInput); }}
                className="w-full bg-white/50 border border-gray-200/80 rounded-xl pl-8 pr-16 py-1.5 text-base md:text-xs focus:outline-none focus:border-marix-teal text-[#111111] font-medium placeholder-gray-400 shadow-sm md:shadow-none" 
              />
              {(isSearchFocused || localSearchInput) && (
                <button 
                  onClick={handleCancelSearch}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 text-xs font-bold min-[1025px]:hover:text-marix-teal transition-colors focus:outline-none px-1"
                >
                  {localSearchInput ? 'Clear' : 'Cancel'}
                </button>
              )}
            </div>

            {isSearchFocused && (
              <div 
                onClick={(e) => e.stopPropagation()}
                className="absolute top-full left-0 right-0 mt-2 bg-marix-cream border border-[#452b1f]/10 shadow-2xl rounded-2xl max-h-[400px] overflow-y-auto scrollbar-none pb-6 z-[10000] animate-slideDown text-left"
              >
                <div className="w-full px-5 pt-5 select-none">
                  {localSearchInput.trim() ? (
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Suggestions</span>
                      <div className="flex flex-col">
                        {productSuggestions.length > 0 ? (
                          productSuggestions.map((suggestion, idx) => (
                            <div
                              key={idx}
                              onClick={() => commitSearch(suggestion)}
                              className="w-full py-2.5 border-b border-[#452b1f]/5 flex items-center gap-3 text-xs font-bold text-gray-700 min-[1025px]:hover:text-marix-teal min-[1025px]:hover:translate-x-1 cursor-pointer transition-all duration-150 active:bg-black/5 rounded-lg px-2 -mx-2"
                            >
                              <i className="ph ph-magnifying-glass text-gray-400"></i>
                              <span>{suggestion}</span>
                            </div>
                          ))
                        ) : (
                          <div className="py-4 text-xs font-semibold text-gray-400">Press enter to search for "{localSearchInput}"...</div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Recent Searches</span>
                        {recentSearches.length > 0 ? (
                          <div className="flex flex-col">
                            {recentSearches.map((term, index) => (
                              <div 
                                key={index}
                                onClick={() => commitSearch(term)}
                                className="w-full py-2 flex items-center justify-between border-b border-[#452b1f]/5 group cursor-pointer rounded-lg px-2 -mx-2 transition-all duration-150 min-[1025px]:hover:bg-[#452b1f]/5"
                              >
                                <div className="flex items-center gap-3 text-xs font-bold text-gray-700 min-[1025px]:group-hover:text-marix-teal transition-colors">
                                  <i className="ph ph-clock-counter-clockwise text-gray-400 text-sm"></i>
                                  <span>{term}</span>
                                </div>
                                <button 
                                  onClick={(e) => clearRecentSearchItem(e, term)}
                                  className="text-gray-400 min-[1025px]:hover:text-red-500 font-bold text-[11px] p-1 focus:outline-none transition-colors"
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs font-semibold text-gray-400 py-1">No recent searches.</span>
                        )}
                      </div>

                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Popular Searches</span>
                        <div className="flex flex-wrap gap-1.5">
                          {popularSearches.map((term, index) => (
                            <button
                              key={index}
                              onClick={() => commitSearch(term)}
                              className="h-7 px-3 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700 transition-colors focus:outline-none active:scale-95 shadow-sm hover:bg-gray-50"
                            >
                              {term}
                            </button>
                          ))}
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="hidden md:flex items-center gap-4 shrink-0">
            {isLoggedIn && (
              <div className="flex items-center gap-5 mr-2">
                <button 
                  onClick={() => executeTabSwitch('uploads')} 
                  className={`text-xs font-bold transition-colors focus:outline-none ${activeTab === 'uploads' ? 'text-marix-teal' : 'text-gray-600 hover:text-marix-teal'}`}
                >
                  My Uploads
                </button>
              </div>
            )}

            {!isLoggedIn ? (
              <div className="flex items-center gap-2">
                <button onClick={onNavigateToLogin} className="px-4 py-2 text-xs font-bold text-[#111111]/80 hover:text-[#111111] focus:outline-none">Sign In</button>
                <button onClick={onNavigateToSignup} className="px-4 py-2 rounded-xl bg-marix-brown text-white text-xs font-bold shadow-sm hover:opacity-95 transition-all focus:outline-none">Create Account</button>
              </div>
            ) : (
              <div className="flex items-center gap-3 sm:gap-5">
                <button onClick={() => executeTabSwitch('saved-mobile')} className={`relative p-1 transition-colors focus:outline-none ${activeTab === 'saved-mobile' ? 'text-marix-teal' : 'text-gray-400 min-[1025px]:hover:text-marix-teal'}`}>
                  <i className="ph ph-heart text-xl"></i>
                  {savedCount > 0 && (
                    <span className="absolute top-0 right-0 bg-marix-teal text-white font-bold text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center border border-white shadow-sm">
                      {savedCount}
                    </span>
                  )}
                </button>
                
                <button className="relative p-1 text-gray-500 min-[1025px]:hover:text-marix-teal transition-colors focus:outline-none">
                  <i className="ph ph-bell text-xl"></i>
                  {unreadNotifications > 0 && (
                    <span className="absolute top-0 right-0 bg-marix-teal text-white font-bold text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center border border-white shadow-sm">
                      {unreadNotifications}
                    </span>
                  )}
                </button>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setShowCreateModal(true)} 
                    className="bg-marix-brown hover:bg-marix-brown/95 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md active:scale-95 transition-all focus:outline-none"
                  >
                    <i className="ph ph-plus font-bold"></i><span>Create Listing</span>
                  </button>
                  <div 
                    className="w-8 h-8 rounded-xl bg-marix-brown text-white text-xs font-bold flex items-center justify-center shadow-sm cursor-pointer hover:opacity-90 mr-1" 
                    onClick={() => setIsLoggedIn(false)}
                  >
                    {userInitial}
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </nav>
    </>
  );
}