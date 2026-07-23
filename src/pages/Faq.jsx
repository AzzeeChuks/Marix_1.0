import React, { useState, useEffect, useRef } from 'react';
import marixLogoM from '../images/marix-logo-m.png';
import Navbar from '../components/Navbar';

export default function Faq({ 
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
  const [openIdx, setOpenIdx] = useState(null);
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

  const faqs = [
    { q: "What is Marix?", a: "Marix is a campus marketplace that helps students discover products and connect directly with sellers through WhatsApp." },
    { q: "Is Marix free?", a: "Yes. Creating an account and listing products is free during the current stage of Marix. Premium features may be introduced in the future." },
    { q: "How do I buy a product?", a: "Browse products, open a listing, and contact the seller directly through WhatsApp." },
    { q: "How do I become a seller?", a: "Create an account and upload your first product." },
    { q: "Does Marix handle payments?", a: "No. Payments are arranged directly between buyers and sellers." },
    { q: "Which universities are supported?", a: "Marix currently supports selected campuses and will continue expanding over time." },
    { q: "Can I edit my listings?", a: "Yes. You can update or remove your listings whenever needed." },
    { q: "How are products shown?", a: "Products are displayed using several factors such as relevance, location, freshness, and platform recommendations to help buyers discover products more easily." },
    { q: "Can I report a seller?", a: "Yes. If you notice fraudulent behaviour or misleading listings, you can report the seller for review." },
    { q: "Why should I join the community?", a: "The Marix Community is where you'll receive product updates, launch announcements, seller tips, polls, and opportunities to help shape future features." }
  ];

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
        onLogoClick={() => {
          window.dispatchEvent(new CustomEvent('marix_force_home_reset'));
        }}
        onNavigateToNotifications={() => {
          window.sessionStorage.setItem('marix_static_back_source', 'faq');
          onNavigateToView?.('home');
          onNavigateToNotificationsTab?.();
        }}
        onNavigateToProfile={() => {
          window.sessionStorage.setItem('marix_static_back_source', 'faq');
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

      {/* DESKTOP BACK BUTTON */}
      <div className="hidden md:block w-full max-w-[95%] mx-auto px-2 lg:px-4 pt-6 select-none text-left">
        <button 
          onClick={onNavigateHome} 
          className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-600 hover:text-marix-teal hover:border-marix-teal transition-all focus:outline-none cursor-pointer"
        >
          <i className="ph ph-arrow-left text-lg font-bold"></i>
        </button>
      </div>
      
      <main className="w-full max-w-[90%] md:max-w-2xl mx-auto py-6 md:py-12 flex-1">
        {/* MOBILE BACK BUTTON */}
        <div className="block md:hidden pb-4 text-left">
          <button 
            onClick={onNavigateHome} 
            className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-600 focus:outline-none active:scale-95 transition-transform cursor-pointer"
          >
            <i className="ph ph-arrow-left text-base font-bold"></i>
          </button>
        </div>

        <div className="pb-4 mb-[34px] text-left">
          <h1 className="text-3xl font-black text-[#111111] tracking-tight mb-1">Frequently Asked Questions</h1>
          <p className="text-xs text-gray-400 font-medium mt-0.5">Quick guides to help you understand how <span className="text-marix-teal">Marix</span> operates.</p>
        </div>

        <div className="flex flex-col gap-3.5 mb-8">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div key={idx} className="bg-white border border-gray-200/60 rounded-2xl overflow-hidden shadow-sm transition-all duration-200">
                <button onClick={() => setOpenIdx(isOpen ? null : idx)} className="w-full px-5 py-4 flex items-center justify-between gap-3 text-left focus:outline-none">
                  <span className="text-xs md:text-sm font-black text-[#111111] tracking-tight">
                    {faq.q.split('Marix').reduce((prev, current, i) => i === 0 ? [current] : [...prev, <span key={i} className="text-marix-teal">Marix</span>, current], [])}
                  </span>
                  <div className={`w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center shrink-0 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180 bg-marix-teal/10 text-marix-teal' : ''}`}>
                    <i className="ph ph-caret-down font-bold text-xs"></i>
                  </div>
                </button>

                <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[200px] border-t border-gray-50' : 'max-h-0'} overflow-hidden`}>
                  <p className="px-5 py-4 text-xs text-gray-600 font-medium leading-relaxed m-0 bg-gray-50/30">
                    {faq.a.split('Marix').reduce((prev, current, i) => i === 0 ? [current] : [...prev, <span key={i} className="text-marix-teal font-bold">Marix</span>, current], [])}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <div className="w-full text-center text-[11px] text-gray-400 font-bold tracking-tight py-6 border-t border-gray-100 bg-white z-30 relative shrink-0">
        <span>&copy; {new Date().getFullYear()} <span className="text-marix-teal font-bold">Marix</span>. Built for Campus Commerce.</span>
      </div>

    </div>
  );
}