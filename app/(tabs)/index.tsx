import { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  ImageBackground,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { WebNavigation } from "../../components/web-navigation";

const HEADER_COLOR = "#b04570";
const AUTO_SCROLL_INTERVAL = 5000;
const CARD_ASPECT_RATIO = 0.56;
const MAX_CARD_WIDTH = 720;
const MIN_CARD_WIDTH = 260;
const MIN_CARD_HEIGHT = 180;

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

const TOTAL_SLIDES = carouselItems.length;

const actionButtons = [
  {
    id: "volunteers",
    label: "Voluntariados",
    icon: "people-outline",
    href: "/(tabs)/voluntariados",
  },
  {
    id: "workshops",
    label: "Talleres",
    icon: "brush-outline",
    href: "/(tabs)/talleres",
  },
  {
    id: "dropoff",
    label: "Unidades\nreceptoras",
    icon: "heart-circle-outline",
    href: "/(tabs)/unidades",
  },
] as const;

type ActionButton = (typeof actionButtons)[number];

export default function Index() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const { width: rawWindowWidth } = useWindowDimensions();
  const windowWidth = Math.max(rawWindowWidth, 1);
  const cardWidth = Math.min(Math.max(windowWidth - 32, MIN_CARD_WIDTH), MAX_CARD_WIDTH);
  const cardHeight = Math.max(cardWidth * CARD_ASPECT_RATIO, MIN_CARD_HEIGHT);
  const flatListRef = useRef<FlatList<typeof carouselItems[number]>>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevWidthRef = useRef(windowWidth);
  const isWeb = Platform.OS === "web";

  const clearAutoScroll = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startAutoScroll = useCallback(() => {
    clearAutoScroll();
    if (TOTAL_SLIDES <= 1) {
      return;
    }

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        const nextIndex = (prev + 1) % TOTAL_SLIDES;
        flatListRef.current?.scrollToOffset({
          offset: windowWidth * nextIndex,
          animated: true,
        });
        return nextIndex;
      });
    }, AUTO_SCROLL_INTERVAL);
  }, [clearAutoScroll, windowWidth, TOTAL_SLIDES]);

  useEffect(() => {
    startAutoScroll();
    return clearAutoScroll;
  }, [startAutoScroll, clearAutoScroll]);

  useEffect(() => {
    if (prevWidthRef.current !== windowWidth) {
      flatListRef.current?.scrollToOffset({
        offset: windowWidth * currentIndex,
        animated: false,
      });
      prevWidthRef.current = windowWidth;
    }
  }, [windowWidth, currentIndex]);

  const handleScrollBeginDrag = useCallback(() => {
    clearAutoScroll();
  }, [clearAutoScroll]);

  const handleMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const viewWidth = event.nativeEvent.layoutMeasurement.width || windowWidth;
      const rawIndex = event.nativeEvent.contentOffset.x / viewWidth;
      const boundedIndex = Math.max(0, Math.min(TOTAL_SLIDES - 1, Math.round(rawIndex)));

      if (boundedIndex !== currentIndex) {
        setCurrentIndex(boundedIndex);
      }

      startAutoScroll();
    },
    [windowWidth, currentIndex, startAutoScroll, TOTAL_SLIDES]
  );

  const goToSlide = useCallback(
    (direction: number) => {
      if (TOTAL_SLIDES <= 1) {
        return;
      }

      const targetIndex = (currentIndex + direction + TOTAL_SLIDES) % TOTAL_SLIDES;
      clearAutoScroll();
      flatListRef.current?.scrollToOffset({
        offset: windowWidth * targetIndex,
        animated: true,
      });
      setCurrentIndex(targetIndex);
      startAutoScroll();
    },
    [currentIndex, windowWidth, clearAutoScroll, startAutoScroll, TOTAL_SLIDES]
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={HEADER_COLOR} />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.brandContainer}
            activeOpacity={0.8}
            accessibilityRole="link"
            onPress={() => router.push("/")}
          >
            <View style={styles.logoBadge}>
              <Ionicons name="hand-left" size={24} color="#fff" />
            </View>
            <Text style={styles.brandText}>Conexión Social</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.searchButton} activeOpacity={0.8}>
            <Ionicons name="search" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <WebNavigation />

  <View style={[styles.carouselContainer, { height: cardHeight }]}> 
          <FlatList
            ref={flatListRef}
            data={carouselItems}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScrollBeginDrag={handleScrollBeginDrag}
            onMomentumScrollEnd={handleMomentumScrollEnd}
            getItemLayout={(_, index) => ({ length: windowWidth, offset: windowWidth * index, index })}
            renderItem={({ item }) => (
              <View style={[styles.carouselSlide, { width: windowWidth }]}> 
                <ImageBackground
                  source={{ uri: item.image }}
                  style={[styles.carouselImage, { width: cardWidth, height: cardHeight }]}
                  imageStyle={styles.carouselImageBackground}
                  resizeMode="cover"
                >
                  <View style={styles.carouselOverlay}>
                    <Text style={styles.carouselTitle}>{item.title}</Text>
                    <Text style={styles.carouselSubtitle}>{item.subtitle}</Text>
                  </View>
                </ImageBackground>
              </View>
            )}
          />
          {isWeb && (
            <View style={styles.carouselArrows} pointerEvents="box-none">
              <TouchableOpacity
                accessibilityLabel="Previous highlight"
                accessibilityRole="button"
                style={styles.carouselArrowButton}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                onPress={() => goToSlide(-1)}
              >
                <Ionicons name="chevron-back" size={22} color={HEADER_COLOR} />
              </TouchableOpacity>
              <TouchableOpacity
                accessibilityLabel="Next highlight"
                accessibilityRole="button"
                style={styles.carouselArrowButton}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                onPress={() => goToSlide(1)}
              >
                <Ionicons name="chevron-forward" size={22} color={HEADER_COLOR} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={[styles.actionSection, { width: cardWidth }]}>
          {actionButtons.map((action: ActionButton) => (
            <Link key={action.id} href={action.href} asChild>
              <TouchableOpacity
                style={styles.actionButton}
                activeOpacity={0.85}
                accessibilityRole="button"
                accessibilityHint={`Ir a la sección ${action.label.replace("\n", " ")}`}
              >
                <View style={styles.actionIconWrapper}>
                  <Ionicons name={action.icon} size={28} color={HEADER_COLOR} />
                </View>
                <Text style={styles.actionLabel}>{action.label}</Text>
              </TouchableOpacity>
            </Link>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

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
  carouselContainer: {
    marginTop: 12,
    position: "relative",
    justifyContent: "center",
  },
  carouselSlide: {
    alignItems: "center",
    justifyContent: "center",
  },
  carouselImage: {
    borderRadius: 16,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  carouselImageBackground: {
    borderRadius: 16,
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
  carouselArrows: {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    transform: [{ translateY: -21 }],
  },
  carouselArrowButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.92)",
    borderWidth: 1,
    borderColor: "rgba(176,69,112,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  actionSection: {
    marginTop: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 24,
    alignSelf: "center",
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

