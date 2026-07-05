import React, { useState, useEffect } from 'react';
import imageCompression from 'browser-image-compression';

export default function CreateListing({ onProductCreated, onCancel }) {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [isCompressing, setIsCompressing] = useState(false);

  // 🚀 CORE INITIALIZATION: Reads profile configurations cleanly from memory cache tracks
  const [basicInfo, setBasicInfo] = useState({
    productTitle: '',
    category: 'Fashion',
    price: '',
    productDescription: '',
    shopName: localStorage.getItem('marix_shopName') || '',
    campus: localStorage.getItem('marix_campus') || 'ABSU, Uturu',
    whatsappNumber: localStorage.getItem('marix_whatsappNumber') || ''
  });

  const [availableSizes, setAvailableSizes] = useState(['M', 'L', 'XL']);
  const [sizeInput, setSizeInput] = useState('');

  // 🚀 FIXED: Stripped out the prefilled "Black" text. Every color name initialization starts completely empty ("")!
  const [colorVariants, setColorVariants] = useState([
    { colorName: '', fileName: '', fileBlob: null, imageUrl: '', isMain: true }
  ]);

  const campuses = ["ABSU, Uturu", "IMSU, Owerri", "FUTO, Owerri", "UniAbuja, Gwagwalada"];
  
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
      // Clear out clothes tags completely for Gadgets, Accessories, Beauty, Kitchen, and Others
      setAvailableSizes([]);
    }
  }, [basicInfo.category]);

  // 🚀 FIXED DYNAMIC PLACEHOLDER & LABEL ENGINE Matrix
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
        colorLabel: 'Material / Color Variant',
        colorPlaceholder: 'e.g., Gold Plated, Silver Chain, Brown Leather'
      };
    }
    if (cat === 'Gadgets') {
      return {
        specLabel: 'Specification / Storage',
        specPlaceholder: 'e.g., 128GB, 8GB RAM, Unlocked',
        colorLabel: 'Device Color',
        colorPlaceholder: 'e.g., Space Gray, Sierra Blue, Matte Black'
      };
    }
    if (cat === 'Home & Kitchen') {
      return {
        specLabel: 'Specification / Capacity',
        specPlaceholder: 'e.g., 5-Litre, 3-Meter Cord, Plastic',
        colorLabel: 'Color / Design Style',
        colorPlaceholder: 'e.g., Matte Black, Floral Print, Wooden Finish'
      };
    }
    if (cat === 'Beauty') {
      return {
        specLabel: 'Specification / Volume',
        specPlaceholder: 'e.g., 250ml, 100g, 2-Pack',
        colorLabel: 'Type / Extract Variant',
        colorPlaceholder: 'e.g., Aloe Vera, Shea Butter, Charcoal, Scented'
      };
    }
    if (cat === 'Food & Snacks') {
      return {
        specLabel: 'Portion Size / Package Type',
        specPlaceholder: 'e.g., Full Plate, 1 Litre Pack',
        colorLabel: 'Flavor / Prep Option',
        colorPlaceholder: 'e.g., Extra Spicy, Mild Pepper, Vanilla Crumb'
      };
    }
    return {
      specLabel: 'Specification / Condition',
      specPlaceholder: 'e.g., Brand New, Boxed, Slightly Used',
      colorLabel: 'Color / Type Option',
      colorPlaceholder: 'e.g., Midnight Blue, Standard Edition'
    };
  };

  const labels = getDynamicLabels();

  const isFormComplete = 
    basicInfo.productTitle.trim() !== '' &&
    basicInfo.price.trim() !== '' &&
    basicInfo.productDescription.trim() !== '' &&
    basicInfo.shopName.trim() !== '' &&
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
    // New fields initialize completely clean ("") to safely anchor placeholder triggers
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
    localStorage.setItem('marix_campus', basicInfo.campus);
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
        campus: basicInfo.campus,
        description: basicInfo.productDescription.trim(),
        whatsappNumber: basicInfo.whatsappNumber.trim(),
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
      setColorVariants([{ colorName: '', fileName: '', fileBlob: null, imageUrl: '', isMain: true }]);
      setActiveStep(1);

      setTimeout(() => setSuccess(false), 1000);
    }, 1200);
  };

  return (
    <div 
      className="w-full max-w-2xl mx-auto bg-white border border-gray-200/90 shadow-xl rounded-2xl p-4 md:p-6 text-left relative text-[#111111]"
      style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}
    >
      {/* Loading Overlay */}
      {(isLoading || isCompressing) && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-[1px] z-50 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-marix-teal/20 border-t-marix-teal rounded-full animate-spin"></div>
          <p className="text-xs font-bold tracking-wide text-gray-600">
            {isCompressing ? "Optimizing images..." : "Uploading listing..."}
          </p>
        </div>
      )}

      {/* Success Banner */}
      {success && (
        <div className="mb-6 w-full bg-marix-teal text-white px-4 py-3 rounded-xl shadow-md text-xs md:text-sm font-semibold flex items-center gap-2 animate-fadeIn">
          <span>✨</span> Listing published successfully! Card generated.
        </div>
      )}

      {/* Header Bar Area */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-6 select-none">
        <button 
          type="button" 
          onClick={onCancel} 
          className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold active:scale-95 focus:outline-none text-gray-600 hover:bg-gray-200 transition-colors"
        >
          <i className="ph ph-x"></i>
        </button>
        <h2 className="text-base font-bold text-[#111111]">Create a Listing</h2>
        
        <button 
          type="button"
          onClick={handlePublish}
          disabled={!isFormComplete || isCompressing}
          className={`px-5 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all duration-300 shadow-sm focus:outline-none ${
            isFormComplete && !isCompressing
              ? 'bg-marix-brown text-white cursor-pointer hover:opacity-90 active:scale-95 shadow-md' 
              : 'bg-marix-brown/20 text-[#111111]/40 cursor-not-allowed'
          }`}
        >
          Publish
        </button>
      </div>

      {/* Process Index Breadcrumbs Bar */}
      <div className="flex items-center justify-center gap-4 text-xs font-semibold text-gray-400 mb-6 select-none">
        <div className={`flex items-center gap-1.5 cursor-pointer ${activeStep === 1 ? 'text-marix-teal' : 'text-gray-400'}`} onClick={() => setActiveStep(1)}>
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${activeStep === 1 ? 'bg-marix-teal text-white' : 'bg-gray-200 text-gray-600'}`}>1</span>
          <span>Basic Information</span>
        </div>
        <span className="h-px w-8 bg-gray-200"></span>
        <div className={`flex items-center gap-1.5 cursor-pointer ${activeStep === 2 ? 'text-marix-teal' : 'text-gray-400'}`} onClick={() => setActiveStep(2)}>
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${activeStep === 2 ? 'bg-marix-teal text-white' : 'bg-gray-200 text-gray-600'}`}>2</span>
          <span>Variants</span>
        </div>
      </div>

      {/* STEP 1 SECTION: BASIC INFORMATION */}
      {activeStep === 1 && (
        <div className="bg-white border border-gray-200/90 rounded-xl p-4 md:p-5 shadow-sm flex flex-col gap-4 animate-fadeIn">
          <div className="flex gap-2.5 items-start mb-1 select-none">
            <div className="p-2 bg-marix-cream/80 text-marix-teal rounded-xl flex items-center justify-center shrink-0">
              <i className="ph ph-file-text text-xl"></i>
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#111111]">1. Basic Information</h3>
              <p className="text-[11px] text-gray-400 font-medium">Add the essential details about your product.</p>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-[#111111]">Product Title <span className="text-red-500">*</span></label>
            <input type="text" placeholder="e.g., Louis Vuitton Slim-Fit Shirt" maxLength={100} value={basicInfo.productTitle} onChange={(e) => setBasicInfo({ ...basicInfo, productTitle: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-marix-teal text-[#111111]" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-[#111111]">Shop Name <span className="text-red-500">*</span></label>
            <input type="text" placeholder="e.g., ThriftByFaith or KicksPlug" value={basicInfo.shopName} onChange={(e) => setBasicInfo({ ...basicInfo, shopName: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-marix-teal text-[#111111]" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-[#111111]">Category <span className="text-red-500">*</span></label>
            <div className="relative w-full">
              <select value={basicInfo.category} onChange={(e) => setBasicInfo({ ...basicInfo, category: e.target.value })} className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-xs focus:outline-none focus:border-marix-teal font-medium appearance-none text-[#111111] bg-white cursor-pointer">
                {campusCategories.map((c, i) => <option key={i} value={c}>{c}</option>)}
              </select>
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none flex items-center">
                <i className="ph ph-tag text-sm"></i>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#111111]">Price (₦) <span className="text-red-500">*</span></label>
              <input type="number" placeholder="e.g., 15000" value={basicInfo.price} onChange={(e) => setBasicInfo({ ...basicInfo, price: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-marix-teal text-[#111111]" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#111111]">WhatsApp Number <span className="text-red-500">*</span></label>
              <input type="tel" placeholder="e.g., 2348012345678" value={basicInfo.whatsappNumber} onChange={(e) => setBasicInfo({ ...basicInfo, whatsappNumber: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-marix-teal text-[#111111]" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-[#111111]">Campus Hub Location <span className="text-red-500">*</span></label>
            <select value={basicInfo.campus} onChange={(e) => setBasicInfo({ ...basicInfo, campus: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-marix-teal font-medium text-[#111111] bg-white cursor-pointer">
              {campuses.map((c, i) => <option key={i} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-[#111111]">Product Description <span className="text-red-500">*</span></label>
            <textarea placeholder="e.g., Vintage print, high-quality material. Delivery at ABSU." maxLength={500} rows={3} value={basicInfo.productDescription} onChange={(e) => setBasicInfo({ ...basicInfo, productDescription: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-marix-teal resize-none text-[#111111]" />
          </div>

          <button type="button" onClick={() => setActiveStep(2)} className="w-full mt-2 bg-marix-brown text-white font-bold py-2.5 rounded-xl text-xs shadow-sm hover:opacity-95 transition-opacity cursor-pointer text-center focus:outline-none">
            Continue to Variants →
          </button>
        </div>
      )}

      {/* STEP 2 SECTION: VARIANTS */}
      {activeStep === 2 && (
        <div className="flex flex-col gap-4 animate-fadeIn">
          <div className="bg-white border border-gray-200/90 rounded-xl p-4 md:p-5 shadow-sm">
            <div className="flex gap-2.5 items-start mb-6 select-none">
              <div className="p-2 bg-marix-cream/80 text-marix-teal rounded-xl flex items-center justify-center">
                <i className="ph ph-squares-four text-lg"></i>
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#111111]">2. Variants</h3>
                <p className="text-[11px] text-gray-400 font-medium">Add specifications and product option images below.</p>
              </div>
            </div>

            {/* A. Dynamic Variable Entry Block */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-gray-600">A. {labels.specLabel} <span className="text-gray-400 font-medium">(Optional)</span></h4>
              </div>
              
              <div className="flex flex-wrap gap-2 items-center">
                {availableSizes.map((size, index) => (
                  <div key={index} className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-bold text-[#111111]">
                    <span>{size}</span>
                    <button type="button" onClick={() => handleRemoveSize(size)} className="text-gray-400 hover:text-red-500 ml-1 font-normal text-xs focus:outline-none">✕</button>
                  </div>
                ))}
                
                <div className="flex items-center gap-1 max-w-[220px]">
                  <input type="text" placeholder={labels.specPlaceholder} value={sizeInput} onChange={(e) => setSizeInput(e.target.value)} className="w-full border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none text-[#111111]" />
                  <button type="button" onClick={handleAddSize} className="px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-xs font-bold rounded-xl border border-gray-200 focus:outline-none">+</button>
                </div>
              </div>
            </div>

            <hr className="border-gray-100 my-4" />

            {/* B. Product Options & Images Section */}
            <div>
              <h4 className="text-xs font-bold text-gray-600 mb-1">B. {labels.colorLabel} <span className="text-red-500">*</span></h4>
              <p className="text-[10px] text-gray-400 font-medium mb-3">Add options and their corresponding presentation images below.</p>

              <div className="flex flex-col gap-4">
                {colorVariants.map((variant, index) => (
                  <div key={index} className="border border-gray-200 p-3 rounded-xl bg-gray-50/50 flex flex-col gap-3 relative group">
                    
                    {colorVariants.length > 1 && (
                      <button type="button" onClick={() => handleRemoveColorVariant(index)} className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors focus:outline-none flex items-center justify-center">
                        <i className="ph ph-trash text-base"></i>
                      </button>
                    )}

                    <div className="flex flex-col gap-1 max-w-sm">
                      <label className="text-[10px] font-bold text-gray-500">{labels.colorLabel}</label>
                      {/* 🚀 FIXED: Pure dynamic placeholder used here cleanly. No values prefilled! */}
                      <input type="text" placeholder={labels.colorPlaceholder} value={variant.colorName} onChange={(e) => handleColorChange(index, e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-marix-teal text-[#111111]" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                      <div className="sm:col-span-5">
                        <label className="border border-dashed border-gray-300 bg-white hover:border-gray-400 rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer transition-colors select-none text-center min-h-[92px]">
                          {variant.imageUrl ? (
                            <div className="w-full h-16 rounded-lg overflow-hidden relative">
                              <img src={variant.imageUrl} alt="Asset container variant" className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <>
                              <i className="ph ph-camera text-xl text-gray-400 mb-1"></i>
                              <span className="text-[11px] font-bold text-gray-500 max-w-[140px] truncate">Upload Image</span>
                            </>
                          )}
                          <input type="file" accept="image/*" onChange={(e) => handleRealImageCompressionUpload(index, e)} className="hidden" />
                        </label>
                      </div>

                      <div className="sm:col-span-7">
                        {variant.isMain ? (
                          <div className="bg-green-50 border border-green-100 p-2.5 rounded-xl text-left flex items-start gap-2 select-none animate-fadeIn">
                            <i className="ph ph-star-fill text-green-600 text-xs pt-0.5"></i>
                            <div>
                              <h5 className="text-[11px] font-bold text-green-800">Main product image</h5>
                              <p className="text-[10px] text-green-700/80 font-medium">This will be used as your main product card thumbnail grid preview.</p>
                            </div>
                          </div>
                        ) : (
                          <div 
                            onClick={() => handleSetMainImage(index)}
                            className="border border-dashed border-gray-200 bg-white px-3 py-2.5 rounded-xl text-left flex items-center gap-1.5 cursor-pointer hover:border-gray-400 select-none transition-colors text-xs text-gray-400 font-bold"
                          >
                            <i className="ph ph-star text-sm font-bold"></i>
                            <span>Set as main image</span>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                ))}

                <div className="flex flex-col gap-1.5 mt-2">
                  <button type="button" onClick={handleAddColorVariant} className="w-full border border-dashed border-marix-teal/40 text-marix-teal p-3 rounded-xl text-xs font-bold text-center bg-marix-cream/20 hover:bg-marix-cream/50 transition-all focus:outline-none flex items-center justify-center gap-1">
                    <i className="ph ph-plus font-bold"></i>
                    <span>Create New Option Variant Entry</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}