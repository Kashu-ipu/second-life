import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PRESET_SAMPLES } from '../data/mockData';
import { evaluateItemPathway } from '../utils/recommendationEngine';

const validateImageSuitability = (file, imageSrc) => {
  return new Promise((resolve) => {
    if (!file) {
      resolve({ status: 'VALID_ITEM', predictedCategory: null });
      return;
    }

    const name = file.name.toLowerCase();

    // Check non-image extensions just in case (Layer 1 File validation)
    const validExtensions = ['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg'];
    const ext = name.split('.').pop();
    if (!validExtensions.includes(ext) || !file.type.startsWith('image/')) {
      resolve({
        status: 'INVALID_NOT_AN_ITEM',
        reason: 'Please upload a valid image file. Unsupported file formats cannot be analyzed.',
        predictedCategory: null
      });
      return;
    }

    // Size limit check: 10MB (Layer 1 size limit check)
    if (file.size > 10 * 1024 * 1024) {
      resolve({
        status: 'INVALID_NOT_AN_ITEM',
        reason: 'File size exceeds the 10MB limit. Please upload a smaller image.',
        predictedCategory: null
      });
      return;
    }

    // Heuristics for digital graphics, cartoons, memes, or illustrations in filename
    const invalidKeywords = [
      'waterfall', 'landscape', 'scenery', 'nature', 'forest', 'mountain', 'river',
      'sea', 'lake', 'ocean', 'view', 'sky', 'beach', 'sunset', 'sunrise', 'abstract',
      'pattern', 'background', 'texture', 'wallpaper', 'cartoon', 'meme', 'illustration',
      'drawing', 'vector', 'clipart', 'logo', 'sketch', 'doodle', 'graphic', 'art'
    ];
    const isInvalidName = invalidKeywords.some(keyword => name.includes(keyword));
    if (isInvalidName) {
      resolve({
        status: 'INVALID_NOT_AN_ITEM',
        reason: "We couldn't confidently identify a physical item in this image. Please upload a clear photo of the item.",
        predictedCategory: null
      });
      return;
    }

    // Predict category based on filename keywords
    let predictedCategory = null;
    if (/\b(chair|sofa|couch|table|bed|desk|drawer|cabinet|stool|furniture|bench|wardrobe|dresser)\b/i.test(name)) {
      predictedCategory = 'Furniture';
    } else if (/\b(jacket|shirt|pants|jeans|dress|coat|sweater|tshirt|hoodie|clothing|apparel|socks|skirt|blouse)\b/i.test(name)) {
      predictedCategory = 'Clothing';
    } else if (/\b(lamp|vase|mirror|clock|frame|pillow|rug|candle|decor|cushion|painting)\b/i.test(name)) {
      predictedCategory = 'Home Decor';
    } else if (/\b(phone|laptop|computer|tv|television|tablet|camera|charger|headphone|speaker|electronic|appliance|keyboard|mouse|screen|monitor)\b/i.test(name)) {
      predictedCategory = 'Electronics';
    } else if (/\b(pot|pan|cup|plate|fork|spoon|knife|kettle|mug|kitchenware|cookware|glassware|bowl|utensil)\b/i.test(name)) {
      predictedCategory = 'Kitchenware';
    }

    // Semantic Layer 2: Canvas color composition & color diversity assessment
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({ status: 'VALID_ITEM', predictedCategory });
          return;
        }

        // Downscale to 30x30 to aggregate high-level color representation
        canvas.width = 30;
        canvas.height = 30;
        ctx.drawImage(img, 0, 0, 30, 30);

        const imgData = ctx.getImageData(0, 0, 30, 30);
        const data = imgData.data;

        let skyBlueCount = 0;
        let foliageGreenCount = 0;
        let waterBlueCount = 0;
        let earthyBrownCount = 0;

        const uniqueColors = new Set();
        const colorCounts = {};

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i+1];
          const b = data[i+2];

          // Store unique color fingerprint
          const bucketR = Math.round(r / 4) * 4;
          const bucketG = Math.round(g / 4) * 4;
          const bucketB = Math.round(b / 4) * 4;
          const colorKey = `${bucketR},${bucketG},${bucketB}`;
          uniqueColors.add(colorKey);
          colorCounts[colorKey] = (colorCounts[colorKey] || 0) + 1;

          // Sky blue (light cyan-blue gradients)
          if (b > 170 && g > 140 && r > 90 && b > g && g > r) {
            skyBlueCount++;
          }
          // Foliage green (plants/nature landscapes)
          else if (g > 80 && g > r * 1.15 && g > b * 1.15) {
            foliageGreenCount++;
          }
          // Water blue
          else if (b > 100 && b > r * 1.3 && b > g * 1.05) {
            waterBlueCount++;
          }
          // Earthy brown
          else if (r > 60 && r < 160 && g > 40 && g < 120 && b > 20 && b < 90 && r > g && g > b) {
            earthyBrownCount++;
          }
        }

        const totalPixels = 30 * 30;
        const natureRatio = (skyBlueCount + foliageGreenCount + waterBlueCount + earthyBrownCount) / totalPixels;

        // Find if a single color dominates the image (flat graphics)
        let maxColorCount = 0;
        for (const key in colorCounts) {
          if (colorCounts[key] > maxColorCount) {
            maxColorCount = colorCounts[key];
          }
        }
        const dominantColorRatio = maxColorCount / totalPixels;

        // Cartoon & Illustration check:
        // 1. Color diversity (vector graphics have very low color count, e.g. < 110 unique shades in 30x30 grid, whereas photos have > 300)
        // 2. High dominance of a single flat color (e.g. background > 50% of the image)
        const isCartoonOrIllustration = uniqueColors.size < 110 || dominantColorRatio > 0.6;

        if (isCartoonOrIllustration) {
          resolve({
            status: 'INVALID_NOT_AN_ITEM',
            reason: "We couldn't confidently identify a physical item in this image. Please upload a clear photo of the item (cartoons, drawings, and digital illustrations cannot be analyzed).",
            predictedCategory
          });
        } else if (natureRatio > 0.45) {
          resolve({
            status: 'INVALID_NOT_AN_ITEM',
            reason: 'Landscapes, scenery, and nature-only photographs cannot be assessed. Please upload an image containing a physical item.',
            predictedCategory
          });
        } else if (natureRatio > 0.22) {
          resolve({
            status: 'UNCERTAIN',
            reason: 'Prototype image verification could not confidently identify a physical item. Please upload a clearer photo, or verify item details manually.',
            predictedCategory
          });
        } else {
          resolve({ status: 'VALID_ITEM', predictedCategory });
        }
      } catch (err) {
        console.error('Image validation error', err);
        resolve({ status: 'VALID_ITEM', predictedCategory });
      }
    };
    img.onerror = () => {
      resolve({
        status: 'INVALID_NOT_AN_ITEM',
        reason: 'Failed to load image. The file might be corrupted.',
        predictedCategory: null
      });
    };
  });
};

