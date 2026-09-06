import Link from 'next/link';

export default function PaginaProhibida() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center dark:bg-slate-900">
      <div className="space-y-4">
        <h1 className="text-6xl font-extrabold text-indigo-600 dark:text-indigo-400">
          403
        </h1>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Acceso Denegado
        </h2>
        <p className="max-w-md text-sm text-slate-600 dark:text-slate-400">
          No tienes los permisos necesarios para acceder a este recurso o sección.
        </p>
        <div className="pt-4">
          <Link
            href="/dashboard"
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
          >
            Volver al Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}