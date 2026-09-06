'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const enlacesNavegacion = [
  { nombre: 'Dashboard', ruta: '/dashboard' },
  { nombre: 'Proyectos', ruta: '/proyectos' },
];

export function AppSidebar() {
  const rutaActual = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
      <div className="flex h-16 items-center px-6 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
          Panel SaaS
        </h1>
      </div>

      <nav className="flex-1 space-y-1 px-4 py-4">
        {enlacesNavegacion.map((enlace) => {
          const estaActivo = rutaActual === enlace.ruta;
          return (
            <Link
              key={enlace.ruta}
              href={enlace.ruta}
              className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                estaActivo
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-700 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-900'
              }`}
            >
              {enlace.nombre}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}