import { Card } from "@/components/ui/Card";
import { calcRLC, resonantF } from "@/lib/rlc-engine";
import {
  PARTE_B,
  PARTE_B_BASE,
  PARTE_B_RESONANCIA,
  UF,
} from "@/lib/measured-data";
import { fmt } from "@/lib/format";

const f0 = resonantF(PARTE_B.L, PARTE_B.C * UF);
const res = calcRLC({ ...PARTE_B_BASE, f: f0 }); // en resonancia
const r50 = calcRLC({ ...PARTE_B_BASE, f: 50 }); // a 50 Hz
const rz = PARTE_B_RESONANCIA; // resonancia medida (Parte B)

function QA({
  letter,
  question,
  children,
}: {
  letter: string;
  question: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <div className="flex gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
          {letter}
        </span>
        <div className="space-y-2">
          <h2 className="font-semibold text-neutral-800 dark:text-neutral-100">
            {question}
          </h2>
          <div className="space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
            {children}
          </div>
        </div>
      </div>
    </Card>
  );
}

function Num({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-semibold text-blue-600 tabular-nums dark:text-blue-400">
      {children}
    </span>
  );
}

export default function CuestionarioPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-5 px-4 py-8 sm:px-6">
      <header>
        <p className="text-xs font-semibold tracking-wide text-blue-600 uppercase">
          TP N°1 · Cuestionario
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">
          Preguntas y análisis
        </h1>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
          Respuestas orientativas con los valores calculados para el circuito de
          la Parte B (en resonancia, f₀ ≈ {fmt(f0, 0)} Hz).
        </p>
      </header>

      <QA
        letter="a"
        question="¿Cómo se hubiera comportado el circuito si los ensayos se hacían con el circuito en paralelo?"
      >
        <p>
          En el <strong>RLC paralelo</strong> los roles se invierten respecto al
          serie. En resonancia la <strong>impedancia es máxima</strong> (no
          mínima), por lo que la{" "}
          <strong>corriente total de línea es mínima</strong> (en el serie es
          máxima). La tensión es común a las tres ramas, y son las{" "}
          <strong>corrientes</strong> de L y C las que se amplifican y se
          compensan entre sí (Q·I), en lugar de las tensiones. La potencia
          activa sigue siendo la única consumida (la reactiva se cancela) y el
          factor de potencia vuelve a ser 1.
        </p>
      </QA>

      <QA
        letter="b"
        question="En resonancia, ¿cómo resultaron las caídas de tensión? Considere el factor de mérito Q."
      >
        <p>
          En resonancia{" "}
          <Num>
            X<sub>L</sub> = X<sub>C</sub>
          </Num>
          , así que las caídas medidas sobre la bobina y el capacitor quedan
          muy próximas entre sí:{" "}
          <Num>
            U<sub>L</sub> = {fmt(rz.UL, 2)} V
          </Num>{" "}
          y{" "}
          <Num>
            U<sub>C</sub> = {fmt(rz.UC, 2)} V
          </Num>
          , muy por encima de la tensión de fuente (
          <Num>{fmt(rz.U, 1)} V</Num>). Esa amplificación es justamente el
          factor de mérito:{" "}
          <Num>
            Q = U<sub>L</sub>/U ≈ {fmt(rz.UL / rz.U, 1)}
          </Num>
          .
        </p>
        <p>
          <strong>Doble lectura de Q:</strong> respecto a la resistencia
          externa R,{" "}
          <Num>
            Q = U<sub>C</sub>/U_RS ≈ {fmt(rz.UC / rz.URS, 1)}
          </Num>
          . La diferencia con el valor anterior (≈{fmt(rz.UL / rz.U, 1)})
          revela la <strong>resistencia interna R</strong>
          <sub>L</sub> <strong>de la bobina</strong>: el exceso{" "}
          <Num>
            U − U_RS ≈ {fmt(rz.U - rz.URS, 2)} V
          </Num>{" "}
          cae en ella, no en la R externa. El Q correcto, el de la resistencia
          total del circuito, es{" "}
          <Num>Q ≈ {fmt(rz.UL / rz.U, 0)}</Num>.
        </p>
      </QA>

      <QA
        letter="c"
        question="¿Qué sucedió con las potencias y el factor de potencia en resonancia? Justifique."
      >
        <p>
          Al anularse la reactancia neta, la{" "}
          <strong>potencia reactiva se hace cero</strong> (
          <Num>Q ≈ {fmt(res.Qreact, 3)} VAR</Num>) y toda la potencia es activa:{" "}
          <Num>P = {fmt(res.P * 1000, 1)} mW</Num>. La potencia aparente
          coincide con la activa, por lo que el{" "}
          <strong>factor de potencia es máximo</strong>:{" "}
          <Num>cos φ = {fmt(res.fp, 3)}</Num> con{" "}
          <Num>φ = {fmt(res.phiDeg, 1)}°</Num>.
        </p>
      </QA>

      <QA
        letter="d"
        question="¿Cómo resultaron la corriente y la impedancia en el estado de resonancia?"
      >
        <p>
          En la resonancia medida (medición N°{rz.n}, ~{fmt(rz.f, 0)} Hz) la
          impedancia es <strong>mínima</strong> y la{" "}
          <strong>corriente es máxima</strong>: la tensión sobre la
          resistencia externa alcanza su valor más alto (
          <Num>U_RS = {fmt(rz.URS, 3)} V</Num>), lo que implica{" "}
          <Num>I = {fmt((rz.URS / PARTE_B.R) * 1000, 1)} mA</Num> máxima. Fuera
          de f₀ la corriente cae a ambos lados, dibujando el pico en la tabla
          medida.
        </p>
      </QA>

      <QA
        letter="e"
        question="¿Qué hubiera pasado alimentando el circuito de la Parte B a una frecuencia industrial de 50 Hz?"
      >
        <p>
          Esta pregunta es hipotética: no se midió a 50 Hz en la Parte B, así
          que la proyección siguiente es{" "}
          <strong>
            teórica, calculada con los elementos R/L/C estimados
          </strong>{" "}
          (no medidos) de este ensayo. A 50 Hz estaríamos muy por debajo de f₀
          ({fmt(f0, 0)} Hz), en zona fuertemente <strong>capacitiva</strong>:{" "}
          <Num>
            X<sub>C</sub> = {fmt(r50.XC, 0)} Ω
          </Num>{" "}
          es enorme frente a{" "}
          <Num>
            X<sub>L</sub> = {fmt(r50.XL, 0)} Ω
          </Num>
          . La impedancia resulta altísima (
          <Num>Z = {fmt(r50.Z, 0)} Ω</Num>) y la corriente, ínfima (
          <Num>I = {fmt(r50.I * 1000, 3)} mA</Num>). El circuito se comporta
          casi como un capacitor: <Num>φ = {fmt(r50.phiDeg, 1)}°</Num> (la
          corriente adelanta a la tensión) y prácticamente no hay transferencia
          de potencia.
        </p>
      </QA>
    </main>
  );
}
