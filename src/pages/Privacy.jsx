import React, { useState, useEffect, useRef } from 'react';
import marixLogoM from '../images/marix-logo-m.png';
import Navbar from '../components/Navbar';

export default function Privacy({ 
  onNavigateHome, 
  isLoggedIn, 
  setIsLoggedIn,
  userName,
  onNavigateToLogin, 
  onNavigateToSignup,
  savedCount,
  onNavigateToSaved,
  onNavigateToUploads, 
  onSignOut,
  showCreateModal,
  setShowCreateModal,
  activeTab,
  setActiveTab,
  // 🚀 FIXED: Injected these missing props into the signature to stop the white screen crash!
  activeSearchTerm,
  setActiveSearchTerm,
  onNavigateToExplore,
  onNavigateToView
}) {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const observerTargetRef = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  // 🚀 EXACT HOMEPAGE OBSERVER MATCH
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (window.innerWidth < 768) {
          setShowBackToTop(!entry.isIntersecting);
        } else {
          setShowBackToTop(false);
        }
      },
      { threshold: 0, rootMargin: "0px" }
    );

    if (observerTargetRef.current) {
      observer.observe(observerTargetRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // ⚡ EXACT HOMEPAGE BULLET TRAIN SCROLL (150ms)
  const handleFastScrollToTop = () => {
    const startScrollY = window.scrollY;
    const startTime = performance.now();
    const duration = 150; 

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function frameTrack(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const nextScrollY = startScrollY * (1 - easeOutCubic(progress));
      
      if (nextScrollY <= 15 || progress >= 1) {
        window.scrollTo(0, 0);
      } else {
        window.scrollTo(0, nextScrollY);
        window.requestAnimationFrame(frameTrack);
      }
    }
    window.requestAnimationFrame(frameTrack);
  };

  const userInitial = userName ? userName.trim().charAt(0).toUpperCase() : 'M';

  return (
    /* 🎯 REMOVED pb-28: Swapped to pb-0 since the mobile bottom dock doesn't render here anymore */
    <div className="min-h-screen bg-marix-cream text-[#111111] flex flex-col justify-between w-full relative overflow-x-hidden md:pt-[76px] pb-0">
      
      <Navbar 
        isLoggedIn={isLoggedIn} 
        setIsLoggedIn={setIsLoggedIn} 
        userName={userName} 
        savedCount={savedCount} 
        showCreateModal={showCreateModal} 
        setShowCreateModal={setShowCreateModal} 
        onNavigateToLogin={onNavigateToLogin} 
        onNavigateToSignup={onNavigateToSignup}
        
        // 🚀 GLOBAL ROUTING & SEARCH BRIDGE
        // This passes the global state so they can search from anywhere!
        activeSearchTerm={activeSearchTerm} 
        setActiveSearchTerm={setActiveSearchTerm}
        
        // This forces the app to jump to the 'explore' grid view on search
        onNavigateToExplore={onNavigateToExplore} 
        
        handleTabChange={(targetTab) => {
          // Standardizes navigation back to Home/Browse from any static page
          if (onNavigateHome) {
            onNavigateHome();
          } else if (onNavigateToView) {
            onNavigateToView('home');
          }
        }}
      />

      {/* 👑 ANCHOR OBSERVER TRACKER */}
      <div ref={observerTargetRef} className="w-full h-px pointer-events-none absolute top-[110px]"></div>

      {/* 🚀 Precise h-3 spacer right beneath the nav block flow on mobile */}
      <div className="w-full h-3 block md:hidden shrink-0"></div>

      {/* 🚀 DESKTOP BACK BUTTON VIEW: Synchronized with ProductOverview */}
      <div className="hidden md:block w-full max-w-[95%] mx-auto px-2 lg:px-4 pt-6 select-none text-left">
        <button 
          onClick={onNavigateHome} 
          className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-600 hover:text-marix-teal hover:border-marix-teal transition-all focus:outline-none cursor-pointer"
        >
          <i className="ph ph-arrow-left text-lg font-bold"></i>
        </button>
      </div>

      <main className="w-full max-w-[90%] md:max-w-3xl mx-auto py-6 md:py-12 flex-1">
        
        {/* 🚀 MOBILE BACK BUTTON VIEW: Synchronized with ProductOverview and tightened up! */}
        <div className="block md:hidden pb-4 text-left">
          <button 
            onClick={onNavigateHome} 
            className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-600 focus:outline-none active:scale-95 transition-transform cursor-pointer"
          >
            <i className="ph ph-arrow-left text-base font-bold"></i>
          </button>
        </div>

        <div className="pb-4 mb-8 text-left">
          <h1 className="text-3xl font-black text-[#111111] tracking-tight mb-1">Privacy Policy</h1>
          <p className="text-xs font-black tracking-widest text-marix-teal uppercase">Last updated: August 2026</p>
        </div>

        <div className="text-xs md:text-sm text-gray-700 font-medium leading-relaxed text-left">
          <p className="mb-8 text-gray-800">
            <span className="text-marix-teal font-bold">Marix</span> respects your privacy and is committed to protecting your personal information.
          </p>

          <div className="mt-10 mb-6">
            <h3 className="text-sm font-black text-[#111111] uppercase tracking-wide mb-3">1. Information We Collect</h3>
            <p className="text-gray-600 mb-3">When you use <span className="text-marix-teal font-bold">Marix</span>, we may collect:</p>
            <ul className="flex flex-col gap-2.5 text-gray-600 list-disc pl-5">
              <li>Your name</li>
              <li>Email address</li>
              <li>University</li>
              <li>Profile information</li>
              <li>Product listings</li>
              <li>Basic usage information</li>
            </ul>
          </div>

          <div className="mt-10 mb-6">
            <h3 className="text-sm font-black text-[#111111] uppercase tracking-wide mb-3">2. How We Use Your Information</h3>
            <p className="text-gray-600 mb-3">Your information helps us:</p>
            <ul className="flex flex-col gap-2.5 text-gray-600 list-disc pl-5">
              <li>Create and manage your account</li>
              <li>Display your listings</li>
              <li>Improve the platform</li>
              <li>Provide customer support</li>
              <li>Keep <span className="text-marix-teal font-bold">Marix</span> secure</li>
            </ul>
          </div>

          <div className="mt-10 mb-6">
            <h3 className="text-sm font-black text-[#111111] uppercase tracking-wide mb-3">3. Sharing Your Information</h3>
            <p className="text-gray-600 mb-3"><span className="text-marix-teal font-bold">Marix</span> does not sell your personal information.</p>
            <p className="text-gray-600">Information is only shared when necessary to operate the platform or comply with legal obligations.</p>
          </div>

          <div className="mt-10 mb-6">
            <h3 className="text-sm font-black text-[#111111] uppercase tracking-wide mb-3">4. Third-Party Services</h3>
            <p className="text-gray-600 mb-3"><span className="text-marix-teal font-bold">Marix</span> may use trusted third-party services to power the platform, such as:</p>
            <ul className="flex flex-col gap-2.5 text-gray-600 list-disc pl-5 mb-3">
              <li>Authentication services</li>
              <li>Database and cloud infrastructure</li>
              <li>Analytics tools</li>
              <li>WhatsApp for buyer–seller communication</li>
            </ul>
            <p className="text-gray-600 font-semibold italic mt-3 pt-2 border-t border-gray-100">
              Each third-party service manages its own privacy practices.
            </p>
          </div>

          <div className="mt-10 mb-6">
            <h3 className="text-sm font-black text-[#111111] uppercase tracking-wide mb-3">5. Data Security</h3>
            <p className="text-gray-600 mb-3">We take reasonable steps to protect your information from unauthorized access or misuse.</p>
            <p className="text-gray-600">However, no online platform can guarantee absolute security.</p>
          </div>

          <div className="mt-10 mb-6">
            <h3 className="text-sm font-black text-[#111111] uppercase tracking-wide mb-3">6. Your Rights</h3>
            <p className="text-gray-600 mb-3">You may request to:</p>
            <ul className="flex flex-col gap-2.5 text-gray-600 list-disc pl-5">
              <li>Update your account information</li>
              <li>Delete your account</li>
              <li>Remove your listings</li>
            </ul>
          </div>

          <div className="mt-10 mb-6">
            <h3 className="text-sm font-black text-[#111111] uppercase tracking-wide mb-3">7. Policy Updates</h3>
            <p className="text-gray-600 mb-3">This Privacy Policy may change as <span className="text-marix-teal font-bold">Marix</span> evolves.</p>
            <p className="text-gray-600">Significant updates will be communicated through the platform when appropriate.</p>
          </div>

          <div className="mt-10 mb-6">
            <h3 className="text-sm font-black text-[#111111] uppercase tracking-wide mb-3">8. Contact</h3>
            <p className="text-gray-600">If you have questions about this Privacy Policy, please contact the <span className="text-marix-teal font-bold">Marix</span> team through the official support channels.</p>
          </div>
        </div>
      </main>

      {/* 🚀 UPDATED FLOATING ARROW SYSTEM: Changed bottom-6 to bottom-24 to match Homepage height exactly */}
      {/* {showBackToTop && !showCreateModal && (
        <button
          onClick={handleFastScrollToTop}
          className="fixed bottom-24 right-5 w-12 h-12 bg-marix-brown text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all z-[100] focus:outline-none animate-fadeIn"
          style={{ display: window.innerWidth >= 768 ? 'none' : 'flex' }}
          aria-label="Scroll back to top fast"
        >
          <i className="ph ph-arrow-up font-black text-lg"></i>
        </button>
      )} */}

      {/* 🎯 SINGLE PATCHED COPYRIGHT ROW */}
      <div className="w-full text-center text-[11px] text-gray-400 font-bold tracking-tight py-6 border-t border-gray-100 bg-white z-30 relative shrink-0">
        <span>&copy; {new Date().getFullYear()} <span className="text-marix-teal font-bold">Marix</span>. Built for Campus Commerce.</span>
      </div>

    </div>
  );
}