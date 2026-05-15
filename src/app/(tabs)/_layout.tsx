import { Tabs } from "expo-router";
import { Text } from "react-native";
import { colors, fonts } from "@/theme/tokens";

function TabLabel({ ko, focused }: { ko: string; focused: boolean }) {
  return (
    <Text
      style={{
        fontFamily: fonts.display,
        fontSize: 11,
        color: focused ? colors.ink : colors.inkSoft,
        marginTop: 2,
      }}
    >
      {ko}
    </Text>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.ink,
        tabBarInactiveTintColor: colors.inkSoft,
        tabBarStyle: {
          backgroundColor: colors.cream,
          borderTopColor: colors.line,
        },
      }}
    >
      <Tabs.Screen
        name="today/index"
        options={{
          title: "오늘",
          tabBarLabel: ({ focused }) => <TabLabel ko="오늘" focused={focused} />,
          tabBarIcon: () => null,
        }}
      />
      <Tabs.Screen
        name="journey/index"
        options={{
          title: "여정",
          tabBarLabel: ({ focused }) => <TabLabel ko="여정" focused={focused} />,
          tabBarIcon: () => null,
        }}
      />
      <Tabs.Screen
        name="cell/index"
        options={{
          title: "구역",
          tabBarLabel: ({ focused }) => <TabLabel ko="구역" focused={focused} />,
          tabBarIcon: () => null,
        }}
      />
      <Tabs.Screen
        name="self/index"
        options={{
          title: "나",
          tabBarLabel: ({ focused }) => <TabLabel ko="나" focused={focused} />,
          tabBarIcon: () => null,
        }}
      />
    </Tabs>
  );
}
