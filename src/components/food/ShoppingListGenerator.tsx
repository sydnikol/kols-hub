// ShoppingListGenerator.tsx - Generate and manage shopping lists from recipes
// Part of the Gothic Dollhouse Kitchen Lab

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Stack,
  Button,
  Checkbox,
  Chip,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Collapse,
  Divider,
  Tooltip,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  ShoppingCart,
  Plus,
  X,
  Trash2,
  Check,
  Share2,
  Download,
  Printer,
  ChevronDown,
  ChevronUp,
  Search,
  Apple,
  Milk,
  Beef,
  Cookie,
  Snowflake,
  Flame,
  Wine,
  RefreshCw,
  Copy,
  CheckCircle2,
} from 'lucide-react';
import {
  gothicRecipes,
  GothicRecipe,
  Ingredient,
  getRecipeById,
} from '../../data/gothicRecipes';

// Types
type IngredientCategory = 'produce' | 'dairy' | 'meat' | 'pantry' | 'frozen' | 'spices' | 'beverages';

interface ShoppingItem {
  id: string;
  name: string;
  amount: string;
  unit: string;
  category: IngredientCategory;
  checked: boolean;
  recipeIds: string[];
  isCustom?: boolean;
}

interface CategoryGroup {
  category: IngredientCategory;
  label: string;
  icon: React.ReactNode;
  color: string;
  items: ShoppingItem[];
}

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const checkmark = keyframes`
  0% { transform: scale(0); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
`;

// Styled components
const Container = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #0a0812 0%, #1a1028 50%, #0f0a18 100%)',
  padding: '24px',
});

const Header = styled(Box)({
  background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 50%, #15803d 100%)',
  borderRadius: '16px',
  padding: '24px 32px',
  marginBottom: '24px',
  boxShadow: '0 8px 32px rgba(34, 197, 94, 0.4)',
});

const CategorySection = styled(Paper)({
  background: 'rgba(26, 16, 40, 0.6)',
  borderRadius: '16px',
  border: '1px solid rgba(139, 92, 246, 0.2)',
  marginBottom: '16px',
  overflow: 'hidden',
  animation: `${fadeIn} 0.5s ease-out`,
});

const CategoryHeader = styled(Box)<{ expanded: boolean }>(({ expanded }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '16px 20px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  background: expanded ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
  '&:hover': {
    background: 'rgba(139, 92, 246, 0.1)',
  },
}));

const ShoppingItemRow = styled(Box)<{ checked: boolean }>(({ checked }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '12px 20px',
  borderBottom: '1px solid rgba(139, 92, 246, 0.1)',
  transition: 'all 0.3s ease',
  opacity: checked ? 0.5 : 1,
  background: checked ? 'rgba(34, 197, 94, 0.05)' : 'transparent',
  '&:hover': {
    background: checked ? 'rgba(34, 197, 94, 0.1)' : 'rgba(139, 92, 246, 0.05)',
  },
  '&:last-child': {
    borderBottom: 'none',
  },
}));

const StyledCheckbox = styled(Checkbox)({
  color: 'rgba(139, 92, 246, 0.5)',
  '&.Mui-checked': {
    color: '#22c55e',
    '& svg': {
      animation: `${checkmark} 0.3s ease-out`,
    },
  },
});

const AddItemField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    color: '#ffffff',
    background: 'rgba(26, 16, 40, 0.8)',
    borderRadius: '12px',
    '& fieldset': { borderColor: 'rgba(139, 92, 246, 0.3)' },
    '&:hover fieldset': { borderColor: 'rgba(139, 92, 246, 0.6)' },
    '&.Mui-focused fieldset': { borderColor: '#8b5cf6' },
  },
});

