import React, { useState } from 'react';
import AuthForm from './components/RegisterForm';
import CreateListing from './components/CreateListing';
import Homepage from './pages/Homepage';
import { initialProducts } from './data/products';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'auth-login' | 'auth-signup'
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [products, setProducts] = useState(initialProducts || []);
  
  // 🚀 FIXED: Global dynamic name state tracking parameter
  const [userName, setUserName] = useState('');

  const handleLoginSuccess = (firstName) => {
    // Save the user's first name globally upon successful handshake connection
    setUserName(firstName || 'Student');
    setIsLoggedIn(true);
    setCurrentView('home');
  };

  const handleSignOut = () => {
    setUserName('');
    setIsLoggedIn(false);
    setCurrentView('home');
  };

  const handleNewProduct = (newCard) => {
    setProducts([newCard, ...products]);
    setShowCreateModal(false); 
  };

  return (
    <div className="min-h-screen bg-marix-cream text-[#111111] flex flex-col relative selection:bg-marix-teal/20">
      
      <main className="w-full flex-1 flex flex-col">
        {currentView === 'home' && (
          <Homepage 
            products={products} 
            isLoggedIn={isLoggedIn} 
            userName={userName} // Pass userName down to track initials dynamically
            onSignOut={handleSignOut}
            showCreateModal={showCreateModal}
            setShowCreateModal={setShowCreateModal}
            onNavigateToLogin={() => setCurrentView('auth-login')}
            onNavigateToSignup={() => setCurrentView('auth-signup')}
          />
        )}
        
        {(currentView === 'auth-login' || currentView === 'auth-signup') && (
          <AuthForm 
            initialMode={currentView === 'auth-login' ? 'login' : 'signup'}
            onSuccessLogin={handleLoginSuccess}
            onCancel={() => setCurrentView('home')}
          />
        )}
      </main>

      {/* UNIVERSAL CREATION MODAL OVERLAY PORTAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-[#111111]/40 backdrop-blur-[4px] flex items-center justify-center p-4 md:p-6 select-none animate-fadeIn">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-200/50 max-h-[90vh] overflow-y-auto relative animate-scaleIn">
            <div className="p-1">
              <CreateListing 
                onProductCreated={handleNewProduct} 
                onCancel={() => setShowCreateModal(false)}
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}