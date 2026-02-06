/**
 * Embedded Art Studio Component
 * ==============================
 * ACTUAL embedded art tools you can use directly in the app!
 * No external links - everything works right here
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';

// ============================================================================
// TYPES
// ============================================================================

interface EmbeddedArtStudioProps {
  className?: string;
}

type Tool = 'brush' | 'eraser' | 'fill' | 'line' | 'rectangle' | 'circle' | 'text' | 'picker';
type TabView = 'canvas' | 'pixel' | 'embed';

interface Point {
  x: number;
  y: number;
}

// ============================================================================
// COLOR PALETTES
// ============================================================================

const PALETTES = {
  rainbow: ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3', '#FF1493'],
  pastel: ['#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF', '#E0BBE4', '#FEC8D8', '#FFDFD3'],
  dark: ['#1a1a2e', '#16213e', '#0f3460', '#533483', '#e94560', '#0f0f0f', '#2d2d2d', '#4a4a4a'],
  gothic: ['#2D0A31', '#4A1942', '#6B1D5B', '#8B2A6E', '#5C0A3B', '#380A20', '#1A0510', '#0D0208'],
  skin: ['#FFE4C4', '#DEB887', '#D2B48C', '#BC8F8F', '#F5DEB3', '#FFDAB9', '#CD853F', '#8B4513'],
  grayscale: ['#000000', '#333333', '#666666', '#999999', '#BBBBBB', '#DDDDDD', '#EEEEEE', '#FFFFFF'],
  neon: ['#FF00FF', '#00FFFF', '#FF0080', '#80FF00', '#00FF80', '#8000FF', '#FF8000', '#0080FF']
};

// ============================================================================
// DRAWING CANVAS COMPONENT
// ============================================================================

const DrawingCanvas: React.FC<{
  width: number;
  height: number;
  brushSize: number;
  color: string;
  tool: Tool;
  onColorPick?: (color: string) => void;
}> = ({ width, height, brushSize, color, tool, onColorPick }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState<Point | null>(null);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Save state for undo
  const saveState = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(imageData);
    setHistory(newHistory.slice(-20)); // Keep last 20 states
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveState();
  }, []);

  const getPoint = (e: React.MouseEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const point = getPoint(e);
    setIsDrawing(true);
    setLastPoint(point);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (tool === 'picker') {
      const imageData = ctx.getImageData(point.x, point.y, 1, 1).data;
      const hex = '#' + [imageData[0], imageData[1], imageData[2]]
        .map(x => x.toString(16).padStart(2, '0')).join('');
      onColorPick?.(hex);
      return;
    }

    if (tool === 'fill') {
      floodFill(ctx, Math.floor(point.x), Math.floor(point.y), color);
      saveState();
      return;
    }

    if (tool === 'brush' || tool === 'eraser') {
      ctx.beginPath();
      ctx.arc(point.x, point.y, brushSize / 2, 0, Math.PI * 2);
      ctx.fillStyle = tool === 'eraser' ? '#FFFFFF' : color;
      ctx.fill();
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !lastPoint) return;
    if (tool === 'picker' || tool === 'fill') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const point = getPoint(e);

    if (tool === 'brush' || tool === 'eraser') {
      ctx.beginPath();
      ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(point.x, point.y);
      ctx.strokeStyle = tool === 'eraser' ? '#FFFFFF' : color;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    }

    setLastPoint(point);
  };

  const stopDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (tool === 'line' && lastPoint) {
      const point = getPoint(e);
      ctx.beginPath();
      ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(point.x, point.y);
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.stroke();
    }

    if (tool === 'rectangle' && lastPoint) {
      const point = getPoint(e);
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.strokeRect(lastPoint.x, lastPoint.y, point.x - lastPoint.x, point.y - lastPoint.y);
    }

    if (tool === 'circle' && lastPoint) {
      const point = getPoint(e);
      const radius = Math.sqrt(Math.pow(point.x - lastPoint.x, 2) + Math.pow(point.y - lastPoint.y, 2));
      ctx.beginPath();
      ctx.arc(lastPoint.x, lastPoint.y, radius, 0, Math.PI * 2);
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.stroke();
    }

    setIsDrawing(false);
    setLastPoint(null);
    if (tool !== 'picker') saveState();
  };

  const floodFill = (ctx: CanvasRenderingContext2D, x: number, y: number, fillColor: string) => {
    const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;

    const targetColor = getPixel(data, x, y, width);
    const fill = hexToRgb(fillColor);
    if (!fill) return;

    if (colorsMatch(targetColor, fill)) return;

    const stack: [number, number][] = [[x, y]];
    const visited = new Set<string>();

    while (stack.length > 0) {
      const [cx, cy] = stack.pop()!;
      const key = `${cx},${cy}`;

      if (visited.has(key)) continue;
      if (cx < 0 || cx >= width || cy < 0 || cy >= height) continue;

      const currentColor = getPixel(data, cx, cy, width);
      if (!colorsMatch(currentColor, targetColor)) continue;

      visited.add(key);
      setPixel(data, cx, cy, width, fill);

      stack.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]);
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const getPixel = (data: Uint8ClampedArray, x: number, y: number, width: number) => {
    const i = (y * width + x) * 4;
    return [data[i], data[i + 1], data[i + 2], data[i + 3]];
  };

  const setPixel = (data: Uint8ClampedArray, x: number, y: number, width: number, color: number[]) => {
    const i = (y * width + x) * 4;
    data[i] = color[0];
    data[i + 1] = color[1];
    data[i + 2] = color[2];
    data[i + 3] = 255;
  };

  const colorsMatch = (a: number[], b: number[]) => {
    return Math.abs(a[0] - b[0]) < 10 && Math.abs(a[1] - b[1]) < 10 && Math.abs(a[2] - b[2]) < 10;
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
  };

  const undo = () => {
    if (historyIndex <= 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const newIndex = historyIndex - 1;
    ctx.putImageData(history[newIndex], 0, 0);
    setHistoryIndex(newIndex);
  };

  const redo = () => {
    if (historyIndex >= history.length - 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const newIndex = historyIndex + 1;
    ctx.putImageData(history[newIndex], 0, 0);
    setHistoryIndex(newIndex);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveState();
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'kols-hub-artwork.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="space-y-4">
      {/* Canvas Actions */}
      <div className="flex gap-2 flex-wrap">
        <button onClick={undo} className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm">
          ↩ Undo
        </button>
        <button onClick={redo} className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm">
          ↪ Redo
        </button>
        <button onClick={clearCanvas} className="bg-red-700 hover:bg-red-600 text-white px-3 py-1 rounded text-sm">
          🗑️ Clear
        </button>
        <button onClick={downloadImage} className="bg-green-700 hover:bg-green-600 text-white px-3 py-1 rounded text-sm">
          💾 Save PNG
        </button>
      </div>

      {/* Canvas */}
      <div className="flex justify-center bg-gray-800 rounded-xl p-4">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="border-2 border-purple-500/50 rounded-lg cursor-crosshair bg-white"
          style={{ maxWidth: '100%', height: 'auto' }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
      </div>
    </div>
  );
};

