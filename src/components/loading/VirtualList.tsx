/**
 * VirtualList Component
 * Efficiently renders large lists by only rendering visible items
 * Gothic-themed for the Dollhouse application
 */

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { Box, styled, keyframes } from '@mui/material';
import { calculateVirtualListRange, throttle } from '../../utils/performance';

// Keyframe animations
const fadeIn = keyframes`
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
`;

// Styled components
const VirtualContainer = styled(Box)({
  position: 'relative',
  overflow: 'auto',
  willChange: 'scroll-position',
  scrollBehavior: 'smooth',
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'rgba(20, 20, 30, 0.5)',
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'linear-gradient(180deg, #8b5cf6 0%, #6d28d9 100%)',
    borderRadius: '4px',
    '&:hover': {
      background: 'linear-gradient(180deg, #a78bfa 0%, #8b5cf6 100%)',
    },
  },
});

const InnerContainer = styled(Box)({
  position: 'relative',
  width: '100%',
});

const VirtualItem = styled(Box)<{ animated?: boolean }>(({ animated }) => ({
  position: 'absolute',
  left: 0,
  right: 0,
  animation: animated ? `${fadeIn} 0.2s ease-out` : 'none',
}));

// Types
export interface VirtualListProps<T> {
  items: T[];
  itemHeight: number | ((index: number, item: T) => number);
  containerHeight: number | string;
  overscan?: number;
  renderItem: (item: T, index: number, style: React.CSSProperties) => React.ReactNode;
  keyExtractor?: (item: T, index: number) => string | number;
  onScroll?: (scrollTop: number) => void;
  onEndReached?: () => void;
  endReachedThreshold?: number;
  className?: string;
  animateItems?: boolean;
  emptyMessage?: React.ReactNode;
  loadingPlaceholder?: React.ReactNode;
  isLoading?: boolean;
}

export interface VirtualListRef {
  scrollTo: (index: number, behavior?: ScrollBehavior) => void;
  scrollToTop: () => void;
  scrollToBottom: () => void;
  getScrollTop: () => number;
}

// Helper to get item height
function getItemHeight<T>(
  itemHeight: number | ((index: number, item: T) => number),
  index: number,
  item: T
): number {
  if (typeof itemHeight === 'function') {
    return itemHeight(index, item);
  }
  return itemHeight;
}

