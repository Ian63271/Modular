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

const UNITS = [
  {
    id: "imss-92",
    name: "IMSS CLINICA 92",
    address: "Av. Gobernador Curiel",
    distanceKm: 1.5,
    icon: "medkit" as const,
    contact: "33 *** *** **",
    notes: "Ubicacion: Av. Gobernador Curiel #123, Zona Industrial. Contacto disponible de 8:00 a 16:00 hrs.",
    programs: [
      {
        id: "blood-general",
        title: "Donacion de sangre (todas las tipologias)",
        coordinator: "Jefatura de Consultas",
        schedule: "Horarios multiples (consultar ficha informativa)",
        icon: "water" as const,
      },
      {
        id: "blood-type-a-neg",
        title: "Donacion de sangre tipo A negativo",
        coordinator: "Familia Sanchez Romero",
        schedule: "Horarios multiples (consultar ficha informativa)",
        icon: "water" as const,
      },
      {
        id: "medical-supplies",
        title: "Recepcion de insumos medicos",
        coordinator: "Unidad de Inventarios",
        schedule: "Martes 10:00 a.m. - 01:00 p.m.",
        icon: "medical" as const,
      },
    ],
  },
  {
    id: "caritas-miravalle",
    name: "Caritas Miravalle",
    address: "Sra. Conchita",
    distanceKm: 0.02,
    icon: "people-circle" as const,
    contact: "33 555 889 12",
    notes: "Ubicacion: Calle Solidaridad #45, Col. Miravalle. Contacto disponible de 9:00 a 17:00 hrs.",
    programs: [
      {
        id: "food-bank",
        title: "Recepcion de alimentos",
        coordinator: "Coordinacion de Acopio",
        schedule: "Lunes a viernes 9:00 a.m. - 5:00 p.m.",
        icon: "restaurant" as const,
      },
      {
        id: "family-support",
        title: "Atencion familiar integral",
        coordinator: "Equipo Psicosocial",
        schedule: "Citas bajo agenda",
        icon: "chatbubble-ellipses" as const,
      },
    ],
  },
] as const;

type UnitItem = (typeof UNITS)[number];
type ProgramItem = UnitItem["programs"][number];

