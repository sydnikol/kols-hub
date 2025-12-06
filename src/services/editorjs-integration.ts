/**
 * Editor.js Integration Service
 *
 * Block-styled editor for rich media content
 *
 * Features:
 * - Block-based content architecture
 * - Clean JSON data output
 * - Extensible plugin system
 * - Inline formatting tools
 * - Block tunes (block-level settings)
 * - Custom blocks via plugins
 * - API for block manipulation
 * - Drag and drop support
 * - Read-only mode
 * - Data validation
 * - i18n support
 * - Mobile-friendly
 *
 * Core Blocks:
 * - Paragraph, Header, List
 * - Image, Video, Embed
 * - Quote, Code, Table
 * - Delimiter, Warning, Checklist
 * - Link Tool, Marker, Bold, Italic
 *
 * Docs: https://editorjs.io/
 */

interface EditorConfig {
  holder: string; // Element ID to mount editor
  data?: EditorData;
  tools?: Record<string, EditorTool>;
  placeholder?: string;
  readOnly?: boolean;
  minHeight?: number;
  logLevel?: 'VERBOSE' | 'INFO' | 'WARN' | 'ERROR';
  i18n?: {
    messages?: Record<string, any>;
  };
  onReady?: () => void;
  onChange?: (api: EditorAPI, event: CustomEvent) => void;
  autofocus?: boolean;
  defaultBlock?: string;
}

interface EditorData {
  time?: number;
  blocks: EditorBlock[];
  version?: string;
}

interface EditorBlock {
  id?: string;
  type: string;
  data: Record<string, any>;
  tunes?: Record<string, any>;
}

interface EditorTool {
  class: any;
  config?: Record<string, any>;
  inlineToolbar?: boolean | string[];
  shortcut?: string;
  toolbox?: {
    title: string;
    icon?: string;
  };
}

interface EditorAPI {
  blocks: BlockAPI;
  caret: CaretAPI;
  events: EventsAPI;
  listeners: ListenersAPI;
  notifier: NotifierAPI;
  sanitizer: SanitizerAPI;
  saver: SaverAPI;
  selection: SelectionAPI;
  styles: StylesAPI;
  toolbar: ToolbarAPI;
  inlineToolbar: InlineToolbarAPI;
  tooltip: TooltipAPI;
  i18n: I18nAPI;
  readOnly: ReadOnlyAPI;
  ui: UIAPI;
}

interface BlockAPI {
  clear(): void;
  render(data: EditorData): Promise<void>;
  renderFromHTML(html: string): Promise<void>;
  delete(index?: number): void;
  swap(fromIndex: number, toIndex: number): void;
  move(toIndex: number, fromIndex?: number): void;
  getBlockByIndex(index: number): BlockInstance | undefined;
  getBlocksCount(): number;
  getCurrentBlockIndex(): number;
  insert(type: string, data?: any, config?: any, index?: number, needToFocus?: boolean): void;
  update(id: string, data: Record<string, any>): void;
}

interface BlockInstance {
  id: string;
  name: string;
  config: Record<string, any>;
  holder: HTMLElement;
  save(): Promise<Record<string, any>>;
  validate(data: Record<string, any>): boolean;
}

interface CaretAPI {
  setToFirstBlock(position?: 'start' | 'end', offset?: number): void;
  setToLastBlock(position?: 'start' | 'end', offset?: number): void;
  setToNextBlock(position?: 'start' | 'end', offset?: number): void;
  setToPreviousBlock(position?: 'start' | 'end', offset?: number): void;
  setToBlock(index: number, position?: 'start' | 'end', offset?: number): void;
  focus(atEnd?: boolean): void;
}

interface SaverAPI {
  save(): Promise<EditorData>;
}

interface NotifierAPI {
  show(options: {
    message: string;
    style?: 'success' | 'warning' | 'error';
    time?: number;
  }): void;
}

interface EventsAPI {
  emit(eventName: string, data?: any): void;
  on(eventName: string, callback: (data?: any) => void): void;
  off(eventName: string, callback: (data?: any) => void): void;
}

