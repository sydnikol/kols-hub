// Gothic Navigation Component
// Navigation with gothic styling, ornate elements, and smooth transitions

import React, { useState } from 'react';
import { Box, Typography, IconButton, Collapse } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import { ChevronRight, Menu, X } from 'lucide-react';

const fadeSlide = keyframes`
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const glowLine = keyframes`
  0%, 100% { opacity: 0.3; width: 0; }
  50% { opacity: 1; width: 100%; }
`;

interface NavItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  children?: NavItem[];
  badge?: string | number;
  disabled?: boolean;
}

interface GothicNavProps {
  items: NavItem[];
  activeId?: string;
  variant?: 'sidebar' | 'horizontal' | 'minimal';
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  showLogo?: boolean;
  logoText?: string;
}

const NavContainer = styled(Box, {
  shouldForwardProp: (prop) => !['variant', 'collapsed'].includes(prop as string),
})<{ variant: string; collapsed: boolean }>(({ variant, collapsed }) => ({
  display: 'flex',
  flexDirection: variant === 'horizontal' ? 'row' : 'column',
  background: 'var(--bg-surface, rgba(20, 20, 30, 0.9))',
  backdropFilter: 'blur(10px)',
  borderRight: variant === 'sidebar' ? '1px solid var(--border-color, rgba(139, 92, 246, 0.3))' : 'none',
  borderBottom: variant === 'horizontal' ? '1px solid var(--border-color, rgba(139, 92, 246, 0.3))' : 'none',
  padding: variant === 'minimal' ? '8px' : '16px',
  width: variant === 'sidebar' ? (collapsed ? '72px' : '280px') : '100%',
  height: variant === 'sidebar' ? '100%' : 'auto',
  transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  overflow: 'hidden',
  position: 'relative',

  // Ornate top border
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '10%',
    right: '10%',
    height: '2px',
    background: 'linear-gradient(90deg, transparent, var(--color-accent, #d4af37), transparent)',
  },
}));

const LogoSection = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  padding: '12px 16px',
  marginBottom: '16px',
  borderBottom: '1px solid var(--border-color, rgba(139, 92, 246, 0.2))',
});

const LogoText = styled(Typography)({
  fontFamily: 'var(--font-accent, "Cinzel", serif)',
  fontSize: '1.25rem',
  fontWeight: 700,
  color: 'var(--text-accent, #d4af37)',
  letterSpacing: '0.1em',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
});

const NavItemContainer = styled(Box, {
  shouldForwardProp: (prop) => !['active', 'disabled', 'hasChildren'].includes(prop as string),
})<{ active?: boolean; disabled?: boolean; hasChildren?: boolean }>(({ active, disabled, hasChildren }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '12px 16px',
  marginBottom: '4px',
  borderRadius: '8px',
  cursor: disabled ? 'not-allowed' : 'pointer',
  transition: 'all 0.2s ease',
  opacity: disabled ? 0.5 : 1,
  position: 'relative',
  overflow: 'hidden',
  animation: `${fadeSlide} 0.3s ease-out`,

  // Active state
  ...(active && {
    background: 'rgba(139, 92, 246, 0.15)',
    borderLeft: '3px solid var(--color-primary, #8b5cf6)',

    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: '16px',
      right: '16px',
      height: '1px',
      background: 'linear-gradient(90deg, var(--color-primary, #8b5cf6), transparent)',
      animation: `${glowLine} 2s ease-in-out infinite`,
    },
  }),

  // Hover state
  '&:hover': {
    background: disabled ? 'transparent' : 'rgba(139, 92, 246, 0.1)',
    '& .nav-icon': {
      color: 'var(--color-primary, #8b5cf6)',
      transform: 'scale(1.1)',
    },
    '& .nav-label': {
      color: 'var(--text-primary, #e0e0e0)',
    },
  },
}));

const NavIcon = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '24px',
  height: '24px',
  color: 'var(--text-secondary, #a0a0a0)',
  transition: 'all 0.2s ease',
  marginRight: '12px',
  flexShrink: 0,
});

const NavLabel = styled(Typography)({
  fontFamily: 'var(--font-family, sans-serif)',
  fontSize: '0.9rem',
  color: 'var(--text-secondary, #a0a0a0)',
  transition: 'color 0.2s ease',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  flex: 1,
});

const Badge = styled(Box)({
  padding: '2px 8px',
  borderRadius: '12px',
  background: 'var(--color-primary, #8b5cf6)',
  color: '#ffffff',
  fontSize: '0.75rem',
  fontWeight: 600,
  marginLeft: '8px',
});

const ExpandIcon = styled(ChevronRight, {
  shouldForwardProp: (prop) => prop !== 'expanded',
})<{ expanded: boolean }>(({ expanded }) => ({
  color: 'var(--text-muted, #666666)',
  transition: 'transform 0.3s ease',
  transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
}));

const ChildrenContainer = styled(Box)({
  paddingLeft: '24px',
  marginTop: '4px',
  borderLeft: '1px solid var(--border-color, rgba(139, 92, 246, 0.2))',
  marginLeft: '28px',
});

const CollapseButton = styled(IconButton)({
  position: 'absolute',
  top: '16px',
  right: '8px',
  color: 'var(--text-secondary, #a0a0a0)',
  '&:hover': {
    color: 'var(--text-primary, #e0e0e0)',
    background: 'rgba(139, 92, 246, 0.1)',
  },
});

const NavItemComponent: React.FC<{
  item: NavItem;
  active: boolean;
  collapsed: boolean;
  onItemClick: (id: string) => void;
}> = ({ item, active, collapsed, onItemClick }) => {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  const handleClick = () => {
    if (item.disabled) return;
    if (hasChildren) {
      setExpanded(!expanded);
    } else {
      onItemClick(item.id);
      item.onClick?.();
    }
  };

  return (
    <>
      <NavItemContainer
        active={active}
        disabled={item.disabled}
        hasChildren={hasChildren}
        onClick={handleClick}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
          {item.icon && <NavIcon className="nav-icon">{item.icon}</NavIcon>}
          {!collapsed && (
            <NavLabel className="nav-label">{item.label}</NavLabel>
          )}
        </Box>
        {!collapsed && item.badge && <Badge>{item.badge}</Badge>}
        {!collapsed && hasChildren && <ExpandIcon expanded={expanded} size={18} />}
      </NavItemContainer>

      {hasChildren && !collapsed && (
        <Collapse in={expanded}>
          <ChildrenContainer>
            {item.children!.map((child) => (
              <NavItemComponent
                key={child.id}
                item={child}
                active={active}
                collapsed={collapsed}
                onItemClick={onItemClick}
              />
            ))}
          </ChildrenContainer>
        </Collapse>
      )}
    </>
  );
};

export const GothicNav: React.FC<GothicNavProps> = ({
  items,
  activeId,
  variant = 'sidebar',
  collapsed = false,
  onToggleCollapse,
  showLogo = true,
  logoText = 'KOL HUB',
}) => {
  const [activeItem, setActiveItem] = useState(activeId || '');

  const handleItemClick = (id: string) => {
    setActiveItem(id);
  };

  return (
    <NavContainer variant={variant} collapsed={collapsed}>
      {variant === 'sidebar' && onToggleCollapse && (
        <CollapseButton onClick={onToggleCollapse} size="small">
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </CollapseButton>
      )}

      {showLogo && variant === 'sidebar' && (
        <LogoSection>
          {!collapsed && <LogoText>{logoText}</LogoText>}
        </LogoSection>
      )}

      <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        {items.map((item) => (
          <NavItemComponent
            key={item.id}
            item={item}
            active={activeItem === item.id}
            collapsed={collapsed}
            onItemClick={handleItemClick}
          />
        ))}
      </Box>
    </NavContainer>
  );
};

export default GothicNav;
