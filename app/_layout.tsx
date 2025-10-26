import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const HEADER_COLOR = "#b04570";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" />
        <Stack> 
          <Stack.Screen 
            name="(tabs)" 
            options={{ 
              headerShown: false,
            }} 
          />
            <Stack.Screen name="+not-found" options={{}}/>
        </Stack>
    </>
  );
}
