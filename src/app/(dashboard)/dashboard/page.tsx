import { crearClienteSupabaseServidor } from '@/lib/supabase-server';
import { clientePrismaBaseDatos } from '@/lib/prisma-client';

export default async function PaginaDashboard() {
  const supabase = await crearClienteSupabaseServidor();

  const {
    data: { user: usuarioAutenticado },
  } = await supabase.auth.getUser();

  const perfil = await clientePrismaBaseDatos.perfilUsuario.findUnique({
    where: {
      idUsuarioSupabase: usuarioAutenticado?.id,
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Bienvenido, {perfil?.nombreCompleto || 'Usuario'}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Resumen general de tu cuenta y estado de la plataforma.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Estado de Perfil
          </h3>
          <p className="mt-2 text-xl font-bold text-slate-900 dark:text-white">
            {perfil?.rolUsuario || 'USUARIO_ESTANDAR'}
          </p>
          <span className="mt-1 inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            Activo
          </span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Correo Registrado
          </h3>
          <p className="mt-2 text-base font-semibold text-slate-900 dark:text-white truncate">
            {perfil?.correoElectronico || usuarioAutenticado?.email}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Identificador Único
          </h3>
          <p className="mt-2 text-xs font-mono text-slate-600 dark:text-slate-400 truncate">
            {perfil?.idPerfilUsuario || 'Cargando...'}
          </p>
        </div>
      </div>
    </div>
  );
}