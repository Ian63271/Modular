import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { usePathname, useRouter } from "expo-router";

const HEADER_COLOR = "#508ccb";

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
            style={({ hovered }) => [
              styles.navButton,
              hovered && styles.navButtonHovered,
              isActive && styles.navButtonActive,
              hovered && isActive && styles.navButtonActiveHovered,
            ]}
            onPress={() => {
              if (!isActive) {
                router.push(link.href);
              }
            }}
          >
            {({ hovered }) => (
              <Text
                style={[
                  styles.navText,
                  isActive && styles.navTextActive,
                  hovered && styles.navTextHovered,
                ]}
              >
                {link.label}
              </Text>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  navBar: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 18,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  navButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 18,
    transitionDuration: "160ms",
    transitionProperty: "transform, background-color, box-shadow",
  },
  navButtonHovered: {
    transform: [{ scale: 1.05 }],
    backgroundColor: "#f2f8ff",
    shadowColor: "rgba(43, 92, 148, 0.35)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
  },
  navButtonActive: {
    backgroundColor: "#e1effa",
  },
  navButtonActiveHovered: {
    backgroundColor: "#d4e8ff",
  },
  navText: {
    color: HEADER_COLOR,
    fontSize: 14,
    fontWeight: "500",
  },
  navTextActive: {
    color: HEADER_COLOR,
  },
  navTextHovered: {
    color: "#2b5c94",
  },
});
