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
      }} />    
      <Tabs.Screen name="voluntariados" options={{
        title: "Voluntariados",
        tabBarIcon: ({ focused, color}) =>
        <Ionicons 
          name= { focused ? "people-sharp" : "people-outline"} 
          size={30} 
          color={color}/>,
      }} />
      <Tabs.Screen name="talleres" options={{
        title: "Talleres",
        tabBarIcon: ({ focused, color}) =>
        <Ionicons 
          name= { focused ? "brush-sharp" : "brush-outline"} 
          size={30} 
          color={color}/>,
      }} />
      <Tabs.Screen name="unidades" options={{
        title: "Unidades",
        tabBarIcon: ({ focused, color}) =>
        <Ionicons 
          name= { focused ? "heart-circle-sharp" : "heart-circle-outline"} 
          size={30} 
          color={color}/>,
      }} />
    </Tabs>
  );
}
