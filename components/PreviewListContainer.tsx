import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAnimation } from "../context/AnimatedContext";
import { Ionicons } from "@expo/vector-icons";

// Define all possible items (from both ListItems and ListItemsTwo)
const ALL_ITEMS = [
  // From ListItems
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
  // From ListItemsTwo
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

const HEADER_HEIGHT = 55;
const GAP_HEIGHT = 23;

const PreviewListContainer: React.FC = () => {
  const { previewMode } = useAnimation();

  if (!previewMode) return null;

  return (
    <View style={styles.outerContainer}>
      <View style={styles.previewSpacer} />
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    marginHorizontal: "auto",
    alignItems: "center",
    justifyContent: "center",
    width: 401,
    borderWidth: 1,
    borderColor: "#E5E5E7",
    height: HEADER_HEIGHT,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    marginBottom: GAP_HEIGHT,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    fontWeight: "600",
    fontSize: 14,
  },
  previewSpacer: {
    height: 20,
  },
});

export default PreviewListContainer;
