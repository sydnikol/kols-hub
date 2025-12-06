/**
 * Clothing Scanner Modal
 * AI-powered photo scanner that automatically detects and adds clothes to the virtual wardrobe
 */

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera, Upload, X, Check, Sparkles, Loader2, Image, Shirt,
  AlertCircle, Plus, Trash2, Edit2, ChevronRight, Wand2
} from 'lucide-react';
import aiClothingScanner, { DetectedClothing, ScanResult } from '../services/ai-clothing-scanner';
import { WardrobeClothingItem } from '../services/avatar-wardrobe-integration';

interface ClothingScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onItemsAdded: (items: WardrobeClothingItem[]) => void;
  openAIKey?: string;
  geminiKey?: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  top: 'bg-blue-500',
  bottom: 'bg-green-500',
  dress: 'bg-purple-500',
  outerwear: 'bg-orange-500',
  shoes: 'bg-red-500',
  accessory: 'bg-pink-500'
};

const ClothingScannerModal: React.FC<ClothingScannerModalProps> = ({
  isOpen,
  onClose,
  onItemsAdded,
  openAIKey,
  geminiKey
}) => {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [editingItem, setEditingItem] = useState<{ resultIdx: number; itemIdx: number } | null>(null);
  const [step, setStep] = useState<'upload' | 'review' | 'complete'>('upload');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Initialize scanner with API keys
  React.useEffect(() => {
    if (openAIKey) {
      aiClothingScanner.setOpenAIKey(openAIKey);
    }
    if (geminiKey) {
      aiClothingScanner.setGeminiKey(geminiKey);
    }
  }, [openAIKey, geminiKey]);

  // Handle file selection
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setSelectedImages(prev => [...prev, ...files]);

    // Create previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  // Remove an image
  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Start AI scan
  const startScan = async () => {
    if (selectedImages.length === 0) return;

    setIsScanning(true);
    setScanProgress(0);
    setScanResults([]);

    const results: ScanResult[] = [];

    for (let i = 0; i < selectedImages.length; i++) {
      const result = await aiClothingScanner.scanImage(selectedImages[i]);
      results.push(result);
      setScanProgress(((i + 1) / selectedImages.length) * 100);
    }

    setScanResults(results);
    setIsScanning(false);
    setStep('review');
  };

  // Update detected item
  const updateDetectedItem = (
    resultIdx: number,
    itemIdx: number,
    updates: Partial<DetectedClothing>
  ) => {
    setScanResults(prev => {
      const newResults = [...prev];
      newResults[resultIdx] = {
        ...newResults[resultIdx],
        detectedItems: newResults[resultIdx].detectedItems.map((item, idx) =>
          idx === itemIdx ? { ...item, ...updates } : item
        )
      };
      return newResults;
    });
    setEditingItem(null);
  };

  // Remove detected item
  const removeDetectedItem = (resultIdx: number, itemIdx: number) => {
    setScanResults(prev => {
      const newResults = [...prev];
      newResults[resultIdx] = {
        ...newResults[resultIdx],
        detectedItems: newResults[resultIdx].detectedItems.filter((_, idx) => idx !== itemIdx)
      };
      return newResults;
    });
  };

  // Add all items to wardrobe
  const addAllToWardrobe = () => {
    const items: WardrobeClothingItem[] = [];

    scanResults.forEach((result) => {
      result.detectedItems.forEach((detection) => {
        items.push({
          id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          photoUrl: result.sourceImage,
          category: detection.category,
          colors: detection.colors,
          tags: detection.tags,
          favorite: false,
          name: detection.suggestedName,
          notes: detection.description,
          dateAdded: new Date().toISOString(),
          wearCount: 0
        });
      });
    });

    onItemsAdded(items);
    setStep('complete');
  };

  // Reset modal
  const resetModal = () => {
    setSelectedImages([]);
    setImagePreviews([]);
    setScanResults([]);
    setStep('upload');
    setScanProgress(0);
    setEditingItem(null);
  };

  // Count total detected items
  const totalDetectedItems = scanResults.reduce(
    (sum, r) => sum + r.detectedItems.length,
    0
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gray-900 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col border border-purple-500/30"
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                <Wand2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">AI Clothing Scanner</h2>
                <p className="text-sm text-gray-400">
                  {step === 'upload' && 'Upload photos to scan for clothes'}
                  {step === 'review' && `Review ${totalDetectedItems} detected items`}
                  {step === 'complete' && 'Items added to wardrobe!'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Step 1: Upload */}
            {step === 'upload' && (
              <div className="space-y-6">
                {/* Upload area */}
                <div
                  className="border-2 border-dashed border-gray-700 hover:border-purple-500 rounded-xl p-8 text-center transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-300 mb-2">Click to upload photos</p>
                  <p className="text-sm text-gray-500">PNG, JPG, WEBP - Multiple files allowed</p>
                </div>

                {/* Camera option */}
                <div className="flex gap-4">
                  <button
                    onClick={() => cameraInputRef.current?.click()}
                    className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <Camera className="w-5 h-5" />
                    Take Photo
                  </button>
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>

                {/* Image previews */}
                {imagePreviews.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-3">
                      Selected Photos ({imagePreviews.length})
                    </h3>
                    <div className="grid grid-cols-4 gap-3">
                      {imagePreviews.map((preview, idx) => (
                        <div key={idx} className="relative group">
                          <img
                            src={preview}
                            alt={`Preview ${idx + 1}`}
                            className="w-full aspect-square object-cover rounded-lg"
                          />
                          <button
                            onClick={() => removeImage(idx)}
                            className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Scan button */}
                {selectedImages.length > 0 && (
                  <button
                    onClick={startScan}
                    disabled={isScanning}
                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 rounded-xl font-semibold flex items-center justify-center gap-2"
                  >
                    {isScanning ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Scanning... {Math.round(scanProgress)}%
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Scan {selectedImages.length} Photo{selectedImages.length > 1 ? 's' : ''} with AI
                      </>
                    )}
                  </button>
                )}

                {/* Progress bar */}
                {isScanning && (
                  <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300"
                      style={{ width: `${scanProgress}%` }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Review */}
            {step === 'review' && (
              <div className="space-y-6">
                {scanResults.map((result, resultIdx) => (
                  <div key={resultIdx} className="bg-gray-800/50 rounded-xl overflow-hidden">
                    {/* Source image */}
                    <div className="flex items-start gap-4 p-4 border-b border-gray-700">
                      <img
                        src={result.sourceImage}
                        alt={`Scan ${resultIdx + 1}`}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">Photo {resultIdx + 1}</h3>
                        <p className="text-sm text-gray-400">
                          {result.detectedItems.length} item{result.detectedItems.length !== 1 ? 's' : ''} detected
                        </p>
                        {!result.success && (
                          <div className="mt-2 flex items-center gap-2 text-red-400 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            {result.error || 'Scan failed'}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Detected items */}
                    {result.detectedItems.length > 0 && (
                      <div className="p-4 space-y-3">
                        {result.detectedItems.map((item, itemIdx) => (
                          <motion.div
                            key={itemIdx}
                            layout
                            className="flex items-center gap-3 bg-gray-700/50 p-3 rounded-lg"
                          >
                            {/* Category badge */}
                            <div className={`px-2 py-1 rounded text-xs font-medium capitalize ${CATEGORY_COLORS[item.category]} bg-opacity-20`}>
                              {item.category}
                            </div>

                            {/* Item details */}
                            <div className="flex-1 min-w-0">
                              {editingItem?.resultIdx === resultIdx && editingItem?.itemIdx === itemIdx ? (
                                <input
                                  type="text"
                                  defaultValue={item.suggestedName}
                                  onBlur={(e) => updateDetectedItem(resultIdx, itemIdx, {
                                    suggestedName: e.target.value
                                  })}
                                  onKeyPress={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
                                  className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-sm"
                                  autoFocus
                                />
                              ) : (
                                <p className="font-medium text-sm truncate">{item.suggestedName}</p>
                              )}
                              <p className="text-xs text-gray-400 truncate">{item.description}</p>
                            </div>

                            {/* Color swatches */}
                            <div className="flex gap-1">
                              {item.colors.slice(0, 3).map((color, idx) => (
                                <div
                                  key={idx}
                                  className="w-4 h-4 rounded-full border border-white/20"
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>

                            {/* Confidence */}
                            <div className="text-xs text-gray-500">
                              {Math.round(item.confidence * 100)}%
                            </div>

                            {/* Actions */}
                            <div className="flex gap-1">
                              <button
                                onClick={() => setEditingItem({ resultIdx, itemIdx })}
                                className="p-1.5 hover:bg-gray-600 rounded transition-colors"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => removeDetectedItem(resultIdx, itemIdx)}
                                className="p-1.5 hover:bg-red-500/20 text-red-400 rounded transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Summary */}
                {totalDetectedItems > 0 && (
                  <div className="bg-purple-600/20 border border-purple-500/30 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Shirt className="w-6 h-6 text-purple-400" />
                      <div>
                        <p className="font-medium">{totalDetectedItems} items ready to add</p>
                        <p className="text-sm text-gray-400">Review and edit before adding</p>
                      </div>
                    </div>
                    <button
                      onClick={addAllToWardrobe}
                      className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add All
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Complete */}
            {step === 'complete' && (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Success!</h3>
                <p className="text-gray-400 mb-8">
                  {totalDetectedItems} items have been added to your virtual wardrobe
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={resetModal}
                    className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium"
                  >
                    Scan More
                  </button>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          {step === 'review' && (
            <div className="p-4 border-t border-gray-800 flex justify-between">
              <button
                onClick={resetModal}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Start Over
              </button>
              <button
                onClick={() => setStep('upload')}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add More Photos
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ClothingScannerModal;
