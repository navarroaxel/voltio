export const es: Record<string, string> = {
  "quiz.title": "TP N°1 · Cuestionario",
  "quiz.heading": "Preguntas y análisis",
  "quiz.intro.p1":
    "Respuestas basadas en los valores medidos de la Parte B (resonancia en f₀ ≈",
  "quiz.intro.p2": "Hz).",

  "quiz.q1.question":
    "¿Cómo se hubiera comportado el circuito si los ensayos se hacían con el circuito en paralelo?",
  "quiz.q1.p1": "En el",
  "quiz.q1.strong1": "RLC paralelo",
  "quiz.q1.p2": "los roles se invierten respecto al serie. En resonancia la",
  "quiz.q1.strong2": "impedancia es máxima",
  "quiz.q1.p3": "(no mínima), por lo que la",
  "quiz.q1.strong3": "corriente total de línea es mínima",
  "quiz.q1.p4": "(en el serie es máxima). La tensión es común a las tres ramas, y son las",
  "quiz.q1.strong4": "corrientes",
  "quiz.q1.p5":
    "de L y C las que se amplifican y se compensan entre sí (Q·I), en lugar de las tensiones. La potencia activa sigue siendo la única consumida (la reactiva se cancela) y el factor de potencia vuelve a ser 1.",

  "quiz.q2.question":
    "En resonancia, ¿cómo resultaron las caídas de tensión? Considere el factor de mérito Q.",
  "quiz.q2.p1a": "En resonancia",
  "quiz.q2.p1b":
    ", así que las caídas medidas sobre la bobina y el capacitor quedan muy próximas entre sí:",
  "quiz.q2.p1c": "y",
  "quiz.q2.p1d": ", muy por encima de la tensión de fuente (",
  "quiz.q2.p1e": "). Esa amplificación es justamente el factor de mérito:",
  "quiz.q2.p1f": ".",
  "quiz.q2.strong1": "Doble lectura de Q:",
  "quiz.q2.p2a": "respecto a la resistencia externa R,",
  "quiz.q2.p2b": ". La diferencia con el valor anterior (≈",
  "quiz.q2.p2c": ") revela la",
  "quiz.q2.strong2": "resistencia interna R",
  "quiz.q2.strong3": "de la bobina",
  "quiz.q2.p2d": ": el exceso",
  "quiz.q2.p2e":
    "cae en ella, no en la R externa. El Q correcto, el de la resistencia total del circuito, es",
  "quiz.q2.p2f": ".",

  "quiz.q3.question":
    "¿Qué sucedió con las potencias y el factor de potencia en resonancia? Justifique.",
  "quiz.q3.p1": "En resonancia",
  "quiz.q3.p2":
    ": las reactancias se cancelan y la impedancia que ve la fuente es puramente resistiva. Tensión y corriente quedan en fase, así que el factor de potencia es máximo,",
  "quiz.q3.p3": "con",
  "quiz.q3.p4": ".",
  "quiz.q3.strongActive": "Potencia activa:",
  "quiz.q3.p5":
    "es máxima en resonancia. Con la impedancia mínima y la corriente en fase con la tensión, todo el producto U·I es potencia útil,",
  "quiz.q3.p6":
    ", máxima porque I lo es. Toda se disipa en las resistencias: ni L ni C consumen potencia activa.",
  "quiz.q3.strongReactive": "Potencia reactiva neta nula:",
  "quiz.q3.p7": "cada elemento reactivo maneja reactiva por separado —",
  "quiz.q3.p8": "— pero como las tensiones medidas",
  "quiz.q3.p9":
    "se oponen en fase, se cancelan. La energía oscila internamente entre L y C; la fuente solo entrega lo que disipan las resistencias.",

  "quiz.q4.question":
    "¿Cómo resultaron la corriente y la impedancia en el estado de resonancia?",
  "quiz.q4.p1": "En la resonancia medida (medición N°",
  "quiz.q4.p2": ", ~",
  "quiz.q4.p3": "Hz) la impedancia es",
  "quiz.q4.strong1": "mínima",
  "quiz.q4.p4": "y la",
  "quiz.q4.strong2": "corriente es máxima",
  "quiz.q4.p5":
    ": la tensión sobre la resistencia externa alcanza su valor más alto (",
  "quiz.q4.p6": ") y, como",
  "quiz.q4.p7":
    ", la corriente también es máxima ahí. Fuera de f₀ la corriente cae a ambos lados, dibujando el pico en la tabla medida.",

  "quiz.q5.question":
    "¿Qué hubiera pasado alimentando el circuito de la Parte B a una frecuencia industrial de 50 Hz?",
  "quiz.q5.p1":
    "Esta pregunta es hipotética: no se midió a 50 Hz en la Parte B, así que la proyección siguiente es",
  "quiz.q5.strong1":
    "teórica, calculada con los elementos R/L/C estimados",
  "quiz.q5.p2":
    "(no medidos) de este ensayo. A 50 Hz estaríamos muy por debajo de f₀ (",
  "quiz.q5.p3": "Hz), en zona fuertemente",
  "quiz.q5.strong2": "capacitiva",
  "quiz.q5.p4": ":",
  "quiz.q5.p5": "es enorme frente a",
  "quiz.q5.p6": ". La impedancia resulta altísima (",
  "quiz.q5.p7": ") y la corriente, ínfima (",
  "quiz.q5.p8": "). El circuito se comporta casi como un capacitor:",
  "quiz.q5.p9":
    "(la corriente adelanta a la tensión) y prácticamente no hay transferencia de potencia.",
};

