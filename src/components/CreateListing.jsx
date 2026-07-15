import React, { useState, useEffect, useMemo } from 'react';
import imageCompression from 'browser-image-compression';

export default function CreateListing({ onProductCreated, onCancel }) {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [isCompressing, setIsCompressing] = useState(false);

  const [basicInfo, setBasicInfo] = useState({
    productTitle: '',
    category: '',
    price: '',
    productDescription: '',
    shopName: localStorage.getItem('marix_shopName') || '',
    campus: localStorage.getItem('marix_campus') || '',
    whatsappNumber: localStorage.getItem('marix_whatsappNumber') || ''
  });

  const [productCondition, setProductCondition] = useState('');

  // --- GLOBAL SPECIFICATIONS POOL (Defined once, reused everywhere) ---
  const [globalSpecs, setGlobalSpecs] = useState(['M', 'L', 'XL']);
  const [specInput, setSpecInput] = useState('');

  // --- VARIANTS LIST (Equipped with checked selections & custom prices) ---
  const [variantsList, setVariantsList] = useState([{ 
    name: '',
    overridePrice: false,
    customPrice: '',
    enabledSpecs: ['M'], // Stores which global specs are active for this variant
    optionPrices: {}     // Stores price overrides for active options
  }]);
  const [uploadedImages, setUploadedImages] = useState([]); 
  
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

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  // Sync global default specs when the category changes
  useEffect(() => {
    const cat = basicInfo.category;
    let defaultSpecs = [];
    if (cat === 'Fashion') {
      defaultSpecs = ['M', 'L', 'XL'];
    } else if (cat === 'Footwears') {
      defaultSpecs = ['42', '43', '44'];
    } else if (cat === 'Food & Snacks') {
      defaultSpecs = ['Regular', 'Full Pack'];
    }

    setGlobalSpecs(defaultSpecs);

    // Reset variants to default to the first spec of the new category
    setVariantsList(prev => prev.map(v => ({
      ...v,
      enabledSpecs: defaultSpecs.length > 0 ? [defaultSpecs[0]] : [],
      optionPrices: {}
    })));
  }, [basicInfo.category]);

  // Clean condition dynamically on selection of Food & Snacks category
  useEffect(() => {
    if (basicInfo.category === 'Food & Snacks') {
      setProductCondition('');
    }
  }, [basicInfo.category]);

  // Determine Pricing Behavior Model safely
  const isOptionPricingCategory = useMemo(() => {
    const cat = basicInfo.category;
    return ["Gadgets", "Beauty", "Food & Snacks", "Home & Kitchen", "Other"].includes(cat);
  }, [basicInfo.category]);

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
        specPlaceholder: 'e.g., 128GB, 256GB, 8GB RAM',
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
        specPlaceholder: 'e.g., 50ml, 100ml, 250ml',
        colorLabel: 'Type . Extract Variant',
        colorPlaceholder: 'e.g., Aloe Vera, Shea Butter, Charcoal, Scented'
      };
    }
    if (cat === 'Food & Snacks') {
      return {
        specLabel: 'Portion Size . Package Type',
        specPlaceholder: 'e.g., Regular, Full Pack, 1 Litre Pack',
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
    (isOptionPricingCategory || basicInfo.price.trim() !== '') &&
    basicInfo.productDescription.trim() !== '' &&
    basicInfo.shopName.trim() !== '' &&
    basicInfo.campus.trim() !== '' &&
    basicInfo.whatsappNumber.trim() !== '' &&
    (basicInfo.category === 'Food & Snacks' || productCondition !== '') && 
    variantsList.length > 0 &&
    variantsList.every(v => v.name.trim() !== '') &&
    uploadedImages.length > 0 &&
    uploadedImages.every(img => img.variantName.trim() !== '') &&
    uploadedImages.some(img => img.isCover);

  // --- GLOBAL SPECIFICATIONS HANDLERS ---
  const handleAddGlobalSpec = () => {
    if (specInput.trim()) {
      const sanitized = specInput.trim();
      const finalTag = (basicInfo.category === 'Fashion' || basicInfo.category === 'Footwears') ? sanitized.toUpperCase() : sanitized;
      if (!globalSpecs.includes(finalTag)) {
        setGlobalSpecs([...globalSpecs, finalTag]);
        setSpecInput('');

        // Automatically assign the newly added spec to all current variants by default
        setVariantsList(prev => prev.map(v => ({
          ...v,
          enabledSpecs: [...v.enabledSpecs, finalTag]
        })));
      }
    }
  };

  const handleRemoveGlobalSpec = (specToRemove) => {
    setGlobalSpecs(globalSpecs.filter(s => s !== specToRemove));
    // Clean spec reference from all active variants
    setVariantsList(prev => prev.map(v => {
      const filteredSpecs = v.enabledSpecs.filter(s => s !== specToRemove);
      const cleanedPrices = { ...v.optionPrices };
      delete cleanedPrices[specToRemove];
      return {
        ...v,
        enabledSpecs: filteredSpecs,
        optionPrices: cleanedPrices
      };
    }));
  };

  // --- LOCAL VARIANT TOGGLING FOR GLOBAL SPECS ---
  const handleToggleSpecForVariant = (variantIndex, specName) => {
    const updated = [...variantsList];
    const isEnabled = updated[variantIndex].enabledSpecs.includes(specName);

    if (isEnabled) {
      // Disable
      updated[variantIndex].enabledSpecs = updated[variantIndex].enabledSpecs.filter(s => s !== specName);
      if (updated[variantIndex].optionPrices[specName]) {
        delete updated[variantIndex].optionPrices[specName];
      }
    } else {
      // Enable
      updated[variantIndex].enabledSpecs = [...updated[variantIndex].enabledSpecs, specName];
    }
    setVariantsList(updated);
  };

  const handleVariantNameChange = (index, value) => {
    const updated = [...variantsList];
    const oldName = updated[index].name;
    updated[index].name = value;
    setVariantsList(updated);

    setUploadedImages(prev => prev.map(img => {
      if (img.variantName === oldName) {
        return { ...img, variantName: value };
      }
      return img;
    }));
  };

  const handleVariantPriceOverrideToggle = (index) => {
    const updated = [...variantsList];
    updated[index].overridePrice = !updated[index].overridePrice;
    if (!updated[index].overridePrice) {
      updated[index].customPrice = '';
    }
    setVariantsList(updated);
  };

  const handleVariantCustomPriceChange = (index, val) => {
    const updated = [...variantsList];
    updated[index].customPrice = val;
    setVariantsList(updated);
  };

  const handleVariantOptionPriceChange = (variantIndex, optionKey, priceVal) => {
    const updated = [...variantsList];
    if (!updated[variantIndex].optionPrices) {
      updated[variantIndex].optionPrices = {};
    }
    updated[variantIndex].optionPrices[optionKey] = priceVal;
    setVariantsList(updated);
  };

  const handleAddVariantOption = () => {
    setVariantsList([...variantsList, { 
      name: '', 
      overridePrice: false, 
      customPrice: '',
      // Automatically equip the first available spec as default
      enabledSpecs: globalSpecs.length > 0 ? [globalSpecs[0]] : [], 
      optionPrices: {} 
    }]);
  };

  const handleRemoveVariantOption = (index) => {
    if (variantsList.length > 1) {
      const variantToRemove = variantsList[index].name;
      setVariantsList(variantsList.filter((_, idx) => idx !== index));
      setUploadedImages(prev => prev.map(img => {
        if (img.variantName === variantToRemove) {
          return { ...img, variantName: variantsList[0]?.name || '' };
        }
        return img;
      }));
    }
  };

  const handleImagePoolUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    if (uploadedImages.length + files.length > 5) {
      alert("A listing can have a maximum of 5 image uploads total.");
      return;
    }

    setIsCompressing(true);
    const options = {
      maxSizeMB: 0.15,
      maxWidthOrHeight: 1200, 
      useWebWorker: true,
      fileType: 'image/webp'
    };

    try {
      const compressedList = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const compressedBlob = await imageCompression(file, options);
        const displayUrl = URL.createObjectURL(compressedBlob);
        
        compressedList.push({
          id: crypto.randomUUID(),
          fileName: file.name,
          fileBlob: compressedBlob,
          imageUrl: displayUrl,
          variantName: variantsList[0]?.name || '', 
          isCover: false
        });
      }

      const updatedImages = [...uploadedImages, ...compressedList];
      if (!updatedImages.some(img => img.isCover) && updatedImages.length > 0) {
        updatedImages[0].isCover = true;
      }
      setUploadedImages(updatedImages);
    } catch (err) {
      console.error("Compression engine exception:", err);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleRemoveUploadedImage = (id) => {
    const updated = uploadedImages.filter(img => img.id !== id);
    if (updated.length > 0 && !updated.some(img => img.isCover)) {
      updated[0].isCover = true;
    }
    setUploadedImages(updated);
  };

  const handleSetCoverImage = (id) => {
    setUploadedImages(prev => prev.map(img => ({
      ...img,
      isCover: img.id === id
    })));
  };

  const handleImageVariantAssignment = (id, targetVariantName) => {
    setUploadedImages(prev => prev.map(img => {
      if (img.id === id) {
        return { ...img, variantName: targetVariantName };
      }
      return img;
    }));
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

      const fallbackPlaceholderUrl = "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&q=80";
      const coverImageObj = uploadedImages.find(img => img.isCover) || uploadedImages[0];
      const coverUrl = coverImageObj ? coverImageObj.imageUrl : fallbackPlaceholderUrl;

      const compatibleColorVariants = variantsList.map(variantOption => {
        const variantImages = uploadedImages.filter(img => img.variantName === variantOption.name);
        const hasCoverImage = variantImages.find(img => img.isCover);
        const selectedImgUrl = hasCoverImage 
          ? hasCoverImage.imageUrl 
          : (variantImages[0]?.imageUrl || coverUrl);

        return {
          colorName: variantOption.name || 'Standard Variant',
          imageUrl: selectedImgUrl,
          isMain: hasCoverImage ? true : (coverImageObj && variantImages.some(v => v.id === coverImageObj.id)),
          overridePrice: variantOption.overridePrice,
          customPrice: variantOption.customPrice ? `₦${Number(variantOption.customPrice).toLocaleString()}` : null,
          sizes: variantOption.enabledSpecs, 
          optionPrices: variantOption.optionPrices || {}
        };
      });

      if (!compatibleColorVariants.some(v => v.isMain) && compatibleColorVariants.length > 0) {
        compatibleColorVariants[0].isMain = true;
      }

      // --- DYNAMIC PRICE COMPILATION LOGIC ---
      let calculatedPrice = basicInfo.price;

      // If Base Price is empty and this is an Option-Based Category, find the lowest configured price
      if (!calculatedPrice && isOptionPricingCategory) {
        const allPrices = [];
        variantsList.forEach(variant => {
          if (variant.optionPrices) {
            Object.values(variant.optionPrices).forEach(p => {
              if (p) allPrices.push(Number(p));
            });
          }
        });
        
        if (allPrices.length > 0) {
          calculatedPrice = Math.min(...allPrices).toString();
        }
      }

      const basePriceString = calculatedPrice 
        ? `₦${Number(calculatedPrice).toLocaleString()}` 
        : (variantsList[0]?.customPrice ? `₦${Number(variantsList[0].customPrice).toLocaleString()}` : 'Contact Seller');

      const finalProductObj = {
        id: crypto.randomUUID(),
        productTitle: basicInfo.productTitle.trim(),
        shopName: basicInfo.shopName.trim(),
        price: basePriceString,
        category: basicInfo.category,
        campus: basicInfo.campus.trim(),
        description: basicInfo.productDescription.trim(),
        whatsappNumber: basicInfo.whatsappNumber.trim(),
        condition: basicInfo.category === 'Food & Snacks' ? 'Freshly Made' : (productCondition || 'Unspecified'),
        availableSizes: globalSpecs.length > 0 ? globalSpecs : ['Standard Spec'],
        images: uploadedImages.map(img => ({
          id: img.id,
          imageUrl: img.imageUrl,
          variantName: img.variantName,
          isCover: img.isCover
        })),
        variants: variantsList.map(v => v.name),
        colorVariants: compatibleColorVariants,
        isOptionPricing: isOptionPricingCategory 
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
      setProductCondition('');
      setVariantsList([{ name: '', overridePrice: false, customPrice: '', enabledSpecs: ['M'], optionPrices: {} }]);
      setUploadedImages([]);
      setActiveStep(1);

      setTimeout(() => setSuccess(false), 1000);
    }, 1200);
  };

  const getSubTextDefinition = () => {
    if (productCondition === 'Like New') return '(Slightly Used . No scratches)';
    if (productCondition === 'Fair') return '(Gently Used . Normal wear)';
    return '(Unopened & Unused)';
  };

  const inputStyles = "w-full border border-gray-200 rounded-xl px-3 py-2 text-base md:text-sm focus:outline-none focus:border-marix-teal text-[#111111] font-medium transition-colors placeholder:text-gray-400/70 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed";
  const selectStyles = "w-full border border-gray-200 rounded-xl px-3 py-2 text-base md:text-sm focus:outline-none focus:border-marix-teal font-medium appearance-none text-[#111111] bg-white cursor-pointer transition-colors";

  return (
    <div 
      className="w-full max-w-2xl mx-auto bg-white border border-gray-200/90 shadow-xl rounded-2xl p-4 md:p-6 text-left relative text-[#111111]"
      style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", touchAction: 'manipulation', zIndex: 99999 }}
    >
      {(isLoading || isCompressing) && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-[1px] z-50 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-[3px] border-marix-teal/20 border-t-marix-teal rounded-full animate-spin"></div>
          <p className="text-xs font-bold tracking-wide text-gray-500">
            {isCompressing ? "Optimizing images..." : "Uploading listing..."}
          </p>
        </div>
      )}

      {success && (
        <div className="mb-4 w-full bg-marix-teal text-white px-3 py-2.5 rounded-xl shadow-sm text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <span>✨</span> Listing published successfully! Card generated.
        </div>
      )}

      {/* NAVIGATION BAR */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4 select-none">
        <button 
          type="button" 
          onClick={onCancel} 
          className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 focus:outline-none cursor-pointer"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
        
        <h2 className="text-sm font-bold uppercase tracking-wide text-gray-400">Create a Listing</h2>
        
        <button 
          type="button"
          onClick={handlePublish}
          disabled={!isFormComplete || isCompressing}
          className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-tight focus:outline-none ${
            isFormComplete && !isCompressing
              ? 'bg-marix-brown text-white cursor-pointer' 
              : 'bg-marix-brown/10 text-[#111111]/30 cursor-not-allowed'
          }`}
        >
          Publish
        </button>
      </div>

      <div className="flex items-center justify-center gap-3 text-xs font-bold text-gray-400 mb-5 select-none">
        <div className={`flex items-center gap-1.5 cursor-pointer ${activeStep === 1 ? 'text-marix-teal' : 'text-gray-400'}`} onClick={() => setActiveStep(1)}>
          <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${activeStep === 1 ? 'bg-marix-teal text-white' : 'bg-gray-100 text-gray-500'}`}>1</span>
          <span>Basic Details</span>
        </div>
        <span className="h-px w-6 bg-gray-100"></span>
        <div className={`flex items-center gap-1.5 cursor-pointer ${activeStep === 2 ? 'text-marix-teal' : 'text-gray-400'}`} onClick={() => setActiveStep(2)}>
          <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${activeStep === 2 ? 'bg-marix-teal text-white' : 'bg-gray-100 text-gray-500'}`}>2</span>
          <span>Variants</span>
        </div>
      </div>

      {activeStep === 1 && (
        <div className="flex flex-col gap-4 animate-fadeIn">
          <div className="flex gap-2 items-center mb-0.5 select-none">
            <div className="p-1.5 bg-marix-cream/80 text-marix-teal rounded-lg flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-marix-teal" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#111111]">1. Basic Details</h3>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#111111]">Product Title <span className="text-red-500">*</span></label>
            <input type="text" placeholder="e.g., Louis Vuitton Slim-Fit Shirt" maxLength={100} value={basicInfo.productTitle} onChange={(e) => setBasicInfo({ ...basicInfo, productTitle: e.target.value })} className={inputStyles} />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-[#111111]">Shop Name <span className="text-red-500">*</span></label>
              {isShopNameLocked && <span className="text-[10px] font-bold text-gray-400 italic">Locked (Reset below)</span>}
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

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#111111]">Category <span className="text-red-500">*</span></label>
            <div className="relative w-full">
              <select value={basicInfo.category} onChange={(e) => setBasicInfo({ ...basicInfo, category: e.target.value })} className={selectStyles}>
                <option value="" disabled hidden>Select Category</option>
                {campusCategories.map((c, i) => <option key={i} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {basicInfo.category !== 'Food & Snacks' && (
            <div className="flex flex-col gap-1.5 animate-fadeIn">
              <label className="text-xs font-bold text-[#111111]">
                Product Condition <span className="text-red-500">*</span>
              </label>
              <div className="relative w-full">
                <select value={productCondition} onChange={(e) => setProductCondition(e.target.value)} className={selectStyles}>
                  <option value="" disabled hidden>Select Condition</option>
                  <option value="Brand New">Brand New</option>
                  <option value="Like New">Like New</option>
                  <option value="Fair">Fair</option>
                </select>
              </div>
              <div className="text-[11px] font-medium tracking-tight text-gray-400 flex flex-wrap items-center gap-x-1 select-none mt-0.5">
                <span>Condition evaluation is mandatory for non-food listings.</span>
                {productCondition && <span className="text-marix-teal font-semibold italic text-[10px]">{getSubTextDefinition()}</span>}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#111111]">
                Base Price (₦) {!isOptionPricingCategory && <span className="text-red-500">*</span>}
              </label>
              <input 
                type="number" 
                placeholder={isOptionPricingCategory ? "Optional (E.g. 15000)" : "E.g. 15000"} 
                value={basicInfo.price} 
                onChange={(e) => setBasicInfo({ ...basicInfo, price: e.target.value })} 
                className={inputStyles} 
              />
              {isOptionPricingCategory && (
                <span className="text-[10px] text-gray-400 font-semibold italic">Prices will be defined per option under each variant on Step 2.</span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#111111]">WhatsApp Number <span className="text-red-500">*</span></label>
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

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#111111]">Campus Hub Location <span className="text-red-500">*</span></label>
            <div className="relative w-full">
              <input 
                type="text" 
                placeholder="e.g., ABSU, Uturu" 
                value={basicInfo.campus} 
                disabled={isCampusLocked}
                onChange={(e) => setBasicInfo({ ...basicInfo, campus: e.target.value })} 
                className={inputStyles} 
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#111111]">Product Description <span className="text-red-500">*</span></label>
            <textarea placeholder="e.g., Vintage print, high-quality material. Delivery at ABSU." maxLength={500} rows={3} value={basicInfo.productDescription} onChange={(e) => setBasicInfo({ ...basicInfo, productDescription: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-1.5 text-base md:text-sm focus:outline-none focus:border-marix-teal resize-none text-[#111111] font-medium" />
          </div>

          <div className="flex flex-col gap-2.5 mt-3 select-none">
            <button type="button" onClick={() => setActiveStep(2)} className="w-full bg-marix-brown text-white font-bold py-3 rounded-xl text-xs shadow-sm focus:outline-none text-center cursor-pointer">
              Continue to Variants →
            </button>
            <button
              type="button"
              onClick={handleClearCacheAndReset}
              className="text-[11px] font-bold text-gray-400 bg-gray-50 py-2.5 rounded-xl text-center border border-gray-100 outline-none focus:outline-none active:outline-none cursor-pointer"
            >
              Reset Cached Shop Fields
            </button>
          </div>
        </div>
      )}

      {activeStep === 2 && (
        <div className="flex flex-col gap-4 animate-fadeIn">
          <div className="bg-white border border-gray-100 rounded-xl p-3 md:p-4 shadow-sm">
            <div className="flex gap-2 items-center mb-4 select-none">
              <div className="p-1.5 bg-marix-cream/80 text-marix-teal rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-marix-teal" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
              </div>
              <h3 className="text-xs font-bold text-[#111111]">2. Product Variants</h3>
            </div>

            {/* --- SECTION A: GLOBAL SPECIFICATIONS DEFINITION POOL --- */}
            <div className="mb-4">
              <h4 className="text-xs font-bold text-gray-500 mb-1.5">A. Define Specification Pool <span className="text-gray-400 font-semibold">(Optional)</span></h4>
              <p className="text-[11px] text-gray-400 font-medium mb-3">Define your available options first. You will be able to enable/disable and price them inside each variant below.</p>
              
              <div className="flex flex-wrap gap-1.5 items-center">
                {globalSpecs.map((spec, idx) => (
                  <div key={idx} className="flex items-center gap-1 bg-gray-50 border border-gray-100 rounded-lg px-2 py-1 text-[11px] font-bold text-[#111111]">
                    <span>{spec}</span>
                    <button type="button" onClick={() => handleRemoveGlobalSpec(spec)} className="text-gray-400 ml-0.5 font-normal text-[11px] focus:outline-none cursor-pointer">✕</button>
                  </div>
                ))}
                <div className="flex items-center gap-1 max-w-[180px]">
                  <input 
                    type="text" 
                    placeholder={labels.specPlaceholder} 
                    value={specInput} 
                    onChange={(e) => setSpecInput(e.target.value)} 
                    className="w-full border border-gray-200 rounded-lg px-2 py-1 text-base md:text-sm focus:outline-none text-[#111111]" 
                  />
                  <button type="button" onClick={handleAddGlobalSpec} className="px-2 py-1 bg-gray-50 text-xs font-bold rounded-lg border border-gray-200 focus:outline-none cursor-pointer">+</button>
                </div>
              </div>
            </div>

            <hr className="border-gray-50 my-4" />

            <div className="mb-6">
              <h4 className="text-xs font-bold text-gray-500 mb-0.5">B. Create Variant Options <span className="text-red-500">*</span></h4>
              <p className="text-[11px] text-gray-400 font-medium mb-4">Add your variant names. Select which specifications apply to each variant, and configure custom pricing.</p>

              <div className="flex flex-col gap-5">
                {variantsList.map((variant, index) => (
                  <div key={index} className="border border-gray-100/75 p-3.5 rounded-2xl bg-gray-50/20 space-y-4 animate-fadeIn">
                    
                    {/* Variant Name Input Header Row */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Variant Name ({labels.colorLabel})</label>
                        <input 
                          type="text" 
                          placeholder={labels.colorPlaceholder} 
                          value={variant.name} 
                          onChange={(e) => handleVariantNameChange(index, e.target.value)} 
                          className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-base md:text-sm focus:outline-none text-[#111111] font-semibold" 
                        />
                      </div>
                      {variantsList.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => handleRemoveVariantOption(index)} 
                          className="w-8 h-8 rounded-xl bg-red-50 hover:bg-red-100/70 text-red-500 flex items-center justify-center focus:outline-none transition-colors shrink-0 cursor-pointer self-end"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7M4 7h16" /></svg>
                        </button>
                      )}
                    </div>

                    {/* --- LOCAL SPEC SELECTION CHECKBOXES --- */}
                    <div className="bg-white/60 border border-gray-100/30 p-2.5 rounded-xl space-y-2">
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">Select Active {labels.specLabel}</label>
                      {globalSpecs.length === 0 ? (
                        <span className="text-[10px] font-medium text-gray-400 italic">Add specifications in section A above to assign them here.</span>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {globalSpecs.map((spec) => {
                            const isChecked = variant.enabledSpecs.includes(spec);
                            return (
                              <label key={spec} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold cursor-pointer select-none transition-all ${
                                isChecked 
                                  ? 'bg-marix-teal/10 border-marix-teal/30 text-marix-teal' 
                                  : 'bg-white border-gray-250 text-gray-400'
                              }`}>
                                <input 
                                  type="checkbox" 
                                  checked={isChecked} 
                                  onChange={() => handleToggleSpecForVariant(index, spec)}
                                  className="hidden" 
                                />
                                <span>{spec}</span>
                              </label>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* --- PRICING FLOW CONTROLLERS BASED ON ENABLED SPECS --- */}
                    {!isOptionPricingCategory ? (
                      /* FLOW A: SIMPLE VARIANT PRICING (Fashion, Footwear, Accessories) */
                      <div className="flex flex-col gap-1 text-left px-1">
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-500 select-none">
                          <input 
                            type="checkbox" 
                            checked={variant.overridePrice} 
                            onChange={() => handleVariantPriceOverrideToggle(index)}
                            className="rounded border-gray-300 text-marix-teal focus:ring-marix-teal" 
                          />
                          <span>Override Base Price for this variant</span>
                        </label>
                        
                        {variant.overridePrice && (
                          <div className="mt-1.5 max-w-[180px] animate-fadeIn">
                            <input 
                              type="number" 
                              placeholder="Override Price (₦)" 
                              value={variant.customPrice}
                              onChange={(e) => handleVariantCustomPriceChange(index, e.target.value)}
                              className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs font-bold outline-none focus:border-marix-teal" 
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      /* FLOW B: OPTION-BASED PRICING (Gadgets, Beauty, Snacks, Home & Other) */
                      <div className="flex flex-col gap-2 bg-white/70 border border-gray-100/50 p-2.5 rounded-xl text-left">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Configure Price per Active Option</label>
                        {variant.enabledSpecs.length === 0 ? (
                          <span className="text-[10px] font-medium text-gray-400 italic">Select at least one specification tag above to configure pricing.</span>
                        ) : (
                          <div className="grid grid-cols-2 gap-2">
                            {variant.enabledSpecs.map((sizeOption) => (
                              <div key={sizeOption} className="flex flex-col gap-1 animate-fadeIn">
                                <span className="text-[10px] font-bold text-[#111111]">{sizeOption} Price (₦)</span>
                                <input 
                                  type="number" 
                                  placeholder="E.g. 45000" 
                                  value={variant.optionPrices?.[sizeOption] || ''}
                                  onChange={(e) => handleVariantOptionPriceChange(index, sizeOption, e.target.value)}
                                  className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs font-semibold outline-none focus:border-marix-teal"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                ))}

                <button 
                  type="button" 
                  onClick={handleAddVariantOption} 
                  className="w-fit border border-dashed border-marix-teal/30 text-marix-teal px-4 py-1.5 rounded-xl text-[11px] font-bold bg-marix-cream/10 focus:outline-none flex items-center gap-1 transition-all cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
                  <span>Add Color Option</span>
                </button>
              </div>
            </div>

            <hr className="border-gray-50 my-4" />

            <div>
              <div className="flex justify-between items-center mb-1">
                <h4 className="text-xs font-bold text-gray-500">C. Manage Variant Images <span className="text-red-500">*</span></h4>
                <span className="text-[10px] font-black text-marix-teal">{uploadedImages.length}/5 Images uploaded</span>
              </div>
              <p className="text-[11px] text-gray-400 font-medium mb-3">Upload up to 5 presentation images total and assign each to a variant option. Select one as the Cover Image.</p>

              {/* Mobile 5-Image Premium Black-out Overlay Filter Panel */}
              <div className="relative overflow-hidden rounded-xl mb-4">
                {uploadedImages.length < 5 ? (
                  <label className="border border-dashed border-gray-200 bg-gray-50/20 hover:bg-gray-50/50 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer select-none text-center min-h-[100px] transition-all">
                    <svg className="w-6 h-6 text-gray-400 mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                    <span className="text-xs font-bold text-gray-500">Select Images to Upload</span>
                    <span className="text-[10px] text-gray-400 font-medium mt-0.5">Supports multiple selection</span>
                    <input type="file" accept="image/*" multiple onChange={handleImagePoolUpload} className="hidden" />
                  </label>
                ) : (
                  <div className="w-full bg-black/95 border border-black p-6 flex flex-col items-center justify-center text-center rounded-xl min-h-[100px] transition-all select-none pointer-events-none">
                    <svg className="w-6 h-6 text-[#ff4d4d] mb-1.5 animate-pulse" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span className="text-xs font-black text-white tracking-wide uppercase">Upload Limit Reached</span>
                    <span className="text-[10px] text-gray-400/80 font-bold mt-1">Maximum of 5 photos is allowed per listing</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3">
                {uploadedImages.map((img) => (
                  <div key={img.id} className="border border-gray-150 p-2.5 rounded-xl bg-white flex flex-col sm:flex-row sm:items-center gap-3.5 relative group animate-fadeIn">
                    <div className="w-16 h-16 rounded-xl bg-gray-50 overflow-hidden shrink-0 border border-gray-100 relative">
                      <img src={img.imageUrl} alt="Variant pool asset" className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 flex flex-col gap-2">
                      <div className="flex flex-col gap-1 max-w-[200px]">
                        <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Assign to variant option</label>
                        <select 
                          value={img.variantName} 
                          onChange={(e) => handleImageVariantAssignment(img.id, e.target.value)}
                          className="w-full border border-gray-200 rounded-lg px-2 py-1 text-xs font-semibold outline-none bg-white focus:border-marix-teal"
                        >
                          {variantsList.map((v, index) => (
                            <option key={index} value={v.name}>{v.name || `Variant ${index + 1} (Empty)`}</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center gap-2 select-none">
                        {img.isCover ? (
                          <div className="inline-flex items-center gap-1 text-[10px] text-green-700 bg-green-50/70 border border-green-150 px-2 py-0.5 rounded-lg font-bold">
                            <span>Product Cover Image</span>
                          </div>
                        ) : (
                          <button 
                            type="button" 
                            onClick={() => handleSetCoverImage(img.id)}
                            className="text-[10px] text-gray-400 font-bold hover:text-marix-teal transition-colors border border-dashed border-gray-200 bg-white px-2 py-0.5 rounded-lg focus:outline-none cursor-pointer"
                          >
                            Set as Cover Image
                          </button>
                        )}
                      </div>
                    </div>

                    <button 
                      type="button" 
                      onClick={() => handleRemoveUploadedImage(img.id)} 
                      className="absolute top-2.5 right-2.5 text-gray-400 hover:text-red-500 focus:outline-none flex items-center justify-center p-1 transition-colors cursor-pointer"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                  </div>
                ))}
              </div>

            </div>
          </div>
          
          <div className="flex flex-col gap-2.5 mt-2 select-none">
            <button 
              type="button" 
              onClick={() => setActiveStep(1)} 
              className="text-xs font-bold text-gray-400 self-center py-1 focus:outline-none cursor-pointer"
            >
              ← Back to Basic Details
            </button>
            <button
              type="button"
              onClick={handleClearCacheAndReset}
              className="text-[11px] font-bold text-gray-400 bg-gray-50 py-2.5 rounded-xl text-center border border-gray-100 outline-none focus:outline-none active:outline-none cursor-pointer"
            >
              Reset Cached Shop Fields
            </button>
          </div>
        </div>
      )}

    </div>
  );
}