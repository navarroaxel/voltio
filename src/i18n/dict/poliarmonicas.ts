export const es: Record<string, string> = {
  // ── Navegación ──
  "poli.nav.ensayos": "Ensayos",
  "poli.nav.simulador": "Simulador",

  // ── Teoría ──
  "poli.theory.badge": "TP N°4",
  "poli.theory.title": "Régimen poliarmónico",
  "poli.theory.intro":
    "Forma de onda y contenido de armónicas de las corrientes de distintas cargas monofásicas, y corriente de retorno por el neutro en cargas trifásicas. (La guía de la cátedra lo numera como TP N°5.)",

  "poli.theory.objectives.title": "Objetivos",
  "poli.theory.objectives.item1":
    "Verificar experimentalmente la forma de onda y el contenido de armónicos de las corrientes de distintos tipos de cargas monofásicas.",
  "poli.theory.objectives.item2":
    "Analizar para cargas trifásicas la forma de onda y el contenido de armónicos de las corrientes de retorno por el neutro.",

  "poli.theory.summary.title": "Resumen teórico",
  "poli.theory.summary.p1":
    "Una corriente periódica no senoidal se descompone en una serie de Fourier: una fundamental de 50 Hz y armónicas de frecuencia h·50 Hz. A ese régimen se lo llama poliarmónico.",
  "poli.theory.summary.p2":
    "El valor eficaz es I_RMS = √(I₁² + I₂² + I₃² + …) y la distorsión armónica total es THD_I = √(I₂² + I₃² + …)/I₁, de modo que I_RMS = I₁·√(1 + THD_I²). Si I_RMS supera a I₁ hay contenido armónico.",
  "poli.theory.summary.p3":
    "Las cargas lineales (halógena, tubos, trafo cargado) no generan armónicas; las alineales (bajo consumo, LED, trafo en vacío, fuentes conmutadas) toman corrientes deformadas aunque la tensión sea senoidal.",
  "poli.theory.summary.p4":
    "En un sistema trifásico balanceado las armónicas múltiplos de 3 están en fase entre las tres fases y se suman en el neutro (I_N ≈ 3·I₃). Por eso con cargas alineales el neutro puede conducir más corriente que cada fase.",
  "poli.theory.summary.p5":
    "Un capacitor en paralelo corrige el desfasaje pero no la distorsión; además su corriente es proporcional al orden de cada armónica de tensión (I_h = h·ω·C·V_h), así que amplifica la distorsión que ya trae la red.",

  "poli.theory.summary.p6":
    "La potencia activa es P = P₁ + P₂ + P₃ + …, con P_h = V_h·I_h·cos φ_h: sólo aportan las armónicas de tensión y de corriente de la misma frecuencia. Con tensión senoidal pura toda la potencia activa estaría en la fundamental, por deformada que sea la corriente. Como la tensión de la red llega distorsionada, también hay potencia activa en la 3.ª, 5.ª, 7.ª…, y por eso la potencia activa de la fundamental y la total no coinciden en valor.",

  "poli.theory.material.title": "Material utilizado",
  "poli.theory.material.item1":
    "Banco trifásico con, por fase: lámpara halógena de 53 W, lámpara de bajo consumo de 15 W, lámpara LED de 15 W y un tomacorriente con una carga (R: artefacto 2×36 W con tubos; S: dicroica de 12 V con trafo convencional; T: dicroica de 12 V con trafo electrónico).",
  "poli.theory.material.item2": "Analizador de redes Fluke 435.",
  "poli.theory.material.item3":
    "Amperímetro, voltímetro y wattímetro analógicos, y un téster.",

  "poli.theory.nav.ens.title": "Ensayos medidos",
  "poli.theory.nav.ens.desc":
    "Las capturas del Fluke de cada ensayo (Partes A, B y C) con sus lecturas, descripción y análisis.",
  "poli.theory.nav.sim.title": "Simulador de red",
  "poli.theory.nav.sim.desc":
    "Distorsioná la tensión de la red y mirá cómo cambia la corriente de cada carga y la del neutro. Es una simulación, no una medición.",

  "poli.theory.limits.title": "Qué no tiene este trabajo",
  "poli.theory.limits.item1":
    "No hay espectro de armónicas en las capturas del laboratorio. El THD que se muestra es una estimación a partir de I_RMS e I₁ de la misma pantalla.",
  "poli.theory.limits.item2":
    "No hay lecturas de los instrumentos analógicos, así que no se compara contra el Fluke.",
  "poli.theory.limits.item3":
    "Los modelos del simulador son simplificaciones calibradas con las capturas; reproducen lo medido, no el comportamiento exacto de cada artefacto.",

  // ── Ensayos (visor) ──
  "poli.ens.eyebrow": "Resultados del laboratorio",
  "poli.ens.title": "Ensayos medidos",
  "poli.ens.intro":
    "Capturas del analizador Fluke 435 (09/11/2017). Cada ensayo muestra las lecturas transcriptas de las pantallas y las imágenes originales. Un guion (—) significa que el dato no se lee en ninguna captura.",
  "poli.ens.codes.title": "¿Cómo se leen los códigos de los ensayos?",
  "poli.ens.codes.intro":
    "Cada captura del laboratorio tiene un código de la cátedra, que coincide con el nombre de su archivo. Se arma así: Parte + Carga + Conexión + N.º de captura.",
  "poli.ens.codes.example":
    "Ejemplo: ADCM2 = Parte A · dicroica con trafo convencional (cargado) · monofásica · captura 2 (diagrama fasorial).",
  "poli.ens.codes.h.part": "Parte",
  "poli.ens.codes.h.load": "Carga",
  "poli.ens.codes.h.conn": "Conexión",
  "poli.ens.codes.part.A": "Cargas lineales",
  "poli.ens.codes.part.B": "Cargas alineales",
  "poli.ens.codes.part.C": "Cargas mixtas",
  "poli.ens.codes.load.H": "Halógena",
  "poli.ens.codes.load.T": "Tubos fluorescentes",
  "poli.ens.codes.load.DC": "Dicroica con trafo convencional (cargado)",
  "poli.ens.codes.load.DCV": "Trafo convencional en vacío",
  "poli.ens.codes.load.DE": "Trafo electrónico en vacío",
  "poli.ens.codes.load.BC": "Bajo consumo",
  "poli.ens.codes.load.L": "LED",
  "poli.ens.codes.load.TC1": "Tubos con compensación",
  "poli.ens.codes.load.TC2": "Tubos con un banco de capacitores conectado además",
  "poli.ens.codes.load.TCL": "Tubos sin compensar + LED + bajo consumo",
  "poli.ens.codes.conn.M": "Monofásica (fase R)",
  "poli.ens.codes.conn.B": "Desbalanceada (dos fases, R y S)",
  "poli.ens.codes.conn.T": "Balanceada (tres fases)",
  "poli.ens.codes.capture":
    "El número de captura (1, 2, 3) indica qué pantalla del Fluke es; varía según el ensayo, por eso cada captura dice qué muestra.",
  "poli.ens.part.A": "Parte A · Lineales",
  "poli.ens.part.B": "Parte B · Alineales",
  "poli.ens.part.C": "Parte C · Mixtas",
  "poli.ens.partLabel": "Parte del ensayo",
  "poli.ens.pickLabel": "Ensayo",
  "poli.ens.readings": "Lecturas",
  "poli.ens.captures": "Capturas",
  "poli.ens.read.U": "Tensión U",
  "poli.ens.read.I": "I_RMS fases",
  "poli.ens.read.I1": "Fundamental I₁ (L1)",
  "poli.ens.read.phi": "φ₁ (corriente−tensión)",
  "poli.ens.read.IN": "Corriente de neutro",
  "poli.ens.read.ratio": "I_N / I_L1",
  "poli.ens.read.thd": "THD_I estimado",
  "poli.ens.thdNote":
    "THD_I estimado = √(I_RMS² − I₁²)/I₁ con ambos valores de la misma pantalla (resolución de 3 dígitos: orientativo).",
  "poli.ens.read.thdMeas": "THD_I medido",
  "poli.ens.col.thdMeas": "THD_I med.",
  "poli.ens.orders": "Armónicas dominantes anotadas",
  "poli.ens.thdMeasNote":
    "THD_I medido: dato registrado por un compañero durante el laboratorio (notas a mano); no figura en las capturas del profesor. Se muestra junto a la estimación, que sí se calcula con I_RMS e I₁ de las capturas. Los dos pueden diferir.",
  "poli.ens.thdFlag.idem":
    "Anotado como «idem»: igual al valor del ensayo monofásico de la misma carga.",
  "poli.ens.thdFlag.noise":
    "El trafo electrónico en vacío no toma corriente (protección contra vacío): este valor corresponde a ruido y no es representativo.",
  "poli.ens.thdFlag.mapping":
    "La anotación dice «compensado» sin distinguir TC1 de TC2: se asigna a TC1 como correspondencia supuesta.",
  "poli.ens.phiNote": "φ positivo = corriente adelantada; negativo = atrasada.",
  "poli.ens.cap.osc-ui": "Oscilograma de U e I",
  "poli.ens.cap.osc-fases": "Oscilograma de corrientes (fases y neutro)",
  "poli.ens.cap.osc-neutro": "Oscilograma de la corriente de neutro",
  "poli.ens.cap.fasorial": "Diagrama fasorial",
  "poli.ens.summary.title": "Resumen de todos los ensayos",
  "poli.ens.col.test": "Ensayo",
  "poli.ens.col.U": "U",
  "poli.ens.col.I": "I_L1",
  "poli.ens.col.I1": "I₁",
  "poli.ens.col.phi": "φ₁",
  "poli.ens.col.thd": "THD_I est.",
  "poli.ens.col.ratio": "I_N/I_L1",
  "poli.ens.conc.title": "Conclusiones",
  "poli.ens.conc.1":
    "Las cargas lineales (halógena) dan corriente senoidal en fase con la tensión y, balanceadas, neutro casi nulo (0,015 A).",
  "poli.ens.conc.2":
    "El bajo consumo y el LED toman corrientes en pulsos: I_RMS mucho mayor que I₁ (THD estimado ≈ 87 % y ≈ 153 %).",
  "poli.ens.conc.3":
    "Con cargas alineales balanceadas el neutro no se anula: conduce ≈ 1,65 veces (bajo consumo) y ≈ 1,70 veces (LED) la corriente de fase, por la suma de armónicas múltiplos de 3. El neutro debe dimensionarse en consecuencia.",
  "poli.ens.conc.4":
    "La compensación capacitiva de los tubos baja la corriente y el desfasaje (de −57° a −16°), pero no corrige la distorsión; una sobrecompensación (TC2) deja la corriente adelantada.",
  "poli.ens.conc.5":
    "El trafo convencional en vacío toma una corriente de magnetización deformada y muy atrasada; el electrónico, una corriente mínima con ripple de alta frecuencia.",

  "poli.ens.AHM.name": "Halógena 53 W · monofásica",
  "poli.ens.AHM.desc":
    "Tensión y corriente senoidales y en fase (φ ≈ +2°): carga resistiva. I_RMS = I₁ = 0,270 A, sin contenido armónico apreciable. La corriente de neutro (0,277 A) es la de la fase R, único camino de retorno.",
  "poli.ens.AHB.name": "Halógena · trifásica desbalanceada (R y S)",
  "poli.ens.AHB.desc":
    "Con dos fases cargadas (0,270 y 0,258 A, a 120°) el neutro conduce aproximadamente una fase (0,264 A): la suma fasorial de dos corrientes iguales a 120° tiene su mismo módulo. Las ondas siguen siendo senoidales.",
  "poli.ens.AHT.name": "Halógena · trifásica balanceada",
  "poli.ens.AHT.desc":
    "Tres corrientes senoidales iguales y a 120°: el neutro es casi nulo (0,015 A). Con carga lineal y equilibrada el neutro no conduce.",
  "poli.ens.ATM.name": "Tubos 2×36 W · monofásica",
  "poli.ens.ATM.desc":
    "Carga R-L (balasto): corriente atrasada 57° (cos φ₁ ≈ 0,54). La distorsión es pequeña frente al efecto del desfasaje (THD estimado ≈ 11 %). I_RMS varía ≈ 3,5 % entre capturas consecutivas (0,823–0,853 A).",
  "poli.ens.ADCM.name": "Dicroica 12 V / 50 W con trafo convencional (cargado)",
  "poli.ens.ADCM.desc":
    "Con el transformador cargado la corriente es senoidal y casi en fase (φ = −7°). Contrasta con el mismo trafo en vacío (Parte B), cuya corriente está deformada y atrasada 63°. La guía dice «12 W»; se interpreta como 12 V.",
  "poli.ens.BDCVM.name": "Trafo de dicroica convencional · en vacío",
  "poli.ens.BDCVM.desc":
    "Es la corriente de magnetización: no senoidal por saturación del núcleo y muy atrasada (φ = −63°). THD estimado ≈ 38 %.",
  "poli.ens.BDEM.name": "Trafo de dicroica electrónico · en vacío",
  "poli.ens.BDEM.desc":
    "Corriente muy pequeña (0,017 A) con ripple de alta frecuencia de la etapa conmutada. Está cerca del límite de resolución del instrumento, así que I_RMS e I₁ no permiten estimar el THD.",
  "poli.ens.BBCM.name": "Bajo consumo 15 W · monofásica",
  "poli.ens.BBCM.desc":
    "Corriente en pulsos, muy deformada; la fundamental adelanta 25° a la tensión (rectificador con capacitor de filtro). THD estimado ≈ 87 %.",
  "poli.ens.BBCB.name": "Bajo consumo · trifásica desbalanceada (R y S)",
  "poli.ens.BBCB.desc":
    "El neutro (0,166 A) supera la corriente de cada fase (0,125 y 0,112 A): además de la suma fasorial de las fundamentales se suman armónicas.",
  "poli.ens.BBCT.name": "Bajo consumo · trifásica balanceada",
  "poli.ens.BBCT.desc":
    "El neutro no se anula: conduce 0,206 A, ≈ 1,65 veces la corriente de fase, porque las armónicas múltiplos de 3 están en fase entre las tres fases y se suman.",
  "poli.ens.BLM.name": "LED 15 W · monofásica",
  "poli.ens.BLM.desc":
    "Pulsos angostos de gran amplitud y corriente casi nula el resto del semiciclo. I_RMS = 0,152 A contra I₁ = 0,083 A: THD estimado ≈ 153 %. Fundamental adelantada 12°.",
  "poli.ens.BLB.name": "LED · trifásica desbalanceada (R y S)",
  "poli.ens.BLB.desc":
    "El neutro (0,205 A) supera la corriente de cada fase (0,149 y 0,133 A).",
  "poli.ens.BLT.name": "LED · trifásica balanceada",
  "poli.ens.BLT.desc":
    "El neutro conduce 0,259 A, ≈ 1,70 veces la corriente de fase pese a estar balanceado: armónicas triples sumadas.",
  "poli.ens.CTC1.name": "Tubos 2×36 W con compensación capacitiva (TC1)",
  "poli.ens.CTC1.desc":
    "La compensación baja la corriente (de 0,82 A a 0,48 A) y el desfasaje (de −57° a −16°), pero no elimina la distorsión (THD estimado ≈ 28 %): la corriente conserva componentes de alta frecuencia.",
  "poli.ens.CTC2.name": "Tubos con banco de capacitores conectado (TC2)",
  "poli.ens.CTC2.desc":
    "Mismo artefacto al que se le conectó además un banco de capacitores: la corriente adelanta 45° (sobrecompensación) y vuelve a subir a 0,65 A. La componente activa es igual a la de TC1 (≈ 0,44 A); sólo cambia la reactiva. La capacitancia equivalente resulta ≈ el doble que la de TC1 (≈ 15,8 µF contra ≈ 7,9 µF; cálculo con las lecturas, no se conocen los valores reales).",
  "poli.ens.CTCL.name": "Tubos sin compensar + cargas alineales (TCL)",
  "poli.ens.CTCL.desc":
    "Corriente total ≈ 1,01 A con φ = −46°; el neutro (1,043 A) supera la corriente de fase. La composición exacta de la carga no está documentada (se infiere: tubos sin compensar más lámparas alineales).",

  // ── Simulador ──
  "poli.sim.eyebrow": "Simulación",
  "poli.sim.title": "Simulador de interferencias de la red",
  "poli.sim.intro":
    "Elegí una carga y una conexión, y distorsioná la tensión de la red. El simulador calcula la corriente en el tiempo y su espectro. Los modelos de carga están calibrados con las capturas del laboratorio.",
  "poli.sim.banner":
    "SIMULACIÓN: estos valores se calculan con modelos simplificados. No son mediciones.",
  "poli.sim.load.title": "Carga",
  "poli.sim.load.sinCarga": "Sin carga",
  "poli.sim.load.halogena": "Halógena (lineal, R)",
  "poli.sim.load.tubos": "Tubos 2×36 W (R-L)",
  "poli.sim.load.bajoConsumo": "Bajo consumo",
  "poli.sim.load.led": "LED",
  "poli.sim.load.trafoVacio": "Trafo conv. en vacío",
  "poli.sim.load.bancoCapacitores": "Banco de capacitores",
  "poli.sim.load.label": "Tipo de carga",
  "poli.sim.conn.title": "Conexión",
  "poli.sim.conn.label": "Conexión del banco",
  "poli.sim.conn.mono": "Monofásica (R)",
  "poli.sim.conn.bifasica": "Desbalanceada (R y S)",
  "poli.sim.conn.trifasica": "Balanceada (R, S y T)",
  "poli.sim.tubosC": "Capacitor en paralelo con los tubos",
  "poli.sim.tubosC.none": "Sin compensar",
  "poli.sim.tubosC.c1": "Como TC1",
  "poli.sim.tubosC.c2": "Como TC2",
  "poli.sim.tubosC.custom": "Valor personalizado (no coincide con TC1 ni TC2)",
  "poli.chart.spectrum.aria": "Espectro de armónicas. Mayores componentes: ",
  "poli.sim.grid.title": "Tensión de red",
  "poli.sim.grid.V1": "Tensión fundamental U₁",
  "poli.sim.grid.v3": "3.ª armónica",
  "poli.sim.grid.v5": "5.ª armónica",
  "poli.sim.grid.v7": "7.ª armónica",
  "poli.sim.grid.theta": "Fase de las armónicas",
  "poli.sim.preset.label": "Presets de red",
  "poli.sim.preset.ideal": "Red ideal",
  "poli.sim.preset.dia": "Red del día (THD_V 2,4 %)",
  "poli.sim.preset.distorsionada": "Red muy distorsionada",
  "poli.sim.preset.diaNote":
    "El 2,4 % lo informó el Fluke; el reparto entre 5.ª y 7.ª armónica es un supuesto (no se midió).",
  "poli.sim.m.thdV": "THD_V",
  "poli.sim.m.Irms": "I_RMS fase",
  "poli.sim.m.I1": "I₁",
  "poli.sim.m.phi": "φ₁",
  "poli.sim.m.thdI": "THD_I",
  "poli.sim.m.pf": "Factor de potencia",
  "poli.sim.m.IN": "I_N",
  "poli.sim.m.ratio": "I_N / I_fase",
  "poli.sim.chart.voltage": "Tensión",
  "poli.sim.chart.current": "Corriente",
  "poli.sim.chart.spectrum": "Espectro de corriente",
  "poli.sim.chart.timeAxis": "t (ms)",
  "poli.sim.chart.voltageAxis": "u (V)",
  "poli.sim.chart.currentAxis": "i (A)",
  "poli.sim.chart.spectrumAxis": "% de I₁ (fase)",
  "poli.sim.chart.phaseSeries": "I_h fase",
  "poli.sim.chart.neutralSeries": "I_h neutro",
  "poli.sim.chart.orderAxis": "Orden de la armónica h",
  "poli.sim.cmp.title": "Simulado vs medido",
  "poli.sim.cmp.desc":
    "Se compara con el ensayo del laboratorio que corresponde a esta carga y conexión. La simulación usa la tensión que elegís arriba; en el laboratorio de 2017 la distorsión de la red no se conoce, así que para comparar conviene la red ideal.",
  "poli.sim.cmp.none":
    "No hay un ensayo medido equivalente para esta combinación.",
  "poli.sim.cmp.thdNote":
    "El THD_I medido es el que anotó un compañero. El THD simulado sale de I_RMS e I₁ de las capturas (con las que se calibró) y el medido es la lectura directa del Fluke: en el informe no coinciden entre sí (p. ej. LED: 153 % contra 93,8 %), así que el simulado puede diferir bastante del medido, sobre todo en LED y en el trafo en vacío. Los tubos se modelan lineales: su THD propio (≈ 11 %) no se reproduce.",
  "poli.sim.cmp.measured": "Medido",
  "poli.sim.cmp.simulated": "Simulado",
  "poli.sim.cmp.ref": "Ensayo de referencia",
  "poli.sim.cmp.note":
    "El THD estimado se calcula con I_RMS e I₁ de la misma pantalla. El neutro simulado no se ajustó: la calibración sólo usó I_RMS, I₁ y φ₁ de la lectura monofásica.",
  "poli.sim.model.title": "Modelo de la carga seleccionada",
  "poli.sim.model.halogena":
    "R = U/I de la captura AHM1. Lineal: no genera armónicas.",
  "poli.sim.model.tubos":
    "R + jX serie calculada con U, I₁ y φ de ATM2, con capacitor opcional en paralelo. Es lineal: no reproduce la distorsión propia del balasto y la lámpara (THD estimado ≈ 11 % medido).",
  "poli.sim.model.bajoConsumo":
    "Puente rectificador con capacitor de filtro, ajustado con I_RMS, I₁ y φ₁ de BBCM2. Reproduce la corriente en pulsos y el aumento del neutro.",
  "poli.sim.model.led":
    "Puente rectificador con capacitor de filtro, ajustado con I_RMS, I₁ y φ₁ de BLM1/BLM3.",
  "poli.sim.model.sinCarga":
    "Corriente residual del trafo electrónico en vacío (BDEM): ≈ 17 mA, φ = +5° y THD ≈ 65 % (con la red del día). Una fuga lineal muy chica: con una fundamental de ≈ 14 mA, el ruido de la red (≈ 9 mA con la red del día, el mismo para toda carga) hace que el THD de corriente sea enorme aunque la carga casi no exista. El informe atribuye ese THD a ruido o a la red.",
  "poli.sim.circuit.cap": "Capacitor",
  "poli.sim.conn.capOnlyR":
    "Los capacitores sólo se ensayaron en la fase R: con ellos el simulador es monofásico.",
  "poli.sim.model.trafoVacio":
    "Rama de magnetización saturable (i = a·λ + b·λ⁷) con pérdidas en el hierro, ajustada con BDCVM2. Al subir U₁ aumenta la saturación.",
  "poli.sim.model.bancoCapacitores":
    "Capacitor puro calculado con U e I₁ de la foto del banco (2026). La corriente de cada armónica es h·ω·C·V_h. Un capacitor ideal da φ = 90°; en la foto el fasorial marcó +95° con la red distorsionada del día. Se modela como un corrimiento proporcional a la distorsión de tensión (0° con red ideal, +5° con THD_V = 2,4 %).",
  "poli.sim.circuit.title": "Circuito y tablero de lámparas",
  "poli.sim.circuit.on": "Encendido",
  "poli.sim.circuit.legend.on": "Lámpara encendida",
  "poli.sim.circuit.legend.conn": "Carga conectada al tomacorriente",
  "poli.sim.circuit.legend.off": "Apagada",
  "poli.sim.circuit.ariaLabel":
    "Esquema del circuito de ensayo: fases R, S y T y neutro conectados al analizador Fluke 435 y al tablero de lámparas.",
  "poli.sim.circuit.note":
    "Las corrientes mostradas son simuladas. Las tres lámparas de cada fase se dibujan en el orden bajo consumo, LED y halógena (de arriba hacia abajo), tomado de la foto del banco: la guía no lo indica, conviene confirmarlo.",
  "poli.sim.circuit.noteSocket":
    "Con tubos, trafo en vacío o banco de capacitores, el simulador usa el tomacorriente de cada fase como si tuviera esa carga. En el banco real, AT (fase R), DC (S) y DE (T) son artefactos distintos.",
  "poli.sim.lamp.bc": "BC",
  "poli.sim.lamp.led": "LED",
  "poli.sim.lamp.h": "H",
  "poli.sim.limits.title": "Limitaciones",
  "poli.sim.limits.item1":
    "El transformador electrónico no se simula (su ripple es de alta frecuencia).",
  "poli.sim.limits.item2":
    "Con red ideal, tubos y halógena son lineales: el THD_I sólo aparece si distorsionás la tensión.",
  "poli.sim.limits.item3":
    "Los tres neutros trifásicos usan tres cargas idénticas con tensiones desfasadas 120°; el desbalance es sólo por fases apagadas.",
  "poli.sim.limits.item4":
    "Toda corriente incluye un ruido de la red de ≈ 9 mA (armónicas 11 a 25) con la red del día, proporcional a la distorsión de tensión y nulo con red ideal. Se calibró con el trafo electrónico en vacío y es coherente con la halógena (THD 4,5 % con THD de tensión 2,4 %). El espectro del ruido es una suposición: las capturas no lo tienen.",

  // ── Analizador (pantalla estilo Fluke 435) ──
  "poli.fluke.title": "Analizador de calidad de energía (simulado)",
  "poli.fluke.help":
    "Réplica de la interfaz del Fluke 435 usado en el laboratorio: cambiá de pantalla con las teclas inferiores, usá F1–F5 (o tocá la pantalla) para elegir canales, cursor, zoom y unidades, y las flechas para mover el cursor o la armónica seleccionada. Los canales L2 y L3 son copias de L1 desfasadas 120° y 240°. En ARMÓNICAS, el neutro se expresa como porcentaje de la fundamental de la corriente de fase.",
  "poli.fluke.brand": "ANALIZADOR",
  "poli.fluke.model": "calidad de energía · estilo Fluke 435",
  "poli.fluke.sim": "SIMULACIÓN",
  "poli.fluke.title.scope": "VOLTIOS/AMPERIOS/HERCIOS - OSCILOSCOPIO",
  "poli.fluke.title.phasor": "VOLTIOS/AMPERIOS/HERCIOS - FASORES",
  "poli.fluke.title.harmonics": "ARMÓNICAS",
  "poli.fluke.title.meter": "VOLTIOS/AMPERIOS/HERCIOS - MEDIDOR",
  "poli.fluke.key.scope": "OSCILOSC.",
  "poli.fluke.key.phasor": "FASORES",
  "poli.fluke.key.harmonics": "ARMÓNICAS",
  "poli.fluke.key.meter": "MEDIDOR",
  "poli.fluke.keys.modes": "Pantallas",
  "poli.fluke.keys.arrows": "Flechas",
  "poli.fluke.arrow.up": "Arriba",
  "poli.fluke.arrow.down": "Abajo",
  "poli.fluke.arrow.left": "Izquierda",
  "poli.fluke.arrow.right": "Derecha",
  "poli.fluke.soft.back": "VOLVER",
  "poli.fluke.soft.cursor": "CURSOR",
  "poli.fluke.soft.on": "ON",
  "poli.fluke.soft.off": "OFF",
  "poli.fluke.soft.zoom": "ZOOM",
  "poli.fluke.phasor.fund": "Fundamental (módulo y ángulo)",
  "poli.fluke.row.vpk": "Vpico (V)",
  "poli.fluke.row.apk": "Apico (A)",
  "poli.fluke.row.cfV": "FC tensión",
  "poli.fluke.row.cfA": "FC corriente",
  "poli.fluke.row.pf": "FP",
};