// ============================================================================
// PIXEL ART CANVAS
// ============================================================================

const PixelArtCanvas: React.FC<{
  gridSize: number;
  pixelSize: number;
  color: string;
}> = ({ gridSize, pixelSize, color }) => {
  const [pixels, setPixels] = useState<string[][]>(() =>
    Array(gridSize).fill(null).map(() => Array(gridSize).fill('#FFFFFF'))
  );
  const [isDrawing, setIsDrawing] = useState(false);

  const handlePixelClick = (row: number, col: number) => {
    const newPixels = [...pixels];
    newPixels[row][col] = color;
    setPixels(newPixels);
  };

  const handleMouseDown = (row: number, col: number) => {
    setIsDrawing(true);
    handlePixelClick(row, col);
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (isDrawing) {
      handlePixelClick(row, col);
    }
  };

  const clearPixels = () => {
    setPixels(Array(gridSize).fill(null).map(() => Array(gridSize).fill('#FFFFFF')));
  };

  const downloadPixelArt = () => {
    const canvas = document.createElement('canvas');
    canvas.width = gridSize * pixelSize;
    canvas.height = gridSize * pixelSize;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    pixels.forEach((row, i) => {
      row.forEach((pixel, j) => {
        ctx.fillStyle = pixel;
        ctx.fillRect(j * pixelSize, i * pixelSize, pixelSize, pixelSize);
      });
    });

    const link = document.createElement('a');
    link.download = 'kols-hub-pixel-art.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={clearPixels} className="bg-red-700 hover:bg-red-600 text-white px-3 py-1 rounded text-sm">
          🗑️ Clear
        </button>
        <button onClick={downloadPixelArt} className="bg-green-700 hover:bg-green-600 text-white px-3 py-1 rounded text-sm">
          💾 Save PNG
        </button>
      </div>

      <div
        className="inline-grid gap-0 border-2 border-purple-500/50 rounded bg-white"
        style={{ gridTemplateColumns: `repeat(${gridSize}, ${pixelSize}px)` }}
        onMouseUp={() => setIsDrawing(false)}
        onMouseLeave={() => setIsDrawing(false)}
      >
        {pixels.map((row, i) =>
          row.map((pixel, j) => (
            <div
              key={`${i}-${j}`}
              className="border border-gray-200 cursor-pointer hover:opacity-80"
              style={{
                width: pixelSize,
                height: pixelSize,
                backgroundColor: pixel
              }}
              onMouseDown={() => handleMouseDown(i, j)}
              onMouseEnter={() => handleMouseEnter(i, j)}
            />
          ))
        )}
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const EmbeddedArtStudio: React.FC<EmbeddedArtStudioProps> = ({ className = '' }) => {
  const [activeTab, setActiveTab] = useState<TabView>('canvas');
  const [color, setColor] = useState('#FF0000');
  const [brushSize, setBrushSize] = useState(5);
  const [tool, setTool] = useState<Tool>('brush');
  const [activePalette, setActivePalette] = useState<keyof typeof PALETTES>('rainbow');
  const [pixelGridSize, setPixelGridSize] = useState(16);

  const tools: { id: Tool; name: string; icon: string }[] = [
    { id: 'brush', name: 'Brush', icon: '🖌️' },
    { id: 'eraser', name: 'Eraser', icon: '🧽' },
    { id: 'fill', name: 'Fill', icon: '🪣' },
    { id: 'line', name: 'Line', icon: '📏' },
    { id: 'rectangle', name: 'Rectangle', icon: '⬜' },
    { id: 'circle', name: 'Circle', icon: '⭕' },
    { id: 'picker', name: 'Color Picker', icon: '💉' }
  ];

  return (
    <div className={`bg-gray-900/60 rounded-2xl border border-pink-500/30 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-pink-200">🎨 Art Studio</h2>
        <div className="text-sm text-gray-400">Create art directly in the app!</div>
      </div>

      {/* Tab Selection */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('canvas')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            activeTab === 'canvas'
              ? 'bg-pink-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          <span>🖌️</span>
          <span>Drawing Canvas</span>
        </button>
        <button
          onClick={() => setActiveTab('pixel')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            activeTab === 'pixel'
              ? 'bg-pink-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          <span>🎮</span>
          <span>Pixel Art</span>
        </button>
        <button
          onClick={() => setActiveTab('embed')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            activeTab === 'embed'
              ? 'bg-pink-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          <span>🌐</span>
          <span>Pro Tools</span>
        </button>
      </div>

      {/* DRAWING CANVAS TAB */}
      {activeTab === 'canvas' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Toolbar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Tools */}
            <div className="bg-gray-800/60 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-300 mb-3">Tools</h3>
              <div className="grid grid-cols-4 gap-2">
                {tools.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTool(t.id)}
                    className={`p-2 rounded-lg transition-all ${
                      tool === t.id
                        ? 'bg-pink-600 text-white'
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                    title={t.name}
                  >
                    <span className="text-xl">{t.icon}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Brush Size */}
            <div className="bg-gray-800/60 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-300 mb-3">Brush Size: {brushSize}px</h3>
              <input
                type="range"
                min="1"
                max="50"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Color Picker */}
            <div className="bg-gray-800/60 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-300 mb-3">Color</h3>
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-12 h-12 rounded-lg border-2 border-white"
                  style={{ backgroundColor: color }}
                />
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full h-10"
                />
              </div>

              {/* Palette Selection */}
              <select
                value={activePalette}
                onChange={(e) => setActivePalette(e.target.value as keyof typeof PALETTES)}
                className="w-full bg-gray-700 text-white rounded px-2 py-1 mb-2"
              >
                {Object.keys(PALETTES).map(p => (
                  <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                ))}
              </select>

              {/* Palette Colors */}
              <div className="grid grid-cols-4 gap-1">
                {PALETTES[activePalette].map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setColor(c)}
                    className={`w-full aspect-square rounded border-2 ${
                      color === c ? 'border-white' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Canvas Area */}
          <div className="lg:col-span-3">
            <DrawingCanvas
              width={800}
              height={600}
              brushSize={brushSize}
              color={color}
              tool={tool}
              onColorPick={setColor}
            />
          </div>
        </div>
      )}

      {/* PIXEL ART TAB */}
      {activeTab === 'pixel' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Toolbar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Grid Size */}
            <div className="bg-gray-800/60 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-300 mb-3">Grid Size</h3>
              <div className="grid grid-cols-3 gap-2">
                {[8, 16, 32].map(size => (
                  <button
                    key={size}
                    onClick={() => setPixelGridSize(size)}
                    className={`p-2 rounded-lg transition-all ${
                      pixelGridSize === size
                        ? 'bg-pink-600 text-white'
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    }`}
                  >
                    {size}x{size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div className="bg-gray-800/60 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-300 mb-3">Color</h3>
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-12 h-12 rounded-lg border-2 border-white"
                  style={{ backgroundColor: color }}
                />
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full h-10"
                />
              </div>
              <div className="grid grid-cols-4 gap-1">
                {PALETTES[activePalette].map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setColor(c)}
                    className={`w-full aspect-square rounded border-2 ${
                      color === c ? 'border-white' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Pixel Canvas */}
          <div className="lg:col-span-3 flex justify-center">
            <PixelArtCanvas
              gridSize={pixelGridSize}
              pixelSize={Math.floor(400 / pixelGridSize)}
              color={color}
            />
          </div>
        </div>
      )}

      {/* PRO TOOLS TAB - Embedded web-based tools */}
      {activeTab === 'embed' && (
        <div className="space-y-6">
          <div className="bg-gray-800/40 rounded-xl p-4">
            <p className="text-gray-300 mb-4">
              Access professional art tools directly in the app. Click to open in the embedded viewer:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'Photopea', url: 'https://www.photopea.com/', icon: '🖼️', desc: 'Photoshop clone' },
                { name: 'Excalidraw', url: 'https://excalidraw.com/', icon: '✏️', desc: 'Whiteboard' },
                { name: 'Pixilart', url: 'https://www.pixilart.com/draw', icon: '🎮', desc: 'Pixel art' },
                { name: 'Kleki', url: 'https://kleki.com/', icon: '🎨', desc: 'Paint tool' },
                { name: 'Aggie.io', url: 'https://aggie.io/', icon: '👥', desc: 'Collaborative' },
                { name: 'Sketchpad', url: 'https://sketch.io/sketchpad/', icon: '📝', desc: 'Vector draw' },
                { name: 'Sumopaint', url: 'https://sumo.app/', icon: '🎭', desc: 'Full editor' },
                { name: 'Vectr', url: 'https://vectr.com/new', icon: '📐', desc: 'Vector' }
              ].map(tool => (
                <button
                  key={tool.name}
                  onClick={() => {
                    const embed = document.getElementById('art-embed-frame') as HTMLIFrameElement;
                    if (embed) embed.src = tool.url;
                  }}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gray-800/60
                             border border-pink-500/20 hover:border-pink-400/50 transition-all"
                >
                  <span className="text-3xl">{tool.icon}</span>
                  <span className="text-sm font-medium text-pink-200">{tool.name}</span>
                  <span className="text-xs text-gray-500">{tool.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Embedded Frame */}
          <div className="bg-black rounded-xl overflow-hidden" style={{ height: '70vh' }}>
            <iframe
              id="art-embed-frame"
              src="https://www.photopea.com/"
              className="w-full h-full"
              title="Art Tool"
              allow="clipboard-read; clipboard-write"
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-700 flex flex-wrap justify-center gap-4 text-sm text-gray-500">
        <span>🎨 Art Studio</span>
        <span>•</span>
        <span>Built-in Drawing Canvas</span>
        <span>•</span>
        <span>Pixel Art Editor</span>
        <span>•</span>
        <span>Pro Tools Embed</span>
      </div>
    </div>
  );
};

export default EmbeddedArtStudio;
