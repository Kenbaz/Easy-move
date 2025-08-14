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
}

interface AnimatedContextType {
    animatedItems: AnimatedItem[];
    boxLayout: LayoutRectangle | null;
    setBoxLayout: (layout: LayoutRectangle) => void;
    addAnimatedItem: (item: Omit<AnimatedItem, 'id' | 'timestamp' | 'endPosition'>) => void;
    removeAnimatedItem: (itemId: string) => void;
    getItemCount: (itemId: string) => number;
    clearAnimatedItems: () => void;
}

const AnimationContext = createContext<AnimatedContextType | undefined>(undefined);

export const AnimationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [animatedItems, setAnimatedItems] = useState<AnimatedItem[]>([]);
    const [boxLayout, setBoxLayout] = useState<LayoutRectangle | null>(null);
    const itemCountRef = useRef<Record<string, number>>({});

    const addAnimatedItem = (item: Omit<AnimatedItem, 'id' | 'timestamp' | 'endPosition'>) => {
        if (!boxLayout) return;

        // Update count
        itemCountRef.current[item.itemId] = (itemCountRef.current[item.itemId] || 0) + 1;

        // Calculate random end position within the box
        const boxPadding = 20;
        const itemSize = 200;

        const randomX = boxLayout.x + boxPadding + Math.random() * (boxLayout.width - itemSize - boxPadding * 2);
        const randomY = boxLayout.y + boxPadding + Math.random() * (boxLayout.height - itemSize - boxPadding * 2);
        
        // Adding rotation for natural scattered look in the box
        const randomRotation = (Math.random() - 0.5) * 30;
        
        const newItem: AnimatedItem = {
            ...item,
            id: `${item.itemId}_${Date.now()}_${Math.random()}`,
            timestamp: Date.now(),
            endPosition: { x: randomX, y: randomY },
        };

        setAnimatedItems(prev => [...prev, newItem]);
    };


    const removeAnimatedItem = (itemId: string) => {
        // Decrease count
        if (itemCountRef.current[itemId] && itemCountRef.current[itemId] > 0) {
            itemCountRef.current[itemId]--;

            // Remove the most recent item of this type
            setAnimatedItems(prev => {
                const itemsOfType = prev.filter(item => item.itemId === itemId);
                
                if (itemsOfType.length === 0) return prev;

                const mostRecentItem = itemsOfType.reduce((latest, current) => current.timestamp > latest.timestamp ? current : latest);

                return prev.filter((item) => item.id !== mostRecentItem.id);
            });
        }
    };

    const getItemCount = (itemId: string) => {
        return itemCountRef.current[itemId] || 0;
    };

    const clearAnimatedItems = () => {
        setAnimatedItems([]);
        itemCountRef.current = {};
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
            }}
        >
            {children}
        </AnimationContext.Provider>
    );
};


export const useAnimation = () => {
    const context = useContext(AnimationContext);
    if (!context) {
        throw new Error("useAnimation must be used within an AnimationProvider");
    }
    return context;
};