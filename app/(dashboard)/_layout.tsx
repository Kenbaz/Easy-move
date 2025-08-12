import { Tabs } from "expo-router";
import {
  useColorScheme,
  StyleSheet,
  View,
  Text,
    Pressable,
  ViewStyle,
} from "react-native";
import { Colors } from "../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import Svg, { Defs, RadialGradient, Stop, Ellipse } from "react-native-svg";

// Radial Gradient Component
function RadialGradientOverlay({ style }: { style?: ViewStyle }) {
  return (
    <View style={style}>
      <Svg height="100%" width="100%" style={StyleSheet.absoluteFillObject}>
        <Defs>
          <RadialGradient id="grad" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#008E05" stopOpacity="1" />
            <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
          </RadialGradient>
        </Defs>
        <Ellipse cx="50%" cy="50%" rx="50%" ry="50%" fill="url(#grad)" />
      </Svg>
    </View>
  );
}

// Tab Bar Background Component
function TabBarBackground() {
  return <BlurView intensity={20} style={StyleSheet.absoluteFillObject} />;
}

// Custom Tab Bar Component with Top Gradient Overlay
function CustomTabBar({ state, descriptors, navigation }: { state: any; descriptors: any; navigation: any; }) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <View style={styles.tabBarContainer}>
      <BlurView intensity={20} style={styles.blurContainer}>
        <View style={styles.tabBar}>
          {state.routes.map((route: any, index: number) => {
            const { options } = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                  ? options.title
                  : route.name;

            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            return (
              <View key={route.key} style={styles.tabItem}>
                <Pressable onPress={onPress} style={styles.tabButton}>
                  {/* Tab Content (Icon + Text) */}
                  <View style={styles.tabContent}>
                    {options.tabBarIcon &&
                      options.tabBarIcon({
                        focused: isFocused,
                        color: isFocused ? "#008E05" : theme.iconColor,
                        size: 24,
                      })}
                    <Text
                      style={[
                        styles.tabLabel,
                        { color: isFocused ? "#008E05" : theme.iconColor },
                      ]}
                    >
                      {label}
                    </Text>
                  </View>

                  {/* Radial Gradient Overlay on Top Border (only when focused) */}
                  {isFocused && (
                    <RadialGradientOverlay style={styles.topGradientOverlay} />
                  )}
                </Pressable>
              </View>
            );
          })}
        </View>
      </BlurView>
    </View>
  );
}

export default function DashboardLayout() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#008E05",
        tabBarInactiveTintColor: theme.iconColor,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused, color }) => {
            return (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={24}
                color={color}
              />
            );
          },
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          title: "Services",
          tabBarIcon: ({ focused, color }) => {
            return (
              <Ionicons
                name={focused ? "settings" : "settings-outline"}
                size={24}
                color={color}
              />
            );
          },
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: "Activity",
          tabBarIcon: ({ focused, color }) => {
            return (
              <Ionicons
                name={focused ? "receipt" : "receipt-outline"}
                size={24}
                color={focused ? color : theme.iconColor}
              />
            );
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused, color }) => {
            return (
              <Ionicons
                name={focused ? "person" : "person-outline"}
                size={24}
                color={color}
              />
            );
          },
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  blurContainer: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  tabBar: {
    flexDirection: "row",
    height: 90,
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    overflow: "hidden",
  },
  tabItem: {
    flex: 1,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  tabContent: {
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1, // Ensure content stays above gradient
  },
  topGradientOverlay: {
    position: "absolute",
    top: -20,
    left: "20%", // Start from 20% to center it
    right: "20%", // End at 80% to center it
    height: 20, // Increased height for radial gradient visibility
    borderRadius: 10,
    zIndex: 0, // Higher z-index to appear on top
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: "500",
  },
});