export const en: Record<string, string> = {
  "quiz.title": "TP #1 · Questionnaire",
  "quiz.heading": "Questions and analysis",
  "quiz.intro.p1":
    "Indicative answers using the values calculated for the Part B circuit (at resonance, f₀ ≈",
  "quiz.intro.p2": "Hz).",

  "quiz.q1.question":
    "How would the circuit have behaved if the tests had been done with the circuit in parallel?",
  "quiz.q1.p1": "In the",
  "quiz.q1.strong1": "parallel RLC",
  "quiz.q1.p2": "the roles are reversed compared to the series circuit. At resonance the",
  "quiz.q1.strong2": "impedance is maximum",
  "quiz.q1.p3": "(not minimum), so the",
  "quiz.q1.strong3": "total line current is minimum",
  "quiz.q1.p4":
    "(in the series circuit it is maximum). The voltage is common to the three branches, and it is the",
  "quiz.q1.strong4": "currents",
  "quiz.q1.p5":
    "in L and C that get amplified and cancel each other out (Q·I), instead of the voltages. Active power remains the only power actually consumed (reactive power cancels out) and the power factor is again 1.",

  "quiz.q2.question":
    "At resonance, how did the voltage drops turn out? Consider the quality factor Q.",
  "quiz.q2.p1a": "At resonance",
  "quiz.q2.p1b":
    ", so the drops measured across the inductor and the capacitor end up very close to each other:",
  "quiz.q2.p1c": "and",
  "quiz.q2.p1d": ", well above the source voltage (",
  "quiz.q2.p1e": "). That amplification is precisely the quality factor:",
  "quiz.q2.p1f": ".",
  "quiz.q2.strong1": "Two readings of Q:",
  "quiz.q2.p2a": "relative to the external resistance R,",
  "quiz.q2.p2b": ". The difference from the earlier value (≈",
  "quiz.q2.p2c": ") reveals the",
  "quiz.q2.strong2": "internal resistance R",
  "quiz.q2.strong3": "of the inductor",
  "quiz.q2.p2d": ": the excess",
  "quiz.q2.p2e":
    "drops across it, not across the external R. The correct Q, using the circuit's total resistance, is",
  "quiz.q2.p2f": ".",

  "quiz.q3.question":
    "What happened to the powers and the power factor at resonance? Justify your answer.",
  "quiz.q3.p1": "At resonance",
  "quiz.q3.p2":
    ": the reactances cancel and the impedance seen by the source is purely resistive. Voltage and current are in phase, so the power factor is maximum,",
  "quiz.q3.p3": "with",
  "quiz.q3.p4": ".",
  "quiz.q3.strongActive": "Active power:",
  "quiz.q3.p5":
    "is maximum at resonance. With minimum impedance and current in phase with the voltage, the whole product U·I becomes useful power,",
  "quiz.q3.p6":
    ", maximum because I is. All of it is dissipated in the resistances: neither L nor C consumes active power.",
  "quiz.q3.strongReactive": "Net reactive power is zero:",
  "quiz.q3.p7": "each reactive element handles reactive power separately —",
  "quiz.q3.p8": "— but since the measured voltages",
  "quiz.q3.p9":
    "are in phase opposition, they cancel. Energy oscillates internally between L and C; the source only supplies what the resistances dissipate.",

  "quiz.q4.question":
    "How did the current and the impedance turn out at the resonance state?",
  "quiz.q4.p1": "At the measured resonance (reading N°",
  "quiz.q4.p2": ", ~",
  "quiz.q4.p3": "Hz) the impedance is",
  "quiz.q4.strong1": "minimum",
  "quiz.q4.p4": "and the",
  "quiz.q4.strong2": "current is maximum",
  "quiz.q4.p5":
    ": the voltage across the external resistor reaches its highest value (",
  "quiz.q4.p6": ") and, since",
  "quiz.q4.p7":
    ", the current is maximum there too. Away from f₀ the current drops on both sides, tracing the peak in the measured table.",

  "quiz.q5.question":
    "What would have happened feeding the Part B circuit at an industrial frequency of 50 Hz?",
  "quiz.q5.p1":
    "This question is hypothetical: 50 Hz was not measured in Part B, so the following projection is",
  "quiz.q5.strong1":
    "theoretical, calculated with the estimated R/L/C elements",
  "quiz.q5.p2":
    "(not measured) for this test. At 50 Hz we would be well below f₀ (",
  "quiz.q5.p3": "Hz), in a strongly",
  "quiz.q5.strong2": "capacitive",
  "quiz.q5.p4": "region:",
  "quiz.q5.p5": "is huge compared to",
  "quiz.q5.p6": ". The impedance turns out very high (",
  "quiz.q5.p7": ") and the current, negligible (",
  "quiz.q5.p8": "). The circuit behaves almost like a capacitor:",
  "quiz.q5.p9":
    "(the current leads the voltage) and there is practically no power transfer.",
};
