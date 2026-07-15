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
  
  // Set unified dynamic root collection hooks!
  const [products, setProducts] = useState(initialProducts || []);
  const [userUploads, setUserUploads] = useState([]);
  
  const [activeTab, setActiveTab] = useState('browse');
  const [userName, setUserName] = useState('');
  const [activeSearchTerm, setActiveSearchTerm] = useState('');

  const [selectedProduct, setSelectedProduct] = useState(null);

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
    setSelectedProduct(null); 
  };

  const handleNewProduct = (newCard) => {
    // Correctly prepend new product to listings so that it propagates instantly!
    setProducts(prevProducts => [newCard, ...prevProducts]);
    setUserUploads(prev => [newCard, ...prev]);
    setShowCreateModal(false); 
    
    setSelectedProduct(null);
    setCurrentView('home');
    setActiveTab('uploads');
    setActiveSearchTerm('');
  };

  const routeToExploreWithContext = (viewMode = 'All', category = 'All Categories') => {
    setExploreViewMode(viewMode);
    setExploreCategoryFilter(category);
    setCurrentView('explore');
    setSelectedProduct(null); 
  };

  const routeToSavedTab = () => {
    setCurrentView('home');
    setActiveTab('saved-mobile');
    setSelectedProduct(null);
  };

  const routeToUploadsTab = () => {
    setCurrentView('home');
    setActiveTab('uploads');
    setSelectedProduct(null);
  };

  const routeToHomeFeed = () => {
    setCurrentView('home');
    setActiveTab('browse');
    setSelectedProduct(null);
  };

  const routeToLoginView = () => {
    setCurrentView('auth-login');
  };

  const routeToSignupView = () => {
    setCurrentView('auth-signup');
  };

  const handleStaticViewSwitch = (targetView) => {
    setCurrentView(targetView);
    setSelectedProduct(null);
  };

  return (
    <div className="fixed inset-0 bg-marix-cream text-[#111111] flex flex-col overflow-hidden selection:bg-marix-teal/20">
      
      <div className="w-full flex-1 flex flex-col relative overflow-hidden">
        
        {selectedProduct ? (
          <div className="absolute inset-0 overflow-y-auto bg-marix-cream z-50"> 
            <ProductOverview 
              product={selectedProduct}
              allProducts={products}
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              userName={userName}
              showCreateModal={showCreateModal}
              setShowCreateModal={setShowCreateModal}
              onNavigateToLogin={routeToLoginView}
              onNavigateToSignup={routeToSignupView}
              activeSearchTerm={activeSearchTerm}
              setActiveSearchTerm={setActiveSearchTerm}
              onNavigateToExplore={routeToExploreWithContext}
              onNavigateToUploadsTab={routeToUploadsTab}
              onNavigateToSavedTab={routeToSavedTab}
              onNavigateHome={routeToHomeFeed}
              savedProducts={savedProducts}
              onToggleSave={handleToggleSaveProduct}
              onBack={() => setSelectedProduct(null)} 
              onSelectRecommendedProduct={(item) => setSelectedProduct(item)} 
            />
          </div>
        ) : (
          <>
            {/* 🚀 FIXED: True Conditional Rendering. We completely unmount the components when they aren't active. */}
            {currentView === 'home' && (
              <div className="absolute inset-0 flex flex-col">
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
                  onNavigateToExplore={routeToExploreWithContext}
                  activeSearchTerm={activeSearchTerm}
                  setActiveSearchTerm={setActiveSearchTerm}
                  onNavigateToView={handleStaticViewSwitch}
                  onProductCardClick={(clickedItem) => setSelectedProduct(clickedItem)} 
                />
              </div>
            )}
            
            {currentView === 'explore' && (
              <div className="absolute inset-0 flex flex-col animate-fadeIn">
                <ProductListings 
                  allProducts={products} 
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
                  viewMode={exploreViewMode}
                  setViewMode={setExploreViewMode}
                  initialCategory={exploreCategoryFilter}
                  onProductCardClick={(clickedItem) => setSelectedProduct(clickedItem)} 
                />
              </div>
            )}
          </>
        )}
        
        {(currentView === 'auth-login' || currentView === 'auth-signup') && (
          <div className="absolute inset-0 overflow-y-auto bg-marix-cream z-50">
            <AuthForm 
              initialMode={currentView === 'auth-login' ? 'login' : 'signup'}
              onSuccessLogin={handleLoginSuccess}
              onCancel={routeToHomeFeed}
            />
          </div>
        )}

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