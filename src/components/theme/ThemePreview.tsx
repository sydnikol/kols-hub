/**
 * Theme Preview Component
 * Real-time preview of theme with sample UI components
 */

import React from 'react';
import { Theme } from '../../services/themeGeneratorService';
import {
  Heart, Star, Check, AlertCircle, Info, Settings,
  User, Mail, Lock, Search, Bell, Calendar
} from 'lucide-react';

interface ThemePreviewProps {
  theme: Theme;
  showDetails?: boolean;
}

export const ThemePreview: React.FC<ThemePreviewProps> = ({ theme, showDetails = true }) => {
  return (
    <div className="space-y-6">
      {/* Color Palette Display */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white">Color Palette</h3>
        <div className="grid grid-cols-4 gap-2">
          <ColorSwatch label="Primary" color={theme.colors.primary} />
          <ColorSwatch label="Secondary" color={theme.colors.secondary} />
          <ColorSwatch label="Accent" color={theme.colors.accent} />
          <ColorSwatch label="Background" color={theme.colors.background} />
          <ColorSwatch label="Surface" color={theme.colors.surface} />
          <ColorSwatch label="Text" color={theme.colors.text} />
          <ColorSwatch label="Success" color={theme.colors.success} />
          <ColorSwatch label="Error" color={theme.colors.error} />
        </div>
      </div>

      {/* Typography Showcase */}
      {showDetails && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white">Typography</h3>
          <div
            className="p-6 rounded-lg"
            style={{
              backgroundColor: theme.colors.surface,
              color: theme.colors.text,
              fontFamily: theme.typography.fontFamily.body,
            }}
          >
            <h1
              style={{
                fontFamily: theme.typography.fontFamily.heading,
                fontSize: theme.typography.fontSize['4xl'],
                fontWeight: theme.typography.fontWeight.bold,
                marginBottom: '1rem',
              }}
            >
              Heading 1
            </h1>
            <h2
              style={{
                fontFamily: theme.typography.fontFamily.heading,
                fontSize: theme.typography.fontSize['2xl'],
                fontWeight: theme.typography.fontWeight.semibold,
                marginBottom: '1rem',
              }}
            >
              Heading 2
            </h2>
            <p
              style={{
                fontSize: theme.typography.fontSize.base,
                lineHeight: theme.typography.lineHeight.normal,
                color: theme.colors.textSecondary,
                marginBottom: '0.5rem',
              }}
            >
              This is body text showing the default font family and styling.
              The quick brown fox jumps over the lazy dog.
            </p>
            <code
              style={{
                fontFamily: theme.typography.fontFamily.monospace,
                fontSize: theme.typography.fontSize.sm,
                backgroundColor: theme.colors.backgroundLight,
                padding: '0.25rem 0.5rem',
                borderRadius: theme.effects.borderRadius.sm,
              }}
            >
              console.log('monospace font')
            </code>
          </div>
        </div>
      )}

      {/* UI Components Preview */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white">UI Components</h3>
        <div
          className="p-6 rounded-lg space-y-4"
          style={{
            backgroundColor: theme.colors.background,
          }}
        >
          {/* Buttons */}
          <div className="flex gap-3 flex-wrap">
            <button
              style={{
                backgroundColor: theme.colors.primary,
                color: theme.colors.text,
                padding: '0.5rem 1rem',
                borderRadius: theme.effects.borderRadius.md,
                fontWeight: theme.typography.fontWeight.medium,
                transition: `all ${theme.animations.duration.normal}`,
              }}
            >
              Primary Button
            </button>
            <button
              style={{
                backgroundColor: theme.colors.secondary,
                color: theme.colors.text,
                padding: '0.5rem 1rem',
                borderRadius: theme.effects.borderRadius.md,
                fontWeight: theme.typography.fontWeight.medium,
              }}
            >
              Secondary Button
            </button>
            <button
              style={{
                backgroundColor: theme.colors.accent,
                color: theme.colors.text,
                padding: '0.5rem 1rem',
                borderRadius: theme.effects.borderRadius.md,
                fontWeight: theme.typography.fontWeight.medium,
              }}
            >
              Accent Button
            </button>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              style={{
                backgroundColor: theme.colors.surface,
                padding: '1.5rem',
                borderRadius: theme.effects.borderRadius.lg,
                boxShadow: theme.effects.shadow.md,
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Heart size={20} style={{ color: theme.colors.accent }} />
                <h4
                  style={{
                    color: theme.colors.text,
                    fontWeight: theme.typography.fontWeight.semibold,
                    fontSize: theme.typography.fontSize.lg,
                  }}
                >
                  Health Card
                </h4>
              </div>
              <p
                style={{
                  color: theme.colors.textSecondary,
                  fontSize: theme.typography.fontSize.sm,
                }}
              >
                Sample card content showing surface color and text hierarchy
              </p>
              <div className="mt-3 flex gap-2">
                <span
                  style={{
                    backgroundColor: theme.colors.success,
                    color: theme.colors.text,
                    padding: '0.25rem 0.75rem',
                    borderRadius: theme.effects.borderRadius.full,
                    fontSize: theme.typography.fontSize.xs,
                  }}
                >
                  Active
                </span>
              </div>
            </div>

            <div
              style={{
                backgroundColor: theme.colors.surface,
                padding: '1.5rem',
                borderRadius: theme.effects.borderRadius.lg,
                boxShadow: theme.effects.shadow.md,
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Star size={20} style={{ color: theme.colors.accent }} />
                <h4
                  style={{
                    color: theme.colors.text,
                    fontWeight: theme.typography.fontWeight.semibold,
                    fontSize: theme.typography.fontSize.lg,
                  }}
                >
                  Feature Card
                </h4>
              </div>
              <p
                style={{
                  color: theme.colors.textSecondary,
                  fontSize: theme.typography.fontSize.sm,
                }}
              >
                Another sample showing consistent styling
              </p>
            </div>
          </div>

          {/* Form Elements */}
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Search..."
              style={{
                width: '100%',
                backgroundColor: theme.colors.backgroundLight,
                color: theme.colors.text,
                padding: '0.75rem',
                borderRadius: theme.effects.borderRadius.md,
                border: `1px solid ${theme.colors.border}`,
                fontSize: theme.typography.fontSize.base,
              }}
            />
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  style={{
                    accentColor: theme.colors.primary,
                  }}
                />
                <span style={{ color: theme.colors.text, fontSize: theme.typography.fontSize.sm }}>
                  Checkbox
                </span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  style={{
                    accentColor: theme.colors.primary,
                  }}
                />
                <span style={{ color: theme.colors.text, fontSize: theme.typography.fontSize.sm }}>
                  Radio
                </span>
              </label>
            </div>
          </div>

          {/* Status Messages */}
          <div className="space-y-2">
            <StatusMessage
              icon={<Check size={16} />}
              color={theme.colors.success}
              text="Success message"
              theme={theme}
            />
            <StatusMessage
              icon={<AlertCircle size={16} />}
              color={theme.colors.warning}
              text="Warning message"
              theme={theme}
            />
            <StatusMessage
              icon={<AlertCircle size={16} />}
              color={theme.colors.error}
              text="Error message"
              theme={theme}
            />
            <StatusMessage
              icon={<Info size={16} />}
              color={theme.colors.info}
              text="Info message"
              theme={theme}
            />
          </div>

          {/* Icons Grid */}
          <div className="flex gap-4">
            {[User, Mail, Lock, Search, Bell, Calendar, Settings].map((Icon, idx) => (
              <Icon
                key={idx}
                size={24}
                style={{ color: theme.colors.textSecondary }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Accessibility Score */}
      {showDetails && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white">Accessibility</h3>
          <div
            className="p-4 rounded-lg"
            style={{
              backgroundColor: theme.colors.surface,
            }}
          >
            <div className="grid grid-cols-2 gap-4 text-sm">
              <AccessibilityItem
                label="High Contrast"
                value={theme.accessibility.highContrast}
                theme={theme}
              />
              <AccessibilityItem
                label="Reduced Motion"
                value={theme.accessibility.reducedMotion}
                theme={theme}
              />
              <AccessibilityItem
                label="Dyslexia Font"
                value={theme.accessibility.dyslexiaFont}
                theme={theme}
              />
              <AccessibilityItem
                label="Colorblind Mode"
                value={theme.accessibility.colorblindMode !== 'none'}
                theme={theme}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Color swatch component
const ColorSwatch: React.FC<{ label: string; color: string }> = ({ label, color }) => (
  <div className="space-y-1">
    <div
      className="w-full h-12 rounded-lg border-2 border-white/20"
      style={{ backgroundColor: color }}
    />
    <div className="text-xs text-gray-400 text-center">{label}</div>
    <div className="text-xs text-gray-500 text-center font-mono">{color}</div>
  </div>
);

// Status message component
const StatusMessage: React.FC<{
  icon: React.ReactNode;
  color: string;
  text: string;
  theme: Theme;
}> = ({ icon, color, text, theme }) => (
  <div
    className="flex items-center gap-2 p-3 rounded-lg"
    style={{
      backgroundColor: color + '20',
      border: `1px solid ${color}`,
    }}
  >
    <div style={{ color }}>{icon}</div>
    <span style={{ color: theme.colors.text, fontSize: theme.typography.fontSize.sm }}>
      {text}
    </span>
  </div>
);

// Accessibility item component
const AccessibilityItem: React.FC<{
  label: string;
  value: boolean;
  theme: Theme;
}> = ({ label, value, theme }) => (
  <div className="flex items-center justify-between">
    <span style={{ color: theme.colors.textSecondary }}>{label}</span>
    <span
      style={{
        color: value ? theme.colors.success : theme.colors.textMuted,
        fontWeight: theme.typography.fontWeight.medium,
      }}
    >
      {value ? 'Enabled' : 'Disabled'}
    </span>
  </div>
);

export default ThemePreview;
