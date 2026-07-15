import React, { useState, useEffect, useRef } from 'react';
import marixLogoM from '../images/marix-logo-m.png';
import Navbar from '../components/Navbar';

export default function About({ 
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
  onNavigateToView
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
        savedCount={savedCount}
        showCreateModal={showCreateModal}
        setShowCreateModal={setShowCreateModal}
        onNavigateToLogin={onNavigateToLogin}
        onNavigateToSignup={onNavigateToSignup}
        // 🚀 ROUTING & SEARCH WIRED
        activeSearchTerm={activeSearchTerm}
        setActiveSearchTerm={setActiveSearchTerm}
        onNavigateToExplore={onNavigateToExplore}
        handleTabChange={(targetTab) => {
          if (onNavigateHome) {
            onNavigateHome();
          } else if (onNavigateToView) {
            onNavigateToView('home');
          }
        }}
      />

      <div ref={observerTargetRef} className="w-full h-px pointer-events-none absolute top-[110px]"></div>
      <div className="w-full h-3 block md:hidden shrink-0"></div>

      <div className="hidden md:block w-full max-w-[95%] mx-auto px-2 lg:px-4 pt-6 select-none">
        <button 
          onClick={onNavigateHome} 
          className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-600 hover:text-marix-teal hover:border-marix-teal transition-all focus:outline-none cursor-pointer"
        >
          <i className="ph ph-arrow-left text-lg font-bold"></i>
        </button>
      </div>

      <main className="w-full max-w-[90%] md:max-w-3xl mx-auto py-6 md:py-12 flex-1">
        <div className="block md:hidden pb-4">
          <button onClick={onNavigateHome} className="w-9 h-9 bg-white border border-gray-200/70 rounded-xl flex items-center justify-center text-gray-600 focus:outline-none active:scale-95 transition-transform shadow-sm">
            <i className="ph ph-arrow-left text-base font-bold"></i>
          </button>
        </div>

        <div className="pb-4 mb-[34px]">
          <h1 className="text-3xl font-black text-[#111111] tracking-tight mb-1">About <span className="text-marix-teal">Marix</span></h1>
          <p className="text-xs font-black tracking-widest text-marix-teal uppercase">Discover. Connect. Grow</p>
        </div>

        <div className="text-xs md:text-sm text-gray-700 leading-relaxed font-medium space-y-4 mb-6">
          <p>
            <span className="text-marix-teal font-bold">Marix</span> is a student-focused platform designed to help people discover products, services, businesses, and opportunities within their community. Whether you're looking for something useful or trying to reach the right audience, <span className="text-marix-teal font-bold">Marix</span> provides a space where discovery happens naturally.
          </p>
          <p>
            We believe great products, businesses, and opportunities shouldn't go unnoticed simply because they lack visibility. By bringing people, products, and opportunities together, <span className="text-marix-teal font-bold">Marix</span> makes it easier to discover what's around you while helping sellers, entrepreneurs, creators, and businesses get discovered by those who matter most.
          </p>
        </div>

        <div className="mt-10 mb-6">
          <h3 className="text-sm font-black text-[#111111] uppercase tracking-wide mb-3">Our Mission</h3>
          <p className="text-gray-600 font-medium leading-relaxed">Our mission is to make discovery easier, faster, and more accessible while helping people and businesses gain the visibility they need to grow.</p>
        </div>

        <div className="mt-10 mb-6">
          <h3 className="text-sm font-black text-[#111111] uppercase tracking-wide mb-3">What You Can Do on <span className="text-marix-teal">Marix</span></h3>
          <ul className="flex flex-col gap-2.5 text-gray-600 list-disc pl-5">
            <li>Discover products and services around you</li>
            <li>Promote your business to a wider audience</li>
            <li>Reach people interested in what you offer</li>
            <li>Explore opportunities within your community</li>
            <li>Connect directly with buyers and sellers</li>
            <li>Stay updated on opportunities within your community.</li>
          </ul>
        </div>

        <div className="mt-10 mb-6">
          <h3 className="text-sm font-black text-[#111111] uppercase tracking-wide mb-3">Our Vision</h3>
          <p className="text-gray-600 font-medium leading-relaxed">We envision communities where products, businesses, services, and opportunities are easier to discover, support, and grow.</p>
        </div>

        <div className="mt-10 mb-8">
          <h3 className="text-sm font-black text-[#111111] uppercase tracking-wide mb-3">Built for Community</h3>
          <p className="text-gray-600 font-medium leading-relaxed">At <span className="text-marix-teal font-bold">Marix</span>, we believe discovery creates opportunity. That's why we're building a platform that helps people find what they need while helping businesses, entrepreneurs, and creators reach the people they're looking for.</p>
        </div>
      </main>

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

      <div className="w-full text-center text-[11px] text-gray-400 font-bold tracking-tight py-6 border-t border-gray-100 bg-white z-30 relative">
        <span>&copy; {new Date().getFullYear()} <span className="text-marix-teal font-bold">Marix</span>. Built for Campus Commerce.</span>
      </div>

    </div>
  );
}