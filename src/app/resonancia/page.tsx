import Link from "next/link";
import { Card } from "@/components/ui/Card";

const OBJETIVOS = [
  "Verificar experimentalmente la respuesta de un circuito RLC serie y su respuesta en frecuencia al ser excitado por una tensión senoidal de frecuencia variable.",
  "Realizar diagramas fasoriales y de impedancia.",
  "Calcular las magnitudes no medidas con las fórmulas teóricas y completar las tablas.",
  "Analizar las respuestas y sacar conclusiones.",
  "Responder el cuestionario.",
];

function Formula({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[0.95em] text-neutral-800 dark:bg-neutral-800 dark:text-neutral-100">
      {children}
    </code>
  );
}

export default function ResonanciaHub() {
  return (
    <main className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6">
      <header>
        <p className="text-xs font-semibold tracking-wide text-blue-600 uppercase">
          TP N°1
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">Resonancia</h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-300">
          Estudio de un circuito RLC serie en dos ensayos: variando la capacidad
          a frecuencia fija (Parte A) y variando la frecuencia con los elementos
          fijos (Parte B).
        </p>
      </header>

      <Card title="Objetivos">
        <ol className="list-decimal space-y-1.5 pl-5 text-sm text-neutral-700 dark:text-neutral-300">
          {OBJETIVOS.map((o, i) => (
            <li key={i}>{o}</li>
          ))}
        </ol>
      </Card>

      <Card title="Resumen teórico">
        <div className="space-y-3 text-sm text-neutral-700 dark:text-neutral-300">
          <p>
            En un circuito <strong>RLC serie</strong> la impedancia es{" "}
            <Formula>
              Z = (R + R<sub>L</sub>) + j(X<sub>L</sub> − X<sub>C</sub>)
            </Formula>
            , con <Formula>X<sub>L</sub> = ωL</Formula> y{" "}
            <Formula>X<sub>C</sub> = 1/(ωC)</Formula>. El ángulo de fase es{" "}
            <Formula>
              φ = arctg((X<sub>L</sub> − X<sub>C</sub>)/(R + R<sub>L</sub>))
            </Formula>
            .
          </p>
          <p>
            La <strong>resonancia</strong> ocurre cuando{" "}
            <Formula>
              X<sub>L</sub> = X<sub>C</sub>
            </Formula>
            : la reactancia neta se anula, la
            impedancia es mínima e igual a la resistencia total, y la corriente
            es máxima. La frecuencia de resonancia es{" "}
            <Formula>f₀ = 1/(2π·√(L·C))</Formula>.
          </p>
          <p>
            En resonancia el circuito es puramente resistivo:{" "}
            <Formula>φ = 0</Formula> y el factor de potencia es{" "}
            <Formula>cos φ = 1</Formula>. Las caídas sobre la bobina y el
            capacitor se igualan y pueden superar ampliamente la tensión de
            fuente, en una relación dada por el{" "}
            <strong>factor de mérito</strong>{" "}
            <Formula>
              Q = (1/(R+R<sub>L</sub>))·√(L/C)
            </Formula>
            , ya que{" "}
            <Formula>
              U<sub>L</sub> = U<sub>C</sub> = Q·U
            </Formula>
            .
          </p>
        </div>
      </Card>

      <Card title="Procedimiento de medición">
        <p className="text-sm text-neutral-700 dark:text-neutral-300">
          Para cada ensayo se arma el circuito sin energizar, se ajustan las
          escalas de los instrumentos, se eleva la tensión desde cero hasta el
          valor pedido y se registran las lecturas leyendo en el último tercio
          de escala para minimizar errores. Luego se baja la tensión a cero y se
          desarma el circuito.
        </p>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <NavCard
          href="/resonancia/parte-a"
          tag="Parte A"
          title="Varía la capacidad C"
          desc="f = 50 Hz fija. Barrido de C y barrido de frecuencia para f₀."
        />
        <NavCard
          href="/resonancia/parte-b"
          tag="Parte B"
          title="Varía la frecuencia f"
          desc="R, L, C fijos. Resonancia en ≈509 Hz."
        />
        <NavCard
          href="/resonancia/cuestionario"
          tag="Cuestionario"
          title="5 preguntas"
          desc="Análisis y valores de apoyo calculados."
        />
      </div>
    </main>
  );
}

function NavCard({
  href,
  tag,
  title,
  desc,
}: {
  href: string;
  tag: string;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-neutral-200 bg-white p-4 transition-colors hover:border-blue-400 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-blue-600"
    >
      <span className="text-xs font-semibold tracking-wide text-blue-600 uppercase">
        {tag}
      </span>
      <h3 className="mt-1 font-semibold">{title}</h3>
      <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
        {desc}
      </p>
    </Link>
  );
}
