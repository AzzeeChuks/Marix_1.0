import React, { useState, useEffect } from 'react';
import marixLogoM from '../images/marix-logo-m.png';

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
  setShowCreateModal
}) {
  // 🚀 ACTIVE NAVBAR SCROLL TRACKING COMPUTATION ENGINE: With Cushion Buffer 
  const [isVisibleTopNavbar, setIsVisibleTopNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  useEffect(() => {
    const handleSubScrollPhysics = () => {
      const currentScrollY = window.scrollY;
      const navbarHeight = 76; 
      const tolerance = 15;    

      // 1. Lock absolute top anchor position flat
      if (currentScrollY <= navbarHeight) {
        setIsVisibleTopNavbar(true);
        setLastScrollY(currentScrollY);
        return;
      }

      const scrollDifference = currentScrollY - lastScrollY;

      // 2. Intent analysis loop check
      if (Math.abs(scrollDifference) >= tolerance) {
        if (scrollDifference > 0) {
          // Intentional scroll down: hide it
          setIsVisibleTopNavbar(false);
        } else {
          // Intentional scroll up: drop it cleanly
          setIsVisibleTopNavbar(true);
        }
        setLastScrollY(currentScrollY);
      }
    };

    window.addEventListener('scroll', handleSubScrollPhysics, { passive: true });
    return () => window.removeEventListener('scroll', handleSubScrollPhysics);
  }, [lastScrollY]);

  const userInitial = userName ? userName.trim().charAt(0).toUpperCase() : 'M';

  return (
    <div className="min-h-screen bg-marix-cream text-[#111111] flex flex-col justify-between w-full select-none text-left animate-fadeIn pt-[116px] md:pt-[76px]">
      
      {/* 🏡 Global Sliding Navbar: Strict fixed layout matrix execution */}
      <nav className={`w-full border-b border-[#452b1f]/10 px-2 lg:px-4 py-3 md:py-4 fixed top-0 left-0 right-0 z-40 select-none bg-marix-cream/80 backdrop-blur-[6px] transition-transform duration-300 ${isVisibleTopNavbar ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="max-w-[95%] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2.5 md:gap-4">
          
          {/* 📱 TOP ROW: Logo + Mobile Triggers */}
          <div className="flex items-center justify-between w-full md:w-auto shrink-0">
            <div className="flex items-center cursor-pointer" onClick={onNavigateHome}>
              <img src={marixLogoM} alt="M" style={{ width: '52px', height: '52px', margin: '0 -8px', objectFit: 'contain' }} />
              <span style={{ fontSize: '1.05rem', color: '#452b1f', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }} className="tracking-tight pt-1">ARIX</span>
            </div>

            {/* Mobile-Only Action Utilities Slot */}
            <div className="flex items-center gap-3 md:hidden">
              {isLoggedIn ? (
                <>
                  <button onClick={onNavigateToSaved} className="relative p-1 text-gray-500 focus:outline-none">
                    <i className="ph ph-heart text-xl"></i>
                    {savedCount > 0 && <span className="absolute top-0 right-0 bg-marix-teal text-white font-bold text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center border border-white shadow-sm">{savedCount}</span>}
                  </button>
                  <button className="relative p-1 text-gray-500 focus:outline-none">
                    <i className="ph ph-bell text-xl"></i>
                    <span className="absolute top-0 right-0 bg-marix-teal text-white font-bold text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center border border-white shadow-sm">3</span>
                  </button>
                </>
              ) : (
                <button onClick={onNavigateToLogin} className="p-2 text-gray-600 focus:outline-none"><i className="ph ph-user text-xl"></i></button>
              )}
            </div>
          </div>

          {/* 🎯 UNIVERSAL EMBEDDED SEARCH BAR: Text-base settings blocks Safari zoom tracking */}
          <div className="w-full md:flex-1 max-w-md mx-auto relative flex animate-fadeIn">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
              <i className="ph ph-magnifying-glass text-xs sm:text-sm font-bold"></i>
            </div>
            <input type="text" placeholder="Search for anything..." className="w-full bg-white/50 border border-gray-200/80 rounded-xl pl-8 pr-3 py-1.5 text-base md:text-xs focus:outline-none focus:border-marix-teal text-[#111111] font-medium placeholder-gray-400 shadow-sm md:shadow-none" />
          </div>

          {/* 💻 DESKTOP ACTIONS DOCK */}
          <div className="hidden md:flex items-center gap-4 shrink-0">
            {isLoggedIn && (
              <div className="flex items-center gap-5 mr-2">
                <button onClick={onNavigateToUploads} className="text-xs font-bold text-gray-600 hover:text-marix-teal transition-colors focus:outline-none">My Uploads</button>
              </div>
            )}

            {!isLoggedIn ? (
              <div className="flex items-center gap-2">
                <button onClick={onNavigateToLogin} className="px-4 py-2 text-xs font-bold text-[#111111]/80 hover:text-[#111111] focus:outline-none">Sign In</button>
                <button onClick={onNavigateToSignup} className="px-4 py-2 rounded-xl bg-marix-brown text-white text-xs font-bold shadow-sm hover:opacity-95 transition-all focus:outline-none">Create Account</button>
              </div>
            ) : (
              <div className="flex items-center gap-3 sm:gap-5">
                <button onClick={onNavigateToSaved} className="relative p-1 text-gray-500 min-[1025px]:hover:text-marix-teal transition-colors focus:outline-none">
                  <i className="ph ph-heart text-xl"></i>
                  {savedCount > 0 && <span className="absolute top-0 right-0 bg-marix-teal text-white font-bold text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center border border-white shadow-sm">{savedCount}</span>}
                </button>
                <button className="relative p-1 text-gray-500 hover:text-marix-teal transition-colors focus:outline-none">
                  <i className="ph ph-bell text-xl"></i>
                  <span className="absolute top-0 right-0 bg-marix-teal text-white font-bold text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center border border-white shadow-sm">3</span>
                </button>
                <div className="hidden md:flex items-center gap-3">
                  <button onClick={() => setShowCreateModal(true)} className="bg-marix-brown hover:bg-marix-brown/95 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md active:scale-95 transition-all focus:outline-none">
                    <i className="ph ph-plus font-bold"></i><span>Create Listing</span>
                  </button>
                  <div className="w-8 h-8 rounded-xl bg-marix-brown text-white text-xs font-bold flex items-center justify-center shadow-sm cursor-pointer hover:opacity-90 mr-1" onClick={onSignOut}>{userInitial}</div>
                </div>
              </div>
            )}
          </div>

        </div>
      </nav>

      {/* ⬅️ DESKTOP NAVIGATION */}
      <div className="hidden md:block w-full max-w-[95%] mx-auto px-2 lg:px-4 pt-6 select-none">
        <button onClick={onNavigateHome} className="w-9 h-9 bg-white border border-gray-200/70 rounded-xl flex items-center justify-center text-gray-600 hover:text-marix-teal hover:border-marix-teal/40 focus:outline-none transition-all shadow-sm">
          <i className="ph ph-arrow-left font-bold text-base"></i>
        </button>
      </div>

      <main className="w-full max-w-[90%] md:max-w-3xl mx-auto py-6 md:py-12 flex-1">
        {/* ⬅️ MOBILE NAVIGATION */}
        <div className="block md:hidden pb-4">
          <button onClick={onNavigateHome} className="w-9 h-9 bg-white border border-gray-200/70 rounded-xl flex items-center justify-center text-gray-600 focus:outline-none active:scale-95 transition-transform shadow-sm">
            <i className="ph ph-arrow-left text-base font-bold"></i>
          </button>
        </div>

        <div className="pb-4 mb-8">
          <h1 className="text-3xl font-black text-[#111111] tracking-tight mb-1">Privacy Policy</h1>
          <p className="text-xs font-black tracking-widest text-marix-teal uppercase">Last updated: August 2026</p>
        </div>

        <div className="text-xs md:text-sm text-gray-700 font-medium leading-relaxed">
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
            <p className="text-gray-600 mb-3">
              <span className="text-marix-teal font-bold">Marix</span> does not sell your personal information.
            </p>
            <p className="text-gray-600">
              Information is only shared when necessary to operate the platform or comply with legal obligations.
            </p>
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
            <p className="text-gray-600 mb-3">
              We take reasonable steps to protect your information from unauthorized access or misuse.
            </p>
            <p className="text-gray-600">
              However, no online platform can guarantee absolute security.
            </p>
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
            <p className="text-gray-600 mb-3">
              This Privacy Policy may change as <span className="text-marix-teal font-bold">Marix</span> evolves.
            </p>
            <p className="text-gray-600">
              Significant updates will be communicated through the platform when appropriate.
            </p>
          </div>

          <div className="mt-10 mb-6">
            <h3 className="text-sm font-black text-[#111111] uppercase tracking-wide mb-3">8. Contact</h3>
            <p className="text-gray-600">
              If you have questions about this Privacy Policy, please contact the <span className="text-marix-teal font-bold">Marix</span> team through the official support channels.
            </p>
          </div>
        </div>
      </main>

      <div className="w-full text-center text-[11px] text-gray-400 font-bold py-6 border-t border-gray-100 bg-white">
        &copy; {new Date().getFullYear()} <span className="text-marix-teal font-bold">Marix</span>. Built for Campus Commerce.
      </div>
    </div>
  );
}