export default function UnidadesScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [radius, setRadius] = useState(10);
  const [showRadiusModal, setShowRadiusModal] = useState(false);
  const [dismissedRadius, setDismissedRadius] = useState<number | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<UnitItem | null>(null);

  const cardWidth = useMemo(() => Math.min(width - 24, 720), [width]);
  const filteredUnits = useMemo(() => UNITS.filter((unit) => unit.distanceKm <= radius), [radius]);
  const nearestDistance = useMemo<number | null>(() => {
    const distances = UNITS.map((unit) => unit.distanceKm);
    return distances.length ? Math.min(...distances) : null;
  }, []);

  const incrementRadius = () => setRadius((value) => Math.min(value + 1, 99));
  const decrementRadius = () => setRadius((value) => Math.max(value - 1, 1));

  useEffect(() => {
    if (filteredUnits.length > 0) {
      setShowRadiusModal(false);
      setDismissedRadius(null);
      return;
    }

    if (dismissedRadius !== radius) {
      setShowRadiusModal(true);
    }
  }, [filteredUnits.length, radius, dismissedRadius]);

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
          <Text style={styles.brandText}>Conexion Social</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.searchButton} activeOpacity={0.8}>
          <Ionicons name="search" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <WebNavigation />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingHorizontal: Math.max((width - cardWidth) / 2, 12) }]}
      >
        <Text style={styles.screenTitle}>Unidades Receptoras</Text>

        {filteredUnits.length > 0 ? (
          <View style={[styles.unitList, { width: cardWidth }]}>
            {filteredUnits.map((unit) => (
              <UnitCard key={unit.id} unit={unit} onOpenDetails={setSelectedUnit} />
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="location-outline" size={140} color="#7a7a7a" />
            <Text style={styles.emptyMessage}>
              No se encontro ninguna unidad en el radio seleccionado [{" "}
              <Text style={styles.emptyMessageStrong}>{radius} km</Text>
              ].
            </Text>
            <Text style={styles.emptyPrompt}>¿Desea ampliar rango de busqueda?</Text>
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
              No se encontro ninguna unidad dentro del radio seleccionado [{" "}
              <Text style={styles.emptyMessageStrong}>{radius} km</Text>
              ].
            </Text>
            <Text style={styles.modalPrompt}>¿Desea ampliar el rango de busqueda?</Text>
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

      <UnitDetailsModal unit={selectedUnit} onClose={() => setSelectedUnit(null)} />
    </SafeAreaView>
  );
}

function UnitCard({ unit, onOpenDetails }: { unit: UnitItem; onOpenDetails: (unit: UnitItem) => void }) {
  return (
    <View style={styles.unitCard}>
      <View style={styles.unitIconWrapper}>
        <Ionicons name={unit.icon} size={36} color={TEXT_PRIMARY} />
      </View>

      <View style={styles.unitInfo}>
        <Text style={styles.unitTitle}>{unit.name}</Text>
        <View style={styles.unitMetaRow}>
          <Ionicons name="location" size={14} color={TEXT_SECONDARY} />
          <Text style={styles.unitMetaText}>{unit.address}</Text>
        </View>
        <View style={styles.unitMetaRow}>
          <Ionicons name="navigate" size={14} color={TEXT_SECONDARY} />
          <Text style={styles.unitMetaText}>{unit.distanceKm} km</Text>
        </View>
        <View style={styles.unitMetaRow}>
          <Ionicons name="call" size={14} color={TEXT_SECONDARY} />
          <Text style={styles.unitMetaText}>{unit.contact}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.detailsButton}
        accessibilityRole="button"
        accessibilityLabel={`Ver detalles de ${unit.name}`}
        onPress={() => onOpenDetails(unit)}
      >
        <Text style={styles.detailsButtonText}>Detalles</Text>
      </TouchableOpacity>
    </View>
  );
}

function UnitDetailsModal({ unit, onClose }: { unit: UnitItem | null; onClose: () => void }) {
  return (
    <Modal visible={Boolean(unit)} animationType="slide" transparent statusBarTranslucent onRequestClose={onClose}>
      <View style={styles.detailsBackdrop}>
        <View style={styles.detailsCard}>
          <ScrollView contentContainerStyle={styles.detailsContent}>
            {unit && (
              <View style={styles.detailsBody}>
                <Text style={styles.detailsTitle}>{unit.name}</Text>
                <View style={styles.detailsSummaryRow}>
                  <View style={styles.detailsBadge}>
                    <Ionicons name={unit.icon} size={34} color={HEADER_COLOR} />
                  </View>
                  <View style={styles.detailsMeta}>
                    <View style={styles.detailsMetaItem}>
                      <Ionicons name="location" size={18} color={TEXT_PRIMARY} />
                      <Text style={styles.detailsMetaText}>{unit.address}</Text>
                    </View>
                    <View style={styles.detailsMetaItem}>
                      <Ionicons name="navigate" size={18} color={TEXT_PRIMARY} />
                      <Text style={styles.detailsMetaText}>{unit.distanceKm} km</Text>
                    </View>
                    <View style={styles.detailsMetaItem}>
                      <Ionicons name="call" size={18} color={TEXT_PRIMARY} />
                      <Text style={styles.detailsMetaText}>{unit.contact}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.detailsNotesBox}>
                  <Text style={styles.detailsNotes}>{unit.notes}</Text>
                </View>

                <Text style={styles.programsHeading}>Programas</Text>

                <View style={styles.programList}>
                  {unit.programs.map((program: ProgramItem) => (
                    <View key={program.id} style={styles.programCard}>
                      <View style={styles.programIconWrapper}>
                        <Ionicons name={program.icon} size={28} color={TEXT_PRIMARY} />
                      </View>
                      <View style={styles.programInfo}>
                        <Text style={styles.programTitle}>{program.title}</Text>
                        <Text style={styles.programCoordinator}>{program.coordinator}</Text>
                        <Text style={styles.programSchedule}>{program.schedule}</Text>
                      </View>
                      <View style={styles.programActions}>
                        <TouchableOpacity style={styles.programActionChip} accessibilityRole="button">
                          <Ionicons name="image" size={20} color={TEXT_PRIMARY} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.programActionChip} accessibilityRole="button">
                          <Ionicons name="document-text" size={20} color={TEXT_PRIMARY} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </ScrollView>
          <TouchableOpacity style={styles.detailsCloseButton} onPress={onClose} accessibilityRole="button">
            <Text style={styles.detailsCloseText}>Cerrar</Text>
          </TouchableOpacity>
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
  unitList: {
    alignSelf: "center",
    gap: 18,
  },
  unitCard: {
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
    gap: 16,
  },
  unitIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    alignItems: "center",
    justifyContent: "center",
  },
  unitInfo: {
    flex: 1,
    gap: 6,
  },
  unitTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: TEXT_PRIMARY,
  },
  unitMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  unitMetaText: {
    fontSize: 13,
    color: TEXT_SECONDARY,
  },
  detailsButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: HEADER_COLOR,
  },
  detailsButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
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
    maxWidth: 640,
    maxHeight: "85%",
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingTop: 24,
    paddingBottom: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 16,
    elevation: 12,
  },
  detailsContent: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    gap: 20,
    paddingTop: 8,
  },
  detailsBody: {
    gap: 18,
  },
  detailsTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: TEXT_PRIMARY,
    textAlign: "center",
  },
  detailsSummaryRow: {
    flexDirection: "row",
    gap: 16,
    alignItems: "flex-start",
  },
  detailsBadge: {
    width: 60,
    height: 60,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f7f0f4",
  },
  detailsMeta: {
    flex: 1,
    gap: 8,
  },
  detailsMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailsMetaText: {
    fontSize: 14,
    color: TEXT_PRIMARY,
  },
  detailsNotesBox: {
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    borderRadius: 12,
    padding: 14,
    backgroundColor: "#faf5f7",
  },
  detailsNotes: {
    fontSize: 14,
    color: TEXT_SECONDARY,
    lineHeight: 20,
  },
  programsHeading: {
    fontSize: 18,
    fontWeight: "700",
    color: TEXT_PRIMARY,
  },
  programList: {
    gap: 16,
  },
  programCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    borderRadius: 12,
    padding: 14,
    backgroundColor: "#fff",
    gap: 14,
  },
  programIconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f1f4f9",
  },
  programInfo: {
    flex: 1,
    gap: 4,
  },
  programTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: TEXT_PRIMARY,
  },
  programCoordinator: {
    fontSize: 13,
    color: TEXT_PRIMARY,
  },
  programSchedule: {
    fontSize: 12,
    color: TEXT_SECONDARY,
  },
  programActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  programActionChip: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e6e9f2",
  },
  detailsCloseButton: {
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    alignSelf: "center",
  },
  detailsCloseText: {
    color: HEADER_COLOR,
    fontSize: 16,
    fontWeight: "700",
  },
});

