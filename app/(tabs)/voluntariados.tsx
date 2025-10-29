import { useEffect, useMemo, useState } from "react";
import {
  Image,
  Modal,
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
import { useRouter } from "expo-router";
import { WebNavigation } from "../../components/web-navigation";

const HEADER_COLOR = "#b04570";
const BORDER_COLOR = "#c7a6c0";
const TEXT_PRIMARY = "#2f3542";
const TEXT_SECONDARY = "#4d5866";
const PROGRAM_DISCLAIMER =
  "Este programa es público, ajeno a cualquier partido político. Queda prohibido el uso para fines distintos a los establecidos en el programa.";

const EVENTS = [
  {
    id: "reforestacion",
    title: "Reforestación Cerro del 4",
    organization: "Gil & Gil",
    verified: true,
    date: "08/06/2025",
    distanceKm: 4,
    icon: "leaf" as const,
    summary: "Jornada comunitaria para replantar especies nativas y recuperar zonas verdes del Cerro del 4.",
    meetupPoint: "Punto de reunión: Parque Miravalle, entrada principal.",
    contact: "Contacto: coordinacion@gilgilyasociados.org",
    image: require("../../assets/images/originales/WhatsApp_Image_2025-03-18_at_11.29.34_PM-removebg-preview.png"),
    showDisclaimer: true,
  },
  {
    id: "alimentos",
    title: "Entrega de víveres Col. Las Juntas",
    organization: "Iglesia Cristiana Agape Miravalle",
    verified: false,
    date: "01/04/2025",
    distanceKm: 6,
    icon: "people-circle" as const,
    summary: "Recolección y entrega de despensas para familias de la colonia Las Juntas.",
    meetupPoint: "Centro comunitario Agape, Calle Solidaridad #210.",
    contact: "Contacto: 33 1234 5678",
    image: require("../../assets/images/originales/WhatsApp_Image_2025-03-18_at_11.29.34_PM-removebg-preview.png"),
    showDisclaimer: false,
  },
  {
    id: "limpieza",
    title: "Limpieza y recuperación Río Las Aguas",
    organization: "Vecinos Unidos",
    verified: true,
    date: "15/05/2025",
    distanceKm: 2,
    icon: "trash" as const,
    summary: "Actividad para limpiar la ribera del río, retirar escombros y plantar barreras vegetales para evitar la erosión.",
    meetupPoint: "Puente La Piedad, junto al paradero.",
    contact: "voluntariado@vecinosunidos.mx",
    image: require("../../assets/images/originales/WhatsApp_Image_2025-03-18_at_11.29.34_PM-removebg-preview.png"),
    showDisclaimer: true,
  },
  {
    id: "tutorias",
    title: "Tutorías para jóvenes - Centro Comunitario",
    organization: "Fundación Aprender",
    verified: false,
    date: "21/04/2025",
    distanceKm: 9,
    icon: "school" as const,
    summary: "Programa de apoyo escolar para estudiantes de secundaria con énfasis en matemáticas y lectura.",
    meetupPoint: "Centro Comunitario, aula 3 (segundo piso).",
    contact: "contacto@aprender.org",
    image: require("../../assets/images/originales/WhatsApp_Image_2025-03-18_at_11.29.34_PM-removebg-preview.png"),
    showDisclaimer: false,
  },
  {
    id: "donacion_sangre",
    title: "Donación de sangre - Banco Móvil",
    organization: "Cruz Roja Delegación",
    verified: true,
    date: "30/04/2025",
    distanceKm: 12,
    icon: "heart" as const,
    summary: "Unidad móvil para donación voluntaria de sangre. Se requiere registro previo y cumplir requisitos de salud.",
    meetupPoint: "Estacionamiento del Mercado Central.",
    contact: "33 9876 5432",
    image: require("../../assets/images/originales/WhatsApp_Image_2025-03-18_at_11.29.34_PM-removebg-preview.png"),
    showDisclaimer: true,
  },
  {
    id: "apoyo_mayores",
    title: "Acompañamiento a adultos mayores",
    organization: "Red de Apoyo Social",
    verified: false,
    date: "10/06/2025",
    distanceKm: 7,
    icon: "people" as const,
    summary: "Visitas domiciliarias para compañía, apoyo con compras y trámites a personas mayores en situación de vulnerabilidad.",
    meetupPoint: "Casa del Voluntariado, recepción.",
    contact: "apoyo@redapoyo.org",
    image: require("../../assets/images/originales/WhatsApp_Image_2025-03-18_at_11.29.34_PM-removebg-preview.png"),
    showDisclaimer: false,
  },
] as const;

type EventItem = (typeof EVENTS)[number];

export default function VoluntariadosScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [radius, setRadius] = useState(10);
  const [showRadiusModal, setShowRadiusModal] = useState(false);
  const [dismissedRadius, setDismissedRadius] = useState<number | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [previewEvent, setPreviewEvent] = useState<EventItem | null>(null);

  const eventCardWidth = useMemo(() => Math.min(width - 24, 720), [width]);
  const filteredEvents = useMemo(() => EVENTS.filter((item) => item.distanceKm <= radius), [radius]);
  const nearestDistance = useMemo<number | null>(() => {
    const distances = EVENTS.map((event) => event.distanceKm);
    return distances.length ? Math.min(...distances) : null;
  }, []);

  const incrementRadius = () => setRadius((value) => Math.min(value + 1, 99));
  const decrementRadius = () => setRadius((value) => Math.max(value - 1, 1));

  useEffect(() => {
    if (filteredEvents.length > 0) {
      setShowRadiusModal(false);
      setDismissedRadius(null);
      return;
    }

    if (dismissedRadius !== radius) {
      setShowRadiusModal(true);
    }
  }, [filteredEvents.length, radius, dismissedRadius]);

  const handleDismissModal = () => {
    setDismissedRadius(radius);
    setShowRadiusModal(false);
  };

  const handleExpandSearch = () => {
    const nearest = nearestDistance ?? radius;
    const suggestedRadius = Math.max(nearest, radius + 5);
    setDismissedRadius(null);
    setRadius(Math.min(Math.ceil(suggestedRadius), 99));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={HEADER_COLOR} />

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

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingHorizontal: Math.max((width - eventCardWidth) / 2, 12) }]}
      >
        <Text style={styles.screenTitle}>Voluntariados</Text>

        {filteredEvents.length > 0 ? (
          <View style={[styles.eventList, { width: eventCardWidth }]}>
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onOpenDetails={setSelectedEvent}
                onPreviewImage={setPreviewEvent}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="location-outline" size={140} color="#7a7a7a" />
            <Text style={styles.emptyMessage}>
              No se encontró ningún programa en el radio seleccionado [{" "}
              <Text style={styles.emptyMessageStrong}>{radius} km</Text>
              ].
            </Text>
            <Text style={styles.emptyPrompt}>¿Desea ampliar rango de búsqueda?</Text>
            <View style={styles.emptyActions}>
              <TouchableOpacity style={[styles.emptyButton, styles.emptyButtonPrimary]} onPress={handleExpandSearch}>
                <Text style={styles.emptyButtonPrimaryText}>Aceptar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.emptyButton, styles.emptyButtonSecondary]} onPress={handleDismissModal}>
                <Text style={styles.emptyButtonSecondaryText}>Regresar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
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

      <Modal
        visible={showRadiusModal}
        animationType="slide"
        transparent
        statusBarTranslucent
        onRequestClose={handleDismissModal}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Ionicons name="location-outline" size={120} color="#666" />
            <Text style={styles.modalMessage}>
              No se encontró ningún programa dentro del radio seleccionado [{" "}
              <Text style={styles.emptyMessageStrong}>{radius} km</Text>
              ].
            </Text>
            <Text style={styles.modalPrompt}>¿Desea ampliar el rango de búsqueda?</Text>
            <View style={styles.emptyActions}>
              <TouchableOpacity style={[styles.emptyButton, styles.emptyButtonPrimary]} onPress={handleExpandSearch}>
                <Text style={styles.emptyButtonPrimaryText}>Aceptar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.emptyButton, styles.emptyButtonSecondary]} onPress={handleDismissModal}>
                <Text style={styles.emptyButtonSecondaryText}>Regresar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <EventDetailsModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      <EventImageModal event={previewEvent} onClose={() => setPreviewEvent(null)} />
    </SafeAreaView>
  );
}

