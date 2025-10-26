import { useState } from "react";
import {
  Dimensions,
  FlatList,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";

const HEADER_COLOR = "#b04570";

const navItems = ["Home", "About", "Features", "Pricing", "Contact Us"] as const;

const carouselItems = [
  {
    id: "1",
    title: "Colecta de alimentos",
    subtitle: "Apoya la iniciativa [Caritas]",
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "2",
    title: "Brigadas de salud",
    subtitle: "Jornadas comunitarias",
    image:
      "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "3",
    title: "Clases de arte",
    subtitle: "Programas para todas las edades",
    image:
      "https://images.unsplash.com/photo-1508182311256-e3f7d753c783?auto=format&fit=crop&w=1400&q=80",
  },
];

const actionButtons = [
  {
    id: "volunteers",
    label: "Voluntariados",
    icon: "people-outline" as const,
  },
  {
    id: "workshops",
    label: "Talleres",
    icon: "brush-outline" as const,
  },
  {
    id: "dropoff",
    label: "Unidades\nreceptoras",
    icon: "heart-circle-outline" as const,
  },
];

export default function Index() {
  const [activeNav, setActiveNav] = useState<typeof navItems[number]>("Home");

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={HEADER_COLOR} />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <View style={styles.brandContainer}>
            <View style={styles.logoBadge}>
              <Ionicons name="hand-left" size={24} color="#fff" />
            </View>
            <Text style={styles.brandText}>Unidades Receptoras</Text>
          </View>
          <TouchableOpacity style={styles.searchButton} activeOpacity={0.8}>
            <Ionicons name="search" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.navBar}>
          {navItems.map((item) => {
            const isActive = activeNav === item;
            return (
              <TouchableOpacity
                key={item}
                accessibilityRole="button"
                accessibilityState={{ selected: isActive }}
                onPress={() => setActiveNav(item)}
                style={[styles.navButton, isActive && styles.navButtonActive]}
              >
                <Text style={[styles.navText, isActive && styles.navTextActive]}>{item}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.carouselContainer}>
          <FlatList
            data={carouselItems}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <ImageBackground source={{ uri: item.image }} style={styles.carouselImage}>
                <View style={styles.carouselOverlay}>
                  <Text style={styles.carouselTitle}>{item.title}</Text>
                  <Text style={styles.carouselSubtitle}>{item.subtitle}</Text>
                </View>
              </ImageBackground>
            )}
          />
        </View>
            
        <View style={styles.actionSection}>
          {actionButtons.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.actionButton}
              activeOpacity={0.85}
              onPress={() => {
                // Navigation placeholder for future screens.
              }}
            >
              <View style={styles.actionIconWrapper}>
                <Ionicons name={action.icon} size={28} color={HEADER_COLOR} />
              </View>
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: HEADER_COLOR,
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    paddingBottom: 32,
  },
  header: {
    backgroundColor: HEADER_COLOR,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  brandContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  brandText: {
    marginLeft: 12,
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },
  logoBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
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
  carouselContainer: {
    marginTop: 12,
    height: width * 0.5,
  },
  carouselImage: {
    width: width - 32,
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  carouselOverlay: {
    backgroundColor: "rgba(176, 69, 112, 0.55)",
    padding: 16,
  },
  carouselTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  carouselSubtitle: {
    color: "#fff",
    fontSize: 14,
    marginTop: 4,
  },
  actionSection: {
    marginTop: 24,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 16,
  },
  actionButton: {
    alignItems: "center",
  },
  actionIconWrapper: {
    marginBottom: 12,
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 4,
    borderColor: HEADER_COLOR,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionLabel: {
    color: HEADER_COLOR,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
});

