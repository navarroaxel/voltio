export function Footer() {
  return (
    <footer className="mt-8 border-t border-neutral-200 px-4 py-6 text-sm text-neutral-500 sm:px-6 dark:border-neutral-800 dark:text-neutral-400">
      <div className="mx-auto max-w-6xl space-y-2">
        <p>
          <span className="font-medium text-neutral-700 dark:text-neutral-200">
            Voltio
          </span>{" "}
          — simuladores interactivos para los trabajos prácticos de{" "}
          <span className="font-medium">Electrotécnica I</span> de la UTN –
          FRBA.
        </p>
        <p>
          TP N°1: Resonancia · Cátedra Ing. Carlos Cremaschi · Ciclo lectivo
          2026.
        </p>
        <p className="text-xs">
          Herramienta de apoyo para el análisis de los ensayos. Los valores
          medidos son los registrados en el laboratorio.
        </p>
      </div>
    </footer>
  );
}
