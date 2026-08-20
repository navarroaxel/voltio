/**
 * TP2 "Circuitos Acoplados" — nameplate and test setup data (assignment
 * sheet, "Material a utilizar"). There is no measured-data table yet: the
 * lab hasn't been run, so every reading is entered live by the student on
 * each part's page instead of being hardcoded here (see PART_A/PART_B in
 * measured-data.ts for the TP1 pattern this intentionally departs from).
 */
export const TRANSFORMER_NAMEPLATE = {
  brand: "Virason",
  power: "2000 kVA", // as transcribed from the assignment sheet
  primary: "2 x 110 V",
  secondary: "2 x 63,5 V",
  current: "15,8 A",
} as const;

/** Mains frequency used in every AC test of this assignment. */
export const F_LINEA = 50; // Hz
