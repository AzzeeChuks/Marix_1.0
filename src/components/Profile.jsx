import React, { useEffect, useState } from 'react';

// Helper for WhatsApp link formatting
const formatWhatsAppNumber = (rawPhone = '') => {
  if (!rawPhone) return '2348012345678';
  let digits = rawPhone.replace(/\D/g, '');
  if (digits.startsWith('0')) {
    digits = '234' + digits.substring(1);
  } else if (!digits.startsWith('234') && digits.length === 10) {
    digits = '234' + digits;
  }
  return digits || '2348012345678';
};

const extractPrimaryCampus = (rawLocation = '') => {
  if (!rawLocation) return 'Campus';
  const clean = rawLocation.trim().split(/[,/-]/)[0].trim();
  return clean || 'Campus';
};

export default function Profile({
  userName = "Student",
  userEmail = "",
  campusLocation = "",
  joinDate,
  isSeller = false, 
  onNavigateTab, 
  onLogOut,
  forcedView = 'main',
  setForcedView,
  onBecomeSellerTrigger,
  shopDetails,
  activeUploadsCount = 0,
  setShopDetails,
  userLocation,
  setUserLocation,
  onUpdateUserName,
  onOpenCreateListingModal,
  recentlyViewed = [], 
  onProductCardClick,
  savedProducts = [],
  onToggleSave
}) {
  const currentView = forcedView || 'main';
  const setCurrentView = setForcedView || (() => {});

  const formattedJoinDate = joinDate || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const [showPasswordMasks, setShowPasswordMasks] = useState({ current: false, next: false, confirm: false });
  
  // DRAFT STATE FOR PROFILE EDITING (Raw string saved)
  const [profileForm, setProfileForm] = useState({ 
    firstName: userName, 
    campus: userLocation || campusLocation || '' 
  });
  
  // EDIT SHOP INFO MODAL & DRAFT STATE
  const [showEditShopModal, setShowEditShopModal] = useState(false);
  const [shopEditDraft, setShopEditDraft] = useState({
    shopName: '',
    campus: '',
    whatsappNumber: '',
    aboutShop: ''
  });

  // Password States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordToast, setPasswordToast] = useState(false);

  // Report a Problem States
  const [reportIssueType, setReportIssueType] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [reportImage, setReportImage] = useState(null);
  const [reportSuccessToast, setReportSuccessToast] = useState(false);

  // Recently Viewed Filter State
  const [timeFilter, setTimeFilter] = useState('Today');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Password Rules Validation Logic
  const hasEightChars = newPassword.length >= 8;
  const hasOneNumber = /\d/.test(newPassword);
  const isPasswordValid = hasEightChars && hasOneNumber;
  const passwordsMatch = confirmPassword.length > 0 && confirmPassword === newPassword;

  // FORCE SCROLL TO TOP WHEN ANY PROFILE SUB-PAGE IS SELECTED
  useEffect(() => {
    const container = document.querySelector('.scrollbar-none') || window;
    if (container) {
      if (container.scrollTo) {
        container.scrollTo({ top: 0, behavior: 'instant' });
      } else {
        container.scrollTop = 0;
      }
    }
  }, [currentView]);

  useEffect(() => {
    const handleContextRedirect = () => {
      setCurrentView('seller-dashboard');
    };
    window.addEventListener('marix_route_to_seller_profile_hub', handleContextRedirect);
    return () => window.removeEventListener('marix_route_to_seller_profile_hub', handleContextRedirect);
  }, [setCurrentView]);

  // Sync Draft State with incoming props when profile updates
  useEffect(() => {
    setProfileForm({ firstName: userName, campus: userLocation || campusLocation || '' });
  }, [userName, campusLocation, userLocation]);

  const firstLetter = userName ? userName.charAt(0).toUpperCase() : 'S';
  const resolvedShopName = shopDetails?.shopName || `${userName} Hub`;
  const resolvedCampus = shopDetails?.campus || userLocation || campusLocation || "Select Campus";
  const resolvedAboutText = shopDetails?.aboutShop?.trim() || "Welcome to my store! We look forward to listing our products shortly. Tap the link below to query or message me directly for pre-orders.";

  const filteredRecentlyViewed = recentlyViewed.filter((item) => {
    if (!item.viewedAt) return true;

    const itemDate = new Date(item.viewedAt);
    const now = new Date();
    
    const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const itemMidnight = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate());
    const diffDays = Math.round((todayMidnight - itemMidnight) / (1000 * 60 * 60 * 24));

    if (timeFilter === 'Today') {
      return diffDays === 0;
    } else if (timeFilter === 'Yesterday') {
      return diffDays === 1;
    } else if (timeFilter === 'Earlier') {
      return diffDays > 1;
    }
    return true;
  }).slice(0, 12);

  // 🚀 FIX #1: Keep exact user raw input on profile edit
  const handleSaveProfileChanges = (e) => {
    e.preventDefault();
    const rawCampus = profileForm.campus ? profileForm.campus.trim() : '';

    if (profileForm.firstName.trim() && onUpdateUserName) {
      onUpdateUserName(profileForm.firstName.trim());
    }
    if (setUserLocation) {
      setUserLocation(rawCampus);
    }
    if (setShopDetails && shopDetails) {
      setShopDetails({ ...shopDetails, campus: rawCampus });
    }
    setCurrentView('main');
  };

  const handleOpenEditShopModal = () => {
    setShopEditDraft({
      shopName: shopDetails?.shopName || resolvedShopName,
      campus: shopDetails?.campus || resolvedCampus,
      whatsappNumber: shopDetails?.whatsappNumber || '',
      aboutShop: shopDetails?.aboutShop || ''
    });
    setShowEditShopModal(true);
  };

  // 🚀 FIX #2: Keep exact user raw input on shop edit
  const handleSaveShopDetails = (e) => {
    e.preventDefault();
    const rawCampus = shopEditDraft.campus ? shopEditDraft.campus.trim() : '';
    const formattedPhone = formatWhatsAppNumber(shopEditDraft.whatsappNumber);

    const updated = {
      ...shopEditDraft,
      campus: rawCampus,
      whatsappNumber: formattedPhone
    };

    if (setShopDetails) {
      setShopDetails(updated);
    }
    if (setUserLocation && rawCampus) {
      setUserLocation(rawCampus);
    }

    setShowEditShopModal(false);
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (!isPasswordValid) return;
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    setPasswordToast(true);
    setTimeout(() => {
      setPasswordToast(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setCurrentView('main');
    }, 1500);
  };

  const handleReportSubmit = (e) => {
    e.preventDefault();
    if (!reportIssueType || !reportDescription.trim()) return;
    setReportSuccessToast(true);
    setTimeout(() => {
      setReportSuccessToast(false);
      setReportIssueType('');
      setReportDescription('');
      setReportImage(null);
      setCurrentView('main');
    }, 1500);
  };

  // CONSISTENT SUB-SCREEN HEADER
  const SubScreenHeader = ({ title }) => (
    <div className="w-full flex items-center justify-between pb-3 mb-4 select-none relative max-w-[95%] mx-auto px-1 md:px-4 pt-1 md:pt-4">
      <button 
        type="button"
        onClick={() => {
          setCurrentView('main');
          // Cleanly discard uncommitted profile drafts
          setProfileForm({ firstName: userName, campus: userLocation || campusLocation || '' });
          setNewPassword('');
          setCurrentPassword('');
          setConfirmPassword('');
        }}
        className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-white border border-gray-200/60 flex items-center justify-center text-gray-600 hover:text-marix-teal transition-all focus:outline-none cursor-pointer shadow-sm z-10 shrink-0"
      >
        <i className="ph ph-arrow-left text-lg font-bold"></i>
      </button>
      <h2 className="text-xs md:text-sm font-black uppercase tracking-wider text-[#111111] absolute left-1/2 -translate-x-1/2">
        {title}
      </h2>
      <div className="w-10 h-10 md:w-11 md:h-11 opacity-0 pointer-events-none"></div>
    </div>
  );

  return (
    <div 
      className="w-full min-h-[60vh] flex flex-col relative text-[#111111]"
      style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}
    >
      
      {/* SCREEN 1: MAIN PROFILE CONTAINER */}
      {currentView === 'main' && (
        <div className="flex flex-col flex-1 animate-fadeIn max-w-2xl mx-auto w-full px-1 md:px-4">
          <div className="flex flex-col items-center text-center pb-6 border-b border-gray-200/60 relative mt-1">
            <div className="w-20 h-20 rounded-full bg-marix-teal/10 text-marix-teal font-black flex items-center justify-center text-3xl select-none shrink-0">
              {firstLetter}
            </div>
            
            <h1 className="text-xl font-black mt-3 tracking-tight text-[#111111]">{userName || "Student"}</h1>
            <p className="text-xs font-semibold text-gray-400 mt-0.5">{userEmail || "No email provided"}</p>

            <div className="flex items-center justify-center gap-4 text-[11px] font-bold text-gray-400 mt-3 select-none">
              <span className="flex items-center gap-1">
                <i className="ph ph-map-pin text-marix-teal text-xs"></i> {userLocation || campusLocation || 'Select Campus'}
              </span>
              <span className="flex items-center gap-1">
                <i className="ph ph-calendar text-gray-300 text-xs"></i> Joined {formattedJoinDate}
              </span>
            </div>

            <button 
              type="button"
              onClick={() => setCurrentView('edit-profile')}
              className="bg-marix-teal/5 absolute top-0 right-1 w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-marix-teal transition-colors focus:outline-none cursor-pointer shadow-sm"
            >
              <i className="ph ph-pencil-simple text-sm text-marix-teal"></i>
            </button>
          </div>

          <div className="flex flex-col gap-5 mt-5 flex-1">
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-black tracking-wider uppercase text-gray-400 select-none px-1">Account</span>
              <div className="bg-white border border-gray-200/70 rounded-xl overflow-hidden divide-y divide-gray-100 shadow-sm">
                <button 
                  type="button"
                  onClick={() => setCurrentView('password')}
                  className="w-full p-3.5 flex items-center justify-between hover:bg-marix-cream/60 transition-colors focus:outline-none cursor-pointer group text-left"
                >
                  <div className="flex items-center gap-3 text-xs font-bold text-[#111111]">
                    <i className="ph ph-lock text-base text-gray-400 group-hover:text-marix-teal transition-colors"></i>
                    <span>Change Password</span>
                  </div>
                  <i className="ph ph-caret-right text-gray-400 text-xs group-hover:text-marix-teal transition-colors"></i>
                </button>
                
                <button 
                  type="button"
                  onClick={() => {
                    if (isSeller) {
                      setCurrentView('seller-dashboard');
                    } else {
                      onBecomeSellerTrigger?.();
                    }
                  }}
                  className="w-full p-3.5 flex items-center justify-between hover:bg-marix-cream/60 transition-colors focus:outline-none cursor-pointer group text-left"
                >
                  <div className="flex items-center gap-3 text-xs font-bold text-[#111111]">
                    <i className="ph ph-storefront text-base text-gray-400 group-hover:text-marix-teal transition-colors"></i>
                    <span>{isSeller ? "Seller's Profile" : "Become a Seller"}</span>
                  </div>
                  <i className="ph ph-caret-right text-gray-400 text-xs group-hover:text-marix-teal transition-colors"></i>
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-black tracking-wider uppercase text-gray-400 select-none px-1">Activity</span>
              <div className="bg-white border border-gray-200/70 rounded-xl overflow-hidden divide-y divide-gray-100 shadow-sm">
                <button 
                  type="button"
                  onClick={() => setCurrentView('recently-viewed')}
                  className="w-full p-3.5 flex items-center justify-between hover:bg-marix-cream/60 transition-colors focus:outline-none cursor-pointer group text-left"
                >
                  <div className="flex items-center gap-3 text-xs font-bold text-[#111111]">
                    <i className="ph ph-eye text-base text-gray-400 group-hover:text-marix-teal transition-colors"></i>
                    <span>Recently Viewed</span>
                  </div>
                  <i className="ph ph-caret-right text-gray-400 text-xs group-hover:text-marix-teal transition-colors"></i>
                </button>
                
                <button 
                  type="button"
                  onClick={() => {
                    if (isSeller) setCurrentView('analytics');
                  }}
                  className={`w-full p-3.5 flex items-center justify-between transition-colors focus:outline-none group text-left ${isSeller ? 'hover:bg-marix-cream/60 cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
                >
                  <div className="flex items-center gap-3 text-xs font-bold text-[#111111]">
                    <i className="ph ph-chart-bar text-base text-gray-400 group-hover:text-marix-teal transition-colors"></i>
                    <div className="flex items-center gap-2">
                      <span>Analytics</span>
                      <span className="text-[8px] font-black bg-marix-teal/10 text-marix-teal px-1.5 py-0.5 rounded uppercase tracking-wide">Seller Only</span>
                    </div>
                  </div>
                  <i className="ph ph-caret-right text-gray-400 text-xs group-hover:text-marix-teal transition-colors"></i>
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-black tracking-wider uppercase text-gray-400 select-none px-1">Support</span>
              <div className="bg-white border border-gray-200/70 rounded-xl overflow-hidden divide-y divide-gray-100 shadow-sm">
                <button 
                  type="button" 
                  onClick={() => setCurrentView('report-problem')}
                  className="w-full p-3.5 flex items-center justify-between hover:bg-marix-cream/60 transition-colors focus:outline-none cursor-pointer group text-left"
                >
                  <div className="flex items-center gap-3 text-xs font-bold text-[#111111]">
                    <i className="ph ph-warning-circle text-base text-gray-400 group-hover:text-marix-teal transition-colors"></i>
                    <span>Report a Problem</span>
                  </div>
                  <i className="ph ph-caret-right text-gray-400 text-xs group-hover:text-marix-teal transition-colors"></i>
                </button>
              </div>
            </div>

            <button 
              type="button"
              onClick={onLogOut}
              className="w-full border border-marix-teal/20 bg-white hover:bg-gray-50 text-gray-700 hover:text-marix-teal font-bold text-xs py-3.5 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 focus:outline-none mt-2 cursor-pointer mb-6"
            >
              <i className="ph ph-sign-out text-base text-marix-teal"></i>
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}

      {/* SCREEN 2: RECENTLY VIEWED SCREEN */}
      {currentView === 'recently-viewed' && (
        <div className="flex flex-col flex-1 animate-fadeIn w-full text-left">
          <SubScreenHeader title="Recently Viewed" />

          <div className="w-full max-w-5xl mx-auto px-1 md:px-4 flex flex-col flex-1 pb-12">
            <div className="flex flex-col items-center text-center mt-1 mb-6 select-none">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border border-marix-teal/10 bg-marix-teal/5 flex items-center justify-center text-marix-teal text-xl md:text-2xl mb-3">
                <i className="ph ph-eye text-marix-teal"></i>
              </div>
              <h3 className="text-sm font-black tracking-tight text-[#111111]">Recently Viewed Items</h3>
              <p className="text-xs font-semibold text-gray-400 max-w-[280px] mt-1 leading-normal">
                Keep track of items you've explored across campus.
              </p>
            </div>

            <div className="relative mb-6 select-none z-20">
              <button 
                type="button"
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold text-[#111111] flex items-center gap-2 shadow-sm hover:border-marix-teal transition-colors cursor-pointer"
              >
                <span>{timeFilter}</span>
                <i className="ph ph-caret-down text-gray-400"></i>
              </button>

              {showFilterDropdown && (
                <div className="absolute top-12 left-0 w-40 bg-white border border-gray-100 rounded-xl shadow-xl py-1.5 z-30 animate-scaleIn">
                  {['Today', 'Yesterday', 'Earlier'].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setTimeFilter(option);
                        setShowFilterDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-bold flex items-center justify-between hover:bg-marix-cream/60 transition-colors cursor-pointer"
                    >
                      <span className={timeFilter === option ? 'text-marix-teal' : 'text-[#111111]'}>{option}</span>
                      {timeFilter === option && <i className="ph ph-check text-marix-teal font-bold"></i>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {filteredRecentlyViewed.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 md:gap-5 w-full">
                {filteredRecentlyViewed.map((product) => {
                  const primaryImgObj = product.colorVariants?.find(v => v.isMain) || product.colorVariants?.[0];
                  const fallbackImg = product.images?.find(img => img.isCover) || product.images?.[0];
                  const finalTargetSrc = primaryImgObj ? primaryImgObj.imageUrl : (fallbackImg ? fallbackImg.imageUrl : (product.image || "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&q=80"));

                  const isLiked = savedProducts && Array.isArray(savedProducts) ? savedProducts.some(p => p.id === product.id) : false;
                  const cleanCampusName = extractPrimaryCampus(product.campus || userLocation || 'Campus');

                  return (
                    <div 
                      key={product.id}
                      onClick={() => onProductCardClick?.(product)}
                      className="w-full relative transition-transform duration-200 flex flex-col gap-y-1 select-none group bg-white p-1.5 rounded-[18px] border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.01)] text-left cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                    >
                      <div className="w-full aspect-square rounded-[12px] overflow-hidden bg-marix-cream/40 relative shrink-0">
                        <img 
                          src={finalTargetSrc} 
                          alt={product.productTitle || "Product"} 
                          className="w-full h-full object-cover animate-fadeIn" 
                          loading="lazy" 
                        />
                      </div>

                      <div className="flex flex-col gap-y-0.5 px-1 pb-1 flex-1 justify-between min-w-0">
                        <div className="flex flex-col min-w-0">
                          <h4 className="text-[11px] sm:text-xs md:text-sm font-semibold text-[#111111] truncate tracking-tight mt-1">
                            {product.productTitle || product.name || "Untitled Product"}
                          </h4>
                          <div className="flex items-center gap-x-1 text-[9px] sm:text-[10px] md:text-[11px] text-[#111111]/45 font-bold min-w-0 mt-[2px]">
                            <span className="flex items-center gap-x-0.5 min-w-0 max-w-[50%]">
                              <i className="ph ph-storefront text-xs text-[#111111]/35 shrink-0"></i>
                              <span className="truncate">{product.shopName || userName || "Store"}</span>
                            </span>
                            <span className="text-[#111111]/20 select-none">•</span>
                            <span className="flex items-center gap-x-0.5 min-w-0 flex-1">
                              <i className="ph ph-map-pin text-xs text-[#111111]/35 shrink-0"></i>
                              <span className="truncate">{cleanCampusName}</span>
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-gray-100/50 shrink-0">
                          <span className="text-[11px] sm:text-xs md:text-sm font-black text-marix-teal tracking-tight">
                            {product.price || "₦0"}
                          </span>
                          <button 
                            type="button" 
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              if (onToggleSave) onToggleSave(product); 
                            }} 
                            className={`w-[26px] h-[26px] sm:w-7 sm:h-7 rounded-full border flex items-center justify-center bg-white focus:outline-none transition-colors active:scale-90 cursor-pointer ${isLiked ? 'border-marix-teal text-marix-teal' : 'border-gray-200 text-[#111111]/40'}`}
                          >
                            <svg className="w-[11px] h-[11px] sm:w-[13px] sm:h-[13px]" viewBox="0 0 24 24" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5">
                              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="w-full py-16 flex flex-col items-center justify-center text-center select-none bg-white border border-gray-200/70 rounded-2xl p-6">
                <div className="w-16 h-16 rounded-full bg-marix-teal/10 text-marix-teal flex items-center justify-center text-3xl mb-3">
                  <i className="ph ph-eye-slash text-marix-teal"></i>
                </div>
                <h4 className="text-sm font-black text-[#111111]">No recently viewed items ({timeFilter})</h4>
                <p className="text-xs text-gray-400 max-w-xs leading-relaxed font-semibold mt-1 mb-5">
                  Products you view on the feed or explore page will show up here.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SCREEN 3: MERCHANT STORE HUB DASHBOARD */}
      {currentView === 'seller-dashboard' && (
        <div className="flex flex-col flex-1 animate-fadeIn w-full">
          <SubScreenHeader title="Merchant Hub" />

          <div className="max-w-2xl mx-auto w-full px-1 md:px-4 pb-12 flex flex-col">
            <div className="flex flex-col items-center text-center pb-6 mt-1 relative w-full">
              
              {/* EDIT SHOP INFO TRIGGER */}
              <button
                type="button"
                onClick={handleOpenEditShopModal}
                className="bg-marix-teal/5 absolute top-0 right-1 px-3 py-1.5 rounded-xl border border-gray-200 flex items-center gap-1.5 text-xs font-bold text-marix-teal hover:bg-marix-teal/10 transition-colors focus:outline-none cursor-pointer shadow-sm"
              >
                <i className="ph ph-pencil-simple text-sm"></i>
                <span>Edit Info</span>
              </button>

              <div className="w-20 h-20 rounded-full bg-marix-teal text-white font-black flex items-center justify-center text-3xl shadow-md select-none shrink-0 mt-4 md:mt-0">
                {resolvedShopName.charAt(0).toUpperCase()}
              </div>
              
              <h1 className="text-xl font-black mt-3 tracking-tight text-[#111111]">{resolvedShopName}</h1>
              <div className="inline-flex items-center gap-1 text-[10px] bg-marix-teal/10 text-marix-teal font-black px-2 py-0.5 rounded-full mt-1 uppercase tracking-wider">
                <span className="w-1 h-1 bg-marix-teal rounded-full animate-ping"></span> Active Campus Merchant
              </div>

              <div className="flex items-center justify-center gap-4 text-xs font-bold text-gray-400 mt-4 select-none">
                <span className="flex items-center gap-1">
                  <i className="ph ph-map-pin text-marix-teal"></i> {resolvedCampus}
                </span>
                <span className="flex items-center gap-1">
                  <i className="ph ph-calendar text-gray-300"></i> Joined {formattedJoinDate}
                </span>
              </div>
            </div>

            <div className="bg-white border border-gray-200/70 p-4 rounded-2xl shadow-sm flex flex-col gap-2 text-left mt-2">
              <h4 className="text-xs font-black tracking-wider uppercase text-gray-400">About Business</h4>
              <p className="text-xs md:text-sm text-gray-600 font-medium leading-relaxed">
                {resolvedAboutText}
              </p>
              
              <button 
                type="button" 
                onClick={() => {
                  const cleanNum = formatWhatsAppNumber(shopDetails?.whatsappNumber);
                  window.open(`https://wa.me/${cleanNum}?text=${encodeURIComponent(`Hello ${resolvedShopName}, I found your store on Marix!`)}`, '_blank');
                }}
                className="w-full mt-2 border border-gray-200 text-gray-700 font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 bg-white md:hover:bg-gray-50 focus:outline-none transition-colors cursor-pointer"
              >
                <i className="ph ph-whatsapp-logo text-base text-emerald-500 font-bold"></i>
                <span>Chat on WhatsApp</span>
              </button>
            </div>

            {/* SELLER STATS CARD */}
            <div className="bg-white border border-gray-200/70 p-4 rounded-2xl shadow-sm flex items-center justify-between mt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-marix-teal/5 text-marix-teal flex items-center justify-center text-lg shrink-0">
                  <i className="ph ph-package font-bold"></i>
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-black text-[#111111]">Active Listings</span>
                  <span className="text-[10px] text-gray-400 font-bold">Items viewable on campus feed</span>
                </div>
              </div>
              <span className="text-xl font-black text-[#111111] pr-1">
                {activeUploadsCount || 0}
              </span>
            </div>

            {/* DYNAMIC MERCHANT STORE LISTING CHECK */}
            {activeUploadsCount > 0 ? (
              <div className="w-full bg-white border border-gray-200/70 p-6 rounded-2xl shadow-sm flex flex-col items-center text-center select-none mt-4">
                <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl mb-2.5">
                  <i className="ph ph-check-circle font-bold"></i>
                </div>
                <h4 className="text-sm font-black text-[#111111]">
                  You have {activeUploadsCount} active {activeUploadsCount === 1 ? 'listing' : 'listings'} live on campus.
                </h4>
                <p className="text-xs text-gray-400 max-w-xs leading-relaxed font-semibold mt-1 mb-5">
                  Your products are currently active and discoverable by students across your campus network.
                </p>
                <button 
                  type="button"
                  onClick={() => onNavigateTab?.('uploads')}
                  className="bg-marix-brown text-white font-black text-xs px-6 py-3 rounded-xl shadow-md hover:opacity-95 active:scale-95 transition-all focus:outline-none flex items-center gap-2 cursor-pointer"
                >
                  <i className="ph ph-package font-bold"></i>
                  <span>Manage Listings in Uploads</span>
                </button>
              </div>
            ) : (
              <div className="w-full py-12 flex flex-col items-center justify-center text-center select-none mt-4">
                <div className="w-24 h-24 flex items-center justify-center opacity-40 mb-3">
                  <i className="ph ph-package text-6xl text-marix-teal font-light"></i>
                </div>
                <h4 className="text-base font-black text-[#111111]">You haven't listed any products yet.</h4>
                <p className="text-xs text-gray-400 max-w-xs leading-relaxed font-semibold mt-1 mb-6">
                  Upload your first product and start reaching active student buyers across your campus hub network.
                </p>
                
                <button 
                  type="button"
                  onClick={onOpenCreateListingModal}
                  className="bg-marix-brown text-white font-black text-xs px-6 py-3 rounded-xl shadow-md hover:opacity-95 active:scale-95 transition-all focus:outline-none flex items-center gap-2 cursor-pointer"
                >
                  <i className="ph ph-plus font-black"></i>
                  <span>Create First Listing</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SCREEN 4: SECURITY CHANGE PASSWORD */}
      {currentView === 'password' && (
        <div className="flex flex-col flex-1 animate-fadeIn w-full">
          <SubScreenHeader title="Change Password" />
          
          <div className="w-full max-w-2xl mx-auto px-1 md:px-4 flex flex-col flex-1">
            <div className="flex flex-col items-center text-center mt-1 mb-6 select-none">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border border-marix-teal/10 bg-marix-teal/5 flex items-center justify-center text-marix-teal text-xl md:text-2xl mb-3">
                <i className="ph ph-lock-key text-marix-teal"></i>
              </div>
              <h3 className="text-sm font-black tracking-tight text-[#111111]">Keep your account secure</h3>
              <p className="text-xs font-semibold text-gray-400 max-w-[260px] mt-1 leading-normal">
                Choose a strong password that you don't use on other sites.
              </p>
            </div>

            {passwordToast && (
              <div className="mb-4 bg-marix-teal text-white p-3 rounded-xl text-xs font-bold text-center animate-fadeIn">
                ✓ Password updated successfully!
              </div>
            )}
            
            <form className="flex flex-col gap-y-5 pt-2 flex-1 text-left" onSubmit={handlePasswordUpdate}>
              <div className="flex flex-col gap-1.5 relative text-left">
                <label className="text-xs font-bold text-[#111111] px-0.5">Current Password</label>
                <div className="relative w-full">
                  <input 
                    type={showPasswordMasks.current ? "text" : "password"} 
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="w-full bg-transparent border border-gray-200 rounded-xl pl-3 pr-10 py-2.5 text-base md:text-sm focus:outline-none focus:border-marix-teal text-[#111111] font-medium placeholder:text-gray-400/50"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPasswordMasks({ ...showPasswordMasks, current: !showPasswordMasks.current })}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none text-base cursor-pointer"
                  >
                    <i className={showPasswordMasks.current ? "ph ph-eye-slash" : "ph ph-eye"}></i>
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 relative text-left">
                <label className="text-xs font-bold text-[#111111] px-0.5">New Password</label>
                <div className="relative w-full">
                  <input 
                    type={showPasswordMasks.next ? "text" : "password"} 
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full bg-transparent border border-gray-200 rounded-xl pl-3 pr-10 py-2.5 text-base md:text-sm focus:outline-none focus:border-marix-teal text-[#111111] font-medium placeholder:text-gray-400/50"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPasswordMasks({ ...showPasswordMasks, next: !showPasswordMasks.next })}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none text-base cursor-pointer"
                  >
                    <i className={showPasswordMasks.next ? "ph ph-eye-slash" : "ph ph-eye"}></i>
                  </button>
                </div>

                {newPassword.length > 0 && (
                  <div className="flex items-center gap-3 mt-1 px-1 select-none animate-fadeIn">
                    <span className={`text-[11px] font-semibold flex items-center gap-1 ${hasEightChars ? 'text-emerald-600 font-bold' : 'text-red-500'}`}>
                      {hasEightChars ? '✓' : '•'} 8+ chars
                    </span>
                    <span className={`text-[11px] font-semibold flex items-center gap-1 ${hasOneNumber ? 'text-emerald-600 font-bold' : 'text-red-500'}`}>
                      {hasOneNumber ? '✓' : '•'} 1+ number
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-1.5 relative text-left">
                <label className="text-xs font-bold text-[#111111] px-0.5">Confirm New Password</label>
                <div className="relative w-full">
                  <input 
                    type={showPasswordMasks.confirm ? "text" : "password"} 
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full bg-transparent border border-gray-200 rounded-xl pl-3 pr-10 py-2.5 text-base md:text-sm focus:outline-none focus:border-marix-teal text-[#111111] font-medium placeholder:text-gray-400/50"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPasswordMasks({ ...showPasswordMasks, confirm: !showPasswordMasks.confirm })}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none text-base cursor-pointer"
                  >
                    <i className={showPasswordMasks.confirm ? "ph ph-eye-slash" : "ph ph-eye"}></i>
                  </button>
                </div>

                {confirmPassword.length > 0 && (
                  <div className="flex items-center gap-3 mt-1 px-1 select-none animate-fadeIn">
                    <span className={`text-[11px] font-semibold flex items-center gap-1 ${passwordsMatch ? 'text-emerald-600 font-bold' : 'text-red-500'}`}>
                      {passwordsMatch ? '✓ Passwords match' : '• Passwords do not match'}
                    </span>
                  </div>
                )}
              </div>

              <button 
                type="submit"
                disabled={!isPasswordValid || !passwordsMatch}
                className={`w-full font-black text-xs py-3.5 rounded-xl shadow-md transition-all mt-auto mb-6 cursor-pointer ${isPasswordValid && passwordsMatch ? 'bg-marix-brown text-white hover:opacity-95' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
              >
                Update Password
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SCREEN 5: PROFILE DETAIL FORM */}
      {currentView === 'edit-profile' && (
        <div className="flex flex-col flex-1 animate-fadeIn w-full">
          <SubScreenHeader title="Edit Profile" />

          <div className="w-full max-w-2xl mx-auto px-1 md:px-4 flex flex-col flex-1">
            <div className="flex flex-col items-center text-center mt-1 mb-6 select-none">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border border-marix-teal/10 bg-marix-teal/5 flex items-center justify-center text-marix-teal text-xl md:text-2xl mb-3">
                <i className="ph ph-user-circle-gear text-marix-teal"></i>
              </div>
              <h3 className="text-sm font-black tracking-tight text-[#111111]">Personal Details</h3>
              <p className="text-xs font-semibold text-gray-400 max-w-[260px] mt-1 leading-normal">
                Keep your profile metrics updated to build trust with campus shoppers.
              </p>
            </div>

            <form className="flex flex-col gap-y-6 pt-4 flex-1 text-left" onSubmit={handleSaveProfileChanges}>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#111111] px-0.5">First Name</label>
                <input 
                  type="text" 
                  value={profileForm.firstName}
                  onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                  className="w-full bg-transparent border border-gray-200 rounded-xl px-3 py-2.5 text-base md:text-sm focus:outline-none focus:border-marix-teal text-[#111111] font-medium"
                />
              </div>

              <div className="flex flex-col gap-1.5 select-none">
                <label className="text-xs font-bold text-gray-400 px-0.5">Email Address</label>
                <input 
                  type="email" 
                  value={userEmail}
                  disabled
                  className="w-full bg-gray-100/40 border border-gray-200 text-gray-400 rounded-xl px-3 py-2.5 text-base md:text-sm cursor-not-allowed font-medium"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#111111] px-0.5">Campus Hub Location</label>
                <input 
                  type="text"
                  placeholder="e.g., Absu, Uturu"
                  value={profileForm.campus}
                  onChange={(e) => setProfileForm({ ...profileForm, campus: e.target.value })}
                  className="w-full bg-transparent border border-gray-200 rounded-xl px-3 py-2.5 text-base md:text-sm focus:outline-none focus:border-marix-teal text-[#111111] font-medium placeholder:text-gray-400/50"
                />
              </div>

              <div className="flex flex-col gap-2.5 mt-auto select-none mb-6">
                <button 
                  type="submit"
                  className="w-full bg-marix-brown text-white font-black text-xs py-3.5 rounded-xl shadow-md hover:opacity-95 transition-opacity mt-6 cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SCREEN 6: REPORT A PROBLEM SCREEN */}
      {currentView === 'report-problem' && (
        <div className="flex flex-col flex-1 animate-fadeIn w-full text-left">
          <SubScreenHeader title="Report a Problem" />

          <div className="w-full max-w-lg mx-auto px-1 md:px-4 flex flex-col flex-1">
            <div className="flex flex-col items-center text-center mt-1 mb-6 select-none">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border border-marix-teal/10 bg-marix-teal/5 flex items-center justify-center text-marix-teal text-xl md:text-2xl mb-3">
                <i className="ph ph-warning-circle text-marix-teal"></i>
              </div>
              <h3 className="text-sm font-black tracking-tight text-[#111111]">Report an Issue</h3>
              <p className="text-xs font-semibold text-gray-400 max-w-[280px] mt-1 leading-normal">
                Let us know what went wrong. We'll look into it and get back to you.
              </p>
            </div>

            {reportSuccessToast && (
              <div className="mb-4 bg-marix-teal text-white p-3 rounded-xl text-xs font-bold text-center animate-fadeIn">
                ✓ Report submitted! We will review it shortly.
              </div>
            )}

            <form className="flex flex-col gap-4 text-left flex-1" onSubmit={handleReportSubmit}>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#111111] px-0.5">Issue Type</label>
                <select 
                  required
                  value={reportIssueType}
                  onChange={(e) => setReportIssueType(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-3 text-xs font-semibold focus:outline-none focus:border-marix-teal text-[#111111]"
                >
                  <option value="" disabled hidden>Select an issue</option>
                  <option value="Incorrect product information">Incorrect product information</option>
                  <option value="Wrong category">Wrong category</option>
                  <option value="Misleading photos">Misleading photos</option>
                  <option value="Suspected scam or fake listing">Suspected scam or fake listing</option>
                  <option value="Spam or duplicate listing">Spam or duplicate listing</option>
                  <option value="Inappropriate content">Inappropriate content</option>
                  <option value="Seller is unresponsive">Seller is unresponsive</option>
                  <option value="Technical problem">Technical problem</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5 relative">
                <label className="text-xs font-bold text-[#111111] px-0.5">Description</label>
                <textarea 
                  required
                  rows={4}
                  maxLength={500}
                  placeholder="Describe the problem in detail..."
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl p-3.5 text-base md:text-sm font-medium focus:outline-none focus:border-marix-teal text-[#111111] resize-none placeholder:text-gray-400"
                />
                <span className="absolute bottom-2.5 right-3 text-[10px] font-bold text-gray-400 select-none">
                  {reportDescription.length}/500
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#111111] px-0.5">Attach Screenshot <span className="text-gray-400 font-normal">(Optional)</span></label>
                
                {reportImage ? (
                  <div className="border border-gray-200 rounded-xl p-2 bg-white flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-600 truncate max-w-[200px]">{reportImage.name}</span>
                    <button 
                      type="button" 
                      onClick={() => setReportImage(null)}
                      className="text-xs font-bold text-red-500 hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-gray-200 bg-gray-50/50 rounded-2xl p-5 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors text-center">
                    <i className="ph ph-image text-2xl text-gray-400 mb-1"></i>
                    <span className="text-xs font-bold text-[#111111]">Choose Image</span>
                    <span className="text-[10px] text-gray-400 font-semibold mt-0.5">JPG, PNG up to 5MB</span>
                    <input 
                      type="file" 
                      accept="image/jpeg,image/png" 
                      className="hidden" 
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setReportImage(e.target.files[0]);
                        }
                      }}
                    />
                  </label>
                )}
              </div>

              <div className="flex flex-col items-center gap-2 mt-auto mb-6">
                <button 
                  type="button"
                  onClick={handleReportSubmit}
                  disabled={!reportIssueType || !reportDescription.trim()}
                  className={`w-full py-3.5 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer ${reportIssueType && reportDescription.trim() ? 'bg-marix-brown text-white hover:opacity-95' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                >
                  Submit Report
                </button>
                <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium select-none mt-1">
                  <i className="ph ph-lock text-xs"></i>
                  <span>Your report is private and secure.</span>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SCREEN 7: ANALYTICS */}
      {currentView === 'analytics' && (
        <div className="flex flex-col flex-1 animate-fadeIn w-full text-left select-none">
          <SubScreenHeader title="Analytics" />
          
          <div className="w-full max-w-2xl mx-auto px-1 md:px-4 flex flex-col flex-1">
            <div className="flex flex-col items-center text-center mt-1 mb-6 select-none">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border border-marix-teal/10 bg-marix-teal/5 flex items-center justify-center text-marix-teal text-xl md:text-2xl mb-3">
                <i className="ph ph-chart-bar-horizontal text-marix-teal"></i>
              </div>
              <h3 className="text-sm font-black tracking-tight text-[#111111]">Dashboard Overview</h3>
              <p className="text-xs font-semibold text-gray-400 max-w-[260px] mt-1 leading-normal">
                Track your active traffic metrics and engagement logs inside the hub.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full items-start">
              <div className="bg-white border border-gray-200/70 p-4 rounded-2xl shadow-sm flex items-center justify-between gap-2">
                <div className="flex flex-col gap-y-0.5">
                  <span className="text-[10px] md:text-xs font-bold text-gray-400">Product Views</span>
                  <span className="text-xl md:text-2xl font-black text-[#111111] tracking-tight">0</span>
                </div>
                <div className="w-9 h-9 rounded-xl bg-marix-teal/5 text-marix-teal flex items-center justify-center shrink-0">
                  <i className="ph ph-eye text-lg font-bold"></i>
                </div>
              </div>

              <div className="bg-white border border-gray-200/70 p-4 rounded-2xl shadow-sm flex items-center justify-between gap-2">
                <div className="flex flex-col gap-y-0.5">
                  <span className="text-[10px] md:text-xs font-bold text-gray-400">WhatsApp Clicks</span>
                  <span className="text-xl md:text-2xl font-black text-[#111111] tracking-tight">0</span>
                </div>
                <div className="w-9 h-9 rounded-xl bg-marix-teal/5 text-marix-teal flex items-center justify-center shrink-0">
                  <i className="ph ph-whatsapp-logo text-lg font-bold"></i>
                </div>
              </div>

              <div className="bg-white border border-gray-200/70 p-4 rounded-2xl shadow-sm flex items-center justify-between gap-2">
                <div className="flex flex-col gap-y-0.5">
                  <span className="text-[10px] md:text-xs font-bold text-gray-400">Active Listings</span>
                  <span className="text-xl md:text-2xl font-black text-[#111111] tracking-tight">
                    {activeUploadsCount || 0}
                  </span>
                </div>
                <div className="w-9 h-9 rounded-xl bg-marix-teal/5 text-marix-teal flex items-center justify-center shrink-0">
                  <i className="ph ph-package text-lg font-bold"></i>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mt-6 mb-6">
              <div className="bg-white border border-gray-200/70 p-4 rounded-2xl shadow-sm flex flex-col gap-2.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 px-0.5">Highest Viewed Product</span>
                <div className="flex items-center gap-3 w-full">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-marix-cream/40 shrink-0 border border-gray-100 flex items-center justify-center text-gray-300 font-bold text-xs">None</div>
                  <div className="flex flex-col gap-y-0.5 min-w-0 flex-1">
                    <h4 className="text-xs font-black text-gray-400 truncate">No data listed</h4>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200/70 p-4 rounded-2xl shadow-sm flex flex-col gap-2.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 px-0.5">Lowest Viewed Product</span>
                <div className="flex items-center gap-3 w-full">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-marix-cream/40 shrink-0 border border-gray-100 flex items-center justify-center text-gray-300 font-bold text-xs">None</div>
                  <div className="flex flex-col gap-y-0.5 min-w-0 flex-1">
                    <h4 className="text-xs font-black text-gray-400 truncate">No data listed</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDIT SHOP DETAILS */}
      {showEditShopModal && (
        <div className="fixed inset-0 z-[250] bg-black/50 backdrop-blur-md flex items-center justify-center p-4 select-none animate-fadeIn">
          <div className="w-full max-w-md bg-white p-6 rounded-2xl border border-gray-100 shadow-2xl flex flex-col animate-scaleIn">
            <div className="w-full flex items-center justify-between mb-4">
              <div className="w-6 h-6 opacity-0"></div>
              <div className="w-12 h-12 rounded-xl bg-marix-teal/10 text-marix-teal flex items-center justify-center text-2xl"><i className="ph ph-storefront font-bold"></i></div>
              <button onClick={() => setShowEditShopModal(false)} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"><i className="ph ph-x text-sm font-bold"></i></button>
            </div>

            <h3 className="text-xl font-black text-[#111111] tracking-tight text-center">Edit Business Details</h3>
            <p className="text-xs text-gray-400 font-medium text-center max-w-xs mx-auto mt-1 mb-6">Update your storefront information visible to campus entrepreneurs.</p>

            <form className="flex flex-col gap-4 text-left" onSubmit={handleSaveShopDetails}>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#111111] px-0.5">Business Name *</label>
                <input type="text" required placeholder="e.g., K-dot Collections" value={shopEditDraft.shopName} onChange={(e) => setShopEditDraft({ ...shopEditDraft, shopName: e.target.value })} className="w-full bg-transparent border border-gray-200 rounded-xl px-3.5 py-3 text-base md:text-sm focus:outline-none focus:border-marix-teal font-medium" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#111111] px-0.5">Campus Location *</label>
                <input type="text" required placeholder="e.g., Absu, Uturu" value={shopEditDraft.campus} onChange={(e) => setShopEditDraft({ ...shopEditDraft, campus: e.target.value })} className="w-full bg-transparent border border-gray-200 rounded-xl px-3.5 py-3 text-base md:text-sm focus:outline-none focus:border-marix-teal font-medium" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#111111] px-0.5">WhatsApp Number *</label>
                <input type="text" required placeholder="e.g., 234 701 234 5678" value={shopEditDraft.whatsappNumber} onChange={(e) => setShopEditDraft({ ...shopEditDraft, whatsappNumber: e.target.value })} className="w-full bg-transparent border border-gray-200 rounded-xl px-3.5 py-3 text-base md:text-sm focus:outline-none focus:border-marix-teal font-medium" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#111111] px-0.5">About Your Business *</label>
                <textarea required rows={3} placeholder="Describe your store offerings..." value={shopEditDraft.aboutShop} onChange={(e) => setShopEditDraft({ ...shopEditDraft, aboutShop: e.target.value })} className="w-full bg-transparent border border-gray-200 rounded-xl px-3.5 py-2 text-base md:text-sm focus:outline-none focus:border-marix-teal font-medium resize-none" />
              </div>

              <button type="submit" className="w-full bg-marix-brown text-white font-black text-sm py-3.5 rounded-xl shadow-md hover:opacity-95 transition-all mt-3 focus:outline-none text-center cursor-pointer">Save Details</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}