import React, {
  createContext,
  useContext,
  useState,
  useRef,
  ReactNode,
} from "react";
import { LayoutRectangle } from "react-native";

interface AnimatedItem {
  id: string;
  itemId: string;
  title: string;
  image: any;
  startPosition: { x: number; y: number };
  endPosition: { x: number; y: number };
  timestamp: number;
  isRemoving?: boolean;
}

interface AnimationContextType {
  animatedItems: AnimatedItem[];
  boxLayout: LayoutRectangle | null;
  setBoxLayout: (layout: LayoutRectangle) => void;
  addAnimatedItem: (
    item: Omit<AnimatedItem, "id" | "timestamp" | "endPosition">
  ) => void;
  removeAnimatedItem: (itemId: string) => void;
  getItemCount: (itemId: string) => number;
  clearAnimatedItems: () => void;
  hasItemsInBox: () => boolean;
}

const AnimationContext = createContext<AnimationContextType | undefined>(
  undefined
);

export const AnimationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [animatedItems, setAnimatedItems] = useState<AnimatedItem[]>([]);
  const [boxLayout, setBoxLayout] = useState<LayoutRectangle | null>(null);
  const itemCountRef = useRef<Record<string, number>>({});

  const addAnimatedItem = (
    item: Omit<AnimatedItem, "id" | "timestamp" | "endPosition">
  ) => {
    if (!boxLayout) return;

    // Update count
    itemCountRef.current[item.itemId] =
      (itemCountRef.current[item.itemId] || 0) + 1;

    // Calculate random end position within the box
    const boxPadding = 20;
    const itemSize = 200; // Approximate size of the dropped item

    const randomX =
      boxLayout.x +
      boxPadding +
      Math.random() * (boxLayout.width - itemSize - boxPadding * 2);
    
    // Y position start from 50% of box height to ensure items drop deeper
    const minDepthPercentage = 0.9; // 90% of box height
    const availableHeight = boxLayout.height - itemSize - boxPadding * 2;
    const minYOffset = availableHeight * minDepthPercentage;
    
    const randomY =
      boxLayout.y +
      boxPadding +
      Math.random() * (availableHeight - minYOffset);

    // Add some rotation for natural scattered look
    const randomRotation = (Math.random() - 0.5) * 30; // -15 to 15 degrees

    const newItem: AnimatedItem = {
      ...item,
      id: `${item.itemId}_${Date.now()}_${Math.random()}`,
      timestamp: Date.now(),
      endPosition: {
        x: randomX,
        y: randomY,
      },
    };

    setAnimatedItems((prev) => [...prev, newItem]);
  };

  const removeAnimatedItem = (itemId: string) => {
    // Decrease count
    if (itemCountRef.current[itemId] && itemCountRef.current[itemId] > 0) {
      itemCountRef.current[itemId]--;

      // Mark the most recent item of this type as removing
      setAnimatedItems((prev) => {
        const itemsOfType = prev.filter(
          (item) => item.itemId === itemId && !item.isRemoving
        );
        if (itemsOfType.length === 0) return prev;

        const mostRecent = itemsOfType.reduce((latest, current) =>
          current.timestamp > latest.timestamp ? current : latest
        );

        // Mark item as removing instead of immediately removing it
        return prev.map((item) =>
          item.id === mostRecent.id ? { ...item, isRemoving: true } : item
        );
      });

      // Remove the item after animation completes
      setTimeout(() => {
        setAnimatedItems((prev) => prev.filter((item) => !item.isRemoving));
      }, 600); // Match the animation duration
    }
  };

  const getItemCount = (itemId: string) => {
    return itemCountRef.current[itemId] || 0;
  };

  const clearAnimatedItems = () => {
    setAnimatedItems([]);
    itemCountRef.current = {};
  };

  const hasItemsInBox = () => {
    return animatedItems.filter((item) => !item.isRemoving).length > 0;
  };

  return (
    <AnimationContext.Provider
      value={{
        animatedItems,
        boxLayout,
        setBoxLayout,
        addAnimatedItem,
        removeAnimatedItem,
        getItemCount,
        clearAnimatedItems,
        hasItemsInBox,
      }}
    >
      {children}
    </AnimationContext.Provider>
  );
};

export const useAnimation = () => {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error("useAnimation must be used within AnimationProvider");
  }
  return context;
};
