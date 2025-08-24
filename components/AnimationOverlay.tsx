import React, { useMemo } from "react";
import { View } from "react-native";
import { useAnimation } from "../context/AnimatedContext";
import AnimatedItemComponent from "./AnimatedItem";

const ROW_HEIGHT = 64;
const TOP_PADDING = 80; // leaves space for the preview header
const LEFT_MARGIN = 16;

interface Props {
  style?: any;
}

const AnimationOverlay: React.FC<Props> = ({ style }) => {
  const { animatedItems, boxLayout, previewMode } = useAnimation();

  const activeItems = useMemo(
    () => animatedItems.filter((i) => !i.isRemoving),
    [animatedItems]
  );

  const sortedForList = useMemo(
    () => [...activeItems].sort((a, b) => a.timestamp - b.timestamp),
    [activeItems]
  );

  // Get unique item types for preview ordering
  const uniqueItemsForPreview = useMemo(() => {
    if (!previewMode) return [];

    const itemsInBox = activeItems.reduce(
      (acc, item) => {
        if (!acc.find((i) => i.itemId === item.itemId)) {
          acc.push(item);
        }
        return acc;
      },
      [] as typeof activeItems
    );

    return itemsInBox.sort((a, b) => a.timestamp - b.timestamp);
  }, [activeItems, previewMode]);

  const bulkOffsetY = boxLayout ? boxLayout.height + 40 : 200;

  return (
    <View style={{ position: "absolute", ...style }} pointerEvents="none">
      {animatedItems.map((item) => {
        const index = sortedForList.findIndex((x) => x.id === item.id);
        const lineupPosition =
          index >= 0
            ? { x: LEFT_MARGIN, y: TOP_PADDING + index * ROW_HEIGHT }
            : undefined;

        // Calculate preview index based on unique items
        const previewIndex = previewMode
          ? uniqueItemsForPreview.findIndex(
              (uniqueItem) => uniqueItem.itemId === item.itemId
            )
          : 0;

        return (
          <AnimatedItemComponent
            key={item.id}
            {...item}
            isRemoving={item.isRemoving || false}
            previewMode={previewMode}
            bulkOffsetY={bulkOffsetY}
            lineupPosition={lineupPosition}
            previewIndex={previewIndex >= 0 ? previewIndex : 0}
            totalPreviewItems={uniqueItemsForPreview.length}
          />
        );
      })}
    </View>
  );
};

export default AnimationOverlay;
