'use client';

import { useTransition } from 'react';
import { Trash2, Loader2, FolderKanban } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { eliminarProyecto } from '@/actions/project-actions';

export interface ProyectoItem {
  idProyecto: string;
  tituloProyecto: string;
  descripcionProyecto: string | null;
  fechaCreacion: Date | string;
}

interface TablaProyectosProps {
  proyectos: ProyectoItem[];
  enCambioEstado?: () => void;
}

export function TablaProyectos({ proyectos, enCambioEstado }: TablaProyectosProps) {
  const [estaPendiente, iniciarTransicion] = useTransition();

  const manejarEliminacion = (idProyecto: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este proyecto? Esta acción no se puede deshacer.')) {
      return;
    }

    iniciarTransicion(async () => {
      const respuesta = await eliminarProyecto(idProyecto);
      if (respuesta.exito && enCambioEstado) {
        enCambioEstado();
      }
    });
  };

  if (!proyectos || proyectos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-800">
        <FolderKanban className="h-12 w-12 text-slate-400 dark:text-slate-600 mb-3" />
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">
          No tienes proyectos creados
        </h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-sm">
          Comienza creando tu primer proyecto haciendo clic en el botón de arriba.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
            <tr>
              <th scope="col" className="px-6 py-3.5">Título</th>
              <th scope="col" className="px-6 py-3.5">Descripción</th>
              <th scope="col" className="px-6 py-3.5">Fecha de Creación</th>
              <th scope="col" className="px-6 py-3.5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {proyectos.map((proyecto) => (
              <tr 
                key={proyecto.idProyecto}
                className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors"
              >
                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                  {proyecto.tituloProyecto}
                </td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-400 max-w-md truncate">
                  {proyecto.descripcionProyecto || <span className="italic text-slate-400">Sin descripción</span>}
                </td>
                <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs">
                  {new Date(proyecto.fechaCreacion).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })}
                </td>
                <td className="px-6 py-4 text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => manejarEliminacion(proyecto.idProyecto)}
                    disabled={estaPendiente}
                    className="text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50"
                    title="Eliminar proyecto"
                  >
                    {estaPendiente ? (
                      <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}