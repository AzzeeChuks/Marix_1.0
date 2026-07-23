import React, { useState, useEffect, useRef } from 'react';
import marixLogoM from '../images/marix-logo-m.png';
import Navbar from '../components/Navbar';

export default function Terms({ 
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
  activeSearchTerm,
  setActiveSearchTerm,
  onNavigateToExplore,
  onNavigateToView,
  onNavigateToProfileTab,
  onNavigateToNotificationsTab
}) {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const observerTargetRef = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

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
    <div className="min-h-screen bg-marix-cream text-[#111111] flex flex-col justify-between w-full relative overflow-x-hidden md:pt-[76px] pb-0">
      
      <Navbar 
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        userName={userName}
        activeTab="" 
        savedCount={savedCount}
        showCreateModal={false}
        setShowCreateModal={setShowCreateModal}
        onNavigateToLogin={onNavigateToLogin}
        onNavigateToSignup={onNavigateToSignup}
        activeSearchTerm={activeSearchTerm}
        setActiveSearchTerm={setActiveSearchTerm}
        onNavigateToExplore={onNavigateToExplore}
        // 🚀 LINKED LOGO TO ESCAPE HATCH DIRECTLY
        onLogoClick={() => {
          window.dispatchEvent(new CustomEvent('marix_force_home_reset'));
        }}
        // 🚀 DIRECT PROPS: Save history snapshot cleanly before state changes unmount the view!
        onNavigateToNotifications={() => {
          window.sessionStorage.setItem('marix_static_back_source', 'terms');
          onNavigateToView?.('home');
          onNavigateToNotificationsTab?.();
        }}
        onNavigateToProfile={() => {
          window.sessionStorage.setItem('marix_static_back_source', 'terms');
          onNavigateToView?.('home');
          onNavigateToProfileTab?.();
        }}
        handleTabChange={(tab) => {
          if (tab === 'browse' || tab === 'home') {
            window.dispatchEvent(new CustomEvent('marix_force_home_reset'));
            onNavigateHome?.();
            onNavigateToView?.('home');
          }
          else if (tab === 'uploads') {
            onNavigateToView?.('home');
            onNavigateToUploads?.();
          }
          else if (tab === 'saved-mobile') {
            onNavigateToView?.('home');
            onNavigateToSaved?.();
          }
        }}
      />

      <div ref={observerTargetRef} className="w-full h-px pointer-events-none absolute top-[110px]"></div>
      <div className="w-full h-3 block md:hidden shrink-0"></div>

      {/* 🚀 DESKTOP BACK BUTTON VIEW */}
      <div className="hidden md:block w-full max-w-[95%] mx-auto px-2 lg:px-4 pt-6 select-none text-left">
        <button 
          onClick={onNavigateHome} 
          className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-600 hover:text-marix-teal hover:border-marix-teal transition-all focus:outline-none cursor-pointer"
        >
          <i className="ph ph-arrow-left text-lg font-bold"></i>
        </button>
      </div>

      <main className="w-full max-w-[90%] md:max-w-3xl mx-auto py-6 md:py-12 flex-1">
        {/* 🚀 MOBILE BACK BUTTON VIEW */}
        <div className="block md:hidden pb-4 text-left">
          <button 
            onClick={onNavigateHome} 
            className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-600 focus:outline-none active:scale-95 transition-transform cursor-pointer"
          >
            <i className="ph ph-arrow-left text-base font-bold"></i>
          </button>
        </div>

        <div className="pb-4 mb-[34px] text-left">
          <h1 className="text-3xl font-black text-[#111111] tracking-tight mb-1">Terms of Use</h1>
          <p className="text-xs font-black tracking-widest text-marix-teal uppercase">Last updated: August 2026</p>
        </div>

        <div className="text-xs md:text-sm text-gray-700 font-medium leading-relaxed text-left">
          <p className="mb-8">
            Welcome to <span className="text-marix-teal font-bold">Marix</span>. By using <span className="text-marix-teal font-bold">Marix</span>, you agree to these terms. If you do not agree, please do not use the platform.
          </p>

          <div className="mt-10 mb-6">
            <h3 className="text-sm font-black text-[#111111] uppercase tracking-wide mb-3">1. About Marix</h3>
            <p className="text-gray-600">
              <span className="text-marix-teal font-bold">Marix</span> is a campus marketplace that helps students discover products and connect directly with sellers through WhatsApp. <span className="text-marix-teal font-bold">Marix</span> does not process payments or complete transactions on behalf of users.
            </p>
          </div>

          <div className="mt-10 mb-6">
            <h3 className="text-sm font-black text-[#111111] uppercase tracking-wide mb-3">2. User Accounts</h3>
            <p className="text-gray-600 mb-3">To use certain features, you may need to create an account. You are responsible for:</p>
            <ul className="flex flex-col gap-2 text-gray-600 list-disc pl-5">
              <li>Providing accurate information</li>
              <li>Keeping your account secure</li>
              <li>Maintaining the confidentiality of your login details</li>
            </ul>
          </div>

          <div className="mt-10 mb-6">
            <h3 className="text-sm font-black text-[#111111] uppercase tracking-wide mb-3">3. Seller Responsibilities</h3>
            <p className="text-gray-600 mb-3">If you sell on <span className="text-marix-teal font-bold">Marix</span>, you agree to:</p>
            <ul className="flex flex-col gap-2 text-gray-600 list-disc pl-5">
              <li>List genuine products</li>
              <li>Use accurate descriptions and images</li>
              <li>Set fair and honest prices</li>
              <li>Respond respectfully to buyers</li>
              <li>Avoid misleading or fraudulent listings</li>
            </ul>
          </div>

          <div className="mt-10 mb-6">
            <h3 className="text-sm font-black text-[#111111] uppercase tracking-wide mb-3">4. Buyer Responsibilities</h3>
            <p className="text-gray-600 mb-3">Buyers are expected to:</p>
            <ul className="flex flex-col gap-2 text-gray-600 list-disc pl-5">
              <li>Communicate respectfully with sellers</li>
              <li>Verify product details before making purchases</li>
              <li>Complete transactions responsibly</li>
            </ul>
          </div>

          <div className="mt-10 mb-6">
            <h3 className="text-sm font-black text-[#111111] uppercase tracking-wide mb-3">5. Prohibited Content</h3>
            <p className="text-gray-600 mb-3">The following are not allowed on <span className="text-marix-teal font-bold">Marix</span>:</p>
            <ul className="flex flex-col gap-2 text-gray-600 list-disc pl-5 mb-4">
              <li>Illegal products</li>
              <li>Counterfeit or fake goods</li>
              <li>Fraudulent listings</li>
              <li>Spam or duplicate listings</li>
              <li>Content that violates applicable laws</li>
            </ul>
            <p className="text-gray-600 font-semibold italic mt-3 pt-2 border-t border-gray-100">
              <span className="text-marix-teal font-bold">Marix</span> reserves the right to remove listings or suspend accounts that violate these rules.
            </p>
          </div>

          <div className="mt-10 mb-6">
            <h3 className="text-sm font-black text-[#111111] uppercase tracking-wide mb-3">6. Transactions</h3>
            <p className="text-gray-600">
              All purchases happen directly between buyers and sellers through WhatsApp. <span className="text-marix-teal font-bold">Marix</span> is not responsible for payment disputes, delivery issues, or agreements made between users.
            </p>
          </div>

          <div className="mt-10 mb-6">
            <h3 className="text-sm font-black text-[#111111] uppercase tracking-wide mb-3">7. Changes to These Terms</h3>
            <p className="text-gray-600">
              These Terms of Use may be updated as <span className="text-marix-teal font-bold">Marix</span> grows. Continued use of the platform means you accept the updated terms.
            </p>
          </div>

          <div className="mt-10 mb-6">
            <h3 className="text-sm font-black text-[#111111] uppercase tracking-wide mb-3">8. Contact</h3>
            <p className="text-gray-600">
              If you have questions regarding these terms, please contact the <span className="text-marix-teal font-bold">Marix</span> team through the official support channels.
            </p>
          </div>
        </div>
      </main>

      <div className="w-full text-center text-[11px] text-gray-400 font-bold tracking-tight py-6 border-t border-gray-100 bg-white z-30 relative shrink-0">
        <span>&copy; {new Date().getFullYear()} <span className="text-marix-teal font-bold">Marix</span>. Built for Campus Commerce.</span>
      </div>

    </div>
  );
}