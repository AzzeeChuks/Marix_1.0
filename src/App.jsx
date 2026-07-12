import React, { useState, useEffect } from 'react';
import AuthForm from './components/RegisterForm';
import CreateListing from './components/CreateListing';
import Homepage from './pages/Homepage';
import ProductListings from './pages/ProductListings'; 
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
  
  const [activeTab, setActiveTab] = useState('browse');
  const [userUploads, setUserUploads] = useState([]);
  const [userName, setUserName] = useState('');
  const [activeSearchTerm, setActiveSearchTerm] = useState('');

  // 🚀 HOME-TO-EXPLORE NAVIGATION ROUTING STATES
  const [exploreViewMode, setExploreViewMode] = useState('All');
  const [exploreCategoryFilter, setExploreCategoryFilter] = useState('All Categories');

  const [savedProducts, setSavedProducts] = useState(() => {
    const saved = localStorage.getItem('marix_saved_items');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('marix_saved_items', JSON.stringify(savedProducts));
  }, [savedProducts]);

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

  const handleLoginSuccess = (firstName) => {
    setUserName(firstName || 'Student');
    setIsLoggedIn(true);
    setCurrentView('home');
    setActiveTab('browse');
    setActiveSearchTerm('');
  };

  const handleSignOut = () => {
    setUserName('');
    setIsLoggedIn(false);
    setCurrentView('home');
    setActiveTab('browse');
    setActiveSearchTerm('');
  };

  const handleNewProduct = (newCard) => {
    setProducts([newCard, ...products]);
    setUserUploads(prev => [newCard, ...prev]);
    setShowCreateModal(false); 
    setCurrentView('home');
    setActiveTab('uploads');
    setActiveSearchTerm('');
  };

  // 🚀 CONTEXTUAL NAVIGATION ROUTER HANDOFF ENGINE
  const routeToExploreWithContext = (viewMode = 'All', category = 'All Categories') => {
    setExploreViewMode(viewMode);
    setExploreCategoryFilter(category);
    setCurrentView('explore');
  };

  const routeToSavedTab = () => {
    setCurrentView('home');
    setActiveTab('saved-mobile');
  };

  const routeToUploadsTab = () => {
    setCurrentView('home');
    setActiveTab('uploads');
  };

  const routeToHomeFeed = () => {
    setCurrentView('home');
    setActiveTab('browse');
  };

  const routeToLoginView = () => {
    setCurrentView('auth-login');
  };

  const routeToSignupView = () => {
    setCurrentView('auth-signup');
  };

  const handleStaticViewSwitch = (targetView) => {
    setCurrentView(targetView);
  };

  return (
    <div className="fixed inset-0 bg-marix-cream text-[#111111] flex flex-col overflow-hidden selection:bg-marix-teal/20">
      
      <div className="w-full flex-1 flex flex-col relative overflow-hidden">
        
        {/* HOMEPAGE VIEW FRAME */}
        <div className={`absolute inset-0 flex flex-col ${currentView === 'home' ? 'visible pointer-events-auto' : 'invisible pointer-events-none'}`}>
          <Homepage 
            products={products} 
            isLoggedIn={isLoggedIn} 
            setIsLoggedIn={setIsLoggedIn}
            userName={userName}
            onSignOut={handleSignOut} 
            showCreateModal={showCreateModal}
            setShowCreateModal={setShowCreateModal}
            activeTab={activeTab}        
            setActiveTab={(targetTab) => {
              setActiveTab(targetTab);
            }}  
            userUploads={userUploads}
            savedProducts={savedProducts}
            setSavedProducts={handleToggleSaveProduct}     
            onNavigateToLogin={routeToLoginView}   
            onNavigateToSignup={routeToSignupView} 
            onNavigateToExplore={routeToExploreWithContext} // 🚀 Updated to pass down parameters
            activeSearchTerm={activeSearchTerm}
            setActiveSearchTerm={setActiveSearchTerm}
            onNavigateToView={handleStaticViewSwitch}
          />
        </div>
        
        {/* EXPLORE VIEW FRAME */}
        <div className={`absolute inset-0 flex flex-col ${currentView === 'explore' ? 'visible pointer-events-auto' : 'invisible pointer-events-none'}`}>
          <ProductListings 
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
            userName={userName}
            onNavigateHome={routeToHomeFeed}
            savedProducts={savedProducts}
            setSavedProducts={handleToggleSaveProduct}
            showCreateModal={showCreateModal}
            setShowCreateModal={setShowCreateModal}
            onNavigateToLogin={routeToLoginView}
            onNavigateToSignup={routeToSignupView}
            onNavigateToUploadsTab={routeToUploadsTab}
            onNavigateToSavedTab={routeToSavedTab}
            activeSearchTerm={activeSearchTerm}
            setActiveSearchTerm={setActiveSearchTerm}
            viewMode={exploreViewMode} // 🚀 Track Mode prop
            setViewMode={setExploreViewMode}
            initialCategory={exploreCategoryFilter} // 🚀 Route Category prop
          />
        </div>
        
        {/* AUTH FRAME */}
        {(currentView === 'auth-login' || currentView === 'auth-signup') && (
          <div className="absolute inset-0 overflow-y-auto bg-marix-cream z-50">
            <AuthForm 
              initialMode={currentView === 'auth-login' ? 'login' : 'signup'}
              onSuccessLogin={handleLoginSuccess}
              onCancel={routeToHomeFeed}
            />
          </div>
        )}

        {/* STATIC PORTAL VIEWS WITH INDEPENDENT OVERFLOW WRAPPERS */}
        {['about', 'faq', 'privacy', 'terms'].includes(currentView) && (
          <div className="absolute inset-0 overflow-y-auto bg-marix-cream z-40 text-left">
            {currentView === 'about' && (
              <About 
                onNavigateHome={routeToHomeFeed} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} userName={userName}
                onNavigateToLogin={routeToLoginView} onNavigateToSignup={routeToSignupView} savedCount={savedProducts.length}
                onNavigateToSaved={routeToSavedTab} onNavigateToUploads={routeToUploadsTab} onSignOut={handleSignOut}
                setShowCreateModal={setShowCreateModal} onNavigateToExplore={() => routeToExploreWithContext('All', 'All Categories')} activeSearchTerm={activeSearchTerm}
                setActiveSearchTerm={setActiveSearchTerm} onNavigateToView={handleStaticViewSwitch}
              />
            )}
            {currentView === 'faq' && (
              <Faq 
                onNavigateHome={routeToHomeFeed} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} userName={userName}
                onNavigateToLogin={routeToLoginView} onNavigateToSignup={routeToSignupView} savedCount={savedProducts.length}
                onNavigateToSaved={routeToSavedTab} onNavigateToUploads={routeToUploadsTab} onSignOut={handleSignOut}
                setShowCreateModal={setShowCreateModal} onNavigateToExplore={() => routeToExploreWithContext('All', 'All Categories')} activeSearchTerm={activeSearchTerm}
                setActiveSearchTerm={setActiveSearchTerm} onNavigateToView={handleStaticViewSwitch}
              />
            )}
            {currentView === 'privacy' && (
              <Privacy 
                onNavigateHome={routeToHomeFeed} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} userName={userName}
                onNavigateToLogin={routeToLoginView} onNavigateToSignup={routeToSignupView} savedCount={savedProducts.length}
                onNavigateToSaved={routeToSavedTab} onNavigateToUploads={routeToUploadsTab} onSignOut={handleSignOut}
                setShowCreateModal={setShowCreateModal} onNavigateToExplore={() => routeToExploreWithContext('All', 'All Categories')} activeSearchTerm={activeSearchTerm}
                setActiveSearchTerm={setActiveSearchTerm} onNavigateToView={handleStaticViewSwitch}
              />
            )}
            {currentView === 'terms' && (
              <Terms 
                onNavigateHome={routeToHomeFeed} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} userName={userName}
                onNavigateToLogin={routeToLoginView} onNavigateToSignup={routeToSignupView} savedCount={savedProducts.length}
                onNavigateToSaved={routeToSavedTab} onNavigateToUploads={routeToUploadsTab} onSignOut={handleSignOut}
                setShowCreateModal={setShowCreateModal} onNavigateToExplore={() => routeToExploreWithContext('All', 'All Categories')} activeSearchTerm={activeSearchTerm}
                setActiveSearchTerm={setActiveSearchTerm} onNavigateToView={handleStaticViewSwitch}
              />
            )}
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-[#111111]/40 backdrop-blur-[4px] flex items-center justify-center p-4 md:p-6 select-none animate-fadeIn">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-200/50 max-h-[90vh] overflow-y-auto relative animate-scaleIn">
            <div className="p-1">
              <CreateListing onProductCreated={handleNewProduct} onCancel={() => setShowCreateModal(false)} />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}