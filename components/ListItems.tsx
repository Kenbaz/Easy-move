import { useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { Trash2, PlusCircle } from "lucide-react-native";
import { useState, useRef } from "react";
import { useAnimation } from "../context/AnimatedContext";
import Animated from "react-native-reanimated";

// Type definitions
type ItemId = "bed" | "mattress" | "pillow" | "blanket" | "wardrobe";

interface ListItem {
  id: ItemId;
  title: string;
  image: any; // For require() assets
}

type ItemCounts = Record<ItemId, number>;

export default function ListItems() {
  // State to manage counters for each item
  const [itemCounts, setItemCounts] = useState<ItemCounts>({
    bed: 0,
    mattress: 0,
    pillow: 0,
    blanket: 0,
    wardrobe: 0,
  });

  const {
    addAnimatedItem,
    removeAnimatedItem,
    previewMode,
    setListItemLayout,
  } = useAnimation();
  const itemRefs = useRef<Record<string, View | null>>({});

  // Sample data for the list items
  const listItems: ListItem[] = [
    {
      id: "bed",
      title: "Single Bed & Mattresses",
      image: require("../assets/images/image (1).png"),
    },
    {
      id: "mattress",
      title: "Memory Foam Mattress",
      image: require("../assets/images/image (2).png"),
    },
    {
      id: "pillow",
      title: "Comfortable Pillows",
      image: require("../assets/images/image (3).png"),
    },
    {
      id: "blanket",
      title: "Soft Blankets",
      image: require("../assets/images/image (4).png"),
    },
    {
      id: "wardrobe",
      title: "Bedroom Wardrobe",
      image: require("../assets/images/image (4).png"),
    },
  ];

  // NEW: Measure list item positions for preview animation
  const measureListItemPosition = (item: ListItem) => {
    const itemRef = itemRefs.current[item.id];
    if (itemRef) {
      itemRef.measureInWindow((x, y, width, height) => {
        setListItemLayout(item.id, { x, y, width, height });
      });
    }
  };

  // Measure positions on mount and when preview mode changes
  useEffect(() => {
    const timer = setTimeout(() => {
      listItems.forEach(measureListItemPosition);
    }, 100);
    return () => clearTimeout(timer);
  }, [previewMode]);

  // Function to increment item count with animation
  const incrementItem = (item: ListItem) => {
    // Get the position of the item for animation start point
    const itemRef = itemRefs.current[item.id];
    if (itemRef) {
      itemRef.measureInWindow((x, y, width, height) => {
        // Add animated item with starting position
        addAnimatedItem({
          itemId: item.id,
          title: item.title,
          image: item.image,
          startPosition: {
            x: x + 10,
            y: y + height / 2 - 20,
          },
        });
      });
    }

    setItemCounts((prev) => ({
      ...prev,
      [item.id]: prev[item.id] + 1,
    }));
  };

  // Function to decrement item count
  const decrementItem = (itemId: ItemId) => {
    removeAnimatedItem(itemId);

    setItemCounts((prev) => ({
      ...prev,
      [itemId]: Math.max(0, prev[itemId] - 1),
    }));
  };

  const renderListItem = (item: ListItem) => {
    const count = itemCounts[item.id];

    return (
      <Animated.View
        key={item.id}
        style={[styles.list]}
        ref={(ref) => {
          itemRefs.current[item.id] = ref as any;
          // Measure when ref is set
          if (ref) {
            setTimeout(() => measureListItemPosition(item), 50);
          }
        }}
      >
        <View className="flex-row items-center justify-between">
          {/* Left side: Image and Description */}
          <View className="flex-row items-center gap-2 flex-1">
            <Image
              source={item.image}
              className="rounded-[50px]"
              style={{ width: 36, height: 36 }}
              resizeMode="cover"
            />
            <Text className="text-sm font-semibold tracking-normal text-gray-800 flex-1">
              {item.title}
            </Text>
          </View>

          {/* Right side: Counter or Plus button */}
          <View className="flex-row items-center">
            {count > 0 ? (
              // Show decrement, counter, and increment when count > 0
              <View className="flex-row items-center gap-2">
                <TouchableOpacity
                  onPress={() => decrementItem(item.id)}
                  className="w-8 h-8 rounded-full items-center justify-center"
                  activeOpacity={0.7}
                >
                  <Trash2 width={20} height={20} />
                </TouchableOpacity>

                <View className="h-8 items-center justify-center">
                  <Text className="text-sm font-semibold text-gray-800">
                    {count}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => incrementItem(item)}
                  className="w-8 h-8 rounded-full items-center justify-center"
                  activeOpacity={0.7}
                >
                  <PlusCircle width={20} height={20} />
                </TouchableOpacity>
              </View>
            ) : (
              // Show plus button when count is 0
              <TouchableOpacity
                onPress={() => incrementItem(item)}
                className="w-8 h-8 rounded-full items-center justify-center"
                activeOpacity={0.7}
              >
                <PlusCircle width={20} height={20} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <View className="flex-1">
      <View>{listItems.map(renderListItem)}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingVertical: 11,
    paddingLeft: 16,
    paddingRight: 20,
  },
});
