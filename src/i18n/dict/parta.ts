export const es: Record<string, string> = {
  "parta.eyebrow": "TP N°1 · Parte A",
  "parta.title": "RLC serie — se varía la capacidad C",
  "parta.header.source": "Fuente Variac a",
  "parta.header.constant": "constante.",

  "parta.resCondition.label": "Condición de resonancia (punto 6a):",
  "parta.resCondition.toResonateAt": "para resonar a",
  "parta.resCondition.needed": "se necesita C = 1/(ω²·L) =",
  "parta.resCondition.boxIntro":
    "La caja de capacitores llega sólo a ~64 µF (8 escalones × 8 µF), muy por debajo de eso, así que",
  "parta.resCondition.neverReaches": "el circuito nunca alcanza la resonancia",
  "parta.resCondition.testDetail": "en este ensayo: siempre es capacitivo",
  "parta.resCondition.noResonanceGrowth":
    "Al no resonar, la corriente sólo crece asintóticamente hacia",
  "parta.resCondition.lowQ":
    "y el factor de mérito a los 50 Hz de resonancia es muy bajo (Q ≈ 0,03), lo que da una curva chata y poco selectiva.",

  "parta.view.sweepC": "Barrido de C (ensayo medido)",
  "parta.view.sweepF": "Barrido de f (punto 6d)",

  "parta.card.pointMeasurement": "Punto de medición",
  "parta.card.phasor": "Diagrama fasorial (tensiones)",
  "parta.card.impedance": "Diagrama de impedancia",
  "parta.hint.openCapacitor": "capacitor abierto",

  "parta.sweepC.conclusionsCard": "Conclusiones (punto 6g)",
  "parta.sweepC.concl1":
    "La corriente medida crece con C pero nunca muestra un pico de resonancia: la capacidad disponible (~64 µF) queda muy por debajo de los ~",
  "parta.sweepC.concl2":
    "necesarios para resonar a 50 Hz. Tiende asintóticamente a",
  "parta.sweepC.concl3": "sin llegar a alcanzarla. Además",
  "parta.sweepC.concl4":
    "domina ampliamente sobre las reactancias (Q ≪ 1), por lo que la respuesta es apenas selectiva — consistente con lo que muestra la tabla medida.",

  "parta.sweepC.chartsCard": "Gráficos en función de C",
  "parta.sweepC.tableCard": "Tabla de valores medidos",
  "parta.chart.voltageLabel": "Tensión (V)",

  "parta.sweepF.info1": "Para el primer C de la tabla (C =",
  "parta.sweepF.info2": "la frecuencia de resonancia teórica es",
  "parta.sweepF.info3":
    "(punto 6c). El barrido toma 5 frecuencias por debajo y 5 por encima. Aun en f₀ el factor de mérito sigue siendo ≪ 1 (Q ≈",
  "parta.sweepF.info4":
    "), por lo que el pico de resonancia teórico es apenas pronunciado.",
  "parta.sweepF.pointCard": "Punto de cálculo",
  "parta.sweepF.chartsCard": "Gráficos en función de f",
  "parta.sweepF.tableCard": "Tabla del punto 6d (calculada)",
};

export const en: Record<string, string> = {
  "parta.eyebrow": "Assignment 1 · Part A",
  "parta.title": "Series RLC — sweeping capacitance C",
  "parta.header.source": "Variac source at",
  "parta.header.constant": "constant.",

  "parta.resCondition.label": "Resonance condition (point 6a):",
  "parta.resCondition.toResonateAt": "to resonate at",
  "parta.resCondition.needed": "you need C = 1/(ω²·L) =",
  "parta.resCondition.boxIntro":
    "The capacitor bank only reaches ~64 µF (8 steps × 8 µF), well below that value, so",
  "parta.resCondition.neverReaches": "the circuit never reaches resonance",
  "parta.resCondition.testDetail": "in this test: it is always capacitive",
  "parta.resCondition.noResonanceGrowth":
    "Since it never resonates, the current only grows asymptotically toward",
  "parta.resCondition.lowQ":
    "and the quality factor at the 50 Hz resonance is very low (Q ≈ 0.03), giving a flat, poorly selective curve.",

  "parta.view.sweepC": "C sweep (measured test)",
  "parta.view.sweepF": "f sweep (point 6d)",

  "parta.card.pointMeasurement": "Measurement point",
  "parta.card.phasor": "Phasor diagram (voltages)",
  "parta.card.impedance": "Impedance diagram",
  "parta.hint.openCapacitor": "open capacitor",

  "parta.sweepC.conclusionsCard": "Conclusions (point 6g)",
  "parta.sweepC.concl1":
    "The measured current grows with C but never shows a resonance peak: the available capacitance (~64 µF) is well below the ~",
  "parta.sweepC.concl2":
    "needed to resonate at 50 Hz. It tends asymptotically toward",
  "parta.sweepC.concl3": "without ever reaching it. Also,",
  "parta.sweepC.concl4":
    "dominates heavily over the reactances (Q ≪ 1), so the response is barely selective — consistent with what the measured table shows.",

  "parta.sweepC.chartsCard": "Charts as a function of C",
  "parta.sweepC.tableCard": "Table of measured values",
  "parta.chart.voltageLabel": "Voltage (V)",

  "parta.sweepF.info1": "For the first C in the table (C =",
  "parta.sweepF.info2": "the theoretical resonance frequency is",
  "parta.sweepF.info3":
    "(point 6c). The sweep takes 5 frequencies below and 5 above. Even at f₀ the quality factor remains ≪ 1 (Q ≈",
  "parta.sweepF.info4":
    "), so the theoretical resonance peak is barely pronounced.",
  "parta.sweepF.pointCard": "Calculation point",
  "parta.sweepF.chartsCard": "Charts as a function of f",
  "parta.sweepF.tableCard": "Table for point 6d (calculated)",
};
