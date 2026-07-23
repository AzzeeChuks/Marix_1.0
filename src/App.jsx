import React, { useState, useEffect } from 'react';
import AuthForm from './components/RegisterForm';
import CreateListing from './components/CreateListing';
import Homepage from './pages/Homepage';
import ProductListings from './pages/ProductListings'; 
import ProductOverview from './components/ProductOverview'; 
import About from './pages/About';
import Faq from './pages/Faq';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import { initialProducts } from './data/products';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState('home'); 
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const [products, setProducts] = useState(initialProducts || []);
  const [userUploads, setUserUploads] = useState([]);
  
  const [activeTab, setActiveTab] = useState('browse');
  const [previousTab, setPreviousTab] = useState('browse'); 
  
  // CENTRAL DYNAMIC USER STATES
  const [userName, setUserName] = useState('Student');
  const [userEmail, setUserEmail] = useState('');
  const [userLocation, setUserLocation] = useState('');
  
  const [activeSearchTerm, setActiveSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  // RECENTLY VIEWED PRODUCT TRACKING STATE
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  // PUBLIC SELLER PROFILE MODAL STATE
  const [publicSellerData, setPublicSellerData] = useState(null);

  const [exploreViewMode, setExploreViewMode] = useState('All');
  const [exploreCategoryFilter, setExploreCategoryFilter] = useState('All Categories');
  const [editingProductData, setEditingProductData] = useState(null);

  const [hasCompletedSellerOnboarding, setHasCompletedSellerOnboarding] = useState(false);
  const [shopDetails, setShopDetails] = useState({
    shopName: '',
    campus: '',
    whatsappNumber: '',
    aboutShop: ''
  });

  // Modal Temp States
  const [onboardingTempCampus, setOnboardingTempCampus] = useState('');
  const [sellerTempDetails, setSellerTempDetails] = useState({
    shopName: '',
    campus: '',
    whatsappNumber: '',
    aboutShop: ''
  });

  // SEPARATED ONBOARDING OVERLAY STATES
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showOnboardingOverlay, setShowOnboardingOverlay] = useState(false);
  
  const [showBecomeSellerModal, setShowBecomeSellerModal] = useState(false);
  const [sellerRegistrationSource, setSellerRegistrationSource] = useState('dock');

  // Dynamic Notification List
  const [notifications, setNotifications] = useState([
    { 
      id: 1, 
      title: "Welcome to Marix! 🎉", 
      message: "Thanks for joining Marix. Discover amazing products on your campus and start connecting!", 
      createdAt: new Date().toISOString(), 
      read: false 
    }
  ]);

  const [savedProducts, setSavedProducts] = useState(() => {
    const saved = localStorage.getItem('marix_saved_items');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('marix_saved_items', JSON.stringify(savedProducts));
  }, [savedProducts]);

  useEffect(() => {
    const handleGlobalHomeReset = () => {
      setSelectedProduct(null);
      setPublicSellerData(null);
      setCurrentView('home');
      setActiveTab('browse');
    };
    
    window.addEventListener('marix_force_home_reset', handleGlobalHomeReset);
    return () => window.removeEventListener('marix_force_home_reset', handleGlobalHomeReset);
  }, []);

  useEffect(() => {
    const handleTriggerEditListingModal = (e) => {
      if (e.detail) {
        setEditingProductData(e.detail);
        setShowCreateModal(true);
      }
    };
    window.addEventListener('marix_trigger_edit_listing', handleTriggerEditListingModal);
    return () => window.removeEventListener('marix_trigger_edit_listing', handleTriggerEditListingModal);
  }, []);

  const handleToggleSaveProduct = (product) => {
    setSavedProducts((prevSaved) => {
      const isAlreadySaved = prevSaved.some((p) => p.id === product.id);
      if (isAlreadySaved) {
        return prevSaved.filter((p) => p.id !== product.id);
      } else {
        return [product, ...prevSaved];
      }
    });
  };

  const handleProductCardClick = (clickedProduct) => {
    if (!clickedProduct || (!clickedProduct.productTitle && !clickedProduct.name)) return;

    setSelectedProduct(clickedProduct);

    setRecentlyViewed((prev) => {
      const now = new Date().toISOString();
      const newEntry = { ...clickedProduct, viewedAt: now };
      const withoutDuplicate = prev.filter((p) => p.id !== clickedProduct.id);
      return [newEntry, ...withoutDuplicate];
    });
  };

  // LOGIN vs SIGNUP ONBOARDING MODAL ROUTING
  const handleLoginSuccess = (firstName, email, isNewSignup = false) => {
    const finalName = firstName || 'Student';
    const finalEmail = email || 'student@campus.edu';
    
    const isSignup = isNewSignup || currentView === 'auth-signup';

    setUserName(finalName);
    setUserEmail(finalEmail);
    setIsLoggedIn(true);
    setCurrentView('home');
    setActiveTab('browse');
    setActiveSearchTerm('');
    
    if (isSignup) {
      setShowOnboardingOverlay(false);
      setShowWelcomeModal(false);
      setTimeout(() => {
        setShowWelcomeModal(true);
      }, 2000);
    } else {
      setShowWelcomeModal(false);
      setShowOnboardingOverlay(false);
      if (!userLocation) {
        setTimeout(() => {
          setShowOnboardingOverlay(true);
        }, 2000);
      }
    }
  };

  const handleSignOut = () => {
    setUserName('');
    setUserEmail('');
    setIsLoggedIn(false);
    setCurrentView('home');
    setActiveTab('browse');
    setActiveSearchTerm('');
    setSelectedProduct(null); 
    setPublicSellerData(null);
    setHasCompletedSellerOnboarding(false);
    setUserLocation('');
    setShopDetails({ shopName: '', campus: '', whatsappNumber: '', aboutShop: '' });
  };

  const handleNewProduct = (newCard) => {
    const augmentedCard = {
      ...newCard,
      shopName: editingProductData ? (editingProductData.shopName || newCard.shopName) : (shopDetails.shopName || userName || 'Store'),
      campus: editingProductData ? (editingProductData.campus || newCard.campus) : (shopDetails.campus || userLocation || 'Campus'),
      whatsappNumber: editingProductData ? (editingProductData.whatsappNumber || newCard.whatsappNumber) : (shopDetails.whatsappNumber || ''),
      aboutShop: shopDetails.aboutShop || ''
    };

    if (editingProductData) {
      setProducts(prev => prev.map(p => p.id === newCard.id ? augmentedCard : p));
      setUserUploads(prev => prev.map(p => p.id === newCard.id ? augmentedCard : p));
      setSavedProducts(prev => prev.map(p => p.id === newCard.id ? augmentedCard : p));
    } else {
      setProducts(prevProducts => [augmentedCard, ...prevProducts]);
      setUserUploads(prev => [augmentedCard, ...prev]);
    }

    setShowCreateModal(false); 
    setEditingProductData(null); 
    setSelectedProduct(null);
    setCurrentView('home');
    setActiveTab('uploads');
    setActiveSearchTerm('');
  };

  const handleCreateActionIntercept = () => {
    if (!isLoggedIn) {
      setCurrentView('auth-login');
      return;
    }
    if (!hasCompletedSellerOnboarding) {
      setSellerRegistrationSource('dock');
      setSellerTempDetails({
        shopName: shopDetails.shopName || '',
        campus: shopDetails.campus || userLocation || '',
        whatsappNumber: shopDetails.whatsappNumber || '',
        aboutShop: shopDetails.aboutShop || ''
      });
      setShowBecomeSellerModal(true);
    } else {
      setShowCreateModal(true);
    }
  };

  const handleEditInitActionIntercept = (productToEdit) => {
    setEditingProductData(productToEdit);
    setShowCreateModal(true);
  };

  const handleProductDelete = (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    setUserUploads(prev => prev.filter(p => p.id !== productId));
    setSavedProducts(prev => prev.filter(p => p.id !== productId));
  };

  const handleProfileSellerIntercept = () => {
    setSellerRegistrationSource('profile');
    setSellerTempDetails({
      shopName: shopDetails.shopName || '',
      campus: shopDetails.campus || userLocation || '',
      whatsappNumber: shopDetails.whatsappNumber || '',
      aboutShop: shopDetails.aboutShop || ''
    });
    setShowBecomeSellerModal(true);
  };

  const routeToExploreWithContext = (viewMode = 'All', category = 'All Categories') => {
    setExploreViewMode(viewMode);
    setExploreCategoryFilter(category);
    setCurrentView('explore');
    setSelectedProduct(null); 
  };

  const handleHomepageTabBackClick = (targetTab) => {
    setSelectedProduct(null);
    setPublicSellerData(null);
    
    if (targetTab === 'logo-home-reset') {
      setCurrentView('home');
      setActiveTab('browse');
      return;
    }
    if (targetTab !== 'notifications') setPreviousTab(targetTab);
    setActiveTab(targetTab);
  };

  const handleOpenPublicSellerProfile = (product) => {
    const shopName = product.shopName || 'Campus Merchant';
    const campus = product.campus || userLocation || 'Campus';
    const whatsappNumber = product.whatsappNumber || '';
    const joinDate = product.joinDate || "July 2026";
    
    const sellerListings = products.filter(p => 
      (p.shopName && p.shopName.toLowerCase() === shopName.toLowerCase()) || 
      (p.whatsappNumber && whatsappNumber && p.whatsappNumber === whatsappNumber)
    );

    const dynamicAbout = product.aboutShop || shopDetails.aboutShop || "Welcome to my store! Browse through our listed items or chat directly on WhatsApp for pre-orders.";

    setPublicSellerData({
      shopName,
      campus,
      whatsappNumber,
      joinDate,
      aboutShop: dynamicAbout,
      listings: sellerListings
    });
  };

  const handleSeeAllSellerListings = () => {
    if (publicSellerData) {
      setActiveSearchTerm(publicSellerData.shopName);
      routeToExploreWithContext('All', 'All Categories');
      setPublicSellerData(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-marix-cream text-[#111111] flex flex-col overflow-hidden selection:bg-marix-teal/20">
      
      <div className="w-full flex-1 flex flex-col relative overflow-hidden">
        
        {/* PRODUCT OVERVIEW CONTAINER */}
        <div className={`absolute inset-0 overflow-y-auto bg-marix-cream z-[99] shadow-2xl ${
          selectedProduct ? '' : 'hidden'
        }`}>
          {selectedProduct && (
            <ProductOverview 
              product={selectedProduct} allProducts={products} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} userName={userName}
              showCreateModal={showCreateModal} setShowCreateModal={handleCreateActionIntercept} onNavigateToLogin={() => setCurrentView('auth-login')} onNavigateToSignup={() => setCurrentView('auth-signup')}
              activeSearchTerm={activeSearchTerm} setActiveSearchTerm={setActiveSearchTerm} onNavigateToExplore={routeToExploreWithContext}
              onNavigateToUploadsTab={() => { setCurrentView('home'); setActiveTab('uploads'); setSelectedProduct(null); }}
              onNavigateToSavedTab={() => { setCurrentView('home'); setActiveTab('saved-mobile'); setSelectedProduct(null); }}
              onNavigateToProfileTab={() => { setCurrentView('home'); setActiveTab('profile'); setSelectedProduct(null); }}
              onNavigateToNotificationsTab={() => { setCurrentView('home'); setActiveTab('notifications'); setSelectedProduct(null); }}
              onNavigateHome={() => { setSelectedProduct(null); setCurrentView('home'); setActiveTab('browse'); }}
              savedProducts={savedProducts} onToggleSave={handleToggleSaveProduct} onBack={() => setSelectedProduct(null)} 
              onSelectRecommendedProduct={handleProductCardClick} activeTab={activeTab}
              onViewSellerShop={handleOpenPublicSellerProfile}
            />
          )}
        </div>
        
        {/* CORE HOMEPAGE VIEW */}
        <div className={`absolute inset-0 flex flex-col ${currentView === 'home' ? '' : 'hidden'}`}>
          <Homepage 
            products={products} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} userName={userName} userEmail={userEmail} onSignOut={handleSignOut} 
            showCreateModal={showCreateModal} setShowCreateModal={handleCreateActionIntercept} activeTab={activeTab} setActiveTab={handleHomepageTabBackClick}  
            userUploads={userUploads} savedProducts={savedProducts} setSavedProducts={handleToggleSaveProduct}     
            onNavigateToLogin={() => setCurrentView('auth-login')} onNavigateToSignup={() => setCurrentView('auth-signup')} 
            onNavigateToExplore={routeToExploreWithContext} activeSearchTerm={activeSearchTerm} setActiveSearchTerm={setActiveSearchTerm}
            onNavigateToView={(view) => setCurrentView(view)} onProductCardClick={handleProductCardClick} 
            notifications={notifications} onClearNotificationsCount={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
            historyFallbackTab={previousTab} editingProductData={editingProductData} setEditingProductData={handleEditInitActionIntercept}
            onProductDeleted={handleProductDelete}
            hasCompletedSellerOnboarding={hasCompletedSellerOnboarding} onBecomeSellerTrigger={handleProfileSellerIntercept}
            shopDetails={shopDetails} setShopDetails={setShopDetails} setHasCompletedSellerOnboarding={setHasCompletedSellerOnboarding}
            userLocation={userLocation} setUserLocation={setUserLocation} onUpdateUserName={setUserName}
            onOpenCreateListingModal={() => setShowCreateModal(true)}
            recentlyViewed={recentlyViewed.filter(p => p && (p.productTitle || p.name))}
            activeUploadsCount={userUploads.length}
          />
        </div>
        
        {/* EXPLORE PAGE VIEW */}
        <div className={`absolute inset-0 overflow-y-auto flex flex-col animate-fadeIn ${currentView === 'explore' ? '' : 'hidden'}`}>
          <ProductListings 
            allProducts={products} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} userName={userName}
            onNavigateHome={() => { setCurrentView('home'); setActiveTab('browse'); }} savedProducts={savedProducts} setSavedProducts={handleToggleSaveProduct}
            showCreateModal={showCreateModal} setShowCreateModal={handleCreateActionIntercept} onNavigateToLogin={() => setCurrentView('auth-login')} onNavigateToSignup={() => setCurrentView('auth-signup')}
            onNavigateToUploadsTab={() => { setCurrentView('home'); setActiveTab('uploads'); }} onNavigateToSavedTab={() => { setCurrentView('home'); setActiveTab('saved-mobile'); }}
            onNavigateToProfileTab={() => { setCurrentView('home'); setActiveTab('profile'); }} onNavigateToNotificationsTab={() => { setCurrentView('home'); setActiveTab('notifications'); }}
            activeSearchTerm={activeSearchTerm} setActiveSearchTerm={setActiveSearchTerm} viewMode={exploreViewMode} setViewMode={setExploreViewMode}
            initialCategory={exploreCategoryFilter} onProductCardClick={handleProductCardClick} 
          />
        </div>
        
        {/* AUTH FORMS */}
        {(currentView === 'auth-login' || currentView === 'auth-signup') && (
          <div className="fixed inset-0 overflow-y-auto bg-marix-cream z-50">
            <AuthForm 
              initialMode={currentView === 'auth-login' ? 'login' : 'signup'} 
              onSuccessLogin={(name, email, isSignupFromForm) => {
                const isSignup = typeof isSignupFromForm === 'boolean' ? isSignupFromForm : currentView === 'auth-signup';
                handleLoginSuccess(name, email, isSignup);
              }} 
              onCancel={() => setCurrentView('home')} 
            />
          </div>
        )}

        {/* STATIC PAGES CONTAINER */}
        {['about', 'faq', 'privacy', 'terms'].map((staticView) => {
          const Comp = staticView === 'about' ? About : staticView === 'faq' ? Faq : staticView === 'privacy' ? Privacy : Terms;
          return (
            <div key={staticView} className={`absolute inset-0 overflow-y-auto bg-marix-cream z-40 text-left ${currentView === staticView ? '' : 'hidden'}`}>
              <Comp 
                onNavigateHome={() => { setCurrentView('home'); setActiveTab('browse'); }} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} userName={userName}
                onNavigateToLogin={() => setCurrentView('auth-login')} onNavigateToSignup={() => setCurrentView('auth-signup')} savedCount={savedProducts.length}
                onNavigateToSaved={() => { setCurrentView('home'); setActiveTab('saved-mobile'); }} onNavigateToUploads={() => { setCurrentView('home'); setActiveTab('uploads'); }}
                onNavigateToProfileTab={() => { setCurrentView('home'); setActiveTab('profile'); }} onNavigateToNotificationsTab={() => { setCurrentView('home'); setActiveTab('notifications'); }}
                onSignOut={handleSignOut} setShowCreateModal={handleCreateActionIntercept} onNavigateToExplore={() => routeToExploreWithContext('All', 'All Categories')}
                activeSearchTerm={activeSearchTerm} setActiveSearchTerm={setActiveSearchTerm} onNavigateToView={(view) => setCurrentView(view)}
              />
            </div>
          );
        })}

      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-[200] bg-[#111111]/40 backdrop-blur-[4px] flex items-center justify-center p-4 select-none animate-fadeIn">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto relative p-1 animate-scaleIn">
            <CreateListing 
              editInitialData={editingProductData} 
              onProductCreated={handleNewProduct} 
              onCancel={() => { 
                setShowCreateModal(false); 
                setEditingProductData(null); 
              }} 
            />
          </div>
        </div>
      )}

      {/* SIGNUP WELCOME MODAL */}
      {showWelcomeModal && (
        <div className="fixed inset-0 z-[250] bg-black/50 backdrop-blur-md flex items-center justify-center p-4 select-none animate-fadeIn">
          <div className="w-full max-w-md bg-white p-6 rounded-2xl border border-gray-100 shadow-2xl text-center flex flex-col items-center animate-scaleIn relative">
            <button onClick={() => setShowWelcomeModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer">
              <i className="ph ph-x text-lg"></i>
            </button>

            <div className="w-16 h-16 rounded-full bg-marix-teal/10 text-marix-teal flex items-center justify-center text-3xl mb-4">
              🎉
            </div>

            <h3 className="text-xl font-black text-[#111111] tracking-tight">
              Welcome to Marix!
            </h3>

            <p className="text-xs text-gray-500 max-w-xs leading-relaxed font-medium mt-1 mb-6">
              Personalize your campus experience and discover deals near you.
            </p>

            <div className="w-full text-left flex flex-col gap-1.5 mb-6">
              <label className="text-xs font-bold text-[#111111] px-0.5">Your Campus Hub</label>
              <input 
                type="text" 
                placeholder="e.g., Absu, Uturu" 
                value={onboardingTempCampus} 
                onChange={(e) => setOnboardingTempCampus(e.target.value)} 
                className="w-full bg-transparent border border-gray-200 rounded-xl px-4 py-3 text-base md:text-sm focus:outline-none focus:border-marix-teal text-[#111111] font-medium placeholder:text-gray-400/40" 
              />
            </div>

            <button 
              onClick={() => { 
                if(onboardingTempCampus.trim()) {
                  setUserLocation(onboardingTempCampus.trim());
                  setShopDetails(p => ({...p, campus: onboardingTempCampus.trim()}));
                }
                setShowWelcomeModal(false); 
              }} 
              className="w-full bg-marix-brown text-white font-black text-sm py-3.5 rounded-xl shadow-md hover:opacity-95 transition-all focus:outline-none cursor-pointer"
            >
              Get Started
            </button>
          </div>
        </div>
      )}

      {/* LOGIN RETURNING OVERLAY */}
      {showOnboardingOverlay && (
        <div className="fixed inset-0 z-[250] bg-black/50 backdrop-blur-md flex items-center justify-center p-4 select-none animate-fadeIn">
          <div className="w-full max-w-md bg-white p-6 rounded-2xl border border-gray-100 shadow-2xl text-center flex flex-col items-center animate-scaleIn relative">
            <button onClick={() => setShowOnboardingOverlay(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer">
              <i className="ph ph-x text-lg"></i>
            </button>

            <div className="w-16 h-16 rounded-full bg-marix-teal/10 text-marix-teal flex items-center justify-center text-3xl mb-4">
              <i className="ph ph-map-pin-line font-bold"></i>
            </div>

            <h3 className="text-xl font-black text-[#111111] tracking-tight">
              One Last Step!
            </h3>

            <p className="text-xs text-gray-500 max-w-xs leading-relaxed font-medium mt-1 mb-6">
              Add your campus location to discover nearby sellers and products.
            </p>

            <div className="w-full text-left flex flex-col gap-1.5 mb-6">
              <label className="text-xs font-bold text-[#111111] px-0.5">Campus Location</label>
              <input 
                type="text" 
                placeholder="e.g., Absu, Uturu" 
                value={onboardingTempCampus} 
                onChange={(e) => setOnboardingTempCampus(e.target.value)} 
                className="w-full bg-transparent border border-gray-200 rounded-xl px-4 py-3 text-base md:text-sm focus:outline-none focus:border-marix-teal text-[#111111] font-medium placeholder:text-gray-400/40" 
              />
            </div>

            <button 
              onClick={() => { 
                if(onboardingTempCampus.trim()) {
                  setUserLocation(onboardingTempCampus.trim());
                  setShopDetails(p => ({...p, campus: onboardingTempCampus.trim()}));
                }
                setShowOnboardingOverlay(false); 
              }} 
              className="w-full bg-marix-brown text-white font-black text-sm py-3.5 rounded-xl shadow-md hover:opacity-95 transition-all focus:outline-none cursor-pointer"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* BECOME A SELLER MODAL */}
      {showBecomeSellerModal && (
        <div className="fixed inset-0 z-[250] bg-black/50 backdrop-blur-md flex items-center justify-center p-4 select-none animate-fadeIn">
          <div className="w-full max-w-md bg-white p-6 rounded-2xl border border-gray-100 shadow-2xl flex flex-col animate-scaleIn">
            <div className="w-full flex items-center justify-between mb-4">
              <div className="w-6 h-6 opacity-0"></div>
              <div className="w-12 h-12 rounded-xl bg-marix-teal/10 text-marix-teal flex items-center justify-center text-2xl"><i className="ph ph-storefront font-bold"></i></div>
              <button onClick={() => setShowBecomeSellerModal(false)} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"><i className="ph ph-x text-sm font-bold"></i></button>
            </div>

            <h3 className="text-xl font-black text-[#111111] tracking-tight text-center">Become a Seller</h3>
            <p className="text-xs text-gray-400 font-medium text-center max-w-xs mx-auto mt-1 mb-6">Start selling on Marix in less than a minute.</p>

            <form className="flex flex-col gap-4 text-left" onSubmit={(e) => {
              e.preventDefault();
              setShopDetails(sellerTempDetails);
              if (sellerTempDetails.campus) setUserLocation(sellerTempDetails.campus);
              
              setHasCompletedSellerOnboarding(true);
              setShowBecomeSellerModal(false);
              
              if (sellerRegistrationSource === 'profile') {
                window.dispatchEvent(new CustomEvent('marix_route_to_seller_profile_hub'));
              } else {
                setShowCreateModal(true);
              }
            }}>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#111111] px-0.5">Shop Name *</label>
                <input type="text" required placeholder="e.g., K-dot Collections" value={sellerTempDetails.shopName} onChange={(e) => setSellerTempDetails({ ...sellerTempDetails, shopName: e.target.value })} className="w-full bg-transparent border border-gray-200 rounded-xl px-3.5 py-3 text-base md:text-sm focus:outline-none focus:border-marix-teal font-medium" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#111111] px-0.5">Campus *</label>
                <input type="text" required placeholder="Select your campus" value={sellerTempDetails.campus} onChange={(e) => setSellerTempDetails({ ...sellerTempDetails, campus: e.target.value })} className="w-full bg-transparent border border-gray-200 rounded-xl px-3.5 py-3 text-base md:text-sm focus:outline-none focus:border-marix-teal font-medium" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#111111] px-0.5">WhatsApp Number *</label>
                <input type="text" required placeholder="e.g., 234 701 234 5678" value={sellerTempDetails.whatsappNumber} onChange={(e) => setSellerTempDetails({ ...sellerTempDetails, whatsappNumber: e.target.value })} className="w-full bg-transparent border border-gray-200 rounded-xl px-3.5 py-3 text-base md:text-sm focus:outline-none focus:border-marix-teal font-medium" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#111111] px-0.5">About Your Shop *</label>
                <textarea required rows={2} placeholder="e.g., Premium campus deals on streetwear trends" value={sellerTempDetails.aboutShop} onChange={(e) => setSellerTempDetails({ ...sellerTempDetails, aboutShop: e.target.value })} className="w-full bg-transparent border border-gray-200 rounded-xl px-3.5 py-2 text-base md:text-sm focus:outline-none focus:border-marix-teal font-medium resize-none" />
              </div>

              <button type="submit" className="w-full bg-marix-brown text-white font-black text-sm py-3.5 rounded-xl shadow-md hover:opacity-95 transition-all mt-4 focus:outline-none text-center cursor-pointer">Continue</button>
            </form>
          </div>
        </div>
      )}

      {/* PUBLIC SELLER STOREFRONT MODAL */}
      {publicSellerData && (
        <div className="fixed inset-0 z-[220] bg-black/50 backdrop-blur-md flex items-center justify-center p-4 md:p-6 select-none animate-fadeIn">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl max-h-[80vh] md:max-h-[85vh] overflow-y-auto relative p-5 md:p-8 animate-scaleIn flex flex-col text-left">
            <button 
              onClick={() => setPublicSellerData(null)} 
              className="absolute top-4 right-4 md:top-5 md:right-5 w-8 h-8 md:w-9 md:h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 focus:outline-none cursor-pointer z-10"
            >
              <i className="ph ph-x text-sm md:text-base font-bold"></i>
            </button>

            {/* Merchant Header */}
            <div className="flex flex-col items-center text-center pb-5 border-b border-gray-100">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-marix-teal text-white font-black flex items-center justify-center text-2xl md:text-3xl shadow-md select-none shrink-0 mb-2.5">
                {publicSellerData.shopName.charAt(0).toUpperCase()}
              </div>

              <h2 className="text-lg md:text-xl font-black tracking-tight text-[#111111]">{publicSellerData.shopName}</h2>
              <div className="inline-flex items-center gap-1 text-[10px] bg-marix-teal/10 text-marix-teal font-black px-2.5 py-0.5 rounded-full mt-1 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 bg-marix-teal rounded-full animate-ping"></span> Active Campus Merchant
              </div>

              <div className="flex items-center justify-center gap-3 md:gap-4 text-[11px] md:text-xs font-bold text-gray-400 mt-3 select-none">
                <span className="flex items-center gap-1">
                  <i className="ph ph-map-pin text-marix-teal"></i> {publicSellerData.campus}
                </span>
                <span className="flex items-center gap-1">
                  <i className="ph ph-calendar text-gray-300"></i> Joined {publicSellerData.joinDate}
                </span>
              </div>
            </div>

            {/* About & WhatsApp CTA */}
            <div className="py-4 md:py-5 border-b border-gray-100 flex flex-col gap-2.5">
              <span className="text-[10px] font-black tracking-wider uppercase text-gray-400">About Store</span>
              <p className="text-xs md:text-sm text-gray-600 font-medium leading-relaxed">
                {publicSellerData.aboutShop}
              </p>

              <button 
                type="button" 
                onClick={() => {
                  const cleanNum = publicSellerData.whatsappNumber ? publicSellerData.whatsappNumber.replace(/\D/g, '') : "2348012345678";
                  const msg = encodeURIComponent(`Hello ${publicSellerData.shopName}, I found your store on Marix!`);
                  window.open(`https://wa.me/${cleanNum}?text=${msg}`, '_blank');
                }}
                className="w-full mt-1 border border-gray-200 text-gray-700 font-bold text-xs py-2.5 md:py-3 rounded-xl flex items-center justify-center gap-2 bg-white md:hover:bg-gray-50 focus:outline-none transition-colors cursor-pointer"
              >
                <i className="ph ph-whatsapp-logo text-base text-emerald-500 font-bold"></i>
                <span>Chat on WhatsApp</span>
              </button>
            </div>

            {/* Available Listings Row */}
            <div className="pt-4 md:pt-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black tracking-wider uppercase text-gray-400">
                  Available Listings ({publicSellerData.listings.length})
                </span>

                {publicSellerData.listings.length > 6 && (
                  <button
                    type="button"
                    onClick={handleSeeAllSellerListings}
                    className="text-xs font-black text-marix-teal hover:underline focus:outline-none cursor-pointer uppercase tracking-wider"
                  >
                    See All
                  </button>
                )}
              </div>

              {publicSellerData.listings.length > 0 ? (
                <div className="w-full overflow-x-auto pb-2 flex gap-3 snap-x snap-mandatory">
                  {publicSellerData.listings.slice(0, 6).map((p) => {
                    const primaryImg = p.colorVariants?.find(v => v.isMain) || p.colorVariants?.[0];
                    const fallbackImg = p.images?.find(img => img.isCover) || p.images?.[0];
                    const imgSrc = primaryImg ? primaryImg.imageUrl : (fallbackImg ? fallbackImg.imageUrl : (p.image || "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&q=80"));

                    return (
                      <div 
                        key={p.id}
                        onClick={() => {
                          setSelectedProduct(p);
                          setPublicSellerData(null);
                        }}
                        className="w-[125px] sm:w-[145px] shrink-0 snap-start bg-white p-2 rounded-[16px] border border-gray-100 shadow-sm cursor-pointer hover:scale-[1.02] transition-transform flex flex-col gap-1"
                      >
                        <div className="w-full aspect-square rounded-[10px] overflow-hidden bg-marix-cream/40">
                          <img src={imgSrc} alt={p.productTitle} className="w-full h-full object-cover" />
                        </div>
                        <h4 className="text-xs font-semibold text-[#111111] truncate mt-1">{p.productTitle || p.name}</h4>
                        <span className="text-xs font-black text-marix-teal">{p.price || "₦0"}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="w-full py-6 flex flex-col items-center justify-center text-center bg-gray-50/60 rounded-2xl border border-gray-100 p-5">
                  <i className="ph ph-package text-2xl text-gray-300 mb-1"></i>
                  <h4 className="text-xs font-black text-[#111111]">This seller has no active listings available right now.</h4>
                  <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Check back later or contact the seller directly on WhatsApp.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}