import React, { useState, useEffect, useMemo } from 'react';
import imageCompression from 'browser-image-compression';

export default function CreateListing({ onProductCreated, onCancel, editInitialData = null }) {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [isCompressing, setIsCompressing] = useState(false);

  const [basicInfo, setBasicInfo] = useState({
    productTitle: '',
    category: '',
    price: '',
    productDescription: ''
  });

  const [productCondition, setProductCondition] = useState('');
  const [globalSpecs, setGlobalSpecs] = useState(['M', 'L', 'XL']);
  const [specInput, setSpecInput] = useState('');

  const [variantsList, setVariantsList] = useState([{ 
    name: '',
    overridePrice: false,
    customPrice: '',
    enabledSpecs: ['M'], 
    optionPrices: {}     
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
    if (editInitialData) {
      const cleanPrice = (val) => {
        if (val === null || val === undefined || val === 'Contact Seller') return '';
        return String(val).replace(/[^\d]/g, '');
      };

      setBasicInfo({
        productTitle: editInitialData.productTitle || editInitialData.title || '',
        category: editInitialData.category || '',
        price: cleanPrice(editInitialData.price),
        productDescription: editInitialData.description || editInitialData.productDescription || ''
      });

      if (editInitialData.condition && editInitialData.condition !== 'Freshly Made') {
        setProductCondition(editInitialData.condition);
      } else {
        setProductCondition('');
      }

      if (editInitialData.availableSizes && editInitialData.availableSizes.length > 0) {
        setGlobalSpecs(editInitialData.availableSizes);
      }

      if (editInitialData.colorVariants && editInitialData.colorVariants.length > 0) {
        const reconstructedVariants = editInitialData.colorVariants.map(cv => ({
          name: cv.colorName === 'Standard Variant' ? '' : (cv.colorName || cv.name || ''),
          overridePrice: !!cv.overridePrice,
          customPrice: cv.customPrice ? cleanPrice(cv.customPrice) : '',
          enabledSpecs: cv.sizes || cv.enabledSpecs || editInitialData.availableSizes || [],
          optionPrices: cv.optionPrices || {}
        }));
        setVariantsList(reconstructedVariants);
      } else if (editInitialData.variants && editInitialData.variants.length > 0) {
        setVariantsList(editInitialData.variants.map(vName => ({
          name: vName === 'Standard Variant' ? '' : vName,
          overridePrice: false,
          customPrice: '',
          enabledSpecs: editInitialData.availableSizes || [],
          optionPrices: {}
        })));
      }

      if (editInitialData.images && editInitialData.images.length > 0) {
        const mappedImages = editInitialData.images.map(img => ({
          id: img.id || crypto.randomUUID(),
          fileName: 'Existing Asset',
          imageUrl: img.imageUrl,
          variantName: img.variantName || '',
          isCover: !!img.isCover,
          fileBlob: null
        }));
        setUploadedImages(mappedImages);
      }

      setActiveStep(1);
    }
  }, [editInitialData]);

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  useEffect(() => {
    if (editInitialData) return;
    
    const cat = basicInfo.category;
    let defaultSpecs = [];
    if (cat === 'Fashion') {
      defaultSpecs = ['M', 'L', 'XL'];
    } else if (cat === 'Footwears') {
      defaultSpecs = ['42', '43', '44'];
    } else if (cat === 'Food & Snacks') {
      defaultSpecs = ['Regular', 'Full Pack'];
    } else if (cat === 'Beauty') {
      defaultSpecs = ['50ml', '100ml'];
    }

    setGlobalSpecs(defaultSpecs);

    setVariantsList(prev => prev.map(v => ({
      ...v,
      enabledSpecs: defaultSpecs.length > 0 ? [defaultSpecs[0]] : [],
      optionPrices: {}
    })));
  }, [basicInfo.category, editInitialData]);

  useEffect(() => {
    if (basicInfo.category === 'Food & Snacks') {
      setProductCondition('');
    }
  }, [basicInfo.category]);

  const isOptionPricingCategory = useMemo(() => {
    const cat = basicInfo.category;
    return ["Gadgets", "Beauty", "Food & Snacks", "Home & Kitchen", "Other"].includes(cat);
  }, [basicInfo.category]);

  const getDynamicLabels = () => {
    const cat = basicInfo.category;
    if (cat === 'Fashion' || cat === 'Footwears') {
      return {
        specLabel: 'Available Sizes',
        specPlaceholder: 'Add size tag (e.g. S, XL, 45)',
        colorLabel: 'Color Variant',
        colorPlaceholder: 'e.g., Black, Beige'
      };
    }
    if (cat === 'Accessories') {
      return {
        specLabel: 'Available Sizes',
        specPlaceholder: 'e.g., Strap Size, Ring Size',
        colorLabel: 'Material Variant',
        colorPlaceholder: 'e.g., Gold Plated, Silver Chain'
      };
    }
    if (cat === 'Gadgets') {
      return {
        specLabel: 'Storage Spec',
        specPlaceholder: 'e.g., 128GB, 256GB',
        colorLabel: 'Device Color',
        colorPlaceholder: 'e.g., Space Gray, Sierra Blue'
      };
    }
    if (cat === 'Beauty') {
      return {
        specLabel: 'Volume / Size',
        specPlaceholder: 'e.g., 50ml, 100g, 3.4 oz',
        colorLabel: 'Shade / Scent / Variant',
        colorPlaceholder: 'e.g., Vanilla Scent, Shade 02, Rose Oil'
      };
    }
    if (cat === 'Food & Snacks') {
      return {
        specLabel: 'Portion Size',
        specPlaceholder: 'e.g., Regular, Full Pack',
        colorLabel: 'Flavor Variant',
        colorPlaceholder: 'e.g., Extra Spicy, Mild Pepper'
      };
    }
    return {
      specLabel: 'Specification',
      specPlaceholder: 'e.g., Boxed, Standard',
      colorLabel: 'Type Option',
      colorPlaceholder: 'e.g., Standard Edition'
    };
  };

  const labels = getDynamicLabels();

  const areVariantsValid = variantsList.length > 0 && variantsList.every(v => v.name.trim() !== '');

  const hasAtLeastOneOptionPrice = useMemo(() => {
    return variantsList.some(v => 
      v.optionPrices && Object.values(v.optionPrices).some(val => val && String(val).trim() !== '')
    );
  }, [variantsList]);

  const isPriceValid = isOptionPricingCategory
    ? (basicInfo.price.trim() !== '' || hasAtLeastOneOptionPrice)
    : basicInfo.price.trim() !== '';

  const isFormComplete = 
    basicInfo.productTitle.trim() !== '' &&
    basicInfo.category !== '' &&
    isPriceValid &&
    basicInfo.productDescription.trim() !== '' &&
    (basicInfo.category === 'Food & Snacks' || productCondition !== '') && 
    areVariantsValid &&
    uploadedImages.length > 0;

  const handleAddGlobalSpec = () => {
    if (specInput.trim()) {
      const sanitized = specInput.trim();
      const finalTag = (basicInfo.category === 'Fashion' || basicInfo.category === 'Footwears') ? sanitized.toUpperCase() : sanitized;
      if (!globalSpecs.includes(finalTag)) {
        setGlobalSpecs([...globalSpecs, finalTag]);
        setSpecInput('');
        setVariantsList(prev => prev.map(v => ({
          ...v,
          enabledSpecs: [...v.enabledSpecs, finalTag]
        })));
      }
    }
  };

  const handleRemoveGlobalSpec = (specToRemove) => {
    setGlobalSpecs(globalSpecs.filter(s => s !== specToRemove));
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

  const handleToggleSpecForVariant = (variantIndex, specName) => {
    const updated = [...variantsList];
    const isEnabled = updated[variantIndex].enabledSpecs.includes(specName);

    if (isEnabled) {
      updated[variantIndex].enabledSpecs = updated[variantIndex].enabledSpecs.filter(s => s !== specName);
      if (updated[variantIndex].optionPrices[specName]) {
        delete updated[variantIndex].optionPrices[specName];
      }
    } else {
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
    // 🚀 EDIT MODE PHOTO LOCK (Prevent recycling images indefinitely)
    if (editInitialData) {
      alert("Photos cannot be added when editing an existing listing. You can reassign or remove existing photos below.");
      return;
    }

    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    if (uploadedImages.length + files.length > 5) {
      alert("A listing can have a maximum of 5 image uploads total.");
      return;
    }

    setIsCompressing(true);
    const isDesktop = window.innerWidth >= 1024;

    const options = {
      maxSizeMB: isDesktop ? 1.8 : 0.9,
      maxWidthOrHeight: isDesktop ? 3840 : 1920,
      useWebWorker: true,
      fileType: 'image/jpeg', 
      initialQuality: isDesktop ? 0.92 : 0.85
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
      console.error(err);
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

      let calculatedPrice = basicInfo.price;

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
        id: editInitialData ? editInitialData.id : crypto.randomUUID(),
        productTitle: basicInfo.productTitle.trim(),
        price: basePriceString,
        category: basicInfo.category,
        description: basicInfo.productDescription.trim(),
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
        isOptionPricing: isOptionPricingCategory,
        shopName: editInitialData ? editInitialData.shopName : '',
        campus: editInitialData ? editInitialData.campus : '',
        whatsappNumber: editInitialData ? editInitialData.whatsappNumber : ''
      };

      if (onProductCreated) {
        onProductCreated(finalProductObj);
      }

      setBasicInfo({ productTitle: '', category: '', price: '', productDescription: '' });
      setProductCondition('');
      setVariantsList([{ name: '', overridePrice: false, customPrice: '', enabledSpecs: ['M'], optionPrices: {} }]);
      setUploadedImages([]);
      setActiveStep(1);

      setTimeout(() => setSuccess(false), 1000);
    }, 1200);
  };

  const inputStyles = "w-full border border-gray-200 rounded-xl px-3 py-2 text-base md:text-sm focus:outline-none focus:border-marix-teal text-[#111111] font-medium transition-colors placeholder:text-gray-400/70";
  const selectStyles = "w-full border border-gray-200 rounded-xl px-3 py-2 text-base md:text-sm focus:outline-none focus:border-marix-teal font-medium appearance-none text-[#111111] bg-white cursor-pointer transition-colors";

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl p-4 md:p-6 text-left relative text-[#111111]" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      {(isLoading || isCompressing) && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-[1px] z-50 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-[3px] border-marix-teal/20 border-t-marix-teal rounded-full animate-spin"></div>
          <p className="text-xs font-bold text-gray-500">{isCompressing ? "Optimizing images..." : "Uploading listing..."}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 w-full bg-marix-teal text-white px-3 py-2.5 rounded-xl shadow-sm text-xs font-semibold flex items-center gap-2">
          <span>✨</span> {editInitialData ? "Listing updated successfully!" : "Listing published successfully!"}
        </div>
      )}

      <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4 select-none">
        <button type="button" onClick={onCancel} className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 focus:outline-none cursor-pointer"><i className="ph ph-x text-sm"></i></button>
        <h2 className="text-sm font-bold uppercase tracking-wide text-gray-400">{editInitialData ? "Edit Listing" : "New Listing Details"}</h2>
        <button type="button" onClick={handlePublish} disabled={!isFormComplete || isCompressing} className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-tight focus:outline-none cursor-pointer transition-all ${isFormComplete && !isCompressing ? 'bg-marix-brown text-white hover:opacity-95' : 'bg-marix-brown/10 text-[#111111]/30 cursor-not-allowed'}`}>{editInitialData ? "Save" : "Publish"}</button>
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
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#111111]">Product Title <span className="text-red-500">*</span></label>
            <input type="text" placeholder="e.g., Louis Vuitton Slim-Fit Shirt" maxLength={100} value={basicInfo.productTitle} onChange={(e) => setBasicInfo({ ...basicInfo, productTitle: e.target.value })} className={inputStyles} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#111111]">Category <span className="text-red-500">*</span></label>
            <select value={basicInfo.category} onChange={(e) => setBasicInfo({ ...basicInfo, category: e.target.value })} className={selectStyles}>
              <option value="" disabled hidden>Select Category</option>
              {campusCategories.map((c, i) => <option key={i} value={c}>{c}</option>)}
            </select>
          </div>

          {basicInfo.category !== 'Food & Snacks' && (
            <div className="flex flex-col gap-1.5 animate-fadeIn">
              <label className="text-xs font-bold text-[#111111]">Product Condition <span className="text-red-500">*</span></label>
              <select value={productCondition} onChange={(e) => setProductCondition(e.target.value)} className={selectStyles}>
                <option value="" disabled hidden>Select Condition</option>
                <option value="Brand New">Brand New</option>
                <option value="Like New">Like New</option>
                <option value="Fair">Fair</option>
              </select>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#111111]">
              Base Price (₦) {!isOptionPricingCategory && <span className="text-red-500">*</span>}
            </label>
            <input type="number" placeholder={isOptionPricingCategory ? "Optional if option prices are set below" : "E.g. 15000"} value={basicInfo.price} onChange={(e) => setBasicInfo({ ...basicInfo, price: e.target.value })} className={inputStyles} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#111111]">Product Description <span className="text-red-500">*</span></label>
            <textarea placeholder="e.g., Vintage print, high-quality material. Delivery on campus." maxLength={500} rows={4} value={basicInfo.productDescription} onChange={(e) => setBasicInfo({ ...basicInfo, productDescription: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-base md:text-sm focus:outline-none focus:border-marix-teal resize-none font-medium text-[#111111]" />
          </div>

          <button type="button" onClick={() => setActiveStep(2)} className="w-full bg-marix-brown text-white font-bold py-3.5 rounded-xl text-xs mt-2 transition-opacity hover:opacity-95 cursor-pointer">
            Continue to Variants &rarr;
          </button>
        </div>
      )}

      {activeStep === 2 && (
        <div className="flex flex-col gap-4 animate-fadeIn">
          <div className="bg-white border border-gray-100 rounded-xl p-3 md:p-4">
            <div className="mb-4">
              <h4 className="text-xs font-bold text-gray-500 mb-1.5">A. Define Specification Pool <span className="text-gray-400 font-semibold">(Optional)</span></h4>
              <div className="flex flex-wrap gap-1.5 items-center">
                {globalSpecs.map((spec, idx) => (
                  <div key={idx} className="flex items-center gap-1 bg-gray-50 border border-gray-100 rounded-lg px-2 py-1 text-[11px] font-bold">
                    <span>{spec}</span>
                    <button type="button" onClick={() => handleRemoveGlobalSpec(spec)} className="text-gray-400 ml-0.5 focus:outline-none cursor-pointer">✕</button>
                  </div>
                ))}
                <div className="flex items-center gap-1 max-w-[180px]">
                  <input type="text" placeholder={labels.specPlaceholder} value={specInput} onChange={(e) => setSpecInput(e.target.value)} className="w-full border border-gray-200 rounded-lg px-2 py-1 text-base md:text-xs text-[#111111] focus:outline-none focus:border-marix-teal" />
                  <button type="button" onClick={handleAddGlobalSpec} className="px-2 py-1 bg-gray-50 text-xs font-bold rounded-lg border border-gray-200 cursor-pointer">+</button>
                </div>
              </div>
            </div>

            <hr className="border-gray-50 my-4" />

            <div className="mb-4">
              <h4 className="text-xs font-bold text-gray-500 mb-2">B. Create Variant Options <span className="text-red-500">*</span></h4>
              <div className="flex flex-col gap-4">
                {variantsList.map((variant, index) => (
                  <div key={index} className="border border-gray-100 p-3.5 rounded-2xl bg-gray-50/10 space-y-3.5">
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Variant Name ({labels.colorLabel}) <span className="text-red-500">*</span></label>
                        <input type="text" required placeholder={labels.colorPlaceholder} value={variant.name} onChange={(e) => handleVariantNameChange(index, e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-base md:text-xs text-[#111111] font-semibold focus:outline-none focus:border-marix-teal" />
                      </div>
                      {variantsList.length > 1 && (
                        <button type="button" onClick={() => handleRemoveVariantOption(index)} className="w-8 h-8 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0 self-end cursor-pointer"><i className="ph ph-trash"></i></button>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">Select Active Options</label>
                      <div className="flex flex-wrap gap-1.5">
                        {globalSpecs.map((spec) => {
                          const isChecked = variant.enabledSpecs.includes(spec);
                          return (
                            <label key={spec} className={`inline-flex items-center px-2.5 py-1 rounded-lg border text-xs font-bold cursor-pointer transition-all ${isChecked ? 'bg-marix-teal/10 border-marix-teal/30 text-marix-teal' : 'bg-white border-gray-200 text-gray-400'}`}>
                              <input type="checkbox" checked={isChecked} onChange={() => handleToggleSpecForVariant(index, spec)} className="hidden" />
                              <span>{spec}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    {!isOptionPricingCategory ? (
                      <div className="flex flex-col gap-1 pt-1">
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-500">
                          <input type="checkbox" checked={variant.overridePrice} onChange={() => handleVariantPriceOverrideToggle(index)} className="rounded text-marix-teal accent-marix-teal" />
                          <span>Override Base Price for this variant</span>
                        </label>
                        {variant.overridePrice && (
                          <input type="number" placeholder="Override Price (₦)" value={variant.customPrice} onChange={(e) => handleVariantCustomPriceChange(index, e.target.value)} className="mt-1 max-w-[180px] bg-white border border-gray-200 rounded-lg px-2 py-1 text-base md:text-xs font-bold focus:outline-none focus:border-marix-teal" />
                        )}
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        {variant.enabledSpecs.map((sizeOption) => (
                          <div key={sizeOption} className="flex flex-col gap-0.5">
                            <span className="text-[10px] font-bold text-gray-500">{sizeOption} Price (₦)</span>
                            <input type="number" placeholder="E.g. 45000" value={variant.optionPrices?.[sizeOption] || ''} onChange={(e) => handleVariantOptionPriceChange(index, sizeOption, e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1 text-base md:text-xs font-semibold focus:outline-none focus:border-marix-teal" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <button type="button" onClick={handleAddVariantOption} className="w-fit border border-dashed border-marix-teal/30 text-marix-teal px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1 cursor-pointer"><i className="ph ph-plus"></i><span>Add Variant Option</span></button>
              </div>
            </div>

            <hr className="border-gray-50 my-4" />

            <div>
              <div className="flex justify-between items-center mb-1">
                <h4 className="text-xs font-bold text-gray-500">C. Manage Variant Images <span className="text-red-500">*</span></h4>
                <span className="text-[10px] font-black text-marix-teal">{uploadedImages.length}/5 Uploaded</span>
              </div>
              <div className="relative overflow-hidden rounded-xl mb-3">
                {/* 🚀 EDIT MODE PHOTO LOCK DISPLAY */}
                {editInitialData ? (
                  <div className="w-full bg-gray-100 p-3 text-center rounded-xl text-gray-500 text-xs font-bold border border-gray-200">
                    <i className="ph ph-lock text-sm mr-1.5 text-marix-teal"></i>
                    Existing photos locked in Edit Mode. Reassign or delete photos below.
                  </div>
                ) : uploadedImages.length < 5 ? (
                  <label className="border border-dashed border-gray-200 bg-gray-50/30 rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer text-center min-h-[90px]">
                    <i className="ph ph-image text-xl text-gray-400"></i>
                    <span className="text-xs font-bold text-gray-500 mt-1">Select Images to Upload</span>
                    <input type="file" accept="image/*" multiple onChange={handleImagePoolUpload} className="hidden" />
                  </label>
                ) : (
                  <div className="w-full bg-[#111111] p-4 text-center rounded-xl text-white text-xs font-bold">Upload Limit Reached (Max 5)</div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                {uploadedImages.map((img) => (
                  <div key={img.id} className="border border-gray-150 p-2 rounded-xl bg-white flex items-center gap-3 relative">
                    <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-100 shrink-0">
                      <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <select value={img.variantName} onChange={(e) => handleImageVariantAssignment(img.id, e.target.value)} className="border border-gray-200 rounded-lg px-2 py-0.5 text-base md:text-xs bg-white font-semibold max-w-[160px] w-full focus:outline-none focus:border-marix-teal">
                        {variantsList.map((v, idx) => (
                          <option key={idx} value={v.name}>{v.name || `Variant ${idx + 1}`}</option>
                        ))}
                      </select>
                      <div className="mt-1">
                        {img.isCover ? (
                          <span className="text-[9px] text-green-700 bg-green-50 px-1.5 py-0.5 rounded font-bold border border-green-100">Cover Image</span>
                        ) : (
                          <button type="button" onClick={() => handleSetCoverImage(img.id)} className="text-[9px] text-gray-400 border border-dashed border-gray-200 px-1.5 py-0.5 rounded font-bold hover:text-marix-teal cursor-pointer">Set as Cover</button>
                        )}
                      </div>
                    </div>
                    <button type="button" onClick={() => handleRemoveUploadedImage(img.id)} className="text-gray-400 hover:text-red-500 mr-2 cursor-pointer"><i className="ph ph-trash"></i></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <button type="button" onClick={() => setActiveStep(1)} className="text-xs font-bold text-gray-400 self-center hover:underline focus:outline-none cursor-pointer">&larr; Back to Basic Details</button>
        </div>
      )}
    </div>
  );
}