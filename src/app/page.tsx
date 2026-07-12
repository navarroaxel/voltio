import Link from "next/link";

interface TPCard {
  n: number;
  title: string;
  desc: string;
  href?: string;
  status: "activo" | "próximamente";
}

const TPS: TPCard[] = [
  {
    n: 1,
    title: "Resonancia",
    desc: "Circuito RLC serie: respuesta variando la capacidad (Parte A) y variando la frecuencia (Parte B).",
    href: "/resonancia",
    status: "activo",
  },
  {
    n: 2,
    title: "Sistemas trifásicos",
    desc: "Cargas en estrella y triángulo, tensiones y corrientes de línea y de fase.",
    status: "próximamente",
  },
  {
    n: 3,
    title: "Régimen poliarmónico",
    desc: "Análisis de señales no senoidales y descomposición en armónicas.",
    status: "próximamente",
  },
  {
    n: 4,
    title: "Circuitos acoplados",
    desc: "Inductancia mutua y acoplamiento magnético entre bobinas.",
    status: "próximamente",
  },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-10 max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight">
          Trabajos prácticos de Electrotécnica I
        </h1>
        <p className="mt-3 text-neutral-600 dark:text-neutral-300">
          Simuladores interactivos para los laboratorios de la cátedra
          (UTN&nbsp;–&nbsp;FRBA). Cada TP muestra los datos medidos en el
          laboratorio junto con las curvas teóricas, calcula las magnitudes y
          arma los gráficos y diagramas que pide el informe.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {TPS.map((tp) => {
          const inner = (
            <>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold tracking-wide text-blue-600 uppercase">
                  TP N°{tp.n}
                </span>
                <span
                  className={
                    tp.status === "activo"
                      ? "rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-950 dark:text-green-300"
                      : "rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
                  }
                >
                  {tp.status}
                </span>
              </div>
              <h2 className="mt-2 text-xl font-semibold">{tp.title}</h2>
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
                {tp.desc}
              </p>
            </>
          );
          return tp.href ? (
            <Link
              key={tp.n}
              href={tp.href}
              className="rounded-xl border border-neutral-200 bg-white p-5 transition-colors hover:border-blue-400 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-blue-600"
            >
              {inner}
            </Link>
          ) : (
            <div
              key={tp.n}
              className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50/50 p-5 opacity-70 dark:border-neutral-800 dark:bg-neutral-900/40"
            >
              {inner}
            </div>
          );
        })}
      </div>
    </main>
  );
}
