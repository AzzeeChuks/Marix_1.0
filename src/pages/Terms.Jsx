import React, { useEffect } from 'react';
import marixLogoM from '../images/marix-logo-m.png';

export default function Terms({ 
  onNavigateHome, 
  isLoggedIn, 
  setIsLoggedIn,
  userName,
  onNavigateToLogin, 
  onNavigateToSignup,
  savedCount,
  onNavigateToSaved,
  onNavigateToUploads, // 🚀 Added routing link hook
  onSignOut,
  setShowCreateModal
}) {
  useEffect(() => { window.scrollTo({ top: 0 }); }, []);
  const userInitial = userName ? userName.trim().charAt(0).toUpperCase() : 'M';

  return (
    <div className="min-h-screen bg-marix-cream text-[#111111] flex flex-col justify-between w-full select-none text-left animate-fadeIn">
      
      {/* 🏡 Global Navbar */}
      <nav className="w-full border-b border-[#452b1f]/10 px-2 lg:px-4 py-3 md:py-4 sticky top-0 z-40 select-none bg-marix-cream/80 backdrop-blur-[6px]">
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

          {/* 🎯 UNIVERSAL EMBEDDED SEARCH BAR: Inline on Desktop, cleanly drops underneath on Mobile */}
          <div className="w-full md:flex-1 max-w-md mx-auto relative flex animate-fadeIn">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
              <i className="ph ph-magnifying-glass text-xs sm:text-sm font-bold"></i>
            </div>
            <input type="text" placeholder="Search for anything..." className="w-full bg-white/50 border border-gray-200/80 rounded-xl pl-8 pr-3 py-1.5 text-[11px] sm:text-xs focus:outline-none focus:border-marix-teal text-[#111111] font-medium placeholder-gray-400 shadow-sm md:shadow-none" />
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
          <h1 className="text-3xl font-black text-[#111111] tracking-tight mb-1">Terms of Use</h1>
          <p className="text-xs font-black tracking-widest text-marix-teal uppercase">Last updated: August 2026</p>
        </div>

        <div className="text-xs md:text-sm text-gray-700 font-medium leading-relaxed">
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

      <div className="w-full text-center text-[11px] text-gray-400 font-bold py-6 border-t border-gray-100 bg-white">
        &copy; {new Date().getFullYear()} <span className="text-marix-teal font-bold">Marix</span>. Built for Campus Commerce.
      </div>
    </div>
  );
}