interface ListenersAPI {
  on(element: HTMLElement, eventType: string, handler: EventListener, useCapture?: boolean): void;
  off(element: HTMLElement, eventType: string, handler: EventListener, useCapture?: boolean): void;
}

interface SanitizerAPI {
  clean(taintString: string, config?: Record<string, any>): string;
}

interface SelectionAPI {
  findParentTag(tagName: string, className?: string): HTMLElement | null;
  expandToTag(node: HTMLElement): void;
}

interface StylesAPI {
  block: string;
  inlineToolButton: string;
  inlineToolButtonActive: string;
  input: string;
  loader: string;
  button: string;
  settingsButton: string;
  settingsButtonActive: string;
}

interface ToolbarAPI {
  close(): void;
  open(): void;
  toggleBlockSettings(openingState?: boolean): void;
}

interface InlineToolbarAPI {
  close(): void;
  open(): void;
}

interface TooltipAPI {
  show(element: HTMLElement, content: string, options?: { placement?: 'top' | 'bottom' | 'left' | 'right' }): void;
  hide(): void;
}

interface I18nAPI {
  t(key: string, params?: Record<string, string>): string;
}

interface ReadOnlyAPI {
  toggle(state?: boolean): Promise<boolean>;
}

interface UIAPI {
  nodes: {
    wrapper: HTMLElement;
    redactor: HTMLElement;
  };
}

// Built-in Block Types
interface ParagraphData {
  text: string;
}

interface HeaderData {
  text: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
}

interface ListData {
  style: 'ordered' | 'unordered';
  items: string[];
}

interface ImageData {
  file: {
    url: string;
  };
  caption: string;
  withBorder: boolean;
  stretched: boolean;
  withBackground: boolean;
}

interface QuoteData {
  text: string;
  caption: string;
  alignment: 'left' | 'center';
}

interface CodeData {
  code: string;
}

interface TableData {
  withHeadings: boolean;
  content: string[][];
}

interface ChecklistData {
  items: Array<{
    text: string;
    checked: boolean;
  }>;
}

interface EmbedData {
  service: string;
  source: string;
  embed: string;
  width: number;
  height: number;
  caption: string;
}

class EditorJSIntegrationService {
  private editors: Map<string, EditorAPI> = new Map();
  private tools: Map<string, EditorTool> = new Map();

  initialize(): boolean {
    try {
      this.registerDefaultTools();

      console.log('Editor.js integration initialized');
      console.log('Default tools registered:', this.tools.size);

      return true;
    } catch (error) {
      console.error('Error initializing Editor.js integration:', error);
      return false;
    }
  }

  isConfigured(): boolean {
    return true; // No configuration required
  }

  private registerDefaultTools(): void {
    // Mock tool registration
    const defaultTools = [
      'paragraph',
      'header',
      'list',
      'quote',
      'code',
      'delimiter',
      'table',
      'warning',
      'checklist',
      'linkTool',
      'embed',
      'image'
    ];

    for (const tool of defaultTools) {
      this.tools.set(tool, {
        class: {} as any,
        toolbox: { title: tool.charAt(0).toUpperCase() + tool.slice(1) }
      });
    }
  }

  // ==================== Editor Instances ====================

  createEditor(config: EditorConfig): EditorAPI {
    const api = this.createEditorAPI(config.holder);
    this.editors.set(config.holder, api);

    if (config.data) {
      api.blocks.render(config.data);
    }

    console.log('Editor created in:', config.holder);
    console.log('Read-only:', config.readOnly || false);
    console.log('Tools:', Object.keys(config.tools || {}).length);

    if (config.onReady) {
      config.onReady();
    }

    return api;
  }

