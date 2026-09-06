'use client';

import { useTransition } from 'react';
import { cerrarSesion } from '@/actions/auth-actions';

interface PropiedadesAppNavbar {
  nombreUsuario?: string;
  emailUsuario?: string;
}

export function AppNavbar({ nombreUsuario, emailUsuario }: PropiedadesAppNavbar) {
  const [estaPendiente, iniciarTransicion] = useTransition();

  const manejarCierreSesion = () => {
    iniciarTransicion(async () => {
      await cerrarSesion();
    });
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-6 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          SaaS Boilerplate
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right text-xs">
          <p className="font-medium text-slate-900 dark:text-white">
            {nombreUsuario || 'Usuario'}
          </p>
          <p className="text-slate-500 dark:text-slate-400">
            {emailUsuario || ''}
          </p>
        </div>

        <button
          onClick={manejarCierreSesion}
          disabled={estaPendiente}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          {estaPendiente ? 'Saliendo...' : 'Cerrar Sesión'}
        </button>
      </div>
    </header>
  );
}