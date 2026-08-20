export const es: Record<string, string> = {
  "acopl.common.connection": "Conexión",
  "acopl.theory.badge": "TP N°2",
  "acopl.theory.title": "Circuitos acoplados",
  "acopl.theory.intro":
    "Ensayo de un transformador monofásico: determinación de las inductancias propias y mutuas, el coeficiente de acoplamiento, y la disposición de bornes homólogos entre los bobinados primario y secundario.",

  "acopl.theory.objectives.title": "Objetivos",
  "acopl.theory.objectives.item1":
    "Determinar las inductancias propias y mutuas, el coeficiente de acoplamiento de un transformador monofásico.",
  "acopl.theory.objectives.item2":
    "Determinar la disposición de bornes homólogos entre los bobinados primario y secundario del mismo transformador, utilizando diversos métodos de medición en corriente alterna y continua.",
  "acopl.theory.objectives.item3":
    "Calcular los valores de las magnitudes no medidas con las fórmulas teóricas y completar tablas.",
  "acopl.theory.objectives.item4":
    "Analizar las respuestas y sacar conclusiones de lo realizado.",

  "acopl.theory.summary.title": "Resumen teórico",
  "acopl.theory.summary.p1":
    "Dos bobinados devanados sobre un mismo núcleo (primario y secundario del transformador) presentan inductancia propia (L₁, L₂) e inductancia mutua (M). Despreciando la resistencia óhmica de los devanados, cada bobinado se comporta como una reactancia pura frente a la excitación alterna.",
  "acopl.theory.summary.p2":
    "Excitando el primario con tensión nominal (Conexión I) y midiendo I₁₀, U₁ y la tensión inducida U₂₀ en el secundario abierto, y luego excitando el secundario (Conexión II) con I₂₀, U₂ y U₁₀, se obtienen las cuatro magnitudes con las que se calculan L₁, L₂, M₁₂, M₂₁ y el coeficiente de acoplamiento K.",
  "acopl.theory.summary.p3":
    "El coeficiente de acoplamiento K = M/√(L₁·L₂) indica qué fracción del flujo de un bobinado atraviesa el otro; K = 1 es acoplamiento perfecto (todo el flujo es mutuo) y K = 0 es acoplamiento nulo.",
  "acopl.theory.summary.p4":
    "Los bornes homólogos son los que, conectados al mismo signo de tensión instantánea, producen flujos que se suman (polaridad aditiva). Determinarlos es indispensable para saber cómo conectar los bobinados en serie o en paralelo sin que sus fuerzas magnetomotrices se cancelen.",

  "acopl.theory.material.title": "Material a utilizar",
  "acopl.theory.material.item1":
    "1 Transformador monofásico marca Virason de 2000 kVA / 2×110 V – 2×63,5 V – 15,8 A.",
  "acopl.theory.material.item2":
    "1 Amperímetro analógico de corriente alterna, rangos 0,5 – 1 – 2 – 5 A.",
  "acopl.theory.material.item3":
    "1 Amperímetro analógico de corriente continua, escala 3 A.",
  "acopl.theory.material.item4":
    "2 Voltímetros analógicos de corriente alterna, escalas 60 – 120 – 240 – 480 V.",
  "acopl.theory.material.item5": "1 Téster.",
  "acopl.theory.material.item6": "1 Pila de 1,5 V.",

  "acopl.theory.nav.partA.tag": "Parte A",
  "acopl.theory.nav.partA.title": "Determinación de parámetros",
  "acopl.theory.nav.partA.desc": "L₁, L₂, M₁₂, M₂₁ y coeficiente de acoplamiento K.",
  "acopl.theory.nav.partB.tag": "Parte B",
  "acopl.theory.nav.partB.title": "Bornes homólogos",
  "acopl.theory.nav.partB.desc":
    "Métodos con corriente continua, con amperímetro y con voltímetros.",

  // ------------------------------------------------------------------
  // Part A — determinación de parámetros
  // ------------------------------------------------------------------
  "acopl.parta.eyebrow": "Parte A",
  "acopl.parta.title": "Determinación de parámetros",
  "acopl.parta.intro":
    "Se desprecia la resistencia óhmica de los bobinados. Ingresá las lecturas de cada ensayo — todavía no hay datos de laboratorio registrados — y los parámetros se calculan en vivo con ω = 2π·f, f = 50 Hz.",

  "acopl.parta.connI.title": "Conexión I — primario excitado",
  "acopl.parta.connI.desc":
    "Se lleva U₁ al valor nominal del bobinado primario y se mide la corriente I₁₀ y la tensión inducida U₂₀ en el secundario en vacío.",
  "acopl.parta.connII.title": "Conexión II — secundario excitado",
  "acopl.parta.connII.desc":
    "Se lleva U₂ al valor nominal del bobinado secundario y se mide la corriente I₂₀ y la tensión inducida U₁₀ en el primario en vacío.",

  "acopl.parta.results.title": "Parámetros calculados",
  "acopl.parta.results.check":
    "Debe cumplirse M₁₂ = M₂₁ (ambos son la misma inductancia mutua, medida por dos caminos distintos).",
  "acopl.parta.results.pending":
    "Completá las lecturas de ambas conexiones para calcular L₁, L₂, M₁₂, M₂₁ y K.",

  "acopl.parta.card.readings": "Lecturas",
  "acopl.parta.card.results": "Resultados",
  "acopl.parta.card.conclusions": "Conclusiones",
  "acopl.parta.conclusions.pending":
    "Todavía no hay lecturas para sacar conclusiones. Completá las tablas de ambas conexiones arriba.",
  "acopl.parta.conclusions.text":
    "Con las lecturas ingresadas, el transformador presenta un coeficiente de acoplamiento",
  "acopl.parta.conclusions.kPerfect": "acoplamiento prácticamente perfecto",
  "acopl.parta.conclusions.kStrong": "acoplamiento fuerte",
  "acopl.parta.conclusions.kWeak": "acoplamiento débil",
  "acopl.parta.conclusions.mConsistent":
    " (consistentes entre sí, como exige la teoría).",
  "acopl.parta.conclusions.mInconsistent":
    " — revisar las lecturas: deberían coincidir.",
  "acopl.parta.conclusions.with": "con",
  "acopl.parta.conclusions.and": "y",

  // ------------------------------------------------------------------
  // Part B — bornes homólogos
  // ------------------------------------------------------------------
  "acopl.partb.eyebrow": "Parte B",
  "acopl.partb.title": "Determinación de bornes homólogos",
  "acopl.partb.intro":
    "Se realizan hasta tres ensayos independientes para determinar qué bornes son homólogos; lo esperable es que los tres métodos coincidan.",

  "acopl.partb.method.dc": "Corriente continua",
  "acopl.partb.method.acAmmeter": "Amperímetro (C.A.)",
  "acopl.partb.method.acVoltmeter": "Voltímetros (C.A.)",

  "acopl.partb.dc.title": "5.2.1 — Método con corriente continua",
  "acopl.partb.dc.desc":
    "Se aplican los conceptos básicos de la Ley de Faraday-Lenz sobre la interacción entre corriente eléctrica e inducción magnética: al cerrar la llave del circuito, se observa el sentido de la deflexión del amperímetro de continua conectado al secundario.",
  "acopl.partb.dc.rule":
    "Si la aguja se desplaza en el sentido de la lectura, los bornes homólogos son los conectados a bornes del mismo signo. Si la deflexión es en sentido contrario, los homólogos son los conectados a bornes de signo opuesto.",
  "acopl.partb.dc.question": "Al cerrar la llave L, ¿la aguja se desplaza en el sentido de la lectura?",
  "acopl.partb.dc.yes": "Sí, se desplaza en el sentido de la lectura",
  "acopl.partb.dc.no": "No, se desplaza en sentido contrario",
  "acopl.partb.dc.resultYes":
    "Los bornes homólogos son los conectados a bornes del mismo signo: u con (+) de la pila y U con (+) del amperímetro (o v con U, según cómo se hayan conectado).",
  "acopl.partb.dc.resultNo":
    "Los bornes homólogos son los conectados a bornes de signo opuesto.",
  "acopl.partb.dc.pending": "Todavía no se registró el ensayo.",

  "acopl.partb.acAmmeter.title": "5.2.2.1 — Método con amperímetro",
  "acopl.partb.acAmmeter.desc":
    "Se pone en serie el bobinado primario y el secundario. Con la misma tensión aplicada, se mide la corriente total en la Conexión I y, permutando los bornes del secundario, en la Conexión II.",
  "acopl.partb.acAmmeter.case1":
    "Caso 1 — Si I(Conexión II) < I(Conexión I), la serie es aditiva en la Conexión II, y resultan ser homólogos los bornes unidos por el puente en la Conexión I.",
  "acopl.partb.acAmmeter.case2":
    "Caso 2 — Si I(Conexión II) > I(Conexión I), la serie es sustractiva en la Conexión II, y resultan ser homólogos los bornes unidos por el puente en la Conexión II.",
  "acopl.partb.acAmmeter.result.prefix": "Con estas lecturas, son homólogos los bornes puenteados en la",
  "acopl.partb.acAmmeter.pending": "Ingresá ambas corrientes para determinar el resultado.",
  "acopl.partb.acAmmeter.tie": "Las corrientes son iguales (o faltan datos): no se puede determinar.",

  "acopl.partb.acVoltmeter.title": "5.2.2.2 — Método de la tensión aplicada",
  "acopl.partb.acVoltmeter.desc":
    "Con tensión reducida en el lado de alta, se une un borne del primario con uno del secundario y se leen V₁, V₂ y V₃ (tensión entre los dos bornes libres).",
  "acopl.partb.acVoltmeter.case1":
    "Caso 1 — Si U₃ ≈ |U₁ − U₂|, los bornes puenteados SON homólogos: las tensiones de primario y secundario están en fase.",
  "acopl.partb.acVoltmeter.case2":
    "Caso 2 — Si U₃ ≈ U₁ + U₂, los bornes puenteados NO SON homólogos: las tensiones están desfasadas 180°.",
  "acopl.partb.acVoltmeter.result.homologous": "Con estas lecturas, los bornes puenteados en esta conexión SON homólogos.",
  "acopl.partb.acVoltmeter.result.notHomologous": "Con estas lecturas, los bornes puenteados en esta conexión NO SON homólogos.",
  "acopl.partb.acVoltmeter.pending": "Ingresá U₁, U₂ y U₃ para determinar el resultado.",

  "acopl.partb.summary.title": "Síntesis de los tres métodos",
  "acopl.partb.summary.pending": "Completá al menos un ensayo para ver la síntesis.",
};