function EventCard({
  event,
  onOpenDetails,
  onPreviewImage,
}: {
  event: EventItem;
  onOpenDetails: (event: EventItem) => void;
  onPreviewImage: (event: EventItem) => void;
}) {
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
        <TouchableOpacity
          style={styles.eventActionChip}
          accessibilityRole="button"
          accessibilityLabel={`Ver imagen de ${event.title}`}
          onPress={() => onPreviewImage(event)}
        >
          <Ionicons name="image" size={20} color={TEXT_PRIMARY} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.eventActionChip}
          accessibilityRole="button"
          accessibilityLabel={`Ver detalles de ${event.title}`}
          onPress={() => onOpenDetails(event)}
        >
          <Ionicons name="document-text" size={20} color={TEXT_PRIMARY} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function EventDetailsModal({ event, onClose }: { event: EventItem | null; onClose: () => void }) {
  return (
    <Modal visible={Boolean(event)} animationType="slide" transparent statusBarTranslucent onRequestClose={onClose}>
      <View style={styles.detailsBackdrop}>
        <View style={styles.detailsCard}>
          {event && (
            <>
              <Text style={styles.detailsTitle}>{event.title}</Text>
              <View style={styles.detailsSection}>
                <Ionicons name={event.icon} size={40} color={HEADER_COLOR} style={styles.detailsIcon} />
                <View style={styles.detailsTextGroup}>
                  <Text style={styles.detailsLabel}>Organiza:</Text>
                  <Text style={styles.detailsValue}>{event.organization}</Text>
                  <Text style={styles.detailsLabel}>Fecha:</Text>
                  <Text style={styles.detailsValue}>{event.date}</Text>
                </View>
              </View>
              <Text style={styles.detailsSummary}>{event.summary}</Text>
              <Text style={styles.detailsSecondary}>{event.meetupPoint}</Text>
              <Text style={styles.detailsSecondary}>{event.contact}</Text>
              {event.showDisclaimer && <Text style={styles.detailsDisclaimer}>{PROGRAM_DISCLAIMER}</Text>}
              <TouchableOpacity style={styles.detailsCloseButton} onPress={onClose} accessibilityRole="button">
                <Text style={styles.detailsCloseText}>Cerrar</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

function EventImageModal({ event, onClose }: { event: EventItem | null; onClose: () => void }) {
  return (
    <Modal visible={Boolean(event)} animationType="fade" transparent statusBarTranslucent onRequestClose={onClose}>
      <View style={styles.imageModalBackdrop}>
        <View style={styles.imageModalCard}>
          {event && (
            <>
              <Image source={event.image} style={styles.imageModalImage} resizeMode="contain" />
              <Text style={styles.imageModalCaption}>{event.title}</Text>
              <TouchableOpacity style={styles.imageModalCloseButton} onPress={onClose} accessibilityRole="button">
                <Text style={styles.imageModalCloseText}>Cerrar</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
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
    marginTop: 24,
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
  emptyState: {
    alignItems: "center",
    marginTop: 32,
    paddingHorizontal: 16,
  },
  emptyMessage: {
    marginTop: 20,
    fontSize: 16,
    textAlign: "center",
    color: TEXT_SECONDARY,
    lineHeight: 24,
  },
  emptyMessageStrong: {
    color: TEXT_PRIMARY,
    fontWeight: "700",
  },
  emptyPrompt: {
    marginTop: 8,
    fontSize: 15,
    color: TEXT_SECONDARY,
    textAlign: "center",
  },
  emptyActions: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  emptyButton: {
    minWidth: 120,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 8,
  },
  emptyButtonPrimary: {
    backgroundColor: HEADER_COLOR,
  },
  emptyButtonSecondary: {
    backgroundColor: "#dcdde3",
  },
  emptyButtonPrimaryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  emptyButtonSecondaryText: {
    color: HEADER_COLOR,
    fontSize: 16,
    fontWeight: "700",
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
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalCard: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 28,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 10,
  },
  modalMessage: {
    marginTop: 16,
    fontSize: 16,
    color: TEXT_PRIMARY,
    textAlign: "center",
    lineHeight: 24,
  },
  modalPrompt: {
    marginTop: 8,
    fontSize: 14,
    color: TEXT_SECONDARY,
    textAlign: "center",
  },
  detailsBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  detailsCard: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 28,
    gap: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 10,
  },
  detailsTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: TEXT_PRIMARY,
    textAlign: "center",
  },
  detailsSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  detailsIcon: {
    backgroundColor: "#f7f0f4",
    borderRadius: 20,
    padding: 10,
  },
  detailsTextGroup: {
    flex: 1,
    gap: 6,
  },
  detailsLabel: {
    fontSize: 13,
    color: TEXT_SECONDARY,
  },
  detailsValue: {
    fontSize: 16,
    fontWeight: "600",
    color: TEXT_PRIMARY,
  },
  detailsSummary: {
    fontSize: 15,
    color: TEXT_PRIMARY,
    lineHeight: 22,
  },
  detailsSecondary: {
    fontSize: 14,
    color: TEXT_SECONDARY,
  },
  detailsDisclaimer: {
    fontSize: 12,
    color: TEXT_SECONDARY,
    fontStyle: "italic",
    textAlign: "center",
  },
  detailsCloseButton: {
    marginTop: 8,
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: HEADER_COLOR,
  },
  detailsCloseText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  imageModalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  imageModalCard: {
    width: "100%",
    maxWidth: 500,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
    gap: 16,
  },
  imageModalImage: {
    width: "100%",
    height: 260,
    borderRadius: 12,
  },
  imageModalCaption: {
    fontSize: 16,
    fontWeight: "600",
    color: TEXT_PRIMARY,
    textAlign: "center",
  },
  imageModalCloseButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: HEADER_COLOR,
  },
  imageModalCloseText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});

