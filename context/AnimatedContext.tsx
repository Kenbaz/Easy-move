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
  previewMode: boolean;
  startPreview: () => void;
  stopPreview: () => void;
  // Store list item positions for preview animation
  listItemLayouts: Record<string, LayoutRectangle>;
  setListItemLayout: (itemId: string, layout: LayoutRectangle) => void;
  incrementItemCount: (itemId: string) => void;
  decrementItemCount: (itemId: string) => void;
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

  const [previewMode, setPreviewMode] = useState(false);
  const startPreview = () => setPreviewMode(true);
  const stopPreview = () => setPreviewMode(false);

  // Store list item layouts
  const [listItemLayouts, setListItemLayouts] = useState<
    Record<string, LayoutRectangle>
  >({});

  const setListItemLayout = (itemId: string, layout: LayoutRectangle) => {
    setListItemLayouts((prev) => ({
      ...prev,
      [itemId]: layout,
    }));
  };

  const addAnimatedItem = (
    item: Omit<AnimatedItem, "id" | "timestamp" | "endPosition">
  ) => {
    if (!boxLayout) return;

    // Update count
    itemCountRef.current[item.itemId] =
      (itemCountRef.current[item.itemId] || 0) + 1;

    // Calculate random end position within the box
    const boxPadding = 20;
    const itemSize = 200;

    const randomX =
      boxLayout.x +
      boxPadding +
      Math.random() * (boxLayout.width - itemSize - boxPadding * 2);

    // Y position start from 50% of box height to ensure items drop deeper
    const minDepthPercentage = 0.9; // 90% of box height
    const availableHeight = boxLayout.height - itemSize - boxPadding * 2;
    const minYOffset = availableHeight * minDepthPercentage;

    const randomY =
      boxLayout.y + boxPadding + Math.random() * (availableHeight - minYOffset);

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
      }, 600);
    }
  };

  const getItemCount = (itemId: string) => {
    return itemCountRef.current[itemId] || 0;
  };

  const clearAnimatedItems = () => {
    setAnimatedItems([]);
    itemCountRef.current = {};
  };

  const incrementItemCount = (itemId: string) => {
    itemCountRef.current[itemId] = (itemCountRef.current[itemId] || 0) + 1;
  };

  const decrementItemCount = (itemId: string) => {
    if (itemCountRef.current[itemId] && itemCountRef.current[itemId] > 0) {
      itemCountRef.current[itemId]--;
    }
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

        previewMode,
        startPreview,
        stopPreview,

        listItemLayouts,
        setListItemLayout,
        incrementItemCount,
        decrementItemCount,
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
