import React, { useState, useRef } from 'react';
import MockResultCard from './MockResultCard';
import { PRESET_SAMPLES, DEFAULT_MOCK_RESULT } from '../data/mockData';

export default function UploadSection() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageMetadata, setImageMetadata] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
        setImageMetadata({
          name: file.name,
          size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
          analysis: DEFAULT_MOCK_RESULT
        });
        setAnalysisResult(null); // reset prior result
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
    setSelectedImage(preset.image);
    setImageMetadata({
      name: `${preset.name} (Sample)`,
      size: 'Sample Image',
      analysis: preset.analysis
    });
    setAnalysisResult(null);
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    // Simulate lightweight AI analysis delay
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisResult(imageMetadata?.analysis || DEFAULT_MOCK_RESULT);
    }, 800);
  };

  const handleReset = () => {
    setSelectedImage(null);
    setImageMetadata(null);
    setAnalysisResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <section id="upload-section" className="upload-section">
      <div className="container">
        <div className="workspace-card">
          <div className="section-header-compact">
            <h2>Item Assessment</h2>
            <p>Upload a photo of your item to find its optimal circular pathway.</p>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            accept="image/*"
            style={{ display: 'none' }}
          />

          {!selectedImage ? (
            <div>
              {/* Drag and drop zone */}
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

              {/* Quick Preset Samples for Instant Testing */}
              <div className="sample-presets">
                <span className="sample-presets-label">Or test with a sample:</span>
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
            /* Selected Image Preview & Analyze Action */
            <div className="preview-container">
              <div className="preview-media-box">
                <img src={selectedImage} alt="Uploaded item preview" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = '/second-life-hero.png'; }} />
                <button
                  type="button"
                  onClick={handleReset}
                  className="btn-remove-image"
                  title="Remove image"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                  <span>Change</span>
                </button>
              </div>

              <div className="preview-info-row">
                <div className="preview-meta">
                  <span className="preview-item-name">{imageMetadata?.name || 'Selected Item'}</span>
                  <span className="preview-file-size">{imageMetadata?.size}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="btn-analyze"
              >
                {isAnalyzing ? (
                  <>
                    <div className="spinner"></div>
                    <span>Analyzing Item Pathway...</span>
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <span>Analyze Item</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Analysis Result Display */}
          {analysisResult && (
            <MockResultCard result={analysisResult} onReset={handleReset} />
          )}
        </div>
      </div>
    </section>
  );
}
