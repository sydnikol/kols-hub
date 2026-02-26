import React, { useState, useEffect, useRef, useCallback } from 'react';

// Theme colors - Gothic Bratz Dollhouse
const COLORS = {
  primary: '#FF1493',
  secondary: '#9B30FF',
  background: '#0a0010',
  surface: 'rgba(255,20,147,0.08)',
  accent: '#E0A0FF',
  mint: '#00FFB3',
  text: '#F5E6FF',
  glass: 'rgba(155,48,255,0.15)',
  darkBg: '#150020',
  lightText: '#E8D5FF',
};

interface Snippet {
  id: string;
  name: string;
  language: string;
  code: string;
  timestamp: number;
}

interface SavedDocument {
  id: string;
  name: string;
  content: string;
  timestamp: number;
}

interface SavedPalette {
  id: string;
  name: string;
  colors: string[];
  timestamp: number;
}

const DollhouseSoftwareWorkshop: React.FC = () => {
  const [activeTab, setActiveTab] = useState('code-editor');
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [documents, setDocuments] = useState<SavedDocument[]>([]);
  const [palettes, setPalettes] = useState<SavedPalette[]>([]);

  // Code Editor State
  const [code, setCode] = useState('// Welcome to Code Editor\nconsole.log("Hello, Gothic Bratz!");');
  const [language, setLanguage] = useState('javascript');
  const [selectedSnippet, setSelectedSnippet] = useState<string | null>(null);
  const [snippetName, setSnippetName] = useState('');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Markdown State
  const [markdown, setMarkdown] = useState('# Welcome to Markdown Studio\n\nWrite your **markdown** here!');
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [docName, setDocName] = useState('');

  // JSON State
  const [jsonInput, setJsonInput] = useState('{\n  "name": "Bratz Dollhouse",\n  "theme": "Gothic"\n}');
  const [jsonError, setJsonError] = useState('');
  const [jsonFormat, setJsonFormat] = useState('json');
  const [jsonDiff1, setJsonDiff1] = useState('{}');
  const [jsonDiff2, setJsonDiff2] = useState('{}');

  // Regex State
  const [regex, setRegex] = useState('\\w+');
  const [regexFlags, setRegexFlags] = useState('g');
  const [testString, setTestString] = useState('Hello World 123');
  const [regexMatches, setRegexMatches] = useState<RegExpExecArray[]>([]);
  const [regexError, setRegexError] = useState('');

  // Color State
  const [selectedColor, setSelectedColor] = useState('#FF1493');
  const [colorFormat, setColorFormat] = useState('hex');
  const [paletteColors, setPaletteColors] = useState(['#FF1493', '#9B30FF', '#00FFB3']);
  const [selectedPalette, setSelectedPalette] = useState<string | null>(null);
  const [paletteName, setPaletteName] = useState('');
  const [paletteMode, setPaletteMode] = useState('complementary');

  // Unit State
  const [unitFrom, setUnitFrom] = useState('1');
  const [unitType, setUnitType] = useState('length');
  const [unitFromUnit, setUnitFromUnit] = useState('m');
  const [unitToUnit, setUnitToUnit] = useState('ft');

  // Load data from localStorage
  useEffect(() => {
    const savedSnippets = localStorage.getItem('codesnippets');
    if (savedSnippets) setSnippets(JSON.parse(savedSnippets));

    const savedDocs = localStorage.getItem('markdownocs');
    if (savedDocs) setDocuments(JSON.parse(savedDocs));

    const savedPals = localStorage.getItem('colorpalettes');
    if (savedPals) setPalettes(JSON.parse(savedPals));
  }, []);

  // ========== CODE EDITOR FUNCTIONS ==========
  const saveSnippet = useCallback(() => {
    if (!snippetName.trim()) return;
    const newSnippet: Snippet = {
      id: Date.now().toString(),
      name: snippetName,
      language,
      code,
      timestamp: Date.now(),
    };
    const updated = [...snippets, newSnippet];
    setSnippets(updated);
    localStorage.setItem('codesnippets', JSON.stringify(updated));
    setSnippetName('');
  }, [code, language, snippetName, snippets]);

  const loadSnippet = useCallback((id: string) => {
    const snippet = snippets.find(s => s.id === id);
    if (snippet) {
      setCode(snippet.code);
      setLanguage(snippet.language);
      setSelectedSnippet(id);
    }
  }, [snippets]);

  const deleteSnippet = useCallback((id: string) => {
    const updated = snippets.filter(s => s.id !== id);
    setSnippets(updated);
    localStorage.setItem('codesnippets', JSON.stringify(updated));
  }, [snippets]);

  const runCode = useCallback(() => {
    if (language === 'javascript' || language === 'html') {
      const iframe = iframeRef.current;
      if (!iframe) return;

      let htmlContent = '';
      if (language === 'javascript') {
        htmlContent = `
          <html>
          <head><style>body { background: ${COLORS.background}; color: ${COLORS.text}; font-family: monospace; padding: 20px; }</style></head>
          <body>
            <pre id="output"></pre>
            <script>
              const output = document.getElementById('output');
              const originalLog = console.log;
              console.log = function(...args) {
                output.textContent += args.join(' ') + '\\n';
              };
              ${code}
            </script>
          </body>
          </html>
        `;
      } else {
        htmlContent = code;
      }

      iframe.srcdoc = htmlContent;
    }
  }, [code, language]);

  const syntaxHighlight = (code: string, lang: string): string => {
    let highlighted = code;

    // Keywords
    const keywords = ['function', 'const', 'let', 'var', 'if', 'else', 'return', 'for', 'while', 'true', 'false'];
    keywords.forEach(kw => {
      const regex = new RegExp(`\\b${kw}\\b`, 'g');
      highlighted = highlighted.replace(regex, `<span style="color: ${COLORS.mint}">${kw}</span>`);
    });

    // Strings
    highlighted = highlighted.replace(/(['"`])(.*?)\1/g, `<span style="color: ${COLORS.accent}">$1$2$1</span>`);

    // Comments
    highlighted = highlighted.replace(/(\/\/.*)/g, `<span style="color: #888">\$1</span>`);

    return highlighted;
  };

  // ========== MARKDOWN FUNCTIONS ==========
  const saveDocument = useCallback(() => {
    if (!docName.trim()) return;
    const newDoc: SavedDocument = {
      id: Date.now().toString(),
      name: docName,
      content: markdown,
      timestamp: Date.now(),
    };
    const updated = [...documents, newDoc];
    setDocuments(updated);
    localStorage.setItem('markdownocs', JSON.stringify(updated));
    setDocName('');
  }, [markdown, docName, documents]);

  const loadDocument = useCallback((id: string) => {
    const doc = documents.find(d => d.id === id);
    if (doc) {
      setMarkdown(doc.content);
      setSelectedDoc(id);
    }
  }, [documents]);

  const deleteDocument = useCallback((id: string) => {
    const updated = documents.filter(d => d.id !== id);
    setDocuments(updated);
    localStorage.setItem('markdownocs', JSON.stringify(updated));
  }, [documents]);

  const renderMarkdown = (md: string): React.ReactNode => {
    const lines = md.split('\n');
    const elements: React.ReactNode[] = [];

    lines.forEach((line, i) => {
      if (line.startsWith('# ')) {
        elements.push(<h1 key={i} style={{ color: COLORS.primary, marginTop: '20px', fontSize: '32px' }}>{line.slice(2)}</h1>);
      } else if (line.startsWith('## ')) {
        elements.push(<h2 key={i} style={{ color: COLORS.secondary, marginTop: '16px', fontSize: '24px' }}>{line.slice(3)}</h2>);
      } else if (line.startsWith('### ')) {
        elements.push(<h3 key={i} style={{ color: COLORS.accent, marginTop: '12px', fontSize: '20px' }}>{line.slice(4)}</h3>);
      } else if (line.startsWith('- ')) {
        elements.push(<li key={i} style={{ marginLeft: '20px', color: COLORS.text }}>{line.slice(2)}</li>);
      } else if (line.startsWith('* ')) {
        elements.push(<li key={i} style={{ marginLeft: '20px', color: COLORS.text }}>{line.slice(2)}</li>);
      } else if (line.startsWith('```')) {
        return;
      } else if (line.trim()) {
        const processed = line
          .replace(/\*\*(.*?)\*\*/g, '<strong style="color: ' + COLORS.primary + '">$1</strong>')
          .replace(/\*(.*?)\*/g, '<em style="color: ' + COLORS.accent + '">$1</em>')
          .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" style="color: ' + COLORS.mint + '">$1</a>');
        elements.push(<p key={i} style={{ color: COLORS.text, lineHeight: '1.6' }} dangerouslySetInnerHTML={{ __html: processed }} />);
      }
    });

    return elements;
  };

  const exportMarkdownAsHTML = () => {
    const html = `
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { background: ${COLORS.background}; color: ${COLORS.text}; font-family: Arial, sans-serif; padding: 40px; }
          h1, h2, h3 { margin-top: 20px; }
          a { color: ${COLORS.mint}; }
        </style>
      </head>
      <body>
        ${markdown.replace(/^# (.*)/gm, '<h1>\$1</h1>')
          .replace(/^## (.*)/gm, '<h2>\$1</h2>')
          .replace(/^### (.*)/gm, '<h3>\$1</h3>')
          .replace(/\*\*(.*?)\*\*/g, '<strong>\$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>\$1</em>')
          .replace(/- (.*)/g, '<li>\$1</li>')
          .replace(/\n\n/g, '</p><p>')}
      </body>
      </html>
    `;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.html';
    a.click();
  };

  // ========== JSON FUNCTIONS ==========
  const validateJSON = (json: string) => {
    try {
      JSON.parse(json);
      setJsonError('');
      return true;
    } catch (e: any) {
      setJsonError(e.message);
      return false;
    }
  };

  const formatJSON = () => {
    if (validateJSON(jsonInput)) {
      const formatted = JSON.stringify(JSON.parse(jsonInput), null, 2);
      setJsonInput(formatted);
    }
  };

  const minifyJSON = () => {
    if (validateJSON(jsonInput)) {
      const minified = JSON.stringify(JSON.parse(jsonInput));
      setJsonInput(minified);
    }
  };

  const jsonToCSV = () => {
    try {
      const obj = JSON.parse(jsonInput);
      if (Array.isArray(obj) && obj.length > 0) {
        const keys = Object.keys(obj[0]);
        let csv = keys.join(',') + '\n';
        obj.forEach((item: any) => {
          csv += keys.map(k => item[k]).join(',') + '\n';
        });
        setJsonInput(csv);
      }
    } catch (e) {
      setJsonError('Invalid JSON for CSV conversion');
    }
  };

  // ========== REGEX FUNCTIONS ==========
  const testRegex = useCallback(() => {
    try {
      setRegexError('');
      const regexObj = new RegExp(regex, regexFlags);
      const matches: RegExpExecArray[] = [];
      let match;
      const tempRegex = new RegExp(regex, regexFlags + (regexFlags.includes('g') ? '' : 'g'));
      while ((match = tempRegex.exec(testString)) !== null) {
        matches.push(match);
      }
      setRegexMatches(matches);
    } catch (e: any) {
      setRegexError(e.message);
      setRegexMatches([]);
    }
  }, [regex, regexFlags, testString]);

  useEffect(() => {
    testRegex();
  }, [testRegex]);

  const commonPatterns: Record<string, string> = {
    email: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
    url: 'https?:\\/\\/[^\\s]+',
    phone: '^\\d{3}[-.]?\\d{3}[-.]?\\d{4}$',
    ipv4: '^\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}$',
    date: '^\\d{4}-\\d{2}-\\d{2}$',
  };

  // ========== COLOR FUNCTIONS ==========
  const hexToRgb = (hex: string): [number, number, number] | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
  };

  const rgbToHex = (r: number, g: number, b: number): string => {
    return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase();
  };

  const hslToHex = (h: number, s: number, l: number): string => {
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
  };

  const generateComplementary = (hex: string): string[] => {
    const rgb = hexToRgb(hex);
    if (!rgb) return [hex];
    const [r, g, b] = rgb;
    return [hex, rgbToHex(255 - r, 255 - g, 255 - b)];
  };

  const generateAnalogous = (hex: string): string[] => {
    const colors = [hex];
    for (let i = 0; i < 2; i++) {
      const rgb = hexToRgb(colors[0]);
      if (rgb) {
        const hsl = rgbToHsl(rgb[0], rgb[1], rgb[2]);
        colors.push(hslToHex((hsl[0] + 30) % 360, hsl[1], hsl[2]));
      }
    }
    return colors;
  };

  const rgbToHsl = (r: number, g: number, b: number): [number, number, number] => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
  };

  const generateTriadic = (hex: string): string[] => {
    const colors = [hex];
    const rgb = hexToRgb(hex);
    if (rgb) {
      const hsl = rgbToHsl(rgb[0], rgb[1], rgb[2]);
      colors.push(hslToHex((hsl[0] + 120) % 360, hsl[1], hsl[2]));
      colors.push(hslToHex((hsl[0] + 240) % 360, hsl[1], hsl[2]));
    }
    return colors;
  };

  const savePalette = useCallback(() => {
    if (!paletteName.trim()) return;
    const newPalette: SavedPalette = {
      id: Date.now().toString(),
      name: paletteName,
      colors: paletteColors,
      timestamp: Date.now(),
    };
    const updated = [...palettes, newPalette];
    setPalettes(updated);
    localStorage.setItem('colorpalettes', JSON.stringify(updated));
    setPaletteName('');
  }, [paletteColors, paletteName, palettes]);

  const loadPalette = useCallback((id: string) => {
    const palette = palettes.find(p => p.id === id);
    if (palette) {
      setPaletteColors(palette.colors);
      setSelectedPalette(id);
    }
  }, [palettes]);

  const deletePalette = useCallback((id: string) => {
    const updated = palettes.filter(p => p.id !== id);
    setPalettes(updated);
    localStorage.setItem('colorpalettes', JSON.stringify(updated));
  }, [palettes]);

  const generatePalette = () => {
    if (paletteMode === 'complementary') {
      setPaletteColors(generateComplementary(selectedColor));
    } else if (paletteMode === 'analogous') {
      setPaletteColors(generateAnalogous(selectedColor));
    } else if (paletteMode === 'triadic') {
      setPaletteColors(generateTriadic(selectedColor));
    }
  };

  // ========== UNIT CONVERTER FUNCTIONS ==========
  const convertUnits = (): string => {
    const value = parseFloat(unitFrom);
    if (isNaN(value)) return '0';

    const conversions: Record<string, Record<string, number>> = {
      length: {
        m: 1,
        km: 0.001,
        cm: 100,
        mm: 1000,
        mi: 0.000621371,
        yd: 1.09361,
        ft: 3.28084,
        in: 39.3701,
      },
      weight: {
        kg: 1,
        g: 1000,
        mg: 1000000,
        lb: 2.20462,
        oz: 35.274,
      },
      temperature: {
        c: 1,
        f: 0,
        k: 273.15,
      },
      time: {
        s: 1,
        ms: 1000,
        min: 1 / 60,
        h: 1 / 3600,
        d: 1 / 86400,
      },
      datasize: {
        b: 1,
        kb: 1 / 1024,
        mb: 1 / (1024 * 1024),
        gb: 1 / (1024 * 1024 * 1024),
      },
    };

    if (unitType === 'temperature') {
      if (unitFromUnit === 'c' && unitToUnit === 'f') return ((value * 9) / 5 + 32).toFixed(2);
      if (unitFromUnit === 'f' && unitToUnit === 'c') return (((value - 32) * 5) / 9).toFixed(2);
      if (unitFromUnit === 'c' && unitToUnit === 'k') return (value + 273.15).toFixed(2);
      if (unitFromUnit === 'k' && unitToUnit === 'c') return (value - 273.15).toFixed(2);
      return value.toFixed(2);
    }

    const fromRate = conversions[unitType]?.[unitFromUnit] || 1;
    const toRate = conversions[unitType]?.[unitToUnit] || 1;
    const result = (value / fromRate) * toRate;
    return result.toFixed(6);
  };

  // ========== OPEN SOURCE HUB ==========
  const openSourceRepos = [
    { name: 'React', stars: '220k', language: 'JavaScript', desc: 'A JavaScript library for building user interfaces' },
    { name: 'Vue.js', stars: '210k', language: 'JavaScript', desc: 'The Progressive JavaScript Framework' },
    { name: 'Angular', stars: '95k', language: 'TypeScript', desc: 'Platform for building mobile and desktop web applications' },
    { name: 'Svelte', stars: '80k', language: 'JavaScript', desc: 'Cybernetically enhanced web apps' },
    { name: 'Next.js', stars: '125k', language: 'JavaScript', desc: 'The React Framework for Production' },
    { name: 'TailwindCSS', stars: '82k', language: 'JavaScript', desc: 'Utility-first CSS framework' },
    { name: 'TypeScript', stars: '99k', language: 'TypeScript', desc: 'Typed superset of JavaScript' },
    { name: 'Vite', stars: '68k', language: 'JavaScript', desc: 'Next generation frontend tooling' },
  ];

  const licenses = [
    { name: 'MIT', description: 'Permissive, simple, widely used', commercial: 'Yes', modify: 'Yes', distribute: 'Yes' },
    { name: 'GPL-3.0', description: 'Copyleft, strong freedom guarantees', commercial: 'Yes', modify: 'Yes', distribute: 'Yes' },
    { name: 'Apache 2.0', description: 'Permissive with patent protection', commercial: 'Yes', modify: 'Yes', distribute: 'Yes' },
    { name: 'ISC', description: 'Equivalent to MIT', commercial: 'Yes', modify: 'Yes', distribute: 'Yes' },
    { name: 'BSD', description: 'Permissive, similar to MIT', commercial: 'Yes', modify: 'Yes', distribute: 'Yes' },
  ];

  // ========== RENDER FUNCTIONS ==========
  const containerStyle: React.CSSProperties = {
    background: COLORS.background,
    color: COLORS.text,
    minHeight: '100vh',
    padding: '20px',
    fontFamily: 'monospace',
  };

  const tabButtonStyle = (isActive: boolean): React.CSSProperties => ({
    padding: '12px 20px',
    border: 'none',
    background: isActive ? COLORS.primary : 'transparent',
    color: isActive ? COLORS.background : COLORS.text,
    cursor: 'pointer',
    borderRadius: '8px 8px 0 0',
    fontSize: '13px',
    fontWeight: isActive ? 'bold' : 'normal',
    transition: 'all 0.3s',
    borderBottom: isActive ? `2px solid ${COLORS.primary}` : `1px solid ${COLORS.secondary}`,
  });

  const panelStyle: React.CSSProperties = {
    background: COLORS.surface,
    borderRadius: '0 8px 8px 8px',
    border: `1px solid ${COLORS.secondary}`,
    padding: '20px',
    marginTop: '0',
    backdropFilter: 'blur(20px)',
  };

  const inputStyle: React.CSSProperties = {
    background: COLORS.darkBg,
    color: COLORS.text,
    border: `1px solid ${COLORS.secondary}`,
    padding: '10px',
    borderRadius: '4px',
    fontFamily: 'monospace',
    fontSize: '12px',
    width: '100%',
    boxSizing: 'border-box',
    marginBottom: '10px',
  };

  const buttonStyle: React.CSSProperties = {
    background: COLORS.primary,
    color: COLORS.background,
    border: 'none',
    padding: '10px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '12px',
    marginRight: '8px',
    transition: 'all 0.3s',
  };

  const secondaryButtonStyle: React.CSSProperties = {
    background: COLORS.secondary,
    color: COLORS.text,
    border: 'none',
    padding: '8px 14px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '11px',
    marginRight: '6px',
    marginBottom: '6px',
    transition: 'all 0.3s',
  };

  return (
    <div style={containerStyle}>
      {/* Title */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ color: COLORS.primary, fontSize: '28px', marginBottom: '8px' }}>
          Kol's Hub Software Workshop
        </h1>
        <p style={{ color: COLORS.accent, fontSize: '12px' }}>Open-source tools for developers • All offline</p>
      </div>

      {/* Tabs */}
      <div style={{ marginBottom: '20px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
        {[
          { id: 'code-editor', label: 'Code Editor' },
          { id: 'markdown', label: 'Markdown Studio' },
          { id: 'json', label: 'JSON Tools' },
          { id: 'regex', label: 'Regex Lab' },
          { id: 'color', label: 'Color Studio' },
          { id: 'unit', label: 'Unit Converter' },
          { id: 'opensource', label: 'Open Source Hub' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={tabButtonStyle(activeTab === tab.id)}
            onMouseEnter={(e) => {
              if (activeTab !== tab.id) {
                (e.target as HTMLElement).style.opacity = '0.7';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== tab.id) {
                (e.target as HTMLElement).style.opacity = '1';
              }
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* CODE EDITOR */}
      {activeTab === 'code-editor' && (
        <div style={panelStyle}>
          <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ color: COLORS.accent, fontSize: '11px', fontWeight: 'bold' }}>Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                style={{ ...inputStyle, marginTop: '4px' }}
              >
                {['javascript', 'typescript', 'python', 'html', 'css', 'json', 'markdown'].map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ color: COLORS.accent, fontSize: '11px', fontWeight: 'bold' }}>Snippet Name</label>
              <input
                type="text"
                value={snippetName}
                onChange={(e) => setSnippetName(e.target.value)}
                placeholder="My awesome code"
                style={{ ...inputStyle, marginTop: '4px' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <button onClick={saveSnippet} style={buttonStyle}>Save Snippet</button>
            <button onClick={runCode} style={buttonStyle}>Run Code</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            {/* Editor */}
            <div>
              <label style={{ color: COLORS.accent, fontSize: '11px', fontWeight: 'bold' }}>Code Editor</label>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                style={{
                  ...inputStyle,
                  height: '300px',
                  marginTop: '4px',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  lineHeight: '1.5',
                }}
              />
            </div>

            {/* Output */}
            <div>
              <label style={{ color: COLORS.accent, fontSize: '11px', fontWeight: 'bold' }}>Output / Preview</label>
              <iframe
                ref={iframeRef}
                style={{
                  width: '100%',
                  height: '300px',
                  marginTop: '4px',
                  background: COLORS.darkBg,
                  border: `1px solid ${COLORS.secondary}`,
                  borderRadius: '4px',
                }}
              />
            </div>
          </div>

          {/* Saved Snippets */}
          <div>
            <label style={{ color: COLORS.accent, fontSize: '11px', fontWeight: 'bold' }}>Saved Snippets ({snippets.length})</label>
            <div style={{ marginTop: '10px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
              {snippets.map(snippet => (
                <div
                  key={snippet.id}
                  style={{
                    background: COLORS.darkBg,
                    padding: '12px',
                    borderRadius: '4px',
                    border: `1px solid ${COLORS.secondary}`,
                  }}
                >
                  <div style={{ marginBottom: '8px' }}>
                    <strong style={{ color: COLORS.primary }}>{snippet.name}</strong>
                    <span style={{ color: COLORS.accent, fontSize: '10px', marginLeft: '8px' }}>{snippet.language}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={() => loadSnippet(snippet.id)} style={secondaryButtonStyle}>Load</button>
                    <button
                      onClick={() => deleteSnippet(snippet.id)}
                      style={{ ...secondaryButtonStyle, background: '#FF6B6B' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MARKDOWN STUDIO */}
      {activeTab === 'markdown' && (
        <div style={panelStyle}>
          <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
            <input
              type="text"
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              placeholder="Document name"
              style={{ ...inputStyle, flex: 1 }}
            />
            <button onClick={saveDocument} style={buttonStyle}>Save Document</button>
            <button onClick={exportMarkdownAsHTML} style={buttonStyle}>Export HTML</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* Editor */}
            <div>
              <label style={{ color: COLORS.accent, fontSize: '11px', fontWeight: 'bold' }}>Markdown Editor</label>
              <textarea
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                style={{
                  ...inputStyle,
                  height: '400px',
                  marginTop: '4px',
                }}
              />
              <div style={{ marginTop: '10px', color: COLORS.lightText, fontSize: '11px' }}>
                Words: {markdown.split(/\s+/).length} | Reading time: {Math.ceil(markdown.split(/\s+/).length / 200)} min
              </div>
            </div>

            {/* Preview */}
            <div>
              <label style={{ color: COLORS.accent, fontSize: '11px', fontWeight: 'bold' }}>Live Preview</label>
              <div
                style={{
                  ...inputStyle,
                  height: '400px',
                  marginTop: '4px',
                  overflowY: 'auto',
                  background: COLORS.darkBg,
                }}
              >
                {renderMarkdown(markdown)}
              </div>
            </div>
          </div>

          {/* Saved Documents */}
          <div style={{ marginTop: '20px' }}>
            <label style={{ color: COLORS.accent, fontSize: '11px', fontWeight: 'bold' }}>Saved Documents ({documents.length})</label>
            <div style={{ marginTop: '10px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
              {documents.map(doc => (
                <div
                  key={doc.id}
                  style={{
                    background: COLORS.darkBg,
                    padding: '12px',
                    borderRadius: '4px',
                    border: `1px solid ${COLORS.secondary}`,
                  }}
                >
                  <strong style={{ color: COLORS.primary }}>{doc.name}</strong>
                  <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                    <button onClick={() => loadDocument(doc.id)} style={secondaryButtonStyle}>Load</button>
                    <button
                      onClick={() => deleteDocument(doc.id)}
                      style={{ ...secondaryButtonStyle, background: '#FF6B6B' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* JSON TOOLS */}
      {activeTab === 'json' && (
        <div style={panelStyle}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' }}>
            <button onClick={formatJSON} style={buttonStyle}>Format</button>
            <button onClick={minifyJSON} style={buttonStyle}>Minify</button>
            <button onClick={jsonToCSV} style={buttonStyle}>JSON to CSV</button>
          </div>

          {jsonError && (
            <div style={{ background: '#FF6B6B', color: COLORS.background, padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>
              Error: {jsonError}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ color: COLORS.accent, fontSize: '11px', fontWeight: 'bold' }}>JSON Input</label>
              <textarea
                value={jsonInput}
                onChange={(e) => {
                  setJsonInput(e.target.value);
                  validateJSON(e.target.value);
                }}
                style={{
                  ...inputStyle,
                  height: '300px',
                  marginTop: '4px',
                  fontFamily: 'monospace',
                }}
              />
            </div>

            <div>
              <label style={{ color: COLORS.accent, fontSize: '11px', fontWeight: 'bold' }}>JSON Preview</label>
              <div
                style={{
                  ...inputStyle,
                  height: '300px',
                  marginTop: '4px',
                  overflowY: 'auto',
                  background: COLORS.darkBg,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {jsonError ? (
                  <span style={{ color: '#FF6B6B' }}>Invalid JSON</span>
                ) : (
                  <span style={{ color: COLORS.mint }}>
                    {(() => {
                      try {
                        return JSON.stringify(JSON.parse(jsonInput), null, 2);
                      } catch {
                        return jsonInput;
                      }
                    })()}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* JSON Diff */}
          <div style={{ marginTop: '20px' }}>
            <label style={{ color: COLORS.accent, fontSize: '11px', fontWeight: 'bold' }}>JSON Diff Tool</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '10px' }}>
              <textarea
                value={jsonDiff1}
                onChange={(e) => setJsonDiff1(e.target.value)}
                placeholder="JSON 1"
                style={{ ...inputStyle, height: '200px' }}
              />
              <textarea
                value={jsonDiff2}
                onChange={(e) => setJsonDiff2(e.target.value)}
                placeholder="JSON 2"
                style={{ ...inputStyle, height: '200px' }}
              />
            </div>
            <div style={{ marginTop: '10px' }}>
              <strong style={{ color: COLORS.primary }}>Differences:</strong>
              <div style={{ background: COLORS.darkBg, padding: '10px', borderRadius: '4px', marginTop: '8px', fontSize: '12px' }}>
                {jsonDiff1 === jsonDiff2 ? (
                  <span style={{ color: COLORS.mint }}>✓ JSONs are identical</span>
                ) : (
                  <span style={{ color: COLORS.accent }}>✗ JSONs differ</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REGEX LAB */}
      {activeTab === 'regex' && (
        <div style={panelStyle}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ color: COLORS.accent, fontSize: '11px', fontWeight: 'bold' }}>Regular Expression</label>
              <input
                type="text"
                value={regex}
                onChange={(e) => setRegex(e.target.value)}
                placeholder="Your regex pattern"
                style={{ ...inputStyle, marginTop: '4px' }}
              />
            </div>
            <div>
              <label style={{ color: COLORS.accent, fontSize: '11px', fontWeight: 'bold' }}>Flags</label>
              <input
                type="text"
                value={regexFlags}
                onChange={(e) => setRegexFlags(e.target.value)}
                placeholder="g, i, m, s..."
                style={{ ...inputStyle, marginTop: '4px' }}
              />
            </div>
          </div>

          <div>
            <label style={{ color: COLORS.accent, fontSize: '11px', fontWeight: 'bold' }}>Test String</label>
            <textarea
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              style={{
                ...inputStyle,
                height: '100px',
                marginTop: '4px',
              }}
            />
          </div>

          {regexError && (
            <div style={{ background: '#FF6B6B', color: COLORS.background, padding: '10px', borderRadius: '4px', marginTop: '15px' }}>
              Error: {regexError}
            </div>
          )}

          <div style={{ marginTop: '15px' }}>
            <strong style={{ color: COLORS.primary }}>Matches: {regexMatches.length}</strong>
            {regexMatches.length > 0 && (
              <div style={{ marginTop: '10px' }}>
                {regexMatches.map((match, i) => (
                  <div
                    key={i}
                    style={{
                      background: COLORS.darkBg,
                      padding: '8px',
                      borderRadius: '4px',
                      marginBottom: '6px',
                      fontSize: '12px',
                      border: `1px solid ${COLORS.secondary}`,
                    }}
                  >
                    <div style={{ color: COLORS.mint }}>Match {i + 1}: "{match[0]}"</div>
                    {match.length > 1 && (
                      <div style={{ color: COLORS.accent, fontSize: '11px', marginTop: '4px' }}>
                        Groups: {match.slice(1).map((g, gi) => `$${gi + 1}="${g}"`).join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Common Patterns */}
          <div style={{ marginTop: '20px' }}>
            <label style={{ color: COLORS.accent, fontSize: '11px', fontWeight: 'bold' }}>Common Patterns</label>
            <div style={{ marginTop: '10px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px' }}>
              {Object.entries(commonPatterns).map(([name, pattern]) => (
                <button
                  key={name}
                  onClick={() => setRegex(pattern)}
                  style={{
                    ...secondaryButtonStyle,
                    background: COLORS.secondary,
                    padding: '10px',
                    textAlign: 'left',
                  }}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* COLOR STUDIO */}
      {activeTab === 'color' && (
        <div style={panelStyle}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ color: COLORS.accent, fontSize: '11px', fontWeight: 'bold' }}>Color Picker</label>
              <input
                type="color"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                style={{ width: '100%', height: '60px', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '4px' }}
              />
              <input
                type="text"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                style={{ ...inputStyle, marginTop: '4px' }}
              />
            </div>

            <div>
              <label style={{ color: COLORS.accent, fontSize: '11px', fontWeight: 'bold' }}>Palette Mode</label>
              <select value={paletteMode} onChange={(e) => setPaletteMode(e.target.value)} style={{ ...inputStyle, marginTop: '4px' }}>
                <option value="complementary">Complementary</option>
                <option value="analogous">Analogous</option>
                <option value="triadic">Triadic</option>
              </select>
              <button onClick={generatePalette} style={{ ...buttonStyle, width: '100%', marginTop: '4px' }}>Generate Palette</button>
            </div>

            <div>
              <label style={{ color: COLORS.accent, fontSize: '11px', fontWeight: 'bold' }}>Save Palette</label>
              <input
                type="text"
                value={paletteName}
                onChange={(e) => setPaletteName(e.target.value)}
                placeholder="Palette name"
                style={{ ...inputStyle, marginTop: '4px' }}
              />
              <button onClick={savePalette} style={{ ...buttonStyle, width: '100%', marginTop: '4px' }}>Save</button>
            </div>
          </div>

          {/* Palette Preview */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: COLORS.accent, fontSize: '11px', fontWeight: 'bold' }}>Current Palette</label>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${paletteColors.length}, 1fr)`, gap: '10px', marginTop: '10px' }}>
              {paletteColors.map((color, i) => (
                <div
                  key={i}
                  style={{
                    background: color,
                    height: '80px',
                    borderRadius: '4px',
                    border: `2px solid ${COLORS.secondary}`,
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    padding: '8px',
                  }}
                >
                  <span
                    style={{
                      color: COLORS.text,
                      background: COLORS.background,
                      padding: '4px 8px',
                      borderRadius: '2px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                    }}
                  >
                    {color}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Saved Palettes */}
          <div>
            <label style={{ color: COLORS.accent, fontSize: '11px', fontWeight: 'bold' }}>Saved Palettes ({palettes.length})</label>
            <div style={{ marginTop: '10px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
              {palettes.map(palette => (
                <div
                  key={palette.id}
                  style={{
                    background: COLORS.darkBg,
                    padding: '12px',
                    borderRadius: '4px',
                    border: `1px solid ${COLORS.secondary}`,
                  }}
                >
                  <strong style={{ color: COLORS.primary }}>{palette.name}</strong>
                  <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
                    {palette.colors.map((color, i) => (
                      <div
                        key={i}
                        style={{
                          width: '30px',
                          height: '30px',
                          background: color,
                          borderRadius: '2px',
                          border: `1px solid ${COLORS.secondary}`,
                        }}
                      />
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                    <button onClick={() => loadPalette(palette.id)} style={secondaryButtonStyle}>Load</button>
                    <button
                      onClick={() => deletePalette(palette.id)}
                      style={{ ...secondaryButtonStyle, background: '#FF6B6B' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* UNIT CONVERTER */}
      {activeTab === 'unit' && (
        <div style={panelStyle}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '15px', marginBottom: '20px' }}>
            <div>
              <label style={{ color: COLORS.accent, fontSize: '11px', fontWeight: 'bold' }}>Conversion Type</label>
              <select value={unitType} onChange={(e) => setUnitType(e.target.value)} style={{ ...inputStyle, marginTop: '4px' }}>
                <option value="length">Length</option>
                <option value="weight">Weight</option>
                <option value="temperature">Temperature</option>
                <option value="time">Time</option>
                <option value="datasize">Data Size</option>
              </select>
            </div>

            <div>
              <label style={{ color: COLORS.accent, fontSize: '11px', fontWeight: 'bold' }}>Value</label>
              <input
                type="number"
                value={unitFrom}
                onChange={(e) => setUnitFrom(e.target.value)}
                style={{ ...inputStyle, marginTop: '4px' }}
              />
            </div>

            <div>
              <label style={{ color: COLORS.accent, fontSize: '11px', fontWeight: 'bold' }}>From</label>
              <select value={unitFromUnit} onChange={(e) => setUnitFromUnit(e.target.value)} style={{ ...inputStyle, marginTop: '4px' }}>
                {unitType === 'length' && ['m', 'km', 'cm', 'mm', 'mi', 'yd', 'ft', 'in'].map(u => <option key={u} value={u}>{u}</option>)}
                {unitType === 'weight' && ['kg', 'g', 'mg', 'lb', 'oz'].map(u => <option key={u} value={u}>{u}</option>)}
                {unitType === 'temperature' && ['c', 'f', 'k'].map(u => <option key={u} value={u}>{u}</option>)}
                {unitType === 'time' && ['s', 'ms', 'min', 'h', 'd'].map(u => <option key={u} value={u}>{u}</option>)}
                {unitType === 'datasize' && ['b', 'kb', 'mb', 'gb'].map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>

            <div>
              <label style={{ color: COLORS.accent, fontSize: '11px', fontWeight: 'bold' }}>To</label>
              <select value={unitToUnit} onChange={(e) => setUnitToUnit(e.target.value)} style={{ ...inputStyle, marginTop: '4px' }}>
                {unitType === 'length' && ['m', 'km', 'cm', 'mm', 'mi', 'yd', 'ft', 'in'].map(u => <option key={u} value={u}>{u}</option>)}
                {unitType === 'weight' && ['kg', 'g', 'mg', 'lb', 'oz'].map(u => <option key={u} value={u}>{u}</option>)}
                {unitType === 'temperature' && ['c', 'f', 'k'].map(u => <option key={u} value={u}>{u}</option>)}
                {unitType === 'time' && ['s', 'ms', 'min', 'h', 'd'].map(u => <option key={u} value={u}>{u}</option>)}
                {unitType === 'datasize' && ['b', 'kb', 'mb', 'gb'].map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>

          <div style={{ background: COLORS.darkBg, padding: '20px', borderRadius: '4px', border: `2px solid ${COLORS.primary}` }}>
            <div style={{ color: COLORS.accent, fontSize: '12px', marginBottom: '8px' }}>Result</div>
            <div style={{ color: COLORS.primary, fontSize: '28px', fontWeight: 'bold' }}>
              {convertUnits()} {unitToUnit}
            </div>
          </div>
        </div>
      )}

      {/* OPEN SOURCE HUB */}
      {activeTab === 'opensource' && (
        <div style={panelStyle}>
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ color: COLORS.primary, marginBottom: '15px' }}>Trending Open Source Projects</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '15px' }}>
              {openSourceRepos.map((repo, i) => (
                <div
                  key={i}
                  style={{
                    background: COLORS.darkBg,
                    padding: '15px',
                    borderRadius: '4px',
                    border: `1px solid ${COLORS.secondary}`,
                  }}
                >
                  <strong style={{ color: COLORS.primary, fontSize: '14px' }}>{repo.name}</strong>
                  <div style={{ color: COLORS.lightText, fontSize: '12px', marginTop: '8px', lineHeight: '1.5' }}>
                    {repo.desc}
                  </div>
                  <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                    <span style={{ color: COLORS.accent }}>⭐ {repo.stars}</span>
                    <span style={{ color: COLORS.mint }}>{repo.language}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 style={{ color: COLORS.primary, marginBottom: '15px' }}>Open Source Licenses</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr style={{ borderBottom: `2px solid ${COLORS.secondary}` }}>
                    <th style={{ textAlign: 'left', padding: '10px', color: COLORS.accent }}>License</th>
                    <th style={{ textAlign: 'left', padding: '10px', color: COLORS.accent }}>Description</th>
                    <th style={{ textAlign: 'center', padding: '10px', color: COLORS.accent }}>Commercial</th>
                    <th style={{ textAlign: 'center', padding: '10px', color: COLORS.accent }}>Modify</th>
                    <th style={{ textAlign: 'center', padding: '10px', color: COLORS.accent }}>Distribute</th>
                  </tr>
                </thead>
                <tbody>
                  {licenses.map((lic, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${COLORS.secondary}` }}>
                      <td style={{ padding: '10px', color: COLORS.primary, fontWeight: 'bold' }}>{lic.name}</td>
                      <td style={{ padding: '10px', color: COLORS.text }}>{lic.description}</td>
                      <td style={{ padding: '10px', textAlign: 'center', color: COLORS.mint }}>✓</td>
                      <td style={{ padding: '10px', textAlign: 'center', color: COLORS.mint }}>✓</td>
                      <td style={{ padding: '10px', textAlign: 'center', color: COLORS.mint }}>✓</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DollhouseSoftwareWorkshop;