  private createEditorAPI(holder: string): EditorAPI {
    const blocks: EditorBlock[] = [];

    const api: EditorAPI = {
      blocks: {
        clear: () => {
          blocks.length = 0;
          console.log('Blocks cleared');
        },
        render: async (data: EditorData) => {
          blocks.length = 0;
          blocks.push(...data.blocks);
          console.log('Rendered', data.blocks.length, 'blocks');
        },
        renderFromHTML: async (html: string) => {
          console.log('Rendered from HTML');
        },
        delete: (index?: number) => {
          if (index !== undefined) {
            blocks.splice(index, 1);
            console.log('Block deleted at index:', index);
          }
        },
        swap: (fromIndex: number, toIndex: number) => {
          const temp = blocks[fromIndex];
          blocks[fromIndex] = blocks[toIndex];
          blocks[toIndex] = temp;
          console.log('Blocks swapped:', fromIndex, '<->', toIndex);
        },
        move: (toIndex: number, fromIndex?: number) => {
          const from = fromIndex ?? blocks.length - 1;
          const [block] = blocks.splice(from, 1);
          blocks.splice(toIndex, 0, block);
          console.log('Block moved:', from, '->', toIndex);
        },
        getBlockByIndex: (index: number) => {
          return undefined; // Mock
        },
        getBlocksCount: () => blocks.length,
        getCurrentBlockIndex: () => blocks.length - 1,
        insert: (type: string, data?: any, config?: any, index?: number, needToFocus?: boolean) => {
          const block: EditorBlock = {
            id: `block_${Date.now()}`,
            type,
            data: data || {}
          };
          if (index !== undefined) {
            blocks.splice(index, 0, block);
          } else {
            blocks.push(block);
          }
          console.log('Block inserted:', type);
        },
        update: (id: string, data: Record<string, any>) => {
          const block = blocks.find(b => b.id === id);
          if (block) {
            block.data = { ...block.data, ...data };
            console.log('Block updated:', id);
          }
        }
      },
      caret: {
        setToFirstBlock: () => console.log('Caret set to first block'),
        setToLastBlock: () => console.log('Caret set to last block'),
        setToNextBlock: () => console.log('Caret set to next block'),
        setToPreviousBlock: () => console.log('Caret set to previous block'),
        setToBlock: (index: number) => console.log('Caret set to block:', index),
        focus: (atEnd?: boolean) => console.log('Editor focused', atEnd ? 'at end' : 'at start')
      },
      saver: {
        save: async () => {
          const data: EditorData = {
            time: Date.now(),
            blocks: blocks.map(b => ({ ...b })),
            version: '2.28.0'
          };
          console.log('Data saved:', data.blocks.length, 'blocks');
          return data;
        }
      },
      notifier: {
        show: (options) => {
          console.log(`[${options.style?.toUpperCase() || 'INFO'}]`, options.message);
        }
      },
      events: {
        emit: (eventName: string, data?: any) => {
          console.log('Event emitted:', eventName);
        },
        on: (eventName: string, callback: (data?: any) => void) => {
          console.log('Event listener added:', eventName);
        },
        off: (eventName: string, callback: (data?: any) => void) => {
          console.log('Event listener removed:', eventName);
        }
      },
      listeners: {
        on: (element: HTMLElement, eventType: string, handler: EventListener) => {
          console.log('DOM listener added:', eventType);
        },
        off: (element: HTMLElement, eventType: string, handler: EventListener) => {
          console.log('DOM listener removed:', eventType);
        }
      },
      sanitizer: {
        clean: (taintString: string, config?: Record<string, any>) => {
          return taintString; // Mock sanitization
        }
      },
      selection: {
        findParentTag: (tagName: string, className?: string) => {
          return null; // Mock
        },
        expandToTag: (node: HTMLElement) => {
          console.log('Selection expanded to tag');
        }
      },
      styles: {
        block: 'ce-block',
        inlineToolButton: 'ce-inline-tool',
        inlineToolButtonActive: 'ce-inline-tool--active',
        input: 'cdx-input',
        loader: 'cdx-loader',
        button: 'cdx-button',
        settingsButton: 'ce-settings__button',
        settingsButtonActive: 'ce-settings__button--active'
      },
      toolbar: {
        close: () => console.log('Toolbar closed'),
        open: () => console.log('Toolbar opened'),
        toggleBlockSettings: (openingState?: boolean) => {
          console.log('Block settings toggled:', openingState);
        }
      },
      inlineToolbar: {
        close: () => console.log('Inline toolbar closed'),
        open: () => console.log('Inline toolbar opened')
      },
      tooltip: {
        show: (element: HTMLElement, content: string, options?: any) => {
          console.log('Tooltip shown:', content);
        },
        hide: () => console.log('Tooltip hidden')
      },
      i18n: {
        t: (key: string, params?: Record<string, string>) => {
          return key; // Mock translation
        }
      },
      readOnly: {
        toggle: async (state?: boolean) => {
          console.log('Read-only mode:', state);
          return state || false;
        }
      },
      ui: {
        nodes: {
          wrapper: document.createElement('div'),
          redactor: document.createElement('div')
        }
      }
    };

    return api;
  }