export default function AssessPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [selectedImage, setSelectedImage] = useState(null);
  const [imageMetadata, setImageMetadata] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Image suitability check states
  const [validationStatus, setValidationStatus] = useState('idle'); // 'idle' | 'validating' | 'valid' | 'invalid' | 'uncertain' | 'error'
  const [validationMessage, setValidationMessage] = useState('');
  const [predictedCategory, setPredictedCategory] = useState(null);

  // Item information fields
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('Repairable');

  const handleFile = (file) => {
    if (file) {
      setValidationError('');
      setValidationStatus('validating');
      setValidationMessage('Running image verification...');
      setPredictedCategory(null);

      const name = file.name.toLowerCase();
      const validExtensions = ['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg'];
      const ext = name.split('.').pop();

      // Early Layer 1 Validation for non-images
      if (!validExtensions.includes(ext) || !file.type.startsWith('image/')) {
        setSelectedImage(null);
        setImageMetadata(null);
        setValidationStatus('invalid');
        setValidationMessage('Please upload a valid image file (PNG, JPG, WEBP). Non-image files cannot be analyzed.');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageSrc = e.target.result;
        setSelectedImage(imageSrc);
        setImageMetadata({
          name: file.name,
          size: (file.size / (1024 * 1024)).toFixed(2) + ' MB'
        });

        // Auto-detect item name from filename
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        const cleanedName = nameWithoutExt.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        if (!itemName) {
          setItemName(cleanedName);
        }

        // Run validation Promise
        validateImageSuitability(file, imageSrc)
          .then((res) => {
            setValidationStatus(res.status === 'VALID_ITEM' ? 'valid' : res.status === 'UNCERTAIN' ? 'uncertain' : 'invalid');
            setValidationMessage(res.reason || '');
            setPredictedCategory(res.predictedCategory);
          })
          .catch((err) => {
            console.error('Validation promise failed', err);
            setValidationStatus('error');
            setValidationMessage('Image validation could not be completed. Please enter your item details manually below.');
          });
      };
      reader.onerror = () => {
        setValidationStatus('invalid');
        setValidationMessage('Failed to read image. The file might be corrupted.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handlePresetSelect = (preset) => {
    setValidationError('');
    setSelectedImage(preset.image);
    setImageMetadata({
      name: `${preset.name} (Sample)`,
      size: 'Sample Image'
    });
    setItemName(preset.name);
    setCategory(preset.category);
    if (preset.id === 'chair') setCondition('Repairable');
    if (preset.id === 'jacket') setCondition('Excellent');
    if (preset.id === 'lamp') setCondition('Good');

    // Presets are verified
    setValidationStatus('valid');
    setValidationMessage('');
    setPredictedCategory(preset.category);
  };

  const handleResetImage = () => {
    setSelectedImage(null);
    setImageMetadata(null);
    setValidationStatus('idle');
    setValidationMessage('');
    setPredictedCategory(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAnalyze = () => {
    // If validationStatus is invalid, block
    if (validationStatus === 'invalid') {
      setValidationError('Landscapes, scenery, and nature-only photographs cannot be assessed. Please upload a clear photo of an assessable item.');
      return;
    }

    // If validation is validating, block until done
    if (validationStatus === 'validating') {
      setValidationError('Please wait for image suitability check to complete.');
      return;
    }

    // If we have an image and validation is uncertain, check if manual inputs are filled
    if (selectedImage && (validationStatus === 'uncertain' || validationStatus === 'error')) {
      if (!itemName.trim() || !category) {
        setValidationError('Image validation is uncertain. Please enter the Item Name and select a Category manually to proceed.');
        return;
      }
    }

    // If no image is provided (pure manual entry), they must fill Name and Category
    if (!selectedImage) {
      if (!itemName.trim() || !category) {
        setValidationError('Please enter the Item Name and select a Category to proceed with manual assessment.');
        return;
      }
    }

    setValidationError('');
    setIsAnalyzing(true);

    // Fallback matched preset for image if custom text without image was submitted
    let matchedPreset = PRESET_SAMPLES.find(
      (p) => p.name.toLowerCase() === (itemName || '').trim().toLowerCase()
    ) || PRESET_SAMPLES[0];

    const finalItemName = (itemName || '').trim() || matchedPreset.name;
    const finalCategory = category || matchedPreset.category || 'Other';
    const finalCondition = condition || 'Repairable';

    // Run dynamic deterministic recommendation engine
    const analysisResult = evaluateItemPathway({
      item: finalItemName,
      category: finalCategory,
      condition: finalCondition
    });

    const assessmentPayload = {
      image: selectedImage || matchedPreset.image,
      item: finalItemName,
      category: finalCategory,
      condition: finalCondition,
      analysis: analysisResult
    };

    // Simulated evaluation transition
    setTimeout(() => {
      setIsAnalyzing(false);
      navigate('/result', { state: { assessment: assessmentPayload } });
    }, 650);
  };

  const conditionOptions = [
    { label: 'Excellent', desc: 'Like new or gently used' },
    { label: 'Good', desc: 'Functional with minor cosmetic wear' },
    { label: 'Repairable', desc: 'Needs minor fix or refurbishment' },
    { label: 'Damaged', desc: 'Broken parts, best for reclamation' }
  ];

  return (
    <div className="page-assess">
      <div className="container">
        <div className="assess-hero-header">
          <div className="hero-pill">
            <span className="hero-pill-dot"></span>
            <span>Step 1: Item Assessment</span>
          </div>
          <h1 className="assess-page-title">Let’s Find Your Item’s Best Next Life</h1>
          <p className="assess-page-subtitle">
            Upload a photo or choose a sample to identify whether your item should be reused, repaired, resold or recycled.
          </p>
        </div>

        <div className="workspace-card assess-workspace">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            accept="image/*"
            style={{ display: 'none' }}
          />

          {/* Upload Area */}
          {!selectedImage ? (
            <div>
              <div
                className={`dropzone ${isDragging ? 'is-dragging' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
              >
                <div className="dropzone-icon-box">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <div className="dropzone-title">Drag & drop your item image here</div>
                <div className="dropzone-subtitle">Supports JPG, PNG, WEBP (Up to 10MB)</div>
                <button
                  type="button"
                  className="btn-browse"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current && fileInputRef.current.click();
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                  </svg>
                  <span>Select Image</span>
                </button>
              </div>

              {/* Sample item options */}
              <div className="sample-presets">
                <span className="sample-presets-label">Or test with a sample item:</span>
                {PRESET_SAMPLES.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    className="sample-pill"
                    onClick={() => handlePresetSelect(preset)}
                  >
                    + {preset.name}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="preview-container">
              <div className="preview-media-box">
                <img src={selectedImage} alt="Item preview" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = '/second-life-hero.png'; }} />
                <button
                  type="button"
                  onClick={handleResetImage}
                  className="btn-remove-image"
                  title="Change image"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                  <span>Change Image</span>
                </button>
              </div>
              <div className="preview-info-row">
                <div className="preview-meta">
                  <span className="preview-item-name">{imageMetadata?.name || 'Selected Item'}</span>
                  <span className="preview-file-size">{imageMetadata?.size}</span>
                </div>
              </div>

              {/* Image Suitability Validation Status Banner */}
              {validationStatus !== 'idle' && (
                <div className={`validation-warning-banner status-${validationStatus}`} style={{ marginTop: '12px', marginBottom: '8px' }}>
                  {validationStatus === 'validating' ? (
                    <div className="scan-spinner"></div>
                  ) : validationStatus === 'valid' ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  )}
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                    {validationStatus === 'validating' ? 'Scanning Image Suitability...' :
                     validationStatus === 'valid' ? 'Image Suitability: Valid physical item detected' :
                     validationStatus === 'uncertain' ? 'Image Suitability: Uncertain item detection' :
                     validationStatus === 'invalid' ? 'Image Suitability: Invalid image detected' : 'Check Completed'}
                  </span>
                </div>
              )}

              {/* Detailed Validation Status Message */}
              {validationMessage && (
                <div style={{
                  fontSize: '0.82rem',
                  color: validationStatus === 'invalid' ? '#B91C1C' : validationStatus === 'uncertain' ? '#854D0E' : 'var(--text-secondary)',
                  marginTop: '4px',
                  marginBottom: '12px',
                  paddingLeft: '6px',
                  textAlign: 'left',
                  lineHeight: '1.4'
                }}>
                  {validationMessage}
                </div>
              )}
            </div>
          )}

          {/* Show non-image file validation failure message below dropzone when no image is shown */}
          {!selectedImage && validationStatus === 'invalid' && validationMessage && (
            <div className="validation-warning-banner status-invalid" style={{ marginTop: '18px', marginBottom: '8px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                {validationMessage}
              </span>
            </div>
          )}

          {/* Basic Item Details Section (Optional) */}
          <div className="form-section-divider">
            <span>Item Details</span>
          </div>

          <div className="assess-form-grid">
            <div className="form-group">
              <label className="form-label" htmlFor="itemName">Item Name</label>
              <input
                id="itemName"
                type="text"
                className="form-input"
                placeholder="e.g. Wooden Dining Chair, Denim Jacket, Coffee Maker"
                value={itemName}
                onChange={(e) => {
                  setItemName(e.target.value);
                  if (validationError) setValidationError('');
                }}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="category">Category</label>
              <select
                id="category"
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select a category...</option>
                <option value="Furniture">Furniture</option>
                <option value="Clothing">Clothing & Apparel</option>
                <option value="Home Decor">Home & Decor</option>
                <option value="Electronics">Electronics & Appliances</option>
                <option value="Kitchenware">Kitchenware & Cookware</option>
                <option value="Other">Other Household Goods</option>
              </select>
            </div>
          </div>

          {/* Condition Selector */}
          <div className="form-group" style={{ marginTop: '18px' }}>
            <label className="form-label">Estimated Condition</label>
            <div className="condition-pill-grid">
              {conditionOptions.map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => setCondition(opt.label)}
                  className={`condition-pill ${condition === opt.label ? 'is-selected' : ''}`}
                >
                  <span className="condition-pill-title">{opt.label}</span>
                  <span className="condition-pill-desc">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Validation Notice Banner */}
          {validationError && (
            <div className="validation-warning-banner">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{validationError}</span>
            </div>
          )}

          {/* Primary Action Button */}
          <div style={{ marginTop: '28px' }}>
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={isAnalyzing || validationStatus === 'invalid' || validationStatus === 'validating'}
              className="btn-analyze"
              style={{
                opacity: (validationStatus === 'invalid' || validationStatus === 'validating') ? 0.6 : 1,
                cursor: (validationStatus === 'invalid' || validationStatus === 'validating') ? 'not-allowed' : 'pointer'
              }}
            >
              {isAnalyzing ? (
                <>
                  <div className="spinner"></div>
                  <span>Evaluating Circular Pathway...</span>
                </>
              ) : (
                <>
                  <span>Analyze Item</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '8px', textAlign: 'center' }}>
              ℹ️ Image suitability check is performed locally. It filters landscapes and nature scenes but does not calculate circular pathway scores.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
