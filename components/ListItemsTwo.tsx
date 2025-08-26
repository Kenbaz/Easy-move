import { useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { Trash2, PlusCircle } from "lucide-react-native";
import { useState, useRef } from "react";
import { useAnimation } from "../context/AnimatedContext";

// Type definitions
type ItemId = "bed2" | "mattress2" | "pillow2" | "blanket2" | "wardrobe2";

interface ListItem {
  id: ItemId;
  title: string;
  image: any; // For require() assets
}

type ItemCounts = Record<ItemId, number>;

export default function ListItemsTwo() {
  // State to manage counters for each item
  const [itemCounts, setItemCounts] = useState<ItemCounts>({
    bed2: 0,
    mattress2: 0,
    pillow2: 0,
    blanket2: 0,
    wardrobe2: 0,
  });

  const {
    addAnimatedItem,
    removeAnimatedItem,
    previewMode,
    setListItemLayout,
    getItemCount,
  } = useAnimation();
  const itemRefs = useRef<Record<string, View | null>>({});

  // Sample data for the list items
  const listItems: ListItem[] = [
    {
      id: "bed2",
      title: "King Size Bed",
      image: require("../assets/images/image (1).png"),
    },
    {
      id: "mattress2",
      title: "Orthopedic Mattress",
      image: require("../assets/images/image (2).png"),
    },
    {
      id: "pillow2",
      title: "Luxury Pillows",
      image: require("../assets/images/image (3).png"),
    },
    {
      id: "blanket2",
      title: "Weighted Blankets",
      image: require("../assets/images/image (4).png"),
    },
    {
      id: "wardrobe2",
      title: "Walk-in Wardrobe",
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
  };

  // Function to decrement item count
  const decrementItem = (itemId: ItemId) => {
    removeAnimatedItem(itemId);
  };

  const renderListItem = (item: ListItem) => {
    const count = getItemCount(item.id);

    return (
      <View
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
      </View>
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
