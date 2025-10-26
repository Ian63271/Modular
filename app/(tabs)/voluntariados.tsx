import { useMemo, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const HEADER_COLOR = "#b04570";
const BORDER_COLOR = "#c7a6c0";
const TEXT_PRIMARY = "#2f3542";
const TEXT_SECONDARY = "#4d5866";
const CHIP_BG = "#f2d7e3";
const NAV_ITEMS = ["Home", "About", "Features", "Pricing", "Contact us"] as const;

const EVENTS = [
  {
    id: "reforestacion",
    title: "Reforestación Cerro del 4",
    organization: "Gil & Gil",
    verified: true,
    date: "08/06/2025",
    distanceKm: 4,
    icon: "leaf" as const,
  },
  {
    id: "alimentos",
    title: "Entrega de víveres Col. Las Juntas",
    organization: "Iglesia Cristiana Agape Miravalle",
    verified: false,
    date: "01/04/2025",
    distanceKm: 6,
    icon: "people-circle" as const,
  },
] as const;

type NavItem = (typeof NAV_ITEMS)[number];
type EventItem = (typeof EVENTS)[number];

export default function VoluntariadosScreen() {
  const { width } = useWindowDimensions();
  const [activeNav, setActiveNav] = useState<NavItem>("Home");
  const [radius, setRadius] = useState(10);

  const eventCardWidth = useMemo(() => Math.min(width - 24, 720), [width]);

  const incrementRadius = () => setRadius((value) => Math.min(value + 1, 99));
  const decrementRadius = () => setRadius((value) => Math.max(value - 1, 1));

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={HEADER_COLOR} />

      <View style={styles.header}>
        <View style={styles.brandContainer}>
          <View style={styles.logoBadge}>
            <Ionicons name="hand-left" size={24} color="#fff" />
          </View>
          <Text style={styles.brandText}>Conexión Social</Text>
        </View>
        <TouchableOpacity style={styles.searchButton} activeOpacity={0.8}>
          <Ionicons name="search" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.navBar}>
        {NAV_ITEMS.map((item) => {
          const isActive = activeNav === item;
          return (
            <TouchableOpacity
              key={item}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
              style={[styles.navButton, isActive && styles.navButtonActive]}
              onPress={() => setActiveNav(item)}
            >
              <Text style={[styles.navText, isActive && styles.navTextActive]}>{item}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingHorizontal: Math.max((width - eventCardWidth) / 2, 12) }]}
      >
        <Text style={styles.screenTitle}>Voluntariados</Text>

        <View style={[styles.eventList, { width: eventCardWidth }]}>
          {EVENTS.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </View>
      </ScrollView>

      <View style={styles.mapOverlay} pointerEvents="box-none">
        <View style={styles.mapMarker}>
          <Ionicons name="location" size={26} color="#fff" />
        </View>
        <View style={styles.radiusControl}>
          <View style={styles.radiusValueBox}>
            <Text style={styles.radiusValue}>{radius.toString().padStart(2, "0")}</Text>
            <Text style={styles.radiusUnit}>km</Text>
          </View>
          <View style={styles.radiusButtons}>
            <TouchableOpacity
              style={[styles.radiusButton, styles.radiusButtonSecondary]}
              onPress={decrementRadius}
              accessibilityRole="button"
              accessibilityLabel="Reducir radio"
            >
              <Text style={styles.radiusButtonText}>-</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.radiusButton, styles.radiusButtonPrimary]}
              onPress={incrementRadius}
              accessibilityRole="button"
              accessibilityLabel="Ampliar radio"
            >
              <Text style={styles.radiusButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

function EventCard({ event }: { event: EventItem }) {
  return (
    <View style={styles.eventCard}>
      <View style={styles.eventIconWrapper}>
        <Ionicons name={event.icon} size={36} color={TEXT_PRIMARY} />
      </View>

      <View style={styles.eventInfo}>
        <Text style={styles.eventTitle}>{event.title}</Text>
        <View style={styles.eventOrganizationRow}>
          <Text style={styles.eventOrganization}>{event.organization}</Text>
          {event.verified && (
            <Ionicons
              name="checkmark-circle"
              size={16}
              color="#4c91f7"
              style={styles.eventVerifiedIcon}
            />
          )}
        </View>
        <View style={styles.eventMetaRow}>
          <View style={styles.eventMetaItem}>
            <Ionicons name="calendar" size={14} color={TEXT_SECONDARY} />
            <Text style={styles.eventMetaText}>{event.date}</Text>
          </View>
          <View style={styles.eventMetaItem}>
            <Ionicons name="navigate" size={14} color={TEXT_SECONDARY} />
            <Text style={styles.eventMetaText}>{event.distanceKm} km</Text>
          </View>
        </View>
      </View>

      <View style={styles.eventActions}>
        <TouchableOpacity style={styles.eventActionChip} accessibilityRole="button">
          <Ionicons name="image" size={20} color={TEXT_PRIMARY} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.eventActionChip} accessibilityRole="button">
          <Ionicons name="document-text" size={20} color={TEXT_PRIMARY} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: HEADER_COLOR,
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
    backgroundColor: CHIP_BG,
  },
  navText: {
    color: HEADER_COLOR,
    fontSize: 14,
    fontWeight: "500",
  },
  navTextActive: {
    color: HEADER_COLOR,
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    paddingBottom: 120,
    gap: 24,
  },
  screenTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: TEXT_PRIMARY,
    textAlign: "center",
  },
  eventList: {
    alignSelf: "center",
    gap: 18,
  },
  eventCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    borderRadius: 12,
    padding: 16,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  eventIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: TEXT_PRIMARY,
  },
  eventOrganizationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  eventOrganization: {
    fontSize: 13,
    color: TEXT_PRIMARY,
  },
  eventVerifiedIcon: {
    marginLeft: 6,
  },
  eventMetaRow: {
    flexDirection: "row",
    gap: 16,
    marginTop: 8,
  },
  eventMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  eventMetaText: {
    fontSize: 13,
    color: TEXT_SECONDARY,
  },
  eventActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginLeft: 16,
  },
  eventActionChip: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e8ecf3",
  },
  mapOverlay: {
    position: "absolute",
    right: 24,
    bottom: 32,
    alignItems: "center",
    gap: 12,
  },
  mapMarker: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: HEADER_COLOR,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  radiusControl: {
    alignItems: "center",
    gap: 8,
  },
  radiusValueBox: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    backgroundColor: "#fff",
    minWidth: 72,
    gap: 6,
  },
  radiusValue: {
    fontSize: 18,
    fontWeight: "700",
    color: TEXT_PRIMARY,
  },
  radiusUnit: {
    fontSize: 12,
    fontWeight: "600",
    color: TEXT_SECONDARY,
  },
  radiusButtons: {
    flexDirection: "row",
    gap: 8,
  },
  radiusButton: {
    width: 40,
    height: 32,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  radiusButtonSecondary: {
    backgroundColor: "#b45a7a",
  },
  radiusButtonPrimary: {
    backgroundColor: HEADER_COLOR,
  },
  radiusButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});

