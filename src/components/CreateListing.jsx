import React, { useState, useEffect } from 'react';
import imageCompression from 'browser-image-compression';

export default function CreateListing({ onProductCreated, onCancel }) {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [isCompressing, setIsCompressing] = useState(false);

  // 核心 CORE INITIALIZATION
  const [basicInfo, setBasicInfo] = useState({
    productTitle: '',
    category: '',
    price: '',
    productDescription: '',
    shopName: localStorage.getItem('marix_shopName') || '',
    campus: localStorage.getItem('marix_campus') || '',
    whatsappNumber: localStorage.getItem('marix_whatsappNumber') || ''
  });

  const [availableSizes, setAvailableSizes] = useState(['M', 'L', 'XL']);
  const [sizeInput, setSizeInput] = useState('');
  const [productCondition, setProductCondition] = useState('');

  const [colorVariants, setColorVariants] = useState([
    { colorName: '', fileName: '', fileBlob: null, imageUrl: '', isMain: true }
  ]);
  
  const campusCategories = [
    "Fashion",
    "Footwears",
    "Gadgets",
    "Accessories",
    "Beauty",
    "Food & Snacks",
    "Home & Kitchen",
    "Other"
  ];

  // 🔒 SCROLL TRACK FREEZER
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  // 🚀 FIXED DYNAMIC PREFILL & TAG CLEANUP ENGINE
  useEffect(() => {
    const cat = basicInfo.category;
    if (cat === 'Fashion') {
      setAvailableSizes(['M', 'L', 'XL']);
    } else if (cat === 'Footwears') {
      setAvailableSizes(['42', '43', '44']);
    } else if (cat === 'Food & Snacks') {
      setAvailableSizes(['Regular', 'Full Pack']);
    } else {
      setAvailableSizes([]);
    }
  }, [basicInfo.category]);

  // 🧹 THE RESET ENGINE: Clears local storage and empties states to fully unlock inputs
  const handleClearCacheAndReset = () => {
    localStorage.removeItem('marix_shopName');
    localStorage.removeItem('marix_campus');
    localStorage.removeItem('marix_whatsappNumber');
    setBasicInfo({
      productTitle: '',
      category: '',
      price: '',
      productDescription: '',
      shopName: '',
      campus: '',
      whatsappNumber: ''
    });
  };

  // 🔒 LOCK DETERMINATION CHECKS
  const isShopNameLocked = !!localStorage.getItem('marix_shopName');
  const isCampusLocked = !!localStorage.getItem('marix_campus');
  const isWhatsappLocked = !!localStorage.getItem('marix_whatsappNumber');

  const getDynamicLabels = () => {
    const cat = basicInfo.category;
    if (cat === 'Fashion' || cat === 'Footwears') {
      return {
        specLabel: 'Available Sizes',
        specPlaceholder: 'Add size tag (e.g. S, XL, 45)',
        colorLabel: 'Color Variant',
        colorPlaceholder: 'e.g., Black, Beige, Vintage White'
      };
    }
    if (cat === 'Accessories') {
      return {
        specLabel: 'Available Sizes',
        specPlaceholder: 'e.g., Watch Strap Size, Ring Size (Optional)',
        colorLabel: 'Material . Color Variant',
        colorPlaceholder: 'e.g., Gold Plated, Silver Chain, Brown Leather'
      };
    }
    if (cat === 'Gadgets') {
      return {
        specLabel: 'Specification . Storage',
        specPlaceholder: 'e.g., 128GB, 8GB RAM, Unlocked',
        colorLabel: 'Device Color',
        colorPlaceholder: 'e.g., Space Gray, Sierra Blue, Matte Black'
      };
    }
    if (cat === 'Home & Kitchen') {
      return {
        specLabel: 'Specification . Capacity',
        specPlaceholder: 'e.g., 5-Litre, 3-Meter Cord, Plastic',
        colorLabel: 'Color . Design Style',
        colorPlaceholder: 'e.g., Matte Black, Floral Print, Wooden Finish'
      };
    }
    if (cat === 'Beauty') {
      return {
        specLabel: 'Specification . Volume',
        specPlaceholder: 'e.g., 250ml, 100g, 2-Pack',
        colorLabel: 'Type . Extract Variant',
        colorPlaceholder: 'e.g., Aloe Vera, Shea Butter, Charcoal, Scented'
      };
    }
    if (cat === 'Food & Snacks') {
      return {
        specLabel: 'Portion Size . Package Type',
        specPlaceholder: 'e.g., Full Plate, 1 Litre Pack',
        colorLabel: 'Flavor . Prep Option',
        colorPlaceholder: 'e.g., Extra Spicy, Mild Pepper, Vanilla Crumb'
      };
    }
    return {
      specLabel: 'Specification . Condition',
      specPlaceholder: 'e.g., Brand New, Boxed, Slightly Used',
      colorLabel: 'Color . Type Option',
      colorPlaceholder: 'e.g., Midnight Blue, Standard Edition'
    };
  };

  const labels = getDynamicLabels();

  const isFormComplete = 
    basicInfo.productTitle.trim() !== '' &&
    basicInfo.category !== '' &&
    basicInfo.price.trim() !== '' &&
    basicInfo.productDescription.trim() !== '' &&
    basicInfo.shopName.trim() !== '' &&
    basicInfo.campus.trim() !== '' &&
    basicInfo.whatsappNumber.trim() !== '' &&
    colorVariants.every(v => v.colorName.trim() !== '' && (v.fileName.trim() !== '' || v.imageUrl !== ''));

  const handleAddSize = () => {
    if (sizeInput.trim()) {
      const sanitized = sizeInput.trim();
      const finalTag = (basicInfo.category === 'Fashion' || basicInfo.category === 'Footwears') ? sanitized.toUpperCase() : sanitized;
      if (!availableSizes.includes(finalTag)) {
        setAvailableSizes([...availableSizes, finalTag]);
        setSizeInput('');
      }
    }
  };

  const handleRemoveSize = (sizeToRemove) => {
    setAvailableSizes(availableSizes.filter(s => s !== sizeToRemove));
  };

  const handleColorChange = (index, value) => {
    const updated = [...colorVariants];
    updated[index].colorName = value;
    setColorVariants(updated);
  };

  const handleRealImageCompressionUpload = async (index, e) => {
    const rawFile = e.target.files[0];
    if (!rawFile) return;

    setIsCompressing(true);
    const options = {
      maxSizeMB: 0.15,
      maxWidthOrHeight: 1000,
      useWebWorker: true,
      fileType: 'image/webp'
    };

    try {
      const compressedBlob = await imageCompression(rawFile, options);
      const displayUrlBlobString = URL.createObjectURL(compressedBlob);
      
      const updated = [...colorVariants];
      updated[index].fileName = rawFile.name;
      updated[index].fileBlob = compressedBlob;
      updated[index].imageUrl = displayUrlBlobString;
      
      setColorVariants(updated);
    } catch (err) {
      console.error("Compression component track error:", err);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleSetMainImage = (index) => {
    const updated = colorVariants.map((item, idx) => ({
      ...item,
      isMain: idx === index
    }));
    setColorVariants(updated);
  };

  const handleAddColorVariant = () => {
    setColorVariants([...colorVariants, { colorName: '', fileName: '', fileBlob: null, imageUrl: '', isMain: false }]);
  };

  const handleRemoveColorVariant = (index) => {
    if (colorVariants.length > 1) {
      const updated = colorVariants.filter((_, idx) => idx !== index);
      if (!updated.some(item => item.isMain)) {
        updated[0].isMain = true;
      }
      setColorVariants(updated);
    }
  };

  const handlePublish = (e) => {
    e.preventDefault();
    if (!isFormComplete || isCompressing) return;

    setIsLoading(true);

    localStorage.setItem('marix_shopName', basicInfo.shopName.trim());
    localStorage.setItem('marix_campus', basicInfo.campus.trim());
    localStorage.setItem('marix_whatsappNumber', basicInfo.whatsappNumber.trim());

    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);

      const fallbackPlaceholderUrl = "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&q=80";

      const finalProductObj = {
        id: crypto.randomUUID(),
        productTitle: basicInfo.productTitle.trim(),
        shopName: basicInfo.shopName.trim(),
        price: `₦${Number(basicInfo.price).toLocaleString()}`,
        category: basicInfo.category,
        campus: basicInfo.campus.trim(),
        description: basicInfo.productDescription.trim(),
        whatsappNumber: basicInfo.whatsappNumber.trim(),
        condition: productCondition || 'Unspecified',
        availableSizes: availableSizes.length > 0 ? availableSizes : ['Standard Spec'],
        colorVariants: colorVariants.map(variant => ({
          colorName: variant.colorName || 'Standard Variant',
          imageUrl: variant.imageUrl || fallbackPlaceholderUrl,
          isMain: variant.isMain
        }))
      };

      if (onProductCreated) {
        onProductCreated(finalProductObj);
      }

      setBasicInfo(prev => ({
        ...prev,
        productTitle: '',
        price: '',
        productDescription: ''
      }));
      setAvailableSizes(['M', 'L', 'XL']);
      setProductCondition('');
      setColorVariants([{ colorName: '', fileName: '', fileBlob: null, imageUrl: '', isMain: true }]);
      setActiveStep(1);

      setTimeout(() => setSuccess(false), 1000);
    }, 1200);
  };

  const getSubTextDefinition = () => {
    if (productCondition === 'Like New') return '(Slightly Used . No scratches)';
    if (productCondition === 'Fair') return '(Gently Used . Normal wear)';
    return '(Unopened & Unused)';
  };

  // 🎯 BALANCED UNIFIED TYPOGRAPHY SCALING: Small sizing for beautiful mobile UI layouts
  const inputStyles = "w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-marix-teal text-[#111111] font-medium transition-colors placeholder:text-gray-400/70 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed";
  const selectStyles = "w-full border border-gray-200 rounded-xl pl-8 pr-3 py-2 text-xs focus:outline-none focus:border-marix-teal font-medium appearance-none text-[#111111] bg-white cursor-pointer transition-colors";

  return (
    <div 
      className="w-full max-w-2xl mx-auto bg-white border border-gray-200/90 shadow-xl rounded-2xl p-4 md:p-6 text-left relative text-[#111111]"
      style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", touchAction: 'manipulation', zIndex: 99999 }}
    >
      {/* Loading Overlay */}
      {(isLoading || isCompressing) && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-[1px] z-50 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-3 border-marix-teal/20 border-t-marix-teal rounded-full animate-spin"></div>
          <p className="text-[11px] font-bold tracking-wide text-gray-500">
            {isCompressing ? "Optimizing images..." : "Uploading listing..."}
          </p>
        </div>
      )}

      {/* Success Banner */}
      {success && (
        <div className="mb-4 w-full bg-marix-teal text-white px-3 py-2.5 rounded-xl shadow-sm text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <span>✨</span> Listing published successfully! Card generated.
        </div>
      )}

      {/* Header Bar Area */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4 select-none">
        <div className="flex items-center gap-3">
          <button 
            type="button" 
            onClick={onCancel} 
            className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors active:scale-95 focus:outline-none"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
          
          {/* 🧼 PREMIUM GHOST RESET BUTTON */}
          <button
            type="button"
            onClick={handleClearCacheAndReset}
            className="text-[10px] font-bold text-marix-brown bg-white border border-gray-200 hover:border-marix-brown/30 hover:bg-marix-cream/20 px-2.5 py-1 rounded-xl active:scale-95 transition-all focus:outline-none shadow-sm"
          >
            Reset Form
          </button>
        </div>
        
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">Create a Listing</h2>
        
        <button 
          type="button"
          onClick={handlePublish}
          disabled={!isFormComplete || isCompressing}
          className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-tight transition-all duration-300 focus:outline-none ${
            isFormComplete && !isCompressing
              ? 'bg-marix-brown text-white cursor-pointer hover:opacity-95 active:scale-95 shadow-sm' 
              : 'bg-marix-brown/10 text-[#111111]/30 cursor-not-allowed'
          }`}
        >
          Publish
        </button>
      </div>

      {/* Process Index Breadcrumbs Bar */}
      <div className="flex items-center justify-center gap-3 text-[11px] font-bold text-gray-400 mb-5 select-none">
        <div className={`flex items-center gap-1.5 cursor-pointer ${activeStep === 1 ? 'text-marix-teal' : 'text-gray-400'}`} onClick={() => setActiveStep(1)}>
          <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${activeStep === 1 ? 'bg-marix-teal text-white' : 'bg-gray-100 text-gray-500'}`}>1</span>
          <span>Basic Details</span>
        </div>
        <span className="h-px w-6 bg-gray-100"></span>
        <div className={`flex items-center gap-1.5 cursor-pointer ${activeStep === 2 ? 'text-marix-teal' : 'text-gray-400'}`} onClick={() => setActiveStep(2)}>
          <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${activeStep === 2 ? 'bg-marix-teal text-white' : 'bg-gray-100 text-gray-500'}`}>2</span>
          <span>Variants</span>
        </div>
      </div>

      {/* STEP 1 SECTION: BASIC INFORMATION */}
      {activeStep === 1 && (
        <div className="flex flex-col gap-3.5 animate-fadeIn">
          <div className="flex gap-2 items-center mb-0.5 select-none">
            <div className="p-1.5 bg-marix-cream/80 text-marix-teal rounded-lg flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-marix-teal" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#111111]">1. Basic Details</h3>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-[#111111]">Product Title <span className="text-red-500">*</span></label>
            <input type="text" placeholder="e.g., Louis Vuitton Slim-Fit Shirt" maxLength={100} value={basicInfo.productTitle} onChange={(e) => setBasicInfo({ ...basicInfo, productTitle: e.target.value })} className={inputStyles} />
          </div>

          {/* 🔒 SHOP NAME INPUT: readOnly when cached */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-bold text-[#111111]">Shop Name <span className="text-red-500">*</span></label>
              {isShopNameLocked && <span className="text-[9px] font-bold text-gray-400 italic">Locked (Reset to change)</span>}
            </div>
            <input 
              type="text" 
              placeholder="e.g., ThriftByFaith or KicksPlug" 
              value={basicInfo.shopName} 
              disabled={isShopNameLocked}
              onChange={(e) => setBasicInfo({ ...basicInfo, shopName: e.target.value })} 
              className={inputStyles} 
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-[#111111]">Category <span className="text-red-500">*</span></label>
            <div className="relative w-full">
              <select value={basicInfo.category} onChange={(e) => setBasicInfo({ ...basicInfo, category: e.target.value })} className={selectStyles}>
                <option value="" disabled hidden>Select Category</option>
                {campusCategories.map((c, i) => <option key={i} value={c}>{c}</option>)}
              </select>
              <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none flex items-center">
                <i className="ph ph-tag text-sm"></i>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-[#111111]">Product Condition <span className="text-gray-400 font-medium">(Optional)</span></label>
            <div className="relative w-full">
              <select value={productCondition} onChange={(e) => setProductCondition(e.target.value)} className={selectStyles}>
                <option value="">Select condition...</option>
                <option value="Brand New">Brand New</option>
                <option value="Like New">Like New</option>
                <option value="Fair">Fair</option>
              </select>
              <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none flex items-center">
                <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                </svg>
              </div>
            </div>
            <div className="text-[10px] font-medium tracking-tight text-gray-400 flex flex-wrap items-center gap-x-1 select-none mt-0.5">
              <span>Choose the option that best matches your item's current condition</span>
              {productCondition && <span className="text-marix-teal font-semibold italic text-[9px]">{getSubTextDefinition()}</span>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-[#111111]">Price (₦) <span className="text-red-500">*</span></label>
              <input type="number" placeholder="e.g., 15000" value={basicInfo.price} onChange={(e) => setBasicInfo({ ...basicInfo, price: e.target.value })} className={inputStyles} />
            </div>

            {/* 🔒 WHATSAPP INPUT: readOnly when cached */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold text-[#111111]">WhatsApp Number <span className="text-red-500">*</span></label>
                {isWhatsappLocked && <span className="text-[9px] font-bold text-gray-400 italic">Locked</span>}
              </div>
              <input 
                type="tel" 
                placeholder="e.g., 2348012345678" 
                value={basicInfo.whatsappNumber} 
                disabled={isWhatsappLocked}
                onChange={(e) => setBasicInfo({ ...basicInfo, whatsappNumber: e.target.value })} 
                className={inputStyles} 
              />
            </div>
          </div>

          {/* 🔒 CAMPUS HUB LOCATION INPUT: readOnly when cached */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-bold text-[#111111]">Campus Hub Location <span className="text-red-500">*</span></label>
              {isCampusLocked && <span className="text-[9px] font-bold text-gray-400 italic">Locked</span>}
            </div>
            <div className="relative w-full">
              <input 
                type="text" 
                placeholder="e.g., ABSU, Uturu" 
                value={basicInfo.campus} 
                disabled={isCampusLocked}
                onChange={(e) => setBasicInfo({ ...basicInfo, campus: e.target.value })} 
                className={`${inputStyles} pl-8`} 
              />
              <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none flex items-center">
                <i className="ph ph-map-pin text-sm"></i>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-[#111111]">Product Description <span className="text-red-500">*</span></label>
            <textarea placeholder="e.g., Vintage print, high-quality material. Delivery at ABSU." maxLength={500} rows={3} value={basicInfo.productDescription} onChange={(e) => setBasicInfo({ ...basicInfo, productDescription: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-marix-teal resize-none text-[#111111] font-medium" />
          </div>

          <button type="button" onClick={() => setActiveStep(2)} className="w-full mt-1 bg-marix-brown text-white font-bold py-2 rounded-xl text-xs shadow-sm hover:opacity-95 transition-opacity cursor-pointer text-center focus:outline-none">
            Continue to Variants →
          </button>
        </div>
      )}

      {/* STEP 2 SECTION: VARIANTS */}
      {activeStep === 2 && (
        <div className="flex flex-col gap-3.5 animate-fadeIn">
          <div className="bg-white border border-gray-100 rounded-xl p-3 md:p-4 shadow-sm">
            <div className="flex gap-2 items-center mb-4 select-none">
              <div className="p-1.5 bg-marix-cream/80 text-marix-teal rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-marix-teal" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
              </div>
              <h3 className="text-xs font-bold text-[#111111]">2. Product Variants</h3>
            </div>

            <div className="mb-4">
              <h4 className="text-[11px] font-bold text-gray-500 mb-1.5">A. {labels.specLabel} <span className="text-gray-400 font-medium">(Optional)</span></h4>
              <div className="flex flex-wrap gap-1.5 items-center">
                {availableSizes.map((size, index) => (
                  <div key={index} className="flex items-center gap-1 bg-gray-50 border border-gray-100 rounded-lg px-2 py-1 text-[10px] font-bold text-[#111111]">
                    <span>{size}</span>
                    <button type="button" onClick={() => handleRemoveSize(size)} className="text-gray-400 hover:text-red-500 ml-0.5 font-normal text-[10px] focus:outline-none">✕</button>
                  </div>
                ))}
                <div className="flex items-center gap-1 max-w-[180px]">
                  <input type="text" placeholder={labels.specPlaceholder} value={sizeInput} onChange={(e) => setSizeInput(e.target.value)} className="w-full border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none text-[#111111]" />
                  <button type="button" onClick={handleAddSize} className="px-2 py-1 bg-gray-50 hover:bg-gray-100 text-[11px] font-bold rounded-lg border border-gray-200 focus:outline-none">+</button>
                </div>
              </div>
            </div>

            <hr className="border-gray-50 my-3" />

            <div>
              <h4 className="text-[11px] font-bold text-gray-500 mb-0.5">B. {labels.colorLabel} <span className="text-red-500">*</span></h4>
              <p className="text-[9px] text-gray-400 font-medium mb-2.5">Add options and their corresponding presentation images below.</p>

              <div className="flex flex-col gap-3">
                {colorVariants.map((variant, index) => (
                  <div key={index} className="border border-gray-100 p-2.5 rounded-xl bg-gray-50/30 flex flex-col gap-2.5 relative group">
                    {colorVariants.length > 1 && (
                      <button type="button" onClick={() => handleRemoveColorVariant(index)} className="absolute top-2.5 right-2.5 text-gray-400 hover:text-red-500 transition-colors focus:outline-none flex items-center justify-center">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      </button>
                    )}

                    <div className="flex flex-col gap-1 max-w-xs">
                      <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{labels.colorLabel}</label>
                      <input type="text" placeholder={labels.colorPlaceholder} value={variant.colorName} onChange={(e) => handleColorChange(index, e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-2.5 py-1 text-xs focus:outline-none focus:border-marix-teal text-[#111111]" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                      <div className="sm:col-span-4">
                        <label className="border border-dashed border-gray-200 bg-white hover:border-gray-300 rounded-xl p-2 flex flex-col items-center justify-center cursor-pointer transition-colors select-none text-center min-h-[64px]">
                          {variant.imageUrl ? (
                            <div className="w-full h-10 rounded-lg overflow-hidden relative">
                              <img src={variant.imageUrl} alt="Asset container variant" className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <>
                              <svg className="w-4 h-4 text-gray-400 mb-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                              <span className="text-[10px] font-bold text-gray-400">Upload Image</span>
                            </>
                          )}
                          <input type="file" accept="image/*" onChange={(e) => handleRealImageCompressionUpload(index, e)} className="hidden" />
                        </label>
                      </div>

                      <div className="sm:col-span-8">
                        {variant.isMain ? (
                          <div className="bg-green-50/60 border border-green-100 p-2 rounded-xl text-left flex items-start gap-1.5 select-none animate-fadeIn">
                            <svg className="w-3 h-3 text-green-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.5 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                            <div>
                              <h5 className="text-[10px] font-bold text-green-800">Main product image</h5>
                              <p className="text-[9px] text-green-700/70 font-medium">This will be used as your marketplace main card preview template.</p>
                            </div>
                          </div>
                        ) : (
                          <div 
                            onClick={() => handleSetMainImage(index)}
                            className="border border-dashed border-gray-200 bg-white px-2.5 py-1.5 rounded-xl text-left flex items-center gap-1 cursor-pointer hover:border-gray-300 select-none transition-colors text-[10px] text-gray-400 font-bold"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>
                            <span>Set as main thumbnail</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                <button type="button" onClick={handleAddColorVariant} className="w-full border border-dashed border-marix-teal/30 text-marix-teal py-2 rounded-xl text-[11px] font-bold text-center bg-marix-cream/10 hover:bg-marix-cream/30 transition-all focus:outline-none flex items-center justify-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
                  <span>Create New Option Variant Entry</span>
                </button>
              </div>
            </div>
          </div>
          
          <button 
            type="button" 
            onClick={() => setActiveStep(1)} 
            className="text-[11px] font-bold text-gray-400 hover:text-marix-brown self-start transition-colors select-none focus:outline-none"
          >
            ← Back to Basic Details
          </button>
        </div>
      )}

    </div>
  );
}