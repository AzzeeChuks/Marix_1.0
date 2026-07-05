import React, { useState, useEffect } from 'react';
import AuthForm from './components/RegisterForm';
import CreateListing from './components/CreateListing';
import Homepage from './pages/Homepage';
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

  // 🚀 PERSISTENT CLIENT STORAGE ENGINE
  const [savedProducts, setSavedProducts] = useState(() => {
    const saved = localStorage.getItem('marix_saved_items');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('marix_saved_items', JSON.stringify(savedProducts));
  }, [savedProducts]);

  const handleLoginSuccess = (firstName) => {
    setUserName(firstName || 'Student');
    setIsLoggedIn(true);
    setCurrentView('home');
    setActiveTab('browse');
  };

  const handleSignOut = () => {
    setUserName('');
    setIsLoggedIn(false);
    setCurrentView('home');
    setActiveTab('browse');
  };

  const handleNewProduct = (newCard) => {
    setProducts([newCard, ...products]);
    setUserUploads(prev => [newCard, ...prev]);
    setShowCreateModal(false); 
    
    // Smooth transition straight to the user uploads view
    setCurrentView('home');
    setActiveTab('uploads');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 🚀 DIRECT ROUTING INJECTOR: Renders tab states cleanly without hitting homepage feed first
  const routeToSavedTab = () => {
    setCurrentView('home');
    setActiveTab('saved-mobile');
    window.scrollTo({ top: 0 });
  };

  const routeToUploadsTab = () => {
    setCurrentView('home');
    setActiveTab('uploads');
    window.scrollTo({ top: 0 });
  };

  const routeToHomeFeed = () => {
    setCurrentView('home');
    setActiveTab('browse');
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="min-h-screen bg-marix-cream text-[#111111] flex flex-col relative selection:bg-marix-teal/20">
      
      <main className="w-full flex-1 flex flex-col">
        {currentView === 'home' && (
          <Homepage 
            products={products} 
            isLoggedIn={isLoggedIn} 
            setIsLoggedIn={setIsLoggedIn}
            userName={userName}
            onSignOut={handleSignOut}
            showCreateModal={showCreateModal}
            setShowCreateModal={setShowCreateModal}
            activeTab={activeTab}         
            setActiveTab={setActiveTab}   
            userUploads={userUploads}
            savedProducts={savedProducts}
            setSavedProducts={setSavedProducts}     
            onNavigateToLogin={() => setCurrentView('auth-login')}
            onNavigateToSignup={() => setCurrentView('auth-signup')}
            onNavigateToView={(targetView) => {
              if (targetView === 'home') {
                routeToHomeFeed();
              } else {
                setCurrentView(targetView);
              }
            }}
          />
        )}
        
        {(currentView === 'auth-login' || currentView === 'auth-signup') && (
          <AuthForm 
            initialMode={currentView === 'auth-login' ? 'login' : 'signup'}
            onSuccessLogin={handleLoginSuccess}
            onCancel={() => setCurrentView('home')}
          />
        )}

        {/* 🚀 SHARED SYNCHRONIZED APP PORTALS */}
        {currentView === 'about' && (
          <About 
            onNavigateHome={routeToHomeFeed} 
            isLoggedIn={isLoggedIn} 
            setIsLoggedIn={setIsLoggedIn}
            userName={userName}
            onNavigateToLogin={() => setCurrentView('auth-login')} 
            onNavigateToSignup={() => setCurrentView('auth-signup')} 
            savedCount={savedProducts.length}
            onNavigateToSaved={routeToSavedTab}
            onNavigateToUploads={routeToUploadsTab}
            onSignOut={handleSignOut}
            setShowCreateModal={setShowCreateModal}
          />
        )}
        {currentView === 'faq' && (
          <Faq 
            onNavigateHome={routeToHomeFeed} 
            isLoggedIn={isLoggedIn} 
            setIsLoggedIn={setIsLoggedIn}
            userName={userName}
            onNavigateToLogin={() => setCurrentView('auth-login')} 
            onNavigateToSignup={() => setCurrentView('auth-signup')} 
            savedCount={savedProducts.length}
            onNavigateToSaved={routeToSavedTab}
            onNavigateToUploads={routeToUploadsTab}
            onSignOut={handleSignOut}
            setShowCreateModal={setShowCreateModal}
          />
        )}
        {currentView === 'privacy' && (
          <Privacy 
            onNavigateHome={routeToHomeFeed} 
            isLoggedIn={isLoggedIn} 
            setIsLoggedIn={setIsLoggedIn}
            userName={userName}
            onNavigateToLogin={() => setCurrentView('auth-login')} 
            onNavigateToSignup={() => setCurrentView('auth-signup')} 
            savedCount={savedProducts.length}
            onNavigateToSaved={routeToSavedTab}
            onNavigateToUploads={routeToUploadsTab}
            onSignOut={handleSignOut}
            setShowCreateModal={setShowCreateModal}
          />
        )}
        {currentView === 'terms' && (
          <Terms 
            onNavigateHome={routeToHomeFeed} 
            isLoggedIn={isLoggedIn} 
            setIsLoggedIn={setIsLoggedIn}
            userName={userName}
            onNavigateToLogin={() => setCurrentView('auth-login')} 
            onNavigateToSignup={() => setCurrentView('auth-signup')} 
            savedCount={savedProducts.length}
            onNavigateToSaved={routeToSavedTab}
            onNavigateToUploads={routeToUploadsTab}
            onSignOut={handleSignOut}
            setShowCreateModal={setShowCreateModal}
          />
        )}
      </main>

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