// Main component
function VirtualListInner<T>(
  props: VirtualListProps<T>,
  ref: React.Ref<VirtualListRef>
) {
  const {
    items,
    itemHeight,
    containerHeight,
    overscan = 3,
    renderItem,
    keyExtractor,
    onScroll,
    onEndReached,
    endReachedThreshold = 200,
    className,
    animateItems = true,
    emptyMessage,
    loadingPlaceholder,
    isLoading = false,
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeightPx, setContainerHeightPx] = useState(0);
  const endReachedRef = useRef(false);

  // Calculate total height and item positions for variable heights
  const { totalHeight, itemPositions } = useMemo(() => {
    const positions: number[] = [];
    let currentTop = 0;

    for (let i = 0; i < items.length; i++) {
      positions.push(currentTop);
      currentTop += getItemHeight(itemHeight, i, items[i]);
    }

    return {
      totalHeight: currentTop,
      itemPositions: positions,
    };
  }, [items, itemHeight]);

  // Calculate visible range
  const visibleRange = useMemo(() => {
    if (typeof itemHeight === 'number') {
      return calculateVirtualListRange(
        {
          itemHeight,
          containerHeight: containerHeightPx,
          overscan,
          totalItems: items.length,
        },
        scrollTop
      );
    }

    // Variable height calculation
    let startIndex = 0;
    let endIndex = items.length - 1;

    // Find start index using binary search
    let low = 0;
    let high = items.length - 1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      if (itemPositions[mid] < scrollTop) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    startIndex = Math.max(0, high - overscan);

    // Find end index
    const bottomEdge = scrollTop + containerHeightPx;
    for (let i = startIndex; i < items.length; i++) {
      if (itemPositions[i] > bottomEdge) {
        endIndex = Math.min(items.length - 1, i + overscan);
        break;
      }
    }

    const visibleItems: number[] = [];
    for (let i = startIndex; i <= endIndex; i++) {
      visibleItems.push(i);
    }

    return {
      startIndex,
      endIndex,
      offsetY: itemPositions[startIndex] || 0,
      visibleItems,
    };
  }, [items, itemHeight, containerHeightPx, scrollTop, overscan, itemPositions]);

  // Measure container height
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateHeight = () => {
      setContainerHeightPx(container.clientHeight);
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, []);

  // Handle scroll
  const handleScroll = useCallback(
    throttle(() => {
      const container = containerRef.current;
      if (!container) return;

      const newScrollTop = container.scrollTop;
      setScrollTop(newScrollTop);
      onScroll?.(newScrollTop);

      // Check for end reached
      const scrollBottom = newScrollTop + container.clientHeight;
      const distanceToEnd = totalHeight - scrollBottom;

      if (distanceToEnd < endReachedThreshold && !endReachedRef.current) {
        endReachedRef.current = true;
        onEndReached?.();
      } else if (distanceToEnd >= endReachedThreshold) {
        endReachedRef.current = false;
      }
    }, 16), // ~60fps
    [onScroll, onEndReached, totalHeight, endReachedThreshold]
  );

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    scrollTo: (index: number, behavior: ScrollBehavior = 'smooth') => {
      const container = containerRef.current;
      if (!container || index < 0 || index >= items.length) return;

      const targetTop = typeof itemHeight === 'number'
        ? index * itemHeight
        : itemPositions[index];

      container.scrollTo({ top: targetTop, behavior });
    },
    scrollToTop: () => {
      containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    },
    scrollToBottom: () => {
      containerRef.current?.scrollTo({ top: totalHeight, behavior: 'smooth' });
    },
    getScrollTop: () => containerRef.current?.scrollTop || 0,
  }), [items.length, itemHeight, itemPositions, totalHeight]);

  // Render visible items
  const renderedItems = useMemo(() => {
    return visibleRange.visibleItems.map((index) => {
      const item = items[index];
      const key = keyExtractor ? keyExtractor(item, index) : index;
      const height = getItemHeight(itemHeight, index, item);
      const top = typeof itemHeight === 'number'
        ? index * itemHeight
        : itemPositions[index];

      const style: React.CSSProperties = {
        position: 'absolute',
        top,
        left: 0,
        right: 0,
        height,
      };

      return (
        <VirtualItem key={key} animated={animateItems}>
          {renderItem(item, index, style)}
        </VirtualItem>
      );
    });
  }, [visibleRange.visibleItems, items, itemHeight, itemPositions, keyExtractor, renderItem, animateItems]);

  // Empty state
  if (items.length === 0 && !isLoading) {
    return (
      <VirtualContainer
        className={className}
        sx={{ height: containerHeight }}
      >
        {emptyMessage || (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: '#9080a0',
              fontStyle: 'italic',
            }}
          >
            No items to display
          </Box>
        )}
      </VirtualContainer>
    );
  }

  return (
    <VirtualContainer
      ref={containerRef}
      className={className}
      onScroll={handleScroll}
      sx={{ height: containerHeight }}
    >
      <InnerContainer sx={{ height: totalHeight }}>
        {renderedItems}
      </InnerContainer>
      {isLoading && loadingPlaceholder}
    </VirtualContainer>
  );
}

// Export with forwardRef
export const VirtualList = forwardRef(VirtualListInner) as <T>(
  props: VirtualListProps<T> & { ref?: React.Ref<VirtualListRef> }
) => React.ReactElement;

// Simpler fixed-height virtual list
export interface SimpleVirtualListProps<T> {
  items: T[];
  itemHeight: number;
  height: number | string;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
}

export function SimpleVirtualList<T>({
  items,
  itemHeight,
  height,
  renderItem,
  className,
}: SimpleVirtualListProps<T>) {
  return (
    <VirtualList
      items={items}
      itemHeight={itemHeight}
      containerHeight={height}
      renderItem={(item, index, style) => (
        <Box sx={style}>{renderItem(item, index)}</Box>
      )}
      className={className}
    />
  );
}

// Hook for virtual list logic (for custom implementations)
export function useVirtualList<T>(
  items: T[],
  options: {
    itemHeight: number;
    containerHeight: number;
    overscan?: number;
  }
) {
  const [scrollTop, setScrollTop] = useState(0);

  const range = useMemo(
    () =>
      calculateVirtualListRange(
        {
          ...options,
          totalItems: items.length,
          overscan: options.overscan ?? 3,
        },
        scrollTop
      ),
    [items.length, options.itemHeight, options.containerHeight, options.overscan, scrollTop]
  );

  const totalHeight = items.length * options.itemHeight;

  const handleScroll = useCallback((e: React.UIEvent<HTMLElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return {
    range,
    totalHeight,
    scrollTop,
    setScrollTop,
    handleScroll,
    getItemStyle: (index: number): React.CSSProperties => ({
      position: 'absolute',
      top: index * options.itemHeight,
      left: 0,
      right: 0,
      height: options.itemHeight,
    }),
  };
}

export default VirtualList;
