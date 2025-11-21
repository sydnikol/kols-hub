import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Plus,
  Download,
  Copy,
  Trash2,
  Eye,
  Code,
  RefreshCw,
  FileCode,
  Layers,
  Grid,
  List,
  CreditCard,
  LayoutDashboard,
  FileText,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { UIGeneratorEngine, GeneratedComponent } from '../features/ui-generator/engine/GeneratorEngine';
import {
  ALL_TEMPLATES,
  CATEGORY_INFO,
  ComponentTemplate,
  ComponentProp,
} from '../features/ui-generator/templates/ComponentTemplates';

const UIGeneratorPage: React.FC = () => {
  const [engine] = useState(() => UIGeneratorEngine.getInstance());
  const [selectedTemplate, setSelectedTemplate] = useState<ComponentTemplate | null>(null);
  const [componentName, setComponentName] = useState('MyComponent');
  const [customProps, setCustomProps] = useState<Record<string, any>>({});
  const [generatedComponents, setGeneratedComponents] = useState<GeneratedComponent[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<GeneratedComponent | null>(null);
  const [viewMode, setViewMode] = useState<'code' | 'preview'>('code');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setGeneratedComponents(engine.getAllComponents());
    setStats(engine.getStats());
  };

  const handleTemplateSelect = (template: ComponentTemplate) => {
    setSelectedTemplate(template);
    setComponentName(template.name.replace(/\s+/g, ''));

    // Set default props
    const defaults: Record<string, any> = {};
    template.props.forEach(prop => {
      if (prop.default !== undefined) {
        defaults[prop.name] = prop.default;
      }
    });
    setCustomProps(defaults);
  };

  const handlePropChange = (propName: string, value: any) => {
    setCustomProps(prev => ({ ...prev, [propName]: value }));
  };

  const handleGenerate = () => {
    if (!selectedTemplate) {
      toast.error('Please select a template');
      return;
    }

    if (!componentName.trim()) {
      toast.error('Please enter a component name');
      return;
    }

    // Validate props
    const validation = engine.validateProps(selectedTemplate, customProps);
    if (!validation.valid) {
      toast.error(validation.errors[0]);
      return;
    }

    const component = engine.generateComponent(selectedTemplate, customProps, componentName);
    setSelectedComponent(component);
    loadData();
    toast.success('Component generated successfully!');
  };

  const handleCopy = async (id: string) => {
    try {
      const success = await engine.copyToClipboard(id);
      if (success) {
        toast.success('Code copied to clipboard!');
      } else {
        toast.error('Failed to copy code');
      }
    } catch (error) {
      console.error('Copy failed:', error);
      toast.error('Clipboard not supported on this device');
    }
  };

  const handleDelete = (id: string) => {
    engine.deleteComponent(id);
    if (selectedComponent?.id === id) {
      setSelectedComponent(null);
    }
    loadData();
    toast.success('Component deleted');
  };

  const handleExport = (id: string) => {
    try {
      const exported = engine.exportComponent(id);
      if (exported) {
        const blob = new Blob([exported.content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        if (typeof document !== 'undefined') {
          const a = document.createElement('a');
          a.href = url;
          a.download = exported.filename;
          a.click();
          URL.revokeObjectURL(url);
          toast.success('Component exported!');
        } else {
          // Mobile fallback: copy to clipboard
          if (navigator.clipboard) {
            navigator.clipboard.writeText(exported.content);
            toast.success('Code copied to clipboard!');
          } else {
            toast.error('Export not supported on this device');
          }
          URL.revokeObjectURL(url);
        }
      }
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export component');
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'form':
        return <FileText className="w-5 h-5" />;
      case 'dashboard':
        return <LayoutDashboard className="w-5 h-5" />;
      case 'tracker':
        return <Grid className="w-5 h-5" />;
      case 'card':
        return <CreditCard className="w-5 h-5" />;
      case 'list':
        return <List className="w-5 h-5" />;
      default:
        return <Layers className="w-5 h-5" />;
    }
  };

  const filteredTemplates = selectedCategory === 'all'
    ? ALL_TEMPLATES
    : ALL_TEMPLATES.filter(t => t.category === selectedCategory);

  const renderPropInput = (prop: ComponentProp) => {
    switch (prop.type) {
      case 'boolean':
        return (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={customProps[prop.name] || false}
              onChange={(e) => handlePropChange(prop.name, e.target.checked)}
              className="w-5 h-5 rounded bg-black/40 border border-purple-500/30 text-purple-600 focus:ring-purple-500"
            />
            <span className="text-purple-300">{prop.description || prop.name}</span>
          </label>
        );

      case 'array':
        return (
          <input
            type="text"
            value={Array.isArray(customProps[prop.name]) ? customProps[prop.name].join(', ') : ''}
            onChange={(e) => handlePropChange(prop.name, e.target.value.split(',').map(s => s.trim()))}
            className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white placeholder-purple-400/50 focus:outline-none focus:border-purple-500/60"
            placeholder="Item 1, Item 2, Item 3"
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={customProps[prop.name] || ''}
            onChange={(e) => handlePropChange(prop.name, Number(e.target.value))}
            className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white placeholder-purple-400/50 focus:outline-none focus:border-purple-500/60"
          />
        );

      case 'color':
        return (
          <select
            value={customProps[prop.name] || 'purple'}
            onChange={(e) => handlePropChange(prop.name, e.target.value)}
            className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500/60"
          >
            <option value="purple">Purple</option>
            <option value="blue">Blue</option>
            <option value="green">Green</option>
            <option value="red">Red</option>
            <option value="pink">Pink</option>
            <option value="indigo">Indigo</option>
          </select>
        );

      default:
        if (prop.options) {
          return (
            <select
              value={customProps[prop.name] || ''}
              onChange={(e) => handlePropChange(prop.name, e.target.value)}
              className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500/60"
            >
              {prop.options.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          );
        }
        return (
          <input
            type="text"
            value={customProps[prop.name] || ''}
            onChange={(e) => handlePropChange(prop.name, e.target.value)}
            className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white placeholder-purple-400/50 focus:outline-none focus:border-purple-500/60"
            placeholder={prop.description || `Enter ${prop.name}`}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-indigo-950 to-purple-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-8 h-8 text-purple-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              UI Component Generator
            </h1>
          </div>
          <p className="text-purple-400">
            Create beautiful React components with gothic/alt aesthetic - No coding required
          </p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 p-4 rounded-xl border border-purple-500/30">
              <div className="text-sm text-purple-400 mb-1">Total Components</div>
              <div className="text-2xl font-bold text-white">{stats.total}</div>
            </div>
            <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 p-4 rounded-xl border border-purple-500/30">
              <div className="text-sm text-purple-400 mb-1">Templates</div>
              <div className="text-2xl font-bold text-white">{ALL_TEMPLATES.length}</div>
            </div>
            <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 p-4 rounded-xl border border-purple-500/30">
              <div className="text-sm text-purple-400 mb-1">Categories</div>
              <div className="text-2xl font-bold text-white">{CATEGORY_INFO.length}</div>
            </div>
            <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 p-4 rounded-xl border border-purple-500/30">
              <div className="text-sm text-purple-400 mb-1">Last Generated</div>
              <div className="text-sm font-bold text-white">
                {stats.lastGenerated ? new Date(stats.lastGenerated).toLocaleDateString() : 'None'}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Template Selection & Props */}
          <div className="space-y-6">
            {/* Category Filter */}
            <div className="bg-purple-900/20 p-4 rounded-xl border border-purple-500/30">
              <h3 className="text-lg font-bold text-purple-300 mb-3">Template Categories</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
                    selectedCategory === 'all'
                      ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                      : 'bg-purple-900/20 text-purple-400 hover:bg-purple-500/20'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  All ({ALL_TEMPLATES.length})
                </button>
                {CATEGORY_INFO.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                        : 'bg-purple-900/20 text-purple-400 hover:bg-purple-500/20'
                    }`}
                  >
                    {getCategoryIcon(cat.id)}
                    {cat.label} ({cat.count})
                  </button>
                ))}
              </div>
            </div>

            {/* Template Selection */}
            <div className="bg-purple-900/20 p-4 rounded-xl border border-purple-500/30">
              <h3 className="text-lg font-bold text-purple-300 mb-3">Select Template</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateSelect(template)}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      selectedTemplate?.id === template.id
                        ? 'bg-purple-900/40 border-purple-500/50'
                        : 'bg-black/40 border-purple-500/20 hover:bg-purple-900/20'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {getCategoryIcon(template.category)}
                      <div className="flex-1">
                        <div className="font-bold text-white mb-1">{template.name}</div>
                        <div className="text-sm text-purple-400">{template.description}</div>
                        <div className="text-xs text-purple-500 mt-2">
                          {template.props.length} props • {template.category}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Component Props */}
            {selectedTemplate && (
              <div className="bg-purple-900/20 p-4 rounded-xl border border-purple-500/30">
                <h3 className="text-lg font-bold text-purple-300 mb-3">Customize Props</h3>

                {/* Component Name */}
                <div className="mb-4">
                  <label className="block text-purple-300 mb-2 text-sm font-semibold">
                    Component Name {' '}
                    <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={componentName}
                    onChange={(e) => setComponentName(e.target.value)}
                    className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white placeholder-purple-400/50 focus:outline-none focus:border-purple-500/60"
                    placeholder="MyComponent"
                  />
                </div>

                {/* Dynamic Props */}
                <div className="space-y-4">
                  {selectedTemplate.props.map((prop) => (
                    <div key={prop.name}>
                      <label className="block text-purple-300 mb-2 text-sm font-semibold">
                        {prop.name} {prop.required && <span className="text-red-400">*</span>}
                      </label>
                      {renderPropInput(prop)}
                      {prop.description && (
                        <p className="text-xs text-purple-400 mt-1">{prop.description}</p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Generate Button */}
                <button
                  onClick={handleGenerate}
                  className="w-full mt-6 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-[1.02] shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  Generate Component
                </button>
              </div>
            )}
          </div>

          {/* Right Column - Preview & Code */}
          <div className="space-y-6">
            {/* View Toggle */}
            {selectedComponent && (
              <>
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('code')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-bold transition-all ${
                      viewMode === 'code'
                        ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                        : 'bg-purple-900/20 text-purple-400 hover:bg-purple-500/20'
                    }`}
                  >
                    <Code className="w-5 h-5" />
                    Code View
                  </button>
                  <button
                    onClick={() => setViewMode('preview')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-bold transition-all ${
                      viewMode === 'preview'
                        ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                        : 'bg-purple-900/20 text-purple-400 hover:bg-purple-500/20'
                    }`}
                  >
                    <Eye className="w-5 h-5" />
                    Preview
                  </button>
                </div>

                {/* Code/Preview Area */}
                <div className="bg-purple-900/20 p-4 rounded-xl border border-purple-500/30">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-purple-300">{selectedComponent.name}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCopy(selectedComponent.id)}
                        className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-colors"
                        title="Copy to clipboard"
                      >
                        <Copy className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleExport(selectedComponent.id)}
                        className="p-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg transition-colors"
                        title="Download file"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {viewMode === 'code' ? (
                    <pre className="bg-black/60 p-4 rounded-lg overflow-x-auto text-sm text-purple-300 font-mono max-h-[600px] overflow-y-auto border border-purple-500/20">
                      <code>{selectedComponent.code}</code>
                    </pre>
                  ) : (
                    <div className="bg-black/60 p-4 rounded-lg border border-purple-500/20">
                      <p className="text-purple-300 text-center py-12">
                        Live preview coming soon! For now, copy the code and use it in your project.
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Generated Components List */}
            <div className="bg-purple-900/20 p-4 rounded-xl border border-purple-500/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-purple-300">
                  Generated Components ({generatedComponents.length})
                </h3>
                <button
                  onClick={loadData}
                  className="p-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {generatedComponents.length > 0 ? (
                  generatedComponents.map((component) => (
                    <div
                      key={component.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedComponent?.id === component.id
                          ? 'bg-purple-900/40 border-purple-500/50'
                          : 'bg-black/40 border-purple-500/20 hover:bg-purple-900/20'
                      }`}
                      onClick={() => setSelectedComponent(component)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-1">
                          <FileCode className="w-4 h-4 text-purple-400" />
                          <div>
                            <div className="font-bold text-white text-sm">{component.name}</div>
                            <div className="text-xs text-purple-400">
                              {component.template.name} • {new Date(component.timestamp).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(component.id);
                          }}
                          className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-purple-400 py-8">
                    No components generated yet. Select a template and generate your first component!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UIGeneratorPage;