// Category configuration
const categoryConfig: Record<IngredientCategory, { label: string; icon: React.ReactNode; color: string }> = {
  produce: { label: 'Produce', icon: <Apple size={20} />, color: '#22c55e' },
  dairy: { label: 'Dairy & Eggs', icon: <Milk size={20} />, color: '#3b82f6' },
  meat: { label: 'Meat & Seafood', icon: <Beef size={20} />, color: '#ef4444' },
  pantry: { label: 'Pantry', icon: <Cookie size={20} />, color: '#f97316' },
  frozen: { label: 'Frozen', icon: <Snowflake size={20} />, color: '#06b6d4' },
  spices: { label: 'Spices & Seasonings', icon: <Flame size={20} />, color: '#eab308' },
  beverages: { label: 'Beverages', icon: <Wine size={20} />, color: '#8b5cf6' },
};

// Helper to generate unique item ID
const generateItemId = (ingredient: Ingredient): string => {
  return `${ingredient.name.toLowerCase().replace(/\s+/g, '-')}-${ingredient.category}`;
};

// Helper to combine duplicate ingredients
const combineIngredients = (ingredients: { ingredient: Ingredient; recipeId: string }[]): ShoppingItem[] => {
  const itemMap = new Map<string, ShoppingItem>();

  ingredients.forEach(({ ingredient, recipeId }) => {
    const id = generateItemId(ingredient);
    const existing = itemMap.get(id);

    if (existing) {
      // Add recipe ID to existing item
      if (!existing.recipeIds.includes(recipeId)) {
        existing.recipeIds.push(recipeId);
      }
      // Note: For simplicity, we're not combining amounts (would need unit conversion)
    } else {
      itemMap.set(id, {
        id,
        name: ingredient.name,
        amount: ingredient.amount,
        unit: ingredient.unit,
        category: ingredient.category,
        checked: false,
        recipeIds: [recipeId],
      });
    }
  });

  return Array.from(itemMap.values());
};

// Main Component
interface ShoppingListGeneratorProps {
  recipeIds?: string[];
  onClose?: () => void;
}

