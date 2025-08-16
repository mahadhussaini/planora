import { useState, useEffect, useRef, useMemo, memo } from 'react';
import { motion } from 'framer-motion';

const VirtualizedList = memo(({ 
  items = [], 
  itemHeight = 80, 
  containerHeight = 400, 
  renderItem,
  overscan = 5,
  className = '',
  onItemClick
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const scrollElementRef = useRef(null);

  const itemCount = items.length;
  const totalHeight = itemCount * itemHeight;

  // Calculate which items should be visible
  const visibleRange = useMemo(() => {
    const containerItemCount = Math.ceil(containerHeight / itemHeight);
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(startIndex + containerItemCount + overscan, itemCount - 1);
    
    return {
      start: Math.max(0, startIndex - overscan),
      end: endIndex
    };
  }, [scrollTop, containerHeight, itemHeight, itemCount, overscan]);

  // Generate visible items
  const visibleItems = useMemo(() => {
    const items_to_render = [];
    for (let i = visibleRange.start; i <= visibleRange.end; i++) {
      if (items[i]) {
        items_to_render.push({
          index: i,
          item: items[i],
          top: i * itemHeight
        });
      }
    }
    return items_to_render;
  }, [items, visibleRange, itemHeight]);

  const handleScroll = (e) => {
    setScrollTop(e.target.scrollTop);
  };

  // Auto-scroll to new items if they're added at the end
  useEffect(() => {
    if (scrollElementRef.current && visibleRange.end >= itemCount - 1) {
      const scrollElement = scrollElementRef.current;
      const isNearBottom = scrollElement.scrollTop + scrollElement.clientHeight >= scrollElement.scrollHeight - 100;
      
      if (isNearBottom) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [itemCount, visibleRange.end]);

  if (itemCount === 0) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ height: containerHeight }}>
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p className="text-lg mb-2">No items to display</p>
          <p className="text-sm opacity-75">Items will appear here when added</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`relative overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
      ref={scrollElementRef}
    >
      {/* Total height container */}
      <div style={{ height: totalHeight, position: 'relative' }}>
        {/* Visible items */}
        {visibleItems.map(({ index, item, top }) => (
          <motion.div
            key={item.id || index}
            style={{
              position: 'absolute',
              top: top,
              left: 0,
              right: 0,
              height: itemHeight,
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="px-2"
            onClick={() => onItemClick && onItemClick(item, index)}
          >
            {renderItem(item, index)}
          </motion.div>
        ))}
      </div>
      
      {/* Scroll indicator */}
      {itemCount > Math.ceil(containerHeight / itemHeight) && (
        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full pointer-events-none">
          {Math.ceil((scrollTop + containerHeight) / totalHeight * 100)}%
        </div>
      )}
    </div>
  );
});

VirtualizedList.displayName = 'VirtualizedList';

export default VirtualizedList;