  getEditor(holder: string): EditorAPI | null {
    return this.editors.get(holder) || null;
  }

  destroyEditor(holder: string): boolean {
    const deleted = this.editors.delete(holder);
    if (deleted) {
      console.log('Editor destroyed:', holder);
    }
    return deleted;
  }

  // ==================== Block Helpers ====================

  createParagraph(text: string): EditorBlock {
    return {
      type: 'paragraph',
      data: { text }
    };
  }

  createHeader(text: string, level: HeaderData['level'] = 2): EditorBlock {
    return {
      type: 'header',
      data: { text, level }
    };
  }

  createList(items: string[], ordered: boolean = false): EditorBlock {
    return {
      type: 'list',
      data: {
        style: ordered ? 'ordered' : 'unordered',
        items
      }
    };
  }

  createImage(url: string, caption: string = ''): EditorBlock {
    return {
      type: 'image',
      data: {
        file: { url },
        caption,
        withBorder: false,
        stretched: false,
        withBackground: false
      }
    };
  }

  createQuote(text: string, caption: string = ''): EditorBlock {
    return {
      type: 'quote',
      data: {
        text,
        caption,
        alignment: 'left'
      }
    };
  }

  createCode(code: string): EditorBlock {
    return {
      type: 'code',
      data: { code }
    };
  }

  createTable(content: string[][], withHeadings: boolean = false): EditorBlock {
    return {
      type: 'table',
      data: {
        withHeadings,
        content
      }
    };
  }

  createChecklist(items: Array<{ text: string; checked: boolean }>): EditorBlock {
    return {
      type: 'checklist',
      data: { items }
    };
  }

  createDelimiter(): EditorBlock {
    return {
      type: 'delimiter',
      data: {}
    };
  }

  // ==================== Data Conversion ====================

  async convertHTMLToBlocks(html: string): Promise<EditorBlock[]> {
    // Mock HTML to blocks conversion
    const blocks: EditorBlock[] = [
      this.createParagraph('Converted from HTML')
    ];

    console.log('HTML converted to', blocks.length, 'blocks');
    return blocks;
  }

  async convertBlocksToHTML(blocks: EditorBlock[]): Promise<string> {
    // Mock blocks to HTML conversion
    const html = blocks.map(block => {
      switch (block.type) {
        case 'paragraph':
          return `<p>${block.data.text}</p>`;
        case 'header':
          return `<h${block.data.level}>${block.data.text}</h${block.data.level}>`;
        case 'list':
          const tag = block.data.style === 'ordered' ? 'ol' : 'ul';
          const items = block.data.items.map((item: string) => `<li>${item}</li>`).join('');
          return `<${tag}>${items}</${tag}>`;
        default:
          return '';
      }
    }).join('\n');

    console.log('Blocks converted to HTML');
    return html;
  }

  // ==================== Validation ====================

  validateData(data: EditorData): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!data.blocks || !Array.isArray(data.blocks)) {
      errors.push('Data must contain blocks array');
    }

    for (let i = 0; i < (data.blocks?.length || 0); i++) {
      const block = data.blocks[i];

      if (!block.type) {
        errors.push(`Block at index ${i} missing type`);
      }

      if (!block.data) {
        errors.push(`Block at index ${i} missing data`);
      }
    }

    console.log('Data validation:', errors.length === 0 ? 'VALID' : 'INVALID');
    if (errors.length > 0) {
      console.log('Errors:', errors.length);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // ==================== Utilities ====================

  getVersion(): string {
    return '2.28.0'; // Mock Editor.js version
  }

  getAllTools(): string[] {
    return Array.from(this.tools.keys());
  }
}

export const editorjsIntegration = new EditorJSIntegrationService();
