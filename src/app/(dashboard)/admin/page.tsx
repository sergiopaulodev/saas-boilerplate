import { redirect } from 'next/navigation';
import { obtenerUsuarios } from '@/actions/user-actions';
import { TablaUsuarios } from '@/components/admin/user-table';

export default async function PaginaAdmin() {
  const respuesta = await obtenerUsuarios();

  if (!respuesta.exito) {
    // Si no está autorizado o no es admin, se redirige a forbidden
    redirect('/forbidden');
  }

  const usuarios = respuesta.datos || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Panel de Administración
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Gestiona los permisos y roles de los usuarios registrados en la plataforma.
        </p>
      </div>

      <TablaUsuarios usuarios={usuarios} />
    </div>
  );
}