export const en: Record<string, string> = {
  // ── Navigation ──
  "poli.nav.ensayos": "Tests",
  "poli.nav.simulador": "Simulator",

  // ── Theory ──
  "poli.theory.badge": "Assignment 4",
  "poli.theory.title": "Polyharmonic regime",
  "poli.theory.intro":
    "Waveform and harmonic content of the currents drawn by different single-phase loads, and neutral return current in three-phase loads. (The course handout numbers it as assignment 5.)",

  "poli.theory.objectives.title": "Objectives",
  "poli.theory.objectives.item1":
    "Experimentally verify the waveform and harmonic content of the currents of different types of single-phase loads.",
  "poli.theory.objectives.item2":
    "Analyze, for three-phase loads, the waveform and harmonic content of the neutral return currents.",

  "poli.theory.summary.title": "Theory summary",
  "poli.theory.summary.p1":
    "A periodic non-sinusoidal current decomposes into a Fourier series: a 50 Hz fundamental plus harmonics at h·50 Hz. This is called the polyharmonic regime.",
  "poli.theory.summary.p2":
    "The RMS value is I_RMS = √(I₁² + I₂² + I₃² + …) and the total harmonic distortion is THD_I = √(I₂² + I₃² + …)/I₁, so I_RMS = I₁·√(1 + THD_I²). If I_RMS exceeds I₁ there is harmonic content.",
  "poli.theory.summary.p3":
    "Linear loads (halogen, tubes, loaded transformer) generate no harmonics; non-linear ones (CFL, LED, unloaded transformer, switching supplies) draw distorted currents even with a sinusoidal voltage.",
  "poli.theory.summary.p4":
    "In a balanced three-phase system the harmonics that are multiples of 3 are in phase across the three phases and add up in the neutral (I_N ≈ 3·I₃). That is why, with non-linear loads, the neutral can carry more current than each phase.",
  "poli.theory.summary.p5":
    "A parallel capacitor corrects the phase shift but not the distortion; its current is also proportional to the order of each voltage harmonic (I_h = h·ω·C·V_h), so it amplifies the distortion the grid already has.",

  "poli.theory.summary.p6":
    "Active power is P = P₁ + P₂ + P₃ + …, with P_h = V_h·I_h·cos φ_h: only voltage and current harmonics of the same frequency contribute. With a pure sinusoidal voltage all the active power would be in the fundamental, however distorted the current is. Because the grid voltage arrives distorted, there is also active power in the 3rd, 5th, 7th…, which is why the fundamental active power and the total do not match in value.",

  "poli.theory.material.title": "Equipment used",
  "poli.theory.material.item1":
    "Three-phase bench with, per phase: a 53 W halogen lamp, a 15 W compact fluorescent, a 15 W LED lamp and a socket with one load (R: 2×36 W fluorescent fixture; S: 12 V dichroic with conventional transformer; T: 12 V dichroic with electronic transformer).",
  "poli.theory.material.item2": "Fluke 435 power quality analyzer.",
  "poli.theory.material.item3":
    "Analog ammeter, voltmeter and wattmeter, and a multimeter.",

  "poli.theory.nav.ens.title": "Measured tests",
  "poli.theory.nav.ens.desc":
    "The Fluke captures for each test (Parts A, B and C) with their readings, description and analysis.",
  "poli.theory.nav.sim.title": "Grid simulator",
  "poli.theory.nav.sim.desc":
    "Distort the grid voltage and see how each load's current and the neutral current change. It is a simulation, not a measurement.",

  "poli.theory.limits.title": "What this work does not have",
  "poli.theory.limits.item1":
    "The lab captures contain no harmonic spectrum. The THD shown is an estimate from I_RMS and I₁ on the same screen.",
  "poli.theory.limits.item2":
    "There are no readings from the analog instruments, so there is no comparison against the Fluke.",
  "poli.theory.limits.item3":
    "The simulator models are simplifications calibrated against the captures; they reproduce what was measured, not the exact behavior of each device.",

  // ── Tests (viewer) ──
  "poli.ens.eyebrow": "Lab results",
  "poli.ens.title": "Measured tests",
  "poli.ens.intro":
    "Captures from the Fluke 435 analyzer (09/11/2017). Each test shows the readings transcribed from the screens and the original images. A dash (—) means the value cannot be read in any capture.",
  "poli.ens.codes.title": "How to read the test codes",
  "poli.ens.codes.intro":
    "Each lab capture has a course code, which matches its file name. It is built as: Part + Load + Connection + capture number.",
  "poli.ens.codes.example":
    "Example: ADCM2 = Part A · dichroic with conventional transformer (loaded) · single-phase · capture 2 (phasor diagram).",
  "poli.ens.codes.h.part": "Part",
  "poli.ens.codes.h.load": "Load",
  "poli.ens.codes.h.conn": "Connection",
  "poli.ens.codes.part.A": "Linear loads",
  "poli.ens.codes.part.B": "Non-linear loads",
  "poli.ens.codes.part.C": "Mixed loads",
  "poli.ens.codes.load.H": "Halogen",
  "poli.ens.codes.load.T": "Fluorescent tubes",
  "poli.ens.codes.load.DC": "Dichroic with conventional transformer (loaded)",
  "poli.ens.codes.load.DCV": "Conventional transformer, no load",
  "poli.ens.codes.load.DE": "Electronic transformer, no load",
  "poli.ens.codes.load.BC": "CFL (low-energy lamp)",
  "poli.ens.codes.load.L": "LED",
  "poli.ens.codes.load.TC1": "Tubes with compensation",
  "poli.ens.codes.load.TC2": "Tubes with a capacitor bank connected on top",
  "poli.ens.codes.load.TCL": "Uncompensated tubes + LED + CFL",
  "poli.ens.codes.conn.M": "Single-phase (phase R)",
  "poli.ens.codes.conn.B": "Unbalanced (two phases, R and S)",
  "poli.ens.codes.conn.T": "Balanced (three phases)",
  "poli.ens.codes.capture":
    "The capture number (1, 2, 3) tells which Fluke screen it is; it varies by test, so each capture says what it shows.",
  "poli.ens.part.A": "Part A · Linear",
  "poli.ens.part.B": "Part B · Non-linear",
  "poli.ens.part.C": "Part C · Mixed",
  "poli.ens.partLabel": "Test part",
  "poli.ens.pickLabel": "Test",
  "poli.ens.readings": "Readings",
  "poli.ens.captures": "Captures",
  "poli.ens.read.U": "Voltage U",
  "poli.ens.read.I": "I_RMS phases",
  "poli.ens.read.I1": "Fundamental I₁ (L1)",
  "poli.ens.read.phi": "φ₁ (current−voltage)",
  "poli.ens.read.IN": "Neutral current",
  "poli.ens.read.ratio": "I_N / I_L1",
  "poli.ens.read.thd": "Estimated THD_I",
  "poli.ens.thdNote":
    "Estimated THD_I = √(I_RMS² − I₁²)/I₁ with both values from the same screen (3-digit resolution: indicative only).",
  "poli.ens.read.thdMeas": "Measured THD_I",
  "poli.ens.col.thdMeas": "Meas. THD_I",
  "poli.ens.orders": "Dominant harmonics noted",
  "poli.ens.thdMeasNote":
    "Measured THD_I: value recorded by a classmate during the lab (handwritten notes); it is not in the professor's captures. It is shown next to the estimate, which is computed from I_RMS and I₁ in the captures. The two may differ.",
  "poli.ens.thdFlag.idem":
    "Noted as “idem”: same as the single-phase test of the same load.",
  "poli.ens.thdFlag.noise":
    "The electronic transformer draws no current at no load (no-load protection): this value is noise and not representative.",
  "poli.ens.thdFlag.mapping":
    "The note says “compensated” without telling TC1 from TC2: it is assigned to TC1 as an assumed match.",
  "poli.ens.phiNote": "Positive φ = leading current; negative = lagging.",
  "poli.ens.cap.osc-ui": "U and I oscillogram",
  "poli.ens.cap.osc-fases": "Current oscillogram (phases and neutral)",
  "poli.ens.cap.osc-neutro": "Neutral current oscillogram",
  "poli.ens.cap.fasorial": "Phasor diagram",
  "poli.ens.summary.title": "Summary of all tests",
  "poli.ens.col.test": "Test",
  "poli.ens.col.U": "U",
  "poli.ens.col.I": "I_L1",
  "poli.ens.col.I1": "I₁",
  "poli.ens.col.phi": "φ₁",
  "poli.ens.col.thd": "Est. THD_I",
  "poli.ens.col.ratio": "I_N/I_L1",
  "poli.ens.conc.title": "Conclusions",
  "poli.ens.conc.1":
    "Linear loads (halogen) give a sinusoidal current in phase with the voltage and, when balanced, an almost null neutral (0.015 A).",
  "poli.ens.conc.2":
    "CFL and LED lamps draw pulsed currents: I_RMS far above I₁ (estimated THD ≈ 87 % and ≈ 153 %).",
  "poli.ens.conc.3":
    "With balanced non-linear loads the neutral does not cancel: it carries ≈ 1.65 times (CFL) and ≈ 1.70 times (LED) the phase current, from the sum of harmonics that are multiples of 3. The neutral must be sized accordingly.",
  "poli.ens.conc.4":
    "Capacitive compensation of the tubes lowers the current and the phase shift (from −57° to −16°) but does not fix the distortion; over-compensation (TC2) leaves the current leading.",
  "poli.ens.conc.5":
    "The conventional transformer at no load draws a distorted, strongly lagging magnetizing current; the electronic one draws a minimal current with high-frequency ripple.",

  "poli.ens.AHM.name": "Halogen 53 W · single-phase",
  "poli.ens.AHM.desc":
    "Sinusoidal voltage and current in phase (φ ≈ +2°): resistive load. I_RMS = I₁ = 0.270 A, no appreciable harmonic content. The neutral current (0.277 A) is phase R's current, the only return path.",
  "poli.ens.AHB.name": "Halogen · three-phase unbalanced (R and S)",
  "poli.ens.AHB.desc":
    "With two loaded phases (0.270 and 0.258 A, 120° apart) the neutral carries about one phase current (0.264 A): the phasor sum of two equal currents 120° apart has the same magnitude. The waveforms remain sinusoidal.",
  "poli.ens.AHT.name": "Halogen · three-phase balanced",
  "poli.ens.AHT.desc":
    "Three equal sinusoidal currents 120° apart: the neutral is almost null (0.015 A). With a linear balanced load the neutral does not carry current.",
  "poli.ens.ATM.name": "Fluorescent tubes 2×36 W · single-phase",
  "poli.ens.ATM.desc":
    "R-L load (ballast): current lagging by 57° (cos φ₁ ≈ 0.54). Distortion is small compared with the phase shift (estimated THD ≈ 11 %). I_RMS varies ≈ 3.5 % between consecutive captures (0.823–0.853 A).",
  "poli.ens.ADCM.name": "Dichroic 12 V / 50 W with conventional transformer (loaded)",
  "poli.ens.ADCM.desc":
    "With the transformer loaded the current is sinusoidal and almost in phase (φ = −7°). It contrasts with the same transformer at no load (Part B), whose current is distorted and lagging by 63°. The handout says “12 W”; it is read as 12 V.",
  "poli.ens.BDCVM.name": "Conventional dichroic transformer · no load",
  "poli.ens.BDCVM.desc":
    "This is the magnetizing current: non-sinusoidal because of core saturation and strongly lagging (φ = −63°). Estimated THD ≈ 38 %.",
  "poli.ens.BDEM.name": "Electronic dichroic transformer · no load",
  "poli.ens.BDEM.desc":
    "A very small current (0.017 A) with high-frequency ripple from the switching stage. It is close to the instrument's resolution limit, so I_RMS and I₁ cannot be used to estimate the THD.",
  "poli.ens.BBCM.name": "CFL 15 W · single-phase",
  "poli.ens.BBCM.desc":
    "Pulsed, strongly distorted current; the fundamental leads the voltage by 25° (rectifier with filter capacitor). Estimated THD ≈ 87 %.",
  "poli.ens.BBCB.name": "CFL · three-phase unbalanced (R and S)",
  "poli.ens.BBCB.desc":
    "The neutral (0.166 A) exceeds each phase current (0.125 and 0.112 A): besides the phasor sum of the fundamentals, harmonics add up.",
  "poli.ens.BBCT.name": "CFL · three-phase balanced",
  "poli.ens.BBCT.desc":
    "The neutral does not cancel: it carries 0.206 A, ≈ 1.65 times the phase current, because harmonics that are multiples of 3 are in phase across the three phases and add up.",
  "poli.ens.BLM.name": "LED 15 W · single-phase",
  "poli.ens.BLM.desc":
    "Narrow, high-amplitude pulses with almost zero current for the rest of the half-cycle. I_RMS = 0.152 A versus I₁ = 0.083 A: estimated THD ≈ 153 %. Fundamental leading by 12°.",
  "poli.ens.BLB.name": "LED · three-phase unbalanced (R and S)",
  "poli.ens.BLB.desc":
    "The neutral (0.205 A) exceeds each phase current (0.149 and 0.133 A).",
  "poli.ens.BLT.name": "LED · three-phase balanced",
  "poli.ens.BLT.desc":
    "The neutral carries 0.259 A, ≈ 1.70 times the phase current even though the load is balanced: triplen harmonics adding up.",
  "poli.ens.CTC1.name": "Tubes 2×36 W with capacitive compensation (TC1)",
  "poli.ens.CTC1.desc":
    "Compensation lowers the current (from 0.82 A to 0.48 A) and the phase shift (from −57° to −16°), but does not remove the distortion (estimated THD ≈ 28 %): the current keeps high-frequency components.",
  "poli.ens.CTC2.name": "Tubes with a capacitor bank connected (TC2)",
  "poli.ens.CTC2.desc":
    "Same fixture with a capacitor bank connected on top: the current leads by 45° (over-compensation) and rises again to 0.65 A. The active component equals TC1's (≈ 0.44 A); only the reactive part changes. The equivalent capacitance comes out ≈ twice TC1's (≈ 15.8 µF versus ≈ 7.9 µF; computed from the readings, the real values are not known).",
  "poli.ens.CTCL.name": "Uncompensated tubes + non-linear loads (TCL)",
  "poli.ens.CTCL.desc":
    "Total current ≈ 1.01 A with φ = −46°; the neutral (1.043 A) exceeds the phase current. The exact load composition is not documented (inferred: uncompensated tubes plus non-linear lamps).",

  // ── Simulator ──
  "poli.sim.eyebrow": "Simulation",
  "poli.sim.title": "Grid interference simulator",
  "poli.sim.intro":
    "Pick a load and a connection, and distort the grid voltage. The simulator computes the current in time and its spectrum. The load models are calibrated against the lab captures.",
  "poli.sim.banner":
    "SIMULATION: these values come from simplified models. They are not measurements.",
  "poli.sim.load.title": "Load",
  "poli.sim.load.sinCarga": "No load",
  "poli.sim.load.halogena": "Halogen (linear, R)",
  "poli.sim.load.tubos": "Tubes 2×36 W (R-L)",
  "poli.sim.load.bajoConsumo": "CFL",
  "poli.sim.load.led": "LED",
  "poli.sim.load.trafoVacio": "Conv. transformer, no load",
  "poli.sim.load.bancoCapacitores": "Capacitor bank",
  "poli.sim.load.label": "Load type",
  "poli.sim.conn.title": "Connection",
  "poli.sim.conn.label": "Bench connection",
  "poli.sim.conn.mono": "Single-phase (R)",
  "poli.sim.conn.bifasica": "Unbalanced (R and S)",
  "poli.sim.conn.trifasica": "Balanced (R, S and T)",
  "poli.sim.tubosC": "Capacitor in parallel with the tubes",
  "poli.sim.tubosC.none": "Uncompensated",
  "poli.sim.tubosC.c1": "Like TC1",
  "poli.sim.tubosC.c2": "Like TC2",
  "poli.sim.tubosC.custom": "Custom value (matches neither TC1 nor TC2)",
  "poli.chart.spectrum.aria": "Harmonic spectrum. Largest components: ",
  "poli.sim.grid.title": "Grid voltage",
  "poli.sim.grid.V1": "Fundamental voltage U₁",
  "poli.sim.grid.v3": "3rd harmonic",
  "poli.sim.grid.v5": "5th harmonic",
  "poli.sim.grid.v7": "7th harmonic",
  "poli.sim.grid.theta": "Harmonic phase",
  "poli.sim.preset.label": "Grid presets",
  "poli.sim.preset.ideal": "Ideal grid",
  "poli.sim.preset.dia": "Grid of the day (THD_V 2.4 %)",
  "poli.sim.preset.distorsionada": "Heavily distorted grid",
  "poli.sim.preset.diaNote":
    "The 2.4 % was reported by the Fluke; the split between 5th and 7th harmonic is an assumption (not measured).",
  "poli.sim.m.thdV": "THD_V",
  "poli.sim.m.Irms": "I_RMS phase",
  "poli.sim.m.I1": "I₁",
  "poli.sim.m.phi": "φ₁",
  "poli.sim.m.thdI": "THD_I",
  "poli.sim.m.pf": "Power factor",
  "poli.sim.m.IN": "I_N",
  "poli.sim.m.ratio": "I_N / I_phase",
  "poli.sim.chart.voltage": "Voltage",
  "poli.sim.chart.current": "Current",
  "poli.sim.chart.spectrum": "Current spectrum",
  "poli.sim.chart.timeAxis": "t (ms)",
  "poli.sim.chart.voltageAxis": "u (V)",
  "poli.sim.chart.currentAxis": "i (A)",
  "poli.sim.chart.spectrumAxis": "% of I₁ (phase)",
  "poli.sim.chart.phaseSeries": "I_h phase",
  "poli.sim.chart.neutralSeries": "I_h neutral",
  "poli.sim.chart.orderAxis": "Harmonic order h",
  "poli.sim.cmp.title": "Simulated vs measured",
  "poli.sim.cmp.desc":
    "Compared with the lab test that matches this load and connection. The simulation uses the voltage you set above; the grid distortion in the 2017 lab is unknown, so the ideal grid is the fairest comparison.",
  "poli.sim.cmp.none":
    "There is no equivalent measured test for this combination.",
  "poli.sim.cmp.thdNote":
    "The measured THD_I is the one a classmate noted down. The simulated THD comes from the I_RMS and I₁ of the captures (used for calibration) while the measured one is the Fluke's direct reading: in the report they do not agree with each other (e.g. LED: 153 % vs 93.8 %), so the simulated value can differ a lot from the measured one, mostly for LED and the unloaded transformer. The tubes are modeled as linear: their own THD (≈ 11 %) is not reproduced.",
  "poli.sim.cmp.measured": "Measured",
  "poli.sim.cmp.simulated": "Simulated",
  "poli.sim.cmp.ref": "Reference test",
  "poli.sim.cmp.note":
    "The estimated THD is computed from I_RMS and I₁ on the same screen. The simulated neutral was not fitted: calibration only used I_RMS, I₁ and φ₁ from the single-phase reading.",
  "poli.sim.model.title": "Model of the selected load",
  "poli.sim.model.halogena":
    "R = U/I from capture AHM1. Linear: generates no harmonics.",
  "poli.sim.model.tubos":
    "Series R + jX computed from U, I₁ and φ of ATM2, with an optional parallel capacitor. It is linear: it does not reproduce the ballast and lamp's own distortion (measured estimated THD ≈ 11 %).",
  "poli.sim.model.bajoConsumo":
    "Bridge rectifier with filter capacitor, fitted with I_RMS, I₁ and φ₁ from BBCM2. It reproduces the pulsed current and the neutral increase.",
  "poli.sim.model.led":
    "Bridge rectifier with filter capacitor, fitted with I_RMS, I₁ and φ₁ from BLM1/BLM3.",
  "poli.sim.model.sinCarga":
    "Residual current of the electronic transformer with no load (BDEM): ≈ 17 mA, φ = +5° and THD ≈ 65 % (with that day's grid). A very small linear leakage: with a ≈ 14 mA fundamental, the grid noise (≈ 9 mA with that day's grid, the same for any load) makes the current THD huge even though there is almost no load. The report attributes that THD to noise or the grid.",
  "poli.sim.circuit.cap": "Capacitor",
  "poli.sim.conn.capOnlyR":
    "The capacitors were only tested on phase R: with them the simulator is single-phase.",
  "poli.sim.model.trafoVacio":
    "Saturable magnetizing branch (i = a·λ + b·λ⁷) with core losses, fitted with BDCVM2. Raising U₁ increases saturation.",
  "poli.sim.model.bancoCapacitores":
    "Pure capacitor computed from U and I₁ in the bank photo (2026). The current of each harmonic is h·ω·C·V_h. An ideal capacitor gives φ = 90°; in the photo the phasor read +95° with that day's distorted grid. It is modeled as a shift proportional to the voltage distortion (0° with an ideal grid, +5° at THD_V = 2.4 %).",
  "poli.sim.circuit.title": "Circuit and lamp board",
  "poli.sim.circuit.on": "On",
  "poli.sim.circuit.legend.on": "Lamp on",
  "poli.sim.circuit.legend.conn": "Load connected to the socket",
  "poli.sim.circuit.legend.off": "Off",
  "poli.sim.circuit.ariaLabel":
    "Test circuit diagram: phases R, S and T and neutral connected to the Fluke 435 analyzer and the lamp board.",
  "poli.sim.circuit.note":
    "The currents shown are simulated. The three lamps of each phase are drawn in the order CFL, LED and halogen (top to bottom), taken from the bench photo: the handout does not say, so it is worth confirming.",
  "poli.sim.circuit.noteSocket":
    "With tubes, unloaded transformer or capacitor bank, the simulator uses each phase's socket as if it had that load. On the real bench, AT (phase R), DC (S) and DE (T) are different devices.",
  "poli.sim.lamp.bc": "CFL",
  "poli.sim.lamp.led": "LED",
  "poli.sim.lamp.h": "H",
  "poli.sim.limits.title": "Limitations",
  "poli.sim.limits.item1":
    "The electronic transformer is not simulated (its ripple is high-frequency).",
  "poli.sim.limits.item2":
    "With an ideal grid, tubes and halogen are linear: THD_I only appears if you distort the voltage.",
  "poli.sim.limits.item3":
    "The three-phase neutrals use three identical loads with voltages 120° apart; unbalance only comes from switched-off phases.",
  "poli.sim.limits.item4":
    "Every current includes ≈ 9 mA of grid noise (harmonics 11 to 25) with that day's grid, proportional to the voltage distortion and zero with an ideal grid. It was calibrated with the electronic transformer with no load and is consistent with the halogen lamp (THD 4.5 % with voltage THD 2.4 %). The noise spectrum is an assumption: the captures have none.",

  // ── Analyzer (Fluke 435-style screen) ──
  "poli.fluke.title": "Power quality analyzer (simulated)",
  "poli.fluke.help":
    "Replica of the Fluke 435 interface used in the lab: switch screens with the lower keys, use F1–F5 (or tap the screen) to pick channels, cursor, zoom and units, and the arrows to move the cursor or the selected harmonic. Channels L2 and L3 are copies of L1 shifted by 120° and 240°. On HARMONICS, the neutral is shown as a percentage of the phase-current fundamental.",
  "poli.fluke.brand": "ANALYZER",
  "poli.fluke.model": "power quality · Fluke 435 style",
  "poli.fluke.sim": "SIMULATION",
  "poli.fluke.title.scope": "VOLTS/AMPERES/HERTZ - SCOPE",
  "poli.fluke.title.phasor": "VOLTS/AMPERES/HERTZ - PHASOR",
  "poli.fluke.title.harmonics": "HARMONICS",
  "poli.fluke.title.meter": "VOLTS/AMPERES/HERTZ - METER",
  "poli.fluke.key.scope": "SCOPE",
  "poli.fluke.key.phasor": "PHASOR",
  "poli.fluke.key.harmonics": "HARMONICS",
  "poli.fluke.key.meter": "METER",
  "poli.fluke.keys.modes": "Screens",
  "poli.fluke.keys.arrows": "Arrows",
  "poli.fluke.arrow.up": "Up",
  "poli.fluke.arrow.down": "Down",
  "poli.fluke.arrow.left": "Left",
  "poli.fluke.arrow.right": "Right",
  "poli.fluke.soft.back": "BACK",
  "poli.fluke.soft.cursor": "CURSOR",
  "poli.fluke.soft.on": "ON",
  "poli.fluke.soft.off": "OFF",
  "poli.fluke.soft.zoom": "ZOOM",
  "poli.fluke.phasor.fund": "Fundamental (magnitude and angle)",
  "poli.fluke.row.vpk": "Vpeak (V)",
  "poli.fluke.row.apk": "Apeak (A)",
  "poli.fluke.row.cfV": "CF voltage",
  "poli.fluke.row.cfA": "CF current",
  "poli.fluke.row.pf": "PF",
};
