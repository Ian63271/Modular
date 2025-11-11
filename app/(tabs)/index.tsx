import { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  ImageBackground,
  Modal,
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

const HEADER_COLOR = "#508ccb";
const AUTO_SCROLL_INTERVAL = 5000;
const CARD_ASPECT_RATIO = 0.56;
const MAX_CARD_WIDTH = 720;
const MIN_CARD_WIDTH = 260;
const MIN_CARD_HEIGHT = 180;
const TEXT_PRIMARY = "#2f3542";
const TEXT_SECONDARY = "#4d5866";

const carouselItems = [
  {
    id: "1",
    title: "Colecta de alimentos",
    subtitle: "Apoya la iniciativa [Caritas]",
    image:
      require("../../assets/images/index/1.png"),
  },
  {
    id: "2",
    title: "Brigadas de salud",
    subtitle: "Jornadas comunitarias",
    image:
      require("../../assets/images/index/2.png"),
  },
  {
    id: "3",
    title: "Clases de arte",
    subtitle: "Programas para todas las edades",
    image:
      require("../../assets/images/index/3.png"),
  },
];

const TOTAL_SLIDES = carouselItems.length;

const interestAreas = [
  { id: "environment", label: "Medio ambiente" },
  { id: "education", label: "Educación" },
  { id: "health", label: "Salud" },
  { id: "arts", label: "Arte y cultura" },
  { id: "community", label: "Comunidad" },
] as const;

const scheduleOptions = [
  { id: "weekday", label: "Entre semana" },
  { id: "weekend", label: "Fines de semana" },
  { id: "mixed", label: "Horarios mixtos" },
] as const;

const communicationOptions = [
  { id: "email", label: "Correo electrónico" },
  { id: "phone", label: "WhatsApp / Teléfono" },
  { id: "inapp", label: "Notificaciones dentro de la app" },
] as const;

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
  const [interestModalVisible, setInterestModalVisible] = useState(false);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [preferredSchedule, setPreferredSchedule] = useState<string | null>(null);
  const [communicationChoice, setCommunicationChoice] = useState<string | null>(null);

  useEffect(() => {
    if (isWeb && typeof document !== "undefined") {
      document.title = "Conexión Social";
    }
  }, [isWeb]);

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

  const toggleArea = useCallback((id: string) => {
    setSelectedAreas((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  const resetInterestForm = useCallback(() => {
    setSelectedAreas([]);
    setPreferredSchedule(null);
    setCommunicationChoice(null);
  }, []);

  const closeInterestModal = useCallback((resetSelections: boolean) => {
    if (resetSelections) {
      resetInterestForm();
    }
    setInterestModalVisible(false);
  }, [resetInterestForm]);

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
              <Image
                source={require("../../assets/images/originales/logo blanco.png")}
                style={styles.logoImage}
                resizeMode="contain"
              />
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
                  source={item.image}
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

        <View style={[styles.interestSection, { width: cardWidth }]}>
          <TouchableOpacity
            style={styles.interestButton}
            activeOpacity={0.9}
            onPress={() => setInterestModalVisible(true)}
            accessibilityRole="button"
            accessibilityLabel="Responder preguntas sobre intereses"
          >
            <View style={styles.interestIconBubble}>
              <Ionicons name="options-outline" size={24} color={HEADER_COLOR} />
            </View>
            <View style={styles.interestCopy}>
              <Text style={styles.interestTitle}>¿Qué tipo de proyectos te interesan?</Text>
              <Text style={styles.interestSubtitle}>
                Responde unas preguntas rápidas para personalizar tus recomendaciones.
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={HEADER_COLOR} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={interestModalVisible}
        animationType="slide"
        transparent
        statusBarTranslucent
  onRequestClose={() => closeInterestModal(false)}
      >
        <View style={styles.interestBackdrop}>
          <View style={styles.interestCard}>
            <ScrollView contentContainerStyle={styles.interestContent}>
              <Text style={styles.interestHeading}>Cuéntanos de tus intereses</Text>

              <View style={styles.interestBlock}>
                <Text style={styles.interestQuestion}>¿En qué áreas te gustaría participar?</Text>
                <View style={styles.chipGrid}>
                  {interestAreas.map((area) => {
                    const isSelected = selectedAreas.includes(area.id);
                    return (
                      <TouchableOpacity
                        key={area.id}
                        style={[styles.chip, isSelected && styles.chipSelected]}
                        onPress={() => toggleArea(area.id)}
                        accessibilityRole="checkbox"
                        accessibilityState={{ checked: isSelected }}
                      >
                        <Text style={[styles.chipLabel, isSelected && styles.chipLabelSelected]}>
                          {area.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <View style={styles.interestBlock}>
                <Text style={styles.interestQuestion}>¿Qué horarios se adaptan mejor a ti?</Text>
                <View style={styles.optionColumn}>
                  {scheduleOptions.map((option) => {
                    const isSelected = preferredSchedule === option.id;
                    return (
                      <TouchableOpacity
                        key={option.id}
                        style={[styles.optionRow, isSelected && styles.optionRowSelected]}
                        onPress={() => setPreferredSchedule(option.id)}
                        accessibilityRole="radio"
                        accessibilityState={{ checked: isSelected }}
                      >
                        <Ionicons
                          name={isSelected ? "radio-button-on" : "radio-button-off"}
                          size={20}
                          color={isSelected ? HEADER_COLOR : "#8a96a5"}
                        />
                        <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <View style={styles.interestBlock}>
                <Text style={styles.interestQuestion}>¿Cómo prefieres recibir novedades?</Text>
                <View style={styles.optionColumn}>
                  {communicationOptions.map((option) => {
                    const isSelected = communicationChoice === option.id;
                    return (
                      <TouchableOpacity
                        key={option.id}
                        style={[styles.optionRow, isSelected && styles.optionRowSelected]}
                        onPress={() => setCommunicationChoice(option.id)}
                        accessibilityRole="radio"
                        accessibilityState={{ checked: isSelected }}
                      >
                        <Ionicons
                          name={isSelected ? "radio-button-on" : "radio-button-off"}
                          size={20}
                          color={isSelected ? HEADER_COLOR : "#8a96a5"}
                        />
                        <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <View style={styles.summaryBox}>
                <Text style={styles.summaryHeading}>Tu selección hasta ahora</Text>
                <Text style={styles.summaryLine}>
                  Áreas favoritas: {selectedAreas.length > 0 ? selectedAreas.map((areaId) => {
                    const found = interestAreas.find((area) => area.id === areaId);
                    return found ? found.label : areaId;
                  }).join(", ") : "Sin preferencias"}
                </Text>
                <Text style={styles.summaryLine}>
                  Horario ideal: {preferredSchedule ? scheduleOptions.find((item) => item.id === preferredSchedule)?.label : "Sin definir"}
                </Text>
                <Text style={styles.summaryLine}>
                  Canal de contacto: {communicationChoice ? communicationOptions.find((item) => item.id === communicationChoice)?.label : "Sin definir"}
                </Text>
                <Text style={styles.summaryHint}>Puedes ajustar tus respuestas cuando quieras.</Text>
              </View>
            </ScrollView>

            <View style={styles.interestActions}>
              <TouchableOpacity
                style={[styles.interestActionButton, styles.interestActionSecondary]}
                onPress={resetInterestForm}
                accessibilityRole="button"
              >
                <Text style={styles.interestActionSecondaryText}>Limpiar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.interestActionButton, styles.interestActionPrimary]}
                onPress={() => closeInterestModal(true)}
                accessibilityRole="button"
              >
                <Text style={styles.interestActionPrimaryText}>Listo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  logoImage: {
    width: 26,
    height: 26,
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
    backgroundColor: "rgba(80, 140, 203, 0.55)",
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
    borderColor: "rgba(80,140,203,0.35)",
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
  interestSection: {
    marginTop: 32,
    alignSelf: "center",
  },
  interestButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    borderWidth: 1,
    borderColor: "rgba(80,140,203,0.28)",
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 16,
    backgroundColor: "#f2f8ff",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
    gap: 16,
  },
  interestIconBubble: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(80,140,203,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  interestCopy: {
    flex: 1,
    gap: 4,
  },
  interestTitle: {
    color: TEXT_PRIMARY,
    fontSize: 16,
    fontWeight: "700",
  },
  interestSubtitle: {
    color: TEXT_SECONDARY,
    fontSize: 13,
    lineHeight: 18,
  },
  interestBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  interestCard: {
    width: "100%",
    maxWidth: 560,
    maxHeight: "88%",
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 12,
  },
  interestContent: {
    padding: 24,
    gap: 24,
  },
  interestHeading: {
    fontSize: 20,
    fontWeight: "700",
    color: TEXT_PRIMARY,
    textAlign: "center",
  },
  interestBlock: {
    gap: 14,
  },
  interestQuestion: {
    fontSize: 15,
    fontWeight: "600",
    color: TEXT_PRIMARY,
  },
  chipGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(80,140,203,0.35)",
    backgroundColor: "#fff",
  },
  chipSelected: {
    backgroundColor: "rgba(80,140,203,0.18)",
    borderColor: HEADER_COLOR,
  },
  chipLabel: {
    fontSize: 13,
    color: TEXT_SECONDARY,
  },
  chipLabelSelected: {
    color: HEADER_COLOR,
    fontWeight: "600",
  },
  optionColumn: {
    gap: 10,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(80,140,203,0.22)",
    backgroundColor: "#fff",
  },
  optionRowSelected: {
    borderColor: HEADER_COLOR,
    backgroundColor: "rgba(80,140,203,0.14)",
  },
  optionLabel: {
    fontSize: 14,
    color: TEXT_SECONDARY,
  },
  optionLabelSelected: {
    color: HEADER_COLOR,
    fontWeight: "600",
  },
  summaryBox: {
    marginTop: 6,
    borderRadius: 14,
    backgroundColor: "#f4f8fc",
    padding: 16,
    gap: 8,
  },
  summaryHeading: {
    fontSize: 15,
    fontWeight: "700",
    color: TEXT_PRIMARY,
  },
  summaryLine: {
    fontSize: 13,
    color: TEXT_SECONDARY,
    lineHeight: 18,
  },
  summaryHint: {
    marginTop: 4,
    fontSize: 12,
    color: TEXT_SECONDARY,
    fontStyle: "italic",
  },
  interestActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 18,
    borderTopWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    backgroundColor: "#fafbfd",
    gap: 16,
  },
  interestActionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  interestActionSecondary: {
    borderWidth: 1,
    borderColor: HEADER_COLOR,
    marginRight: 12,
  },
  interestActionSecondaryText: {
    color: HEADER_COLOR,
    fontSize: 15,
    fontWeight: "600",
  },
  interestActionPrimary: {
    backgroundColor: HEADER_COLOR,
  },
  interestActionPrimaryText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});