export const ShoppingListGenerator: React.FC<ShoppingListGeneratorProps> = ({
  recipeIds = [],
  onClose,
}) => {
  // State
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<IngredientCategory>>(
    new Set(['produce', 'dairy', 'meat', 'pantry'])
  );
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('');
  const [newItemUnit, setNewItemUnit] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<IngredientCategory>('pantry');
  const [searchQuery, setSearchQuery] = useState('');
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [copied, setCopied] = useState(false);

  // Generate items from recipe IDs
  useEffect(() => {
    if (recipeIds.length > 0) {
      const allIngredients: { ingredient: Ingredient; recipeId: string }[] = [];

      recipeIds.forEach(id => {
        const recipe = getRecipeById(id);
        if (recipe) {
          recipe.ingredients.forEach(ing => {
            if (!ing.optional) {
              allIngredients.push({ ingredient: ing, recipeId: id });
            }
          });
        }
      });

      const combined = combineIngredients(allIngredients);
      setItems(combined);
    }
  }, [recipeIds]);

  // Load saved list from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('gothic-shopping-list');
    if (saved && recipeIds.length === 0) {
      setItems(JSON.parse(saved));
    }
  }, [recipeIds]);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('gothic-shopping-list', JSON.stringify(items));
  }, [items]);

  // Group items by category
  const groupedItems = useMemo((): CategoryGroup[] => {
    const groups: CategoryGroup[] = [];

    (Object.keys(categoryConfig) as IngredientCategory[]).forEach(category => {
      const config = categoryConfig[category];
      const categoryItems = items.filter(item => {
        const matchesCategory = item.category === category;
        const matchesSearch = !searchQuery ||
          item.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      });

      if (categoryItems.length > 0) {
        groups.push({
          category,
          label: config.label,
          icon: config.icon,
          color: config.color,
          items: categoryItems,
        });
      }
    });

    return groups;
  }, [items, searchQuery]);

  // Handlers
  const toggleCategory = (category: IngredientCategory) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const toggleItem = (itemId: string) => {
    setItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const removeItem = (itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
  };

  const addCustomItem = () => {
    if (newItemName.trim()) {
      const newItem: ShoppingItem = {
        id: `custom-${Date.now()}`,
        name: newItemName.trim(),
        amount: newItemAmount.trim() || '1',
        unit: newItemUnit.trim() || 'item',
        category: newItemCategory,
        checked: false,
        recipeIds: [],
        isCustom: true,
      };
      setItems(prev => [...prev, newItem]);
      setNewItemName('');
      setNewItemAmount('');
      setNewItemUnit('');
      setShowAddDialog(false);
    }
  };

  const clearChecked = () => {
    setItems(prev => prev.filter(item => !item.checked));
  };

  const clearAll = () => {
    setItems([]);
  };

  const uncheckAll = () => {
    setItems(prev => prev.map(item => ({ ...item, checked: false })));
  };

  // Generate shareable text
  const generateShareText = (): string => {
    let text = '🦇 Gothic Kitchen Shopping List 🦇\n\n';

    groupedItems.forEach(group => {
      text += `📦 ${group.label}\n`;
      group.items.forEach(item => {
        const checkMark = item.checked ? '✓' : '○';
        text += `  ${checkMark} ${item.amount} ${item.unit} ${item.name}\n`;
      });
      text += '\n';
    });

    return text;
  };

  const copyToClipboard = async () => {
    const text = generateShareText();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const downloadList = () => {
    const text = generateShareText();
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gothic-shopping-list.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Stats
  const totalItems = items.length;
  const checkedItems = items.filter(i => i.checked).length;
  const progress = totalItems > 0 ? (checkedItems / totalItems) * 100 : 0;

  // Get recipe names for an item
  const getRecipeNames = (recipeIds: string[]): string => {
    return recipeIds
      .map(id => getRecipeById(id)?.gothicName || id)
      .join(', ');
  };

  return (
    <Container>
      {/* Header */}
      <Header>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={2} alignItems="center">
            <ShoppingCart size={40} color="#ffffff" />
            <Box>
              <Typography
                variant="h4"
                sx={{ fontFamily: '"Cinzel", serif', color: '#ffffff', fontWeight: 700 }}
              >
                Shopping List
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                {checkedItems} of {totalItems} items checked
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={2}>
            <Button
              startIcon={<Plus size={20} />}
              onClick={() => setShowAddDialog(true)}
              sx={{
                background: 'rgba(255,255,255,0.2)',
                color: '#ffffff',
                '&:hover': { background: 'rgba(255,255,255,0.3)' },
              }}
            >
              Add Item
            </Button>
            <Button
              startIcon={<Share2 size={20} />}
              onClick={() => setShowShareDialog(true)}
              sx={{
                background: 'rgba(255,255,255,0.2)',
                color: '#ffffff',
                '&:hover': { background: 'rgba(255,255,255,0.3)' },
              }}
            >
              Share
            </Button>
          </Stack>
        </Stack>

        {/* Progress Bar */}
        <Box sx={{ mt: 2 }}>
          <Box
            sx={{
              height: 8,
              borderRadius: 4,
              background: 'rgba(255,255,255,0.2)',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                height: '100%',
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #ffffff, #d4af37)',
                borderRadius: 4,
                transition: 'width 0.3s ease',
              }}
            />
          </Box>
        </Box>
      </Header>

      {/* Actions Bar */}
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <AddItemField
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={20} color="#8b5cf6" />
              </InputAdornment>
            ),
          }}
          sx={{ flex: 1 }}
        />
        <Tooltip title="Uncheck all">
          <IconButton onClick={uncheckAll} sx={{ color: '#a78bfa' }}>
            <RefreshCw size={20} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Remove checked items">
          <IconButton
            onClick={clearChecked}
            disabled={checkedItems === 0}
            sx={{ color: checkedItems > 0 ? '#22c55e' : 'rgba(139, 92, 246, 0.3)' }}
          >
            <Check size={20} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Clear all">
          <IconButton onClick={clearAll} sx={{ color: 'rgba(239, 68, 68, 0.7)' }}>
            <Trash2 size={20} />
          </IconButton>
        </Tooltip>
      </Stack>

      {/* Shopping List */}
      {groupedItems.length > 0 ? (
        groupedItems.map(group => (
          <CategorySection key={group.category}>
            <CategoryHeader
              expanded={expandedCategories.has(group.category)}
              onClick={() => toggleCategory(group.category)}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{ color: group.color }}>{group.icon}</Box>
                <Typography sx={{ color: group.color, fontWeight: 600 }}>
                  {group.label}
                </Typography>
                <Chip
                  label={`${group.items.filter(i => i.checked).length}/${group.items.length}`}
                  size="small"
                  sx={{
                    background: 'rgba(139, 92, 246, 0.2)',
                    color: '#a78bfa',
                    height: '24px',
                  }}
                />
              </Stack>
              {expandedCategories.has(group.category) ? (
                <ChevronUp size={20} color="#8b5cf6" />
              ) : (
                <ChevronDown size={20} color="#8b5cf6" />
              )}
            </CategoryHeader>

            <Collapse in={expandedCategories.has(group.category)}>
              {group.items.map(item => (
                <ShoppingItemRow key={item.id} checked={item.checked}>
                  <StyledCheckbox
                    checked={item.checked}
                    onChange={() => toggleItem(item.id)}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      sx={{
                        color: item.checked ? 'rgba(255,255,255,0.5)' : '#ffffff',
                        textDecoration: item.checked ? 'line-through' : 'none',
                      }}
                    >
                      <strong style={{ color: item.checked ? 'rgba(212, 175, 55, 0.5)' : '#d4af37' }}>
                        {item.amount} {item.unit}
                      </strong>{' '}
                      {item.name}
                    </Typography>
                    {item.recipeIds.length > 0 && (
                      <Typography sx={{ color: 'rgba(139, 92, 246, 0.6)', fontSize: '0.75rem' }}>
                        For: {getRecipeNames(item.recipeIds)}
                      </Typography>
                    )}
                    {item.isCustom && (
                      <Chip
                        label="Custom"
                        size="small"
                        sx={{
                          height: '16px',
                          fontSize: '0.65rem',
                          background: 'rgba(236, 72, 153, 0.2)',
                          color: '#ec4899',
                          mt: 0.5,
                        }}
                      />
                    )}
                  </Box>
                  <IconButton
                    size="small"
                    onClick={() => removeItem(item.id)}
                    sx={{ color: 'rgba(239, 68, 68, 0.6)', '&:hover': { color: '#ef4444' } }}
                  >
                    <X size={16} />
                  </IconButton>
                </ShoppingItemRow>
              ))}
            </Collapse>
          </CategorySection>
        ))
      ) : (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <ShoppingCart size={64} color="#8b5cf6" style={{ opacity: 0.5 }} />
          <Typography sx={{ color: 'rgba(139, 92, 246, 0.7)', mt: 2, fontSize: '1.2rem' }}>
            Your shopping list is empty
          </Typography>
          <Typography sx={{ color: 'rgba(139, 92, 246, 0.5)', mt: 1 }}>
            Add items manually or generate from your meal plan
          </Typography>
          <Button
            startIcon={<Plus size={20} />}
            onClick={() => setShowAddDialog(true)}
            sx={{
              mt: 3,
              background: 'linear-gradient(135deg, #8b5cf6, #d4af37)',
              color: '#ffffff',
              '&:hover': { background: 'linear-gradient(135deg, #9333ea, #ffd700)' },
            }}
          >
            Add First Item
          </Button>
        </Box>
      )}

      {/* Add Item Dialog */}
      <Dialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, #1a1028 0%, #0a0812 100%)',
            borderRadius: '16px',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            color: '#ffffff',
            minWidth: '400px',
          },
        }}
      >
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography sx={{ color: '#d4af37', fontFamily: '"Cinzel", serif' }}>
              Add Custom Item
            </Typography>
            <IconButton onClick={() => setShowAddDialog(false)}>
              <X color="#8b5cf6" />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <AddItemField
              fullWidth
              label="Item Name"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="e.g., Organic eggs"
            />
            <Stack direction="row" spacing={2}>
              <AddItemField
                label="Amount"
                value={newItemAmount}
                onChange={(e) => setNewItemAmount(e.target.value)}
                placeholder="1"
                sx={{ flex: 1 }}
              />
              <AddItemField
                label="Unit"
                value={newItemUnit}
                onChange={(e) => setNewItemUnit(e.target.value)}
                placeholder="dozen"
                sx={{ flex: 1 }}
              />
            </Stack>
            <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
              Category
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
              {(Object.keys(categoryConfig) as IngredientCategory[]).map(cat => {
                const config = categoryConfig[cat];
                return (
                  <Chip
                    key={cat}
                    icon={<Box sx={{ color: config.color }}>{config.icon}</Box>}
                    label={config.label}
                    onClick={() => setNewItemCategory(cat)}
                    sx={{
                      background: newItemCategory === cat ? `${config.color}30` : 'rgba(26, 16, 40, 0.6)',
                      color: newItemCategory === cat ? config.color : 'rgba(255,255,255,0.7)',
                      border: `1px solid ${newItemCategory === cat ? config.color : 'rgba(139, 92, 246, 0.2)'}`,
                      cursor: 'pointer',
                    }}
                  />
                );
              })}
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setShowAddDialog(false)} sx={{ color: '#a78bfa' }}>
            Cancel
          </Button>
          <Button
            onClick={addCustomItem}
            disabled={!newItemName.trim()}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              '&:hover': { background: 'linear-gradient(135deg, #16a34a, #22c55e)' },
            }}
          >
            Add Item
          </Button>
        </DialogActions>
      </Dialog>

      {/* Share Dialog */}
      <Dialog
        open={showShareDialog}
        onClose={() => setShowShareDialog(false)}
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, #1a1028 0%, #0a0812 100%)',
            borderRadius: '16px',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            color: '#ffffff',
            minWidth: '400px',
          },
        }}
      >
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography sx={{ color: '#d4af37', fontFamily: '"Cinzel", serif' }}>
              Share Shopping List
            </Typography>
            <IconButton onClick={() => setShowShareDialog(false)}>
              <X color="#8b5cf6" />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <Button
              fullWidth
              startIcon={copied ? <CheckCircle2 size={20} /> : <Copy size={20} />}
              onClick={copyToClipboard}
              sx={{
                background: copied
                  ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                  : 'rgba(139, 92, 246, 0.2)',
                color: '#ffffff',
                '&:hover': { background: 'rgba(139, 92, 246, 0.3)' },
              }}
            >
              {copied ? 'Copied!' : 'Copy to Clipboard'}
            </Button>
            <Button
              fullWidth
              startIcon={<Download size={20} />}
              onClick={downloadList}
              sx={{
                background: 'rgba(139, 92, 246, 0.2)',
                color: '#ffffff',
                '&:hover': { background: 'rgba(139, 92, 246, 0.3)' },
              }}
            >
              Download as Text File
            </Button>
            <Divider sx={{ borderColor: 'rgba(139, 92, 246, 0.2)' }} />
            <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', textAlign: 'center' }}>
              Preview:
            </Typography>
            <Box
              sx={{
                p: 2,
                background: 'rgba(26, 16, 40, 0.8)',
                borderRadius: '8px',
                maxHeight: '200px',
                overflowY: 'auto',
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                color: 'rgba(255,255,255,0.8)',
                whiteSpace: 'pre-wrap',
              }}
            >
              {generateShareText()}
            </Box>
          </Stack>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default ShoppingListGenerator;
