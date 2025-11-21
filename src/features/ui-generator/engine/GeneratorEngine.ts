/**
 * UI GENERATOR ENGINE
 * Handles component generation, preview, and export
 */

import { ComponentTemplate } from '../templates/ComponentTemplates';

export interface GeneratedComponent {
  id: string;
  name: string;
  template: ComponentTemplate;
  props: Record<string, any>;
  code: string;
  timestamp: number;
}

export class UIGeneratorEngine {
  private static instance: UIGeneratorEngine;
  private components: Map<string, GeneratedComponent> = new Map();

  private constructor() {
    this.loadFromStorage();
  }

  static getInstance(): UIGeneratorEngine {
    if (!UIGeneratorEngine.instance) {
      UIGeneratorEngine.instance = new UIGeneratorEngine();
    }
    return UIGeneratorEngine.instance;
  }

  /**
   * Generate component from template with custom props
   */
  generateComponent(
    template: ComponentTemplate,
    customProps: Record<string, any>,
    componentName: string
  ): GeneratedComponent {
    const id = `gen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Merge default props with custom props
    const props = { ...this.getDefaultProps(template), ...customProps, componentName };

    // Generate code
    const code = template.code(props);

    const component: GeneratedComponent = {
      id,
      name: componentName,
      template,
      props,
      code,
      timestamp: Date.now(),
    };

    this.components.set(id, component);
    this.saveToStorage();

    return component;
  }

  /**
   * Get default props from template
   */
  private getDefaultProps(template: ComponentTemplate): Record<string, any> {
    const defaults: Record<string, any> = {};
    template.props.forEach(prop => {
      if (prop.default !== undefined) {
        defaults[prop.name] = prop.default;
      }
    });
    return defaults;
  }

  /**
   * Update component props and regenerate code
   */
  updateComponent(id: string, newProps: Record<string, any>): GeneratedComponent | null {
    const component = this.components.get(id);
    if (!component) return null;

    const updatedProps = { ...component.props, ...newProps };
    const updatedCode = component.template.code(updatedProps);

    const updated: GeneratedComponent = {
      ...component,
      props: updatedProps,
      code: updatedCode,
      timestamp: Date.now(),
    };

    this.components.set(id, updated);
    this.saveToStorage();

    return updated;
  }

  /**
   * Delete component
   */
  deleteComponent(id: string): boolean {
    const deleted = this.components.delete(id);
    if (deleted) {
      this.saveToStorage();
    }
    return deleted;
  }

  /**
   * Get all generated components
   */
  getAllComponents(): GeneratedComponent[] {
    return Array.from(this.components.values()).sort((a, b) => b.timestamp - a.timestamp);
  }

  /**
   * Get component by ID
   */
  getComponent(id: string): GeneratedComponent | undefined {
    return this.components.get(id);
  }

  /**
   * Export component as file
   */
  exportComponent(id: string): { filename: string; content: string } | null {
    const component = this.components.get(id);
    if (!component) return null;

    const filename = `${component.name.replace(/\s+/g, '')}.tsx`;
    return { filename, content: component.code };
  }

  /**
   * Export all components as zip
   */
  exportAllComponents(): { filename: string; components: Array<{ name: string; code: string }> } {
    const components = this.getAllComponents().map(c => ({
      name: `${c.name.replace(/\s+/g, '')}.tsx`,
      code: c.code,
    }));

    return {
      filename: `generated-components-${Date.now()}.zip`,
      components,
    };
  }

  /**
   * Copy component code to clipboard
   */
  async copyToClipboard(id: string): Promise<boolean> {
    const component = this.components.get(id);
    if (!component) return false;

    try {
      await navigator.clipboard.writeText(component.code);
      return true;
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      return false;
    }
  }

  /**
   * Validate props against template schema
   */
  validateProps(template: ComponentTemplate, props: Record<string, any>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    template.props.forEach(prop => {
      if (prop.required && (props[prop.name] === undefined || props[prop.name] === '')) {
        errors.push(`${prop.name} is required`);
      }

      if (props[prop.name] !== undefined) {
        const value = props[prop.name];
        switch (prop.type) {
          case 'number':
            if (typeof value !== 'number' && isNaN(Number(value))) {
              errors.push(`${prop.name} must be a number`);
            }
            break;
          case 'boolean':
            if (typeof value !== 'boolean') {
              errors.push(`${prop.name} must be a boolean`);
            }
            break;
          case 'array':
            if (!Array.isArray(value)) {
              errors.push(`${prop.name} must be an array`);
            }
            break;
        }

        if (prop.options && !prop.options.includes(value)) {
          errors.push(`${prop.name} must be one of: ${prop.options.join(', ')}`);
        }
      }
    });

    return { valid: errors.length === 0, errors };
  }

  /**
   * Get component stats
   */
  getStats() {
    const components = this.getAllComponents();
    const byCategory: Record<string, number> = {};

    components.forEach(c => {
      const cat = c.template.category;
      byCategory[cat] = (byCategory[cat] || 0) + 1;
    });

    return {
      total: components.length,
      byCategory,
      lastGenerated: components[0]?.timestamp || null,
    };
  }

  /**
   * Save to localStorage
   */
  private saveToStorage(): void {
    try {
      const data = Array.from(this.components.entries());
      localStorage.setItem('ui-generator-components', JSON.stringify(data));
    } catch (err) {
      console.error('Failed to save to storage:', err);
    }
  }

  /**
   * Load from localStorage
   */
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('ui-generator-components');
      if (stored) {
        const data = JSON.parse(stored);
        this.components = new Map(data);
      }
    } catch (err) {
      console.error('Failed to load from storage:', err);
    }
  }

  /**
   * Clear all components
   */
  clearAll(): void {
    this.components.clear();
    this.saveToStorage();
  }
}
