import React, { useState, useEffect, useRef } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Navbar from '../components/Navbar';

export default function HowItWorks({
  onNavigateHome,
  isLoggedIn,
  setIsLoggedIn,
  userName,
  savedCount,
  showCreateModal,
  setShowCreateModal,
  onNavigateToLogin,
  onNavigateToSignup,
  activeSearchTerm,
  setActiveSearchTerm,
  onNavigateToExplore,
  onNavigateToSaved,
  onNavigateToUploads,
  onNavigateToProfileTab,
  onNavigateToNotificationsTab,
  onSignOut,
  onNavigateToView
}) {
  const [activeRole, setActiveRole] = useState('buyer'); // 'buyer' | 'seller'
  const [activeStepId, setActiveStepId] = useState(1);
  const [displayedStepId, setDisplayedStepId] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const observerTargetRef = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const buyerSteps = [
    {
      id: 1,
      icon: 'ph-sign-in',
      title: 'Sign Up / Log In',
      description: 'Create your account or log in to start exploring products around you',
      lottieUrl: 'https://lottie.host/d9de55b4-baa7-4da8-ae1f-9a73f9e8331f/rREDP4AeXq.lottie'
    },
    {
      id: 2,
      icon: 'ph-squares-four',
      title: 'Browse Products',
      description: 'Discover food, snacks, and essentials from sellers on your campus',
      lottieUrl: 'https://lottie.host/e3b6a236-13d5-4243-b3d3-91403992c5cf/tEEdMiHL7N.lottie'
    },
    {
      id: 3,
      icon: 'ph-shopping-bag',
      title: 'Pick Your Products',
      description: 'Select what you want and check details, price, and availability',
      lottieUrl: 'https://lottie.host/1ab6ab47-1141-4872-8453-b78a89bf6f95/lXSNgB430o.lottie'
    },
    {
      id: 4,
      icon: 'ph-whatsapp-logo',
      title: 'Send a Message',
      description: 'Chat with the seller instantly on WhatsApp to ask questions or place your order',
      lottieUrl: 'https://lottie.host/167e0e9a-ab9f-40d1-b7dd-ff2eaee3f4c6/1eypoEeU19.lottie'
    }
  ];

  const sellerSteps = [
    {
      id: 1,
      icon: 'ph-sign-in',
      title: 'Sign Up / Log In',
      description: 'Create your account and get ready to upload products and start selling',
      lottieUrl: 'https://lottie.host/d9de55b4-baa7-4da8-ae1f-9a73f9e8331f/rREDP4AeXq.lottie'
    },
    {
      id: 2,
      icon: 'ph-upload-simple',
      title: 'Upload Products',
      description: 'Click "Create Listing" button to upload your product with images, details, and price',
      lottieUrl: 'https://lottie.host/c8d5ea79-f1ef-427c-bcbf-16095d17e59e/4dA8CmhH9o.lottie'
    },
    {
      id: 3,
      icon: 'ph-users-three',
      title: 'Reach Buyers',
      description: 'Your product becomes visible to buyers browsing your campus',
      lottieUrl: 'https://lottie.host/6d5c765d-3573-48ad-a179-365bdc3e4aaf/7qCpr9G66X.lottie'
    },
    {
      id: 4,
      icon: 'ph-whatsapp-logo',
      title: 'Connect on WhatsApp',
      description: 'Receive messages on WhatsApp and arrange pickup or delivery directly with buyers',
      lottieUrl: 'https://lottie.host/4d821b22-ab85-42c8-9c29-8751ea94653d/PIbvkD5q5i.lottie'
    }
  ];

  const currentSteps = activeRole === 'buyer' ? buyerSteps : sellerSteps;
  const activeStep = currentSteps.find(s => s.id === displayedStepId) || currentSteps[0];

  const triggerStepChange = (nextStepId) => {
    if (nextStepId === activeStepId) return;
    setIsTransitioning(true);

    setTimeout(() => {
      setActiveStepId(nextStepId);
      setDisplayedStepId(nextStepId);
      setIsTransitioning(false);
    }, 200);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const nextId = activeStepId >= currentSteps.length ? 1 : activeStepId + 1;
      triggerStepChange(nextId);
    }, 4000);

    return () => clearInterval(interval);
  }, [activeStepId, activeRole, currentSteps.length]);

  const handleRoleSwitch = (role) => {
    setActiveRole(role);
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveStepId(1);
      setDisplayedStepId(1);
      setIsTransitioning(false);
    }, 200);
  };

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
          window.sessionStorage.setItem('marix_static_back_source', 'how-it-works');
          onNavigateToView?.('home');
          onNavigateToNotificationsTab?.();
        }}
        onNavigateToProfile={() => {
          window.sessionStorage.setItem('marix_static_back_source', 'how-it-works');
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

      <main className="w-full max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-12 flex-1 flex flex-col items-center mb-12 md:mb-16">
        {/* MOBILE BACK BUTTON */}
        <div className="w-full block md:hidden pb-4 text-left">
          <button 
            onClick={onNavigateHome} 
            className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-600 focus:outline-none active:scale-95 transition-transform cursor-pointer"
          >
            <i className="ph ph-arrow-left text-base font-bold"></i>
          </button>
        </div>

        {/* HEADER TITLE */}
        <div className="max-w-xl text-center mb-6">
          <h1 className="text-2xl md:text-4xl font-black text-[#111111] tracking-tight mb-2">
            How Marix Works
          </h1>
          <p className="text-xs md:text-sm text-gray-500 font-medium leading-relaxed">
            Easily browse, connect, and complete transactions without any stress, in just a few steps.
          </p>
        </div>

        {/* ROLE SWITCHER BUTTONS */}
        <div className="flex items-center justify-center gap-3 mb-8 md:mb-10 bg-white/60 p-1.5 rounded-2xl border border-gray-200/60 shadow-sm select-none">
          <button
            type="button"
            onClick={() => handleRoleSwitch('buyer')}
            className={`px-6 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
              activeRole === 'buyer'
                ? 'bg-marix-brown text-white shadow-sm'
                : 'text-gray-600 hover:text-[#111111]'
            }`}
          >
            I'm a Buyer
          </button>

          <button
            type="button"
            onClick={() => handleRoleSwitch('seller')}
            className={`px-6 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
              activeRole === 'seller'
                ? 'bg-marix-brown text-white shadow-sm'
                : 'text-gray-600 hover:text-[#111111]'
            }`}
          >
            I'm a Seller
          </button>
        </div>

        {/* TWO-COLUMN GRID (SWAPPED ON MOBILE: TEXT FIRST, ANIMATION SECOND) */}
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 items-center my-auto">
          
          {/* STEP CARDS LIST (ORDER 1 ON MOBILE) */}
        <div className="order-1 md:order-2 md:col-span-6 flex flex-col gap-3">
        {currentSteps.map((step) => {
            const isActive = step.id === activeStepId;
            return (
            <div
                key={step.id}
                onClick={() => triggerStepChange(step.id)}
                className={`w-full p-4 md:p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                isActive
                    ? 'bg-white border-gray-200/90 shadow-md scale-[1.01]'
                    : 'bg-transparent border-transparent hover:bg-white/40 opacity-70 hover:opacity-100'
                }`}
            >
                <div className={`w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                isActive ? 'bg-marix-teal/10 text-marix-teal' : 'bg-gray-100 text-gray-400'
                }`}>
                <i className={`ph ${step.icon} text-lg md:text-xl font-bold`}></i>
                </div>

                <div className="flex flex-col gap-1 text-left">
                <h3 className="text-sm md:text-base font-black text-[#111111] tracking-tight">
                    {step.title}
                </h3>
                <p className="text-xs text-gray-500 font-medium leading-relaxed">
                    {step.description}
                </p>
                </div>
            </div>
            );
        })}
        </div>
          {/* LOTTIE ANIMATION CONTAINER (ORDER 2 ON MOBILE, SCALED DOWN FOR SUB-430PX) */}
          <div className="order-2 md:order-1 md:col-span-6 flex items-center justify-center p-4 md:p-6 rounded-3xl min-h-[220px] sm:min-h-[260px] md:min-h-[420px] overflow-hidden">
            {activeStep && (
                <div 
                    className={`w-full h-44 sm:h-56 md:h-80 flex items-center justify-center transition-all duration-300 ease-in-out ${
                        isTransitioning 
                        ? 'opacity-0 translate-y-4 scale-95' 
                        : 'opacity-100 translate-y-0 scale-100'
                    }`}
                    >
                    <DotLottieReact
                        key={`${activeRole}-${activeStep.id}`}
                        src={activeStep.lottieUrl}
                        loop
                        autoplay
                        className="w-full h-full object-contain"
                    />
                </div>
            )}
            </div>

        </div>
      </main>

      {/* FOOTER WITH EXTRA MARGIN CLEARANCE */}
      <div className="w-full text-center text-[11px] text-gray-400 font-bold tracking-tight py-6 border-t border-gray-100 bg-white z-30 relative shrink-0">
        <span>&copy; {new Date().getFullYear()} <span className="text-marix-teal font-bold">Marix</span>. Built for Campus Commerce.</span>
      </div>

    </div>
  );
}