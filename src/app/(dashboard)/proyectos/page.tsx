import { obtenerProyectosUsuario } from '@/actions/project-actions';
import { ModalCrearProyecto } from '@/components/projects/project-modal';
import { TablaProyectos } from '@/components/projects/project-table';

export default async function PaginaProyectos() {
  const resultado = await obtenerProyectosUsuario();
  const proyectos = resultado.datos || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Proyectos
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Gestiona y visualiza tus proyectos activos.
          </p>
        </div>

        <div>
          <ModalCrearProyecto />
        </div>
      </div>

      <TablaProyectos proyectos={proyectos} />
    </div>
  );
}