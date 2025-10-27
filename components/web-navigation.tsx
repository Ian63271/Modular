import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { usePathname, useRouter } from "expo-router";

const HEADER_COLOR = "#b04570";

const NAV_LINKS = [
  { label: "Inicio", href: "/" },
  { label: "Voluntariados", href: "/voluntariados" },
  { label: "Talleres", href: "/talleres" },
  { label: "Unidades", href: "/unidades" },
] as const;

const NORMALIZE = (path: string) => {
  if (!path) {
    return "/";
  }
  if (path.length > 1 && path.endsWith("/")) {
    return path.slice(0, -1);
  }
  return path;
};

export function WebNavigation() {
  if (Platform.OS !== "web") {
    return null;
  }

  const pathname = NORMALIZE(usePathname() ?? "/");
  const router = useRouter();

  return (
    <View style={styles.navBar}>
      {NAV_LINKS.map((link) => {
        const targetPath = NORMALIZE(link.href);
        const isActive = pathname === targetPath;

        return (
          <Pressable
            key={link.href}
            accessibilityRole="link"
            accessibilityState={{ selected: isActive }}
            style={[styles.navButton, isActive && styles.navButtonActive]}
            onPress={() => {
              if (!isActive) {
                router.push(link.href);
              }
            }}
          >
            <Text style={[styles.navText, isActive && styles.navTextActive]}>{link.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  navBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  navButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 18,
  },
  navButtonActive: {
    backgroundColor: "#f2d7e3",
  },
  navText: {
    color: HEADER_COLOR,
    fontSize: 14,
    fontWeight: "500",
  },
  navTextActive: {
    color: HEADER_COLOR,
  },
});
