import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PRESET_SAMPLES } from '../data/mockData';
import { evaluateItemPathway } from '../utils/recommendationEngine';

export default function AssessPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [selectedImage, setSelectedImage] = useState(null);
  const [imageMetadata, setImageMetadata] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Item information fields
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('Repairable');

  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      setValidationError('');
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
        setImageMetadata({
          name: file.name,
          size: (file.size / (1024 * 1024)).toFixed(2) + ' MB'
        });
        if (!itemName) {
          setItemName(file.name.replace(/\.[^/.]+$/, ''));
        }
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
  };

  const handleResetImage = () => {
    setSelectedImage(null);
    setImageMetadata(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAnalyze = () => {
    // Validate that user provided an item image or name
    if (!selectedImage && !itemName.trim()) {
      setValidationError('Please select a sample item or upload an image to assess its circular pathway.');
      return;
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
              disabled={isAnalyzing}
              className="btn-analyze"
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
          </div>
        </div>
      </div>
    </div>
  );
}
