export const es: Record<string, string> = {
  "tri.nav.ensayos": "Ensayos",
  "tri.nav.simulador": "Simulador",
  "tri.nav.cuestionario": "Cuestionario",

  // --- hub / teoría
  "tri.theory.badge": "TP N°3",
  "tri.theory.title": "Circuitos trifásicos",
  "tri.theory.intro":
    "Carga trifásica en estrella con y sin conductor neutro, equilibrada y desequilibrada con un capacitor en la fase S: diagramas fasoriales, desplazamiento del punto estrella y potencia por el método de Aron.",
  "tri.theory.nav.ens.title": "Ensayos medidos",
  "tri.theory.nav.ens.desc":
    "Las cuatro lecturas del informe (equilibrada / desequilibrada, con / sin neutro) con su diagrama fasorial y la comparación con el modelo.",
  "tri.theory.nav.sim.title": "Simulador",
  "tri.theory.nav.sim.desc":
    "Conectá o desconectá el neutro, elegí un capacitor o un inductor en la fase S y mirá cómo se corre el punto estrella.",
  "tri.theory.nav.quiz.title": "Cuestionario",
  "tri.theory.nav.quiz.desc":
    "Respuestas a las cuatro preguntas de la guía: potencia y Aron, efecto del capacitor, inductor, ventajas del neutro.",
  "tri.theory.objectives.title": "Objetivos",
  "tri.theory.objectives.item1":
    "Obtener los diagramas fasoriales completos de un circuito trifásico en conexión estrella, para distintos estados de carga.",
  "tri.theory.objectives.item2": "Comprender e interpretar dichos diagramas fasoriales.",
  "tri.theory.objectives.item3": "Responder el cuestionario.",
  "tri.theory.summary.title": "Resumen teórico",
  "tri.theory.summary.p1":
    "Un sistema trifásico son tres tensiones sinusoidales de igual frecuencia y, si está equilibrado, igual amplitud, desfasadas 120°. En la conexión estrella los extremos de las tres impedancias se unen en el punto estrella N', que puede o no conectarse al neutro n de la fuente.",
  "tri.theory.summary.p2":
    "En estrella equilibrada U_L = √3·U_F e I_L = I_F: con 380 V de línea, la tensión de fase es ≈ 220 V. Con tres impedancias iguales las corrientes tienen el mismo módulo, están desfasadas 120° y su suma es cero, por lo que no circula corriente por el neutro.",
  "tri.theory.summary.p3":
    "En una carga desequilibrada las impedancias difieren. Sin neutro, el punto estrella se desplaza respecto de n y las tensiones de fase dejan de ser iguales (teorema de Millman). Con neutro, N' queda fijo en el potencial de n y el desequilibrio aparece como corriente por el neutro, I_N = I_R + I_S + I_T.",
  "tri.theory.summary.p4":
    "La potencia activa total es la suma de las de las tres fases (P = 3·U_L·I_L·cos φ si es equilibrada). El método de Aron mide P = W1 + W2 con dos wattímetros en un sistema de tres conductores. Con neutro y desequilibrio la lectura puede dejar de ser válida.",
  "tri.theory.circuit.title": "Características del circuito",
  "tri.theory.circuit.item1": "Tensión de línea de 380 V.",
  "tri.theory.circuit.item2": "Banco de resistencias de 5 kW al 25 % (≈ 123 Ω por fase según el informe).",
  "tri.theory.circuit.item3":
    "Banco de capacitores de 2 × 8 µF en la fase S (16 µF, X_C ≈ 199 Ω), sólo para el caso desequilibrado, en paralelo con su resistencia.",
  "tri.theory.circuit.item4":
    "Aron: wattímetros en las fases R y T, con la fase S como común.",
  "tri.theory.method.title": "Método de trabajo",
  "tri.theory.method.item1":
    "Elegir instrumentos y armar el circuito sin tensión; revisar escalas (leer en el último tercio) y anotar los errores que puedan afectar la medición.",
  "tri.theory.method.item2":
    "Subir la tensión desde cero hasta el valor buscado verificando los instrumentos; leer sin error de paralaje.",
  "tri.theory.method.item3":
    "Anotar todos los valores del ensayo antes de desenergizar; bajar la tensión a cero, apagar los instrumentos y desarmar.",
  "tri.theory.source": "Datos transcriptos del informe del grupo (lab3.pdf).",

  // --- ensayos
  "tri.ens.eyebrow": "Ensayos medidos",
  "tri.ens.title": "Los cuatro estados de carga",
  "tri.ens.intro":
    "Lecturas del informe del grupo. Elegí un estado para ver su diagrama fasorial; las flechas azules son las tensiones de fase de la carga, las rojas las corrientes.",
  "tri.ens.case.label": "Estado de carga",
  "tri.ens.case.eq-sn": "Equilibrada, sin neutro",
  "tri.ens.case.eq-cn": "Equilibrada, con neutro",
  "tri.ens.case.des-sn": "Desequilibrada, sin neutro",
  "tri.ens.case.des-cn": "Desequilibrada, con neutro",
  "tri.ens.read.title": "Lecturas",
  "tri.ens.phasor.title": "Diagrama fasorial (medido)",
  "tri.ens.explain.title": "Qué pasó",
  "tri.ens.explain.eq-sn":
    "Con carga equilibrada las tres corrientes son iguales (1,8 A) y están en fase con sus tensiones, por ser la carga resistiva pura. La potencia es de 1240 W, con los dos wattímetros marcando lo mismo. La tensión entre el punto estrella y el neutro es de apenas 3,5 V, atribuible a la pequeña asimetría de la red (224 V en la fase T frente a 221 V).",
  "tri.ens.explain.eq-cn":
    "Con neutro los resultados son prácticamente iguales: la corriente por el neutro es ≈ 0 A, porque la suma fasorial de las tres corrientes es cero. El neutro no cumple ninguna función.",
  "tri.ens.explain.des-sn":
    "Las tensiones de línea no cambian (las impone la fuente), pero el punto estrella se desplaza ≈ 43 V respecto del neutro. Las tensiones de fase quedan en 191, 218 y 264 V y las corrientes se desequilibran (1,65 / 2,15 / 2,25 A). La fase T, la que sigue a S en la secuencia, recibe la mayor tensión.",
  "tri.ens.explain.des-cn":
    "El neutro fija N' al potencial de n y las tensiones de fase vuelven a 221 / 221 / 224 V. El desequilibrio aparece como corriente por el neutro, 1,14 A, que es la del capacitor (adelantada 90° respecto de U_S). La potencia vuelve a 1240 W porque el capacitor no consume potencia activa.",
  "tri.ens.m.U": "Tensión de fase",
  "tri.ens.m.I": "Corriente de línea",
  "tri.ens.m.UN": "Desplazamiento U_N",
  "tri.ens.m.IN": "Corriente de neutro I_N",
  "tri.ens.m.W": "Potencia (Aron)",
  "tri.ens.m.approxZero": "≈ 0",
  "tri.ens.checks.title": "Verificaciones con las propias lecturas",
  "tri.ens.checks.sumI":
    "Suma fasorial de las tres corrientes (de los fasores del informe):",
  "tri.ens.checks.sumIreported": "I_N informada:",
  "tri.ens.checks.sumI0": "debe ser ≈ 0 (sin neutro no hay camino de retorno).",
  "tri.ens.checks.p3ui":
    "3·U·I (aprox. con las lecturas, carga resistiva):",
  "tri.ens.checks.p3uiNote":
    "El wattímetro marcó más que ese valor; no hay en el informe una explicación, se atribuye al error de los instrumentos.",
  "tri.ens.table.title": "Tabla de valores (§5.2 del informe)",
  "tri.ens.table.caption":
    "S/N = sin neutro, C/N = con neutro. U_N es la tensión entre punto estrella y neutro (sin neutro); I_N la corriente por el neutro (con neutro).",
  "tri.ens.table.case": "Estado",
  "tri.ens.cmp.title": "Modelo vs lectura",
  "tri.ens.cmp.intro":
    "El mismo estado resuelto con el modelo (R = 123 Ω por fase, 16 µF en S, red 221 / 221 / 224 V). Los parámetros del modelo no se ajustaron para acercarse a estas lecturas.",
  "tri.ens.cmp.quantity": "Magnitud",
  "tri.ens.cmp.measured": "Medido",
  "tri.ens.cmp.model": "Modelo",
  "tri.ens.cmp.noteP":
    "La potencia del modelo (≈ 1200 W) queda por debajo de la leída (1240–1300 W) porque R = 123 Ω sale de las corrientes; ver la nota de 3·U·I.",

  // --- simulador
  "tri.sim.eyebrow": "Simulador",
  "tri.sim.title": "Punto estrella y neutro",
  "tri.sim.intro":
    "Carga resistiva en estrella con un elemento reactivo opcional en la fase S. Cambiá el neutro o el elemento y mirá cómo se corre el punto estrella y cómo se reparten las tensiones y las corrientes.",
  "tri.sim.banner":
    "SIMULACIÓN — modelo en régimen permanente; no son valores medidos.",
  "tri.sim.card.load": "Carga y neutro",
  "tri.sim.neutral": "Conductor neutro",
  "tri.sim.neutral.on": "Con neutro",
  "tri.sim.neutral.off": "Sin neutro",
  "tri.sim.element": "Elemento en la fase S",
  "tri.sim.element.none": "Ninguno",
  "tri.sim.element.capacitor": "Capacitor",
  "tri.sim.element.inductor": "Inductor",
  "tri.sim.X": "Reactancia |X|",
  "tri.sim.R": "Resistencia por fase",
  "tri.sim.net": "Red",
  "tri.sim.net.ensayo": "Del ensayo (221 / 221 / 224 V)",
  "tri.sim.net.sym": "Simétrica (3 × 221 V)",
  "tri.sim.preset.equil": "Equilibrada",
  "tri.sim.preset.banco": "Banco del ensayo (16 µF)",
  "tri.sim.equiv.C": "Equivale a un capacitor de {v} µF",
  "tri.sim.equiv.L": "Equivale a un inductor de {v} H",
  "tri.sim.card.schematic": "Circuito",
  "tri.sim.card.phasor": "Diagrama fasorial",
  "tri.sim.card.results": "Resultados",
  "tri.sim.res.U": "Tensión de fase de la carga",
  "tri.sim.res.I": "Corriente de línea",
  "tri.sim.res.UN": "Desplazamiento U_N",
  "tri.sim.res.IN": "Corriente de neutro I_N",
  "tri.sim.res.W": "Aron W1 + W2",
  "tri.sim.res.PT": "Potencia total",
  "tri.sim.res.aronOk": "Aron coincide con la potencia total.",
  "tri.sim.res.aronBad":
    "Aron NO coincide: con neutro y desequilibrio hay una corriente de neutro con componente en fase con U_S.",
  "tri.sim.cmp.title": "Simulado vs medido",
  "tri.sim.cmp.simulated": "Simulado",
  "tri.sim.cmp.none":
    "Esta combinación no corresponde a ninguno de los cuatro ensayos (equilibrada, o 16 µF en S con R = 123 Ω y la red del ensayo).",
  "tri.sim.limits.title": "Límites del modelo",
  "tri.sim.limits.item1":
    "Fuente ideal con ángulos de 120° exactos; sólo se toma de la red real la magnitud de cada tensión de fase.",
  "tri.sim.limits.item2":
    "El inductor y el capacitor son ideales (sin resistencia propia); el neutro tiene impedancia nula.",
  "tri.sim.limits.item3":
    "No se simula el caso del inductor contra una medición: en el laboratorio sólo se ensayó el capacitor.",

  // --- diagrama
  "tri.phasor.aria":
    "Diagrama fasorial de la estrella: tensiones de fase de la carga, corrientes de línea y punto estrella desplazado.",
  "tri.phasor.legend.U": "Tensión de fase de la carga",
  "tri.phasor.legend.I": "Corriente de línea",
  "tri.phasor.legend.UN": "Desplazamiento N'–n",
  "tri.phasor.legend.IN": "Corriente de neutro",
  "tri.phasor.legend.line": "Tensión de línea (fuente)",
  "tri.phasor.axis": "referencia: URS en 0°",

  // --- esquema
  "tri.schem.aria":
    "Esquema de la carga en estrella con una resistencia por fase, un elemento en la fase S, los wattímetros de Aron y el conductor neutro.",
  "tri.schem.neutralOpen": "neutro abierto",
  "tri.schem.neutralClosed": "neutro conectado",

  // --- cuestionario
  "tri.quiz.eyebrow": "Cuestionario",
  "tri.quiz.title": "Preguntas de la guía",
  "tri.quiz.intro": "Respuestas del informe del grupo.",
  "tri.quiz.qa.q": "a) ¿Cómo resultó el consumo de potencia activa en cada caso? ¿En qué caso es efectivo el método de Aron y en cuál no?",
  "tri.quiz.qa.a1":
    "Con carga equilibrada la potencia total fue la misma con y sin neutro: P_T = W1 + W2 = 620 + 620 = 1240 W. Como la carga es resistiva pura (φ = 0), ambos wattímetros indican lo mismo, W1 = W2 = U_L·I_L·cos 30°.",
  "tri.quiz.qa.a2":
    "Con carga desequilibrada sin neutro la potencia subió a P_T = 580 + 720 = 1300 W, un 5 % más. Los capacitores no consumen potencia activa; el aumento se debe al corrimiento del punto estrella: las resistencias quedan a 191, 218 y 264 V y, como P = U²/R, el aumento en la fase T pesa más que la caída en la fase R: (191² + 218² + 264²)/123 ≈ 1250 W. Con neutro, las tensiones vuelven a su valor y la potencia a ≈ 1240 W.",
  "tri.quiz.qa.a3":
    "Aron es válido en sistemas de tres conductores, porque requiere I_R + I_S + I_T = 0. Eso se cumple en los dos casos equilibrados (I_N ≈ 0) y en el desequilibrado sin neutro. En el desequilibrado con neutro (I_N = 1,14 A) el sistema es de cuatro conductores y en general deja de valer: habría que usar tres wattímetros. Con S como fase común la lectura es W1 + W2 = P_R + P_S + P_T − Re(U_S·I_N*). En este ensayo el error se anula porque I_N es la corriente del capacitor, en cuadratura con U_S.",
  "tri.quiz.qb.q": "b) ¿Cómo impactó en la tensión de cada fase la conexión de los capacitores en la fase S? ¿A qué se debe este comportamiento?",
  "tri.quiz.qb.a1":
    "Sin neutro, la tensión de R bajó de 221 a 191 V, la de S casi no cambió (221 a 218 V) y la de T subió de 224 a 264 V, un 20 % sobre la nominal. Con neutro las tres volvieron a 221, 221 y 224 V.",
  "tri.quiz.qb.a2":
    "Con el capacitor, la admitancia de S es Y_S = G + jωC, distinta de las otras dos (G). Sin neutro, N' ya no coincide con n y su desplazamiento lo da Millman: U_N'n = (Y_R·U_R + Y_S·U_S + Y_T·U_T)/(Y_R + Y_S + Y_T) ≈ jωC·U_S/(3G + jωC) ≈ 44 V ∠ −72°, frente a los 43 V ∠ −72° medidos. N' se acerca al vértice R', por lo que U_R' baja, y se aleja de T', por lo que U_T' sube: con secuencia RST y el capacitor en S, la fase que le sigue (T) queda con mayor tensión (principio del indicador de secuencia).",
  "tri.quiz.qb.a3":
    "Con el neutro, N' queda fijo en n y el desequilibrio pasa a ser corriente por el neutro: I_N = I_R + I_S + I_T = jωC·U_S ≈ 1,11 A ∠ −60°, contra 1,14 A ∠ −60° medidos. Por eso I_S sube a 2,2 A y adelanta ≈ 32° a su tensión.",
  "tri.quiz.qc.q": "c) ¿Qué hubiera pasado si el desequilibrio se hubiera hecho con inductores?",
  "tri.quiz.qc.a1":
    "La admitancia de S sería Y_S = G − j/(ωL): el término de desequilibrio cambia de signo y el punto estrella se desplaza en sentido opuesto. Con un inductor ideal de la misma reactancia (≈ 199 Ω, ≈ 0,63 H) el desplazamiento sería ≈ 44 V ∠ 132°: N' se acerca a T' y se aleja de R', se invierten los papeles de R y T (U_R' ≈ 264 V, U_S' ≈ 217 V, U_T' ≈ 193 V) y la fase de mayor tensión sería la que precede a S, no la que le sigue.",
  "tri.quiz.qc.a2":
    "Con neutro, las tensiones quedarían fijas y por el neutro circularía una corriente de módulo similar (≈ 1,1 A) pero atrasada 90° respecto de U_S, en lugar de adelantada. En la práctica la resistencia propia del bobinado haría que los valores difieran un poco. Probalo en el simulador eligiendo «Inductor».",
  "tri.quiz.qd.q": "d) ¿Qué ventajas y desventajas tiene que la instalación cuente con conductor de neutro? ¿Qué precauciones habría que tomar?",
  "tri.quiz.qd.a1":
    "Ventaja: el neutro fija el potencial del punto estrella y mantiene las tensiones de fase nominales aunque la carga esté desequilibrada. Sin neutro una fase llegó a 264 V (sobretensión que puede dañar equipos monofásicos) y otra quedó en subtensión. Además permite alimentar cargas monofásicas de 220 V desde una red de 380 V.",
  "tri.quiz.qd.a2":
    "Desventajas: es un conductor más, con su costo, y transporta la corriente de desequilibrio (1,14 A en el ensayo), con pérdidas adicionales. Con cargas no lineales, las armónicas múltiplos de 3 se suman en el neutro en lugar de cancelarse y su corriente puede superar la de las fases (ver TP Poliarmónicas). En un sistema de cuatro conductores con desequilibrio, Aron deja de ser válido en general.",
  "tri.quiz.qd.prec.title": "Precauciones",
  "tri.quiz.qd.prec1":
    "Continuidad del neutro: nunca debe interrumpirse solo; sin fusibles en el neutro, e interruptores que corten fases y neutro a la vez. Un neutro cortado o flojo con carga desequilibrada reproduce el caso sin neutro, con sobretensiones.",
  "tri.quiz.qd.prec2":
    "Dimensionamiento: sección del neutro adecuada, al menos igual a la de las fases cuando hay cargas con armónicas.",
  "tri.quiz.qd.prec3":
    "Distribución: repartir las cargas monofásicas de forma equilibrada entre las tres fases.",
  "tri.quiz.qd.prec4":
    "Conexiones: firmes y revisadas periódicamente; no confundir neutro con el conductor de protección (PE).",
};

