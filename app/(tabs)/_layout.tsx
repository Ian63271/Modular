import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

const HEADER_COLOR = "#b04570";

export default function TabsLayout() {
  return (
    <Tabs 
    screenOptions={{
      tabBarActiveTintColor: HEADER_COLOR,
      headerShown: false,
      tabBarStyle: { borderTopColor: HEADER_COLOR },
    }}> 
      <Tabs.Screen name="index" options={{
        title: "Inicio",
        tabBarIcon: ({ focused, color}) => 
        <Ionicons 
          name= { focused ? "home-sharp" : "home-outline"} 
          size={30} 
          color={color}/>,
      }} 
      />    
      <Tabs.Screen name="about" options={{
        title: "Acerca de",
        tabBarIcon: ({ focused, color}) => 
        <Ionicons 
          name= { focused ? "information-circle-sharp" : "information-circle-outline"} 
          size={30} 
          color={color}/>,
      }} />
    </Tabs>
  );
}
