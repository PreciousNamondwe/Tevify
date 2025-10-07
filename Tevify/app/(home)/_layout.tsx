import { Tabs } from "expo-router";
import React from "react";
import { HapticTab } from "@/components/haptic-tab";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Platform } from "react-native";

import { HomeIcon } from "@/components/icons/HomeIcon";
import { FeedIcon } from "@/components/icons/FeedIcon";
import { SearchIcon } from "@/components/icons/SearchIcon";
import { LibraryIcon } from "@/components/icons/LibraryIcon";
import { PlaylistIcon } from "@/components/icons/PlaylistIcon";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#1DB954",
        tabBarInactiveTintColor: isDark ? "rgba(255, 255, 255, 0.6)" : "rgba(0, 0, 0, 0.6)",
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: isDark ? "rgba(20, 20, 20, 0.9)" : "rgba(255, 255, 255, 0.9)",
          borderTopWidth: 0,
          elevation: 0,
          position: "absolute",
          bottom: 0,
          left: 20,
          right: 20,
          height: 65,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
          marginBottom: Platform.OS === "ios" ? 0 : 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <HomeIcon color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="feed"
        options={{
          title: "Feed",
          tabBarIcon: ({ color, size }) => <FeedIcon color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color, size }) => <SearchIcon color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: "Library",
          tabBarIcon: ({ color, size }) => <LibraryIcon color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="playlist"
        options={{
          title: "Playlist",
          tabBarIcon: ({ color, size }) => <PlaylistIcon color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}