export const en: Record<string, string> = {
  "acopl.common.connection": "Connection",
  "acopl.theory.badge": "Assignment 2",
  "acopl.theory.title": "Coupled circuits",
  "acopl.theory.intro":
    "Single-phase transformer test: determining self and mutual inductances, the coupling coefficient, and the homologous-terminal layout between the primary and secondary windings.",

  "acopl.theory.objectives.title": "Objectives",
  "acopl.theory.objectives.item1":
    "Determine the self and mutual inductances and the coupling coefficient of a single-phase transformer.",
  "acopl.theory.objectives.item2":
    "Determine the homologous-terminal layout between the primary and secondary windings of the same transformer, using several AC and DC measurement methods.",
  "acopl.theory.objectives.item3":
    "Calculate the unmeasured quantities with the theoretical formulas and fill in the tables.",
  "acopl.theory.objectives.item4":
    "Analyze the results and draw conclusions.",

  "acopl.theory.summary.title": "Theory summary",
  "acopl.theory.summary.p1":
    "Two windings on the same core (transformer primary and secondary) have self-inductance (L₁, L₂) and mutual inductance (M). Neglecting the ohmic resistance of the windings, each winding behaves as a pure reactance under AC excitation.",
  "acopl.theory.summary.p2":
    "Exciting the primary at rated voltage (Connection I) and measuring I₁₀, U₁ and the induced voltage U₂₀ across the open secondary, then exciting the secondary (Connection II) and measuring I₂₀, U₂ and U₁₀, gives the four quantities needed to compute L₁, L₂, M₁₂, M₂₁ and the coupling coefficient K.",
  "acopl.theory.summary.p3":
    "The coupling coefficient K = M/√(L₁·L₂) shows what fraction of one winding's flux links the other; K = 1 is perfect coupling (all flux is mutual) and K = 0 is no coupling.",
  "acopl.theory.summary.p4":
    "Homologous terminals are the ones that, connected to the same instantaneous voltage sign, produce fluxes that add (additive polarity). Finding them is essential to know how to series- or parallel-connect the windings without their magnetomotive forces canceling out.",

  "acopl.theory.material.title": "Equipment",
  "acopl.theory.material.item1":
    "1 Virason single-phase transformer, 2000 kVA / 2×110 V – 2×63.5 V – 15.8 A.",
  "acopl.theory.material.item2":
    "1 analog AC ammeter, ranges 0.5 – 1 – 2 – 5 A.",
  "acopl.theory.material.item3": "1 analog DC ammeter, 3 A scale.",
  "acopl.theory.material.item4":
    "2 analog AC voltmeters, scales 60 – 120 – 240 – 480 V.",
  "acopl.theory.material.item5": "1 multimeter.",
  "acopl.theory.material.item6": "1 1.5 V battery.",

  "acopl.theory.nav.partA.tag": "Part A",
  "acopl.theory.nav.partA.title": "Parameter determination",
  "acopl.theory.nav.partA.desc": "L₁, L₂, M₁₂, M₂₁ and coupling coefficient K.",
  "acopl.theory.nav.partB.tag": "Part B",
  "acopl.theory.nav.partB.title": "Homologous terminals",
  "acopl.theory.nav.partB.desc":
    "DC method, AC ammeter method, and AC voltmeter method.",

  // ------------------------------------------------------------------
  // Part A
  // ------------------------------------------------------------------
  "acopl.parta.eyebrow": "Part A",
  "acopl.parta.title": "Parameter determination",
  "acopl.parta.intro":
    "The ohmic resistance of the windings is neglected. Enter each test's readings — no lab data has been recorded yet — and the parameters are computed live with ω = 2π·f, f = 50 Hz.",

  "acopl.parta.connI.title": "Connection I — primary excited",
  "acopl.parta.connI.desc":
    "U₁ is set to the primary winding's rated voltage while measuring current I₁₀ and the induced voltage U₂₀ across the open secondary.",
  "acopl.parta.connII.title": "Connection II — secondary excited",
  "acopl.parta.connII.desc":
    "U₂ is set to the secondary winding's rated voltage while measuring current I₂₀ and the induced voltage U₁₀ across the open primary.",

  "acopl.parta.results.title": "Computed parameters",
  "acopl.parta.results.check":
    "M₁₂ = M₂₁ must hold (both are the same mutual inductance, measured two different ways).",
  "acopl.parta.results.pending":
    "Fill in both connections' readings to compute L₁, L₂, M₁₂, M₂₁ and K.",

  "acopl.parta.card.readings": "Readings",
  "acopl.parta.card.results": "Results",
  "acopl.parta.card.conclusions": "Conclusions",
  "acopl.parta.conclusions.pending":
    "No readings yet to draw conclusions from. Fill in both connections' tables above.",
  "acopl.parta.conclusions.text":
    "With the entered readings, the transformer has a coupling coefficient of",
  "acopl.parta.conclusions.kPerfect": "near-perfect coupling",
  "acopl.parta.conclusions.kStrong": "strong coupling",
  "acopl.parta.conclusions.kWeak": "weak coupling",
  "acopl.parta.conclusions.mConsistent":
    " (consistent with each other, as theory requires).",
  "acopl.parta.conclusions.mInconsistent":
    " — check the readings: they should match.",
  "acopl.parta.conclusions.with": "with",
  "acopl.parta.conclusions.and": "and",

  // ------------------------------------------------------------------
  // Part B
  // ------------------------------------------------------------------
  "acopl.partb.eyebrow": "Part B",
  "acopl.partb.title": "Homologous-terminal determination",
  "acopl.partb.intro":
    "Up to three independent tests determine which terminals are homologous; the three methods should agree.",

  "acopl.partb.method.dc": "DC",
  "acopl.partb.method.acAmmeter": "AC ammeter",
  "acopl.partb.method.acVoltmeter": "AC voltmeters",

  "acopl.partb.dc.title": "5.2.1 — DC method",
  "acopl.partb.dc.desc":
    "Basic Faraday-Lenz concepts about the interaction between electric current and magnetic induction apply: closing the switch, observe the deflection direction of the DC ammeter connected to the secondary.",
  "acopl.partb.dc.rule":
    "If the needle deflects in the reading direction, the homologous terminals are the ones connected to the same-sign terminals. If it deflects the other way, the homologous terminals are the ones connected to opposite-sign terminals.",
  "acopl.partb.dc.question": "When switch L closes, does the needle deflect in the reading direction?",
  "acopl.partb.dc.yes": "Yes, it deflects in the reading direction",
  "acopl.partb.dc.no": "No, it deflects the other way",
  "acopl.partb.dc.resultYes":
    "The homologous terminals are the ones connected to same-sign terminals: u with the battery's (+) and U with the ammeter's (+) (or v with U, depending on the wiring).",
  "acopl.partb.dc.resultNo":
    "The homologous terminals are the ones connected to opposite-sign terminals.",
  "acopl.partb.dc.pending": "The test hasn't been recorded yet.",

  "acopl.partb.acAmmeter.title": "5.2.2.1 — Ammeter method",
  "acopl.partb.acAmmeter.desc":
    "The primary and secondary windings are put in series. With the same applied voltage, the total current is measured for Connection I and, after swapping the secondary terminals, for Connection II.",
  "acopl.partb.acAmmeter.case1":
    "Case 1 — If I(Connection II) < I(Connection I), the series is additive in Connection II, and the terminals bridged in Connection I are homologous.",
  "acopl.partb.acAmmeter.case2":
    "Case 2 — If I(Connection II) > I(Connection I), the series is subtractive in Connection II, and the terminals bridged in Connection II are homologous.",
  "acopl.partb.acAmmeter.result.prefix": "With these readings, the bridged terminals in",
  "acopl.partb.acAmmeter.pending": "Enter both currents to determine the result.",
  "acopl.partb.acAmmeter.tie": "The currents are equal (or data is missing): can't be determined.",

  "acopl.partb.acVoltmeter.title": "5.2.2.2 — Applied-voltage method",
  "acopl.partb.acVoltmeter.desc":
    "With reduced voltage on the high side, one primary terminal is joined to one secondary terminal, and V₁, V₂ and V₃ (voltage between the two free terminals) are read.",
  "acopl.partb.acVoltmeter.case1":
    "Case 1 — If U₃ ≈ |U₁ − U₂|, the bridged terminals ARE homologous: the primary and secondary voltages are in phase.",
  "acopl.partb.acVoltmeter.case2":
    "Case 2 — If U₃ ≈ U₁ + U₂, the bridged terminals are NOT homologous: the voltages are 180° out of phase.",
  "acopl.partb.acVoltmeter.result.homologous": "With these readings, the terminals bridged in this connection ARE homologous.",
  "acopl.partb.acVoltmeter.result.notHomologous": "With these readings, the terminals bridged in this connection are NOT homologous.",
  "acopl.partb.acVoltmeter.pending": "Enter U₁, U₂ and U₃ to determine the result.",

  "acopl.partb.summary.title": "Summary across methods",
  "acopl.partb.summary.pending": "Fill in at least one test to see the summary.",
};
