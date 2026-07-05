import React, { useState, useEffect } from 'react';
import marixLogoM from '../images/marix-logo-m.png';

export default function Faq({ 
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
  const [openIdx, setOpenIdx] = useState(null);
  useEffect(() => { window.scrollTo({ top: 0 }); }, []);
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
    <div className="min-h-screen bg-marix-cream text-[#111111] flex flex-col justify-between w-full select-none text-left animate-fadeIn">
      
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

      <div className="hidden md:block w-full max-w-[95%] mx-auto px-2 lg:px-4 pt-6 select-none">
        <button onClick={onNavigateHome} className="w-9 h-9 bg-white border border-gray-200/70 rounded-xl flex items-center justify-center text-gray-600 hover:text-marix-teal hover:border-marix-teal/40 focus:outline-none transition-all shadow-sm">
          <i className="ph ph-arrow-left font-bold text-base"></i>
        </button>
      </div>

      <main className="w-full max-w-[90%] md:max-w-2xl mx-auto py-6 md:py-12 flex-1">
        <div className="block md:hidden pb-4">
          <button onClick={onNavigateHome} className="w-9 h-9 bg-white border border-gray-200/70 rounded-xl flex items-center justify-center text-gray-600 focus:outline-none active:scale-95 transition-transform shadow-sm">
            <i className="ph ph-arrow-left text-base font-bold"></i>
          </button>
        </div>

        <div className="border-b border-gray-200 pb-4 mb-6">
          <h1 className="text-2xl md:text-3xl font-black text-[#111111] tracking-tight">Frequently Asked Questions</h1>
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

      <div className="w-full text-center text-[11px] text-gray-400 font-bold py-6 border-t border-gray-100 bg-white">
        &copy; {new Date().getFullYear()} <span className="text-marix-teal font-bold">Marix</span>. Built for Campus Commerce.
      </div>
    </div>
  );
}