export const en: Record<string, string> = {
  "tri.nav.ensayos": "Tests",
  "tri.nav.simulador": "Simulator",
  "tri.nav.cuestionario": "Questionnaire",

  "tri.theory.badge": "Lab 3",
  "tri.theory.title": "Three-phase circuits",
  "tri.theory.intro":
    "A star-connected three-phase load with and without a neutral wire, balanced and unbalanced with a capacitor in phase S: phasor diagrams, star-point displacement and power by Aron's method.",
  "tri.theory.nav.ens.title": "Measured tests",
  "tri.theory.nav.ens.desc":
    "The four readings of the report (balanced / unbalanced, with / without neutral) with their phasor diagram and a comparison with the model.",
  "tri.theory.nav.sim.title": "Simulator",
  "tri.theory.nav.sim.desc":
    "Connect or disconnect the neutral, pick a capacitor or an inductor in phase S and watch the star point move.",
  "tri.theory.nav.quiz.title": "Questionnaire",
  "tri.theory.nav.quiz.desc":
    "Answers to the four questions in the handout: power and Aron, effect of the capacitor, inductor, advantages of the neutral.",
  "tri.theory.objectives.title": "Objectives",
  "tri.theory.objectives.item1":
    "Obtain the complete phasor diagrams of a star-connected three-phase circuit for different load states.",
  "tri.theory.objectives.item2": "Understand and interpret those phasor diagrams.",
  "tri.theory.objectives.item3": "Answer the questionnaire.",
  "tri.theory.summary.title": "Theory summary",
  "tri.theory.summary.p1":
    "A three-phase system is three sinusoidal voltages of the same frequency and, if balanced, equal amplitude, 120° apart. In a star connection the ends of the three impedances join at the star point N', which may or may not be tied to the source neutral n.",
  "tri.theory.summary.p2":
    "In a balanced star U_L = √3·U_F and I_L = I_F: with a 380 V line voltage the phase voltage is ≈ 220 V. With three equal impedances the currents have equal magnitude, are 120° apart and sum to zero, so no current flows in the neutral.",
  "tri.theory.summary.p3":
    "In an unbalanced load the impedances differ. Without a neutral the star point shifts with respect to n and the phase voltages are no longer equal (Millman's theorem). With a neutral, N' is held at the potential of n and the imbalance shows up as neutral current, I_N = I_R + I_S + I_T.",
  "tri.theory.summary.p4":
    "Total active power is the sum over the three phases (P = 3·U_L·I_L·cos φ if balanced). Aron's method measures P = W1 + W2 with two wattmeters in a three-wire system. With a neutral and an unbalanced load the reading may no longer be valid.",
  "tri.theory.circuit.title": "Circuit characteristics",
  "tri.theory.circuit.item1": "380 V line voltage.",
  "tri.theory.circuit.item2": "5 kW resistor bank at 25 % (≈ 123 Ω per phase according to the report).",
  "tri.theory.circuit.item3":
    "2 × 8 µF capacitor bank in phase S (16 µF, X_C ≈ 199 Ω), only for the unbalanced case, in parallel with its resistor.",
  "tri.theory.circuit.item4":
    "Aron: wattmeters in phases R and T, with phase S common.",
  "tri.theory.method.title": "Procedure",
  "tri.theory.method.item1":
    "Pick the instruments and wire the circuit with no voltage; check the scales (read in the last third) and note the errors that may affect the measurement.",
  "tri.theory.method.item2":
    "Raise the voltage from zero to the target value while checking the instruments; read without parallax error.",
  "tri.theory.method.item3":
    "Write down every value of the test before de-energizing; lower the voltage to zero, switch the instruments off and dismantle.",
  "tri.theory.source": "Data transcribed from the group's report (lab3.pdf).",

  "tri.ens.eyebrow": "Measured tests",
  "tri.ens.title": "The four load states",
  "tri.ens.intro":
    "Readings from the group's report. Pick a state to see its phasor diagram; blue arrows are the load phase voltages, red arrows the currents.",
  "tri.ens.case.label": "Load state",
  "tri.ens.case.eq-sn": "Balanced, no neutral",
  "tri.ens.case.eq-cn": "Balanced, with neutral",
  "tri.ens.case.des-sn": "Unbalanced, no neutral",
  "tri.ens.case.des-cn": "Unbalanced, with neutral",
  "tri.ens.read.title": "Readings",
  "tri.ens.phasor.title": "Phasor diagram (measured)",
  "tri.ens.explain.title": "What happened",
  "tri.ens.explain.eq-sn":
    "With a balanced load the three currents are equal (1.8 A) and in phase with their voltages, as the load is purely resistive. Power is 1240 W, both wattmeters reading the same. The voltage between the star point and the neutral is only 3.5 V, attributable to the small asymmetry of the network (224 V in phase T versus 221 V).",
  "tri.ens.explain.eq-cn":
    "With the neutral connected the results are practically the same: neutral current is ≈ 0 A because the phasor sum of the three currents is zero. The neutral plays no role.",
  "tri.ens.explain.des-sn":
    "Line voltages do not change (the source imposes them), but the star point shifts ≈ 43 V from the neutral. Phase voltages end up at 191, 218 and 264 V and the currents become unbalanced (1.65 / 2.15 / 2.25 A). Phase T, the one that follows S in the sequence, gets the highest voltage.",
  "tri.ens.explain.des-cn":
    "The neutral holds N' at the potential of n and the phase voltages return to 221 / 221 / 224 V. The imbalance appears as neutral current, 1.14 A, which is the capacitor's (leading U_S by 90°). Power returns to 1240 W because the capacitor consumes no active power.",
  "tri.ens.m.U": "Phase voltage",
  "tri.ens.m.I": "Line current",
  "tri.ens.m.UN": "Displacement U_N",
  "tri.ens.m.IN": "Neutral current I_N",
  "tri.ens.m.W": "Power (Aron)",
  "tri.ens.m.approxZero": "≈ 0",
  "tri.ens.checks.title": "Checks with the readings themselves",
  "tri.ens.checks.sumI":
    "Phasor sum of the three currents (from the report's phasors):",
  "tri.ens.checks.sumIreported": "Reported I_N:",
  "tri.ens.checks.sumI0": "should be ≈ 0 (no return path without a neutral).",
  "tri.ens.checks.p3ui":
    "3·U·I (approx. from the readings, resistive load):",
  "tri.ens.checks.p3uiNote":
    "The wattmeter read more than that value; the report gives no explanation, it is attributed to instrument error.",
  "tri.ens.table.title": "Table of values (§5.2 of the report)",
  "tri.ens.table.caption":
    "S/N = no neutral, C/N = with neutral. U_N is the voltage between star point and neutral (no neutral); I_N the neutral current (with neutral).",
  "tri.ens.table.case": "State",
  "tri.ens.cmp.title": "Model vs reading",
  "tri.ens.cmp.intro":
    "The same state solved with the model (R = 123 Ω per phase, 16 µF in S, network 221 / 221 / 224 V). The model's parameters were not tuned to approach these readings.",
  "tri.ens.cmp.quantity": "Quantity",
  "tri.ens.cmp.measured": "Measured",
  "tri.ens.cmp.model": "Model",
  "tri.ens.cmp.noteP":
    "Model power (≈ 1200 W) is below the reading (1240–1300 W) because R = 123 Ω comes from the currents; see the 3·U·I note.",

  "tri.sim.eyebrow": "Simulator",
  "tri.sim.title": "Star point and neutral",
  "tri.sim.intro":
    "Resistive star load with an optional reactive element in phase S. Toggle the neutral or the element and see how the star point moves and how voltages and currents split.",
  "tri.sim.banner":
    "SIMULATION — steady-state model; these are not measured values.",
  "tri.sim.card.load": "Load and neutral",
  "tri.sim.neutral": "Neutral wire",
  "tri.sim.neutral.on": "With neutral",
  "tri.sim.neutral.off": "No neutral",
  "tri.sim.element": "Element in phase S",
  "tri.sim.element.none": "None",
  "tri.sim.element.capacitor": "Capacitor",
  "tri.sim.element.inductor": "Inductor",
  "tri.sim.X": "Reactance |X|",
  "tri.sim.R": "Resistance per phase",
  "tri.sim.net": "Network",
  "tri.sim.net.ensayo": "As in the test (221 / 221 / 224 V)",
  "tri.sim.net.sym": "Symmetric (3 × 221 V)",
  "tri.sim.preset.equil": "Balanced",
  "tri.sim.preset.banco": "Test bank (16 µF)",
  "tri.sim.equiv.C": "Equivalent to a {v} µF capacitor",
  "tri.sim.equiv.L": "Equivalent to a {v} H inductor",
  "tri.sim.card.schematic": "Circuit",
  "tri.sim.card.phasor": "Phasor diagram",
  "tri.sim.card.results": "Results",
  "tri.sim.res.U": "Load phase voltage",
  "tri.sim.res.I": "Line current",
  "tri.sim.res.UN": "Displacement U_N",
  "tri.sim.res.IN": "Neutral current I_N",
  "tri.sim.res.W": "Aron W1 + W2",
  "tri.sim.res.PT": "Total power",
  "tri.sim.res.aronOk": "Aron matches the total power.",
  "tri.sim.res.aronBad":
    "Aron does NOT match: with a neutral and an unbalanced load the neutral current has a component in phase with U_S.",
  "tri.sim.cmp.title": "Simulated vs measured",
  "tri.sim.cmp.simulated": "Simulated",
  "tri.sim.cmp.none":
    "This combination matches none of the four tests (balanced, or 16 µF in S with R = 123 Ω and the test network).",
  "tri.sim.limits.title": "Model limits",
  "tri.sim.limits.item1":
    "Ideal source with exact 120° angles; only the magnitude of each phase voltage is taken from the real network.",
  "tri.sim.limits.item2":
    "Inductor and capacitor are ideal (no own resistance); the neutral has zero impedance.",
  "tri.sim.limits.item3":
    "The inductor case cannot be checked against a measurement: only the capacitor was tested in the lab.",

  "tri.phasor.aria":
    "Star phasor diagram: load phase voltages, line currents and the displaced star point.",
  "tri.phasor.legend.U": "Load phase voltage",
  "tri.phasor.legend.I": "Line current",
  "tri.phasor.legend.UN": "N'–n displacement",
  "tri.phasor.legend.IN": "Neutral current",
  "tri.phasor.legend.line": "Line voltage (source)",
  "tri.phasor.axis": "reference: URS at 0°",

  "tri.schem.aria":
    "Star load schematic with one resistor per phase, an element in phase S, the Aron wattmeters and the neutral wire.",
  "tri.schem.neutralOpen": "neutral open",
  "tri.schem.neutralClosed": "neutral connected",

  "tri.quiz.eyebrow": "Questionnaire",
  "tri.quiz.title": "Handout questions",
  "tri.quiz.intro": "Answers from the group's report.",
  "tri.quiz.qa.q": "a) How did active power turn out in each case? In which case is Aron's method effective and in which is it not?",
  "tri.quiz.qa.a1":
    "With a balanced load total power was the same with and without neutral: P_T = W1 + W2 = 620 + 620 = 1240 W. The load is purely resistive (φ = 0), so both wattmeters read the same, W1 = W2 = U_L·I_L·cos 30°.",
  "tri.quiz.qa.a2":
    "With an unbalanced load and no neutral power rose to P_T = 580 + 720 = 1300 W, about 5 % more. Capacitors consume no active power; the rise comes from the star-point shift: the resistors sit at 191, 218 and 264 V and, as P = U²/R, the increase in phase T outweighs the drop in phase R: (191² + 218² + 264²)/123 ≈ 1250 W. With the neutral connected, voltages return to nominal and power to ≈ 1240 W.",
  "tri.quiz.qa.a3":
    "Aron is valid in three-wire systems, because it needs I_R + I_S + I_T = 0. That holds in both balanced cases (I_N ≈ 0) and in the unbalanced case without neutral. In the unbalanced case with neutral (I_N = 1.14 A) the system has four wires and in general the method no longer holds: three wattmeters would be needed. With S as common phase the reading is W1 + W2 = P_R + P_S + P_T − Re(U_S·I_N*). In this test the error vanishes because I_N is the capacitor current, in quadrature with U_S.",
  "tri.quiz.qb.q": "b) How did connecting the capacitors in phase S affect each phase voltage? Why?",
  "tri.quiz.qb.a1":
    "Without neutral, the voltage of R dropped from 221 to 191 V, S barely changed (221 to 218 V) and T rose from 224 to 264 V, 20 % above nominal. With the neutral all three returned to 221, 221 and 224 V.",
  "tri.quiz.qb.a2":
    "With the capacitor, the admittance of S is Y_S = G + jωC, different from the other two (G). Without neutral N' no longer coincides with n and its displacement is given by Millman: U_N'n = (Y_R·U_R + Y_S·U_S + Y_T·U_T)/(Y_R + Y_S + Y_T) ≈ jωC·U_S/(3G + jωC) ≈ 44 V ∠ −72°, against the 43 V ∠ −72° measured. N' moves toward vertex R', so U_R' drops, and away from T', so U_T' rises: with RST sequence and the capacitor in S, the phase that follows it (T) gets the highest voltage (the phase-sequence indicator principle).",
  "tri.quiz.qb.a3":
    "With the neutral, N' is held at n and the imbalance becomes neutral current: I_N = I_R + I_S + I_T = jωC·U_S ≈ 1.11 A ∠ −60°, against 1.14 A ∠ −60° measured. That is also why I_S rises to 2.2 A and leads its voltage by ≈ 32°.",
  "tri.quiz.qc.q": "c) What would have happened if the imbalance had been made with inductors?",
  "tri.quiz.qc.a1":
    "The admittance of S would be Y_S = G − j/(ωL): the imbalance term changes sign and the star point shifts the opposite way. With an ideal inductor of the same reactance (≈ 199 Ω, ≈ 0.63 H) the displacement would be ≈ 44 V ∠ 132°: N' moves toward T' and away from R', the roles of R and T swap (U_R' ≈ 264 V, U_S' ≈ 217 V, U_T' ≈ 193 V) and the highest voltage lands on the phase that precedes S, not the one that follows it.",
  "tri.quiz.qc.a2":
    "With the neutral, voltages would stay fixed and a neutral current of similar magnitude (≈ 1.1 A) would flow, but lagging U_S by 90° instead of leading it. In practice the winding's own resistance would make values differ a little. Try it in the simulator by picking “Inductor”.",
  "tri.quiz.qd.q": "d) What are the advantages and disadvantages of having a neutral conductor? What precautions should be taken?",
  "tri.quiz.qd.a1":
    "Advantage: the neutral pins the star-point potential and keeps phase voltages at nominal even with an unbalanced load. Without it one phase reached 264 V (an overvoltage that can damage single-phase equipment) and another sat in undervoltage. It also lets 220 V single-phase loads run from a 380 V network.",
  "tri.quiz.qd.a2":
    "Disadvantages: it is one more conductor, with its cost, and it carries the imbalance current (1.14 A in the test), with extra losses. With non-linear loads, third-multiple harmonics add up in the neutral instead of cancelling and its current can exceed the phases' (see the Polyharmonic lab). In a four-wire system with imbalance, Aron is in general no longer valid.",
  "tri.quiz.qd.prec.title": "Precautions",
  "tri.quiz.qd.prec1":
    "Neutral continuity: it must never be interrupted alone; no fuses in the neutral, and switches that open phases and neutral together. A broken or loose neutral with an unbalanced load reproduces the no-neutral case, with overvoltages.",
  "tri.quiz.qd.prec2":
    "Sizing: adequate neutral cross-section, at least equal to the phases' when there are loads with harmonics.",
  "tri.quiz.qd.prec3":
    "Distribution: spread single-phase loads evenly across the three phases.",
  "tri.quiz.qd.prec4":
    "Connections: firm and checked periodically; do not confuse neutral with the protective conductor (PE).",
};
