'use client';

import { useTransition } from 'react';
import { RolUsuarioEnum } from '@prisma/client';
import { Shield, ShieldAlert, Loader2, User } from 'lucide-react';
import { actualizarRolUsuario } from '@/actions/user-actions';

export interface UsuarioItem {
  idUsuario: string;
  nombreCompleto: string | null;
  correoElectronico: string;
  rolUsuario: RolUsuarioEnum;
  fechaCreacion: Date | string;
}

interface TablaUsuariosProps {
  usuarios: UsuarioItem[];
}

export function TablaUsuarios({ usuarios }: TablaUsuariosProps) {
  const [estaPendiente, iniciarTransicion] = useTransition();

  const cambiarRol = (idUsuario: string, rolActual: RolUsuarioEnum, nuevoRol: RolUsuarioEnum) => {
    if (rolActual === nuevoRol) return;

    iniciarTransicion(async () => {
      const resultado = await actualizarRolUsuario(idUsuario, nuevoRol);
      if (!resultado.exito) {
        alert(resultado.mensaje);
      }
    });
  };

  if (!usuarios || usuarios.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-800">
        <User className="h-12 w-12 text-slate-400 mb-3" />
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">
          No hay usuarios registrados
        </h3>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
            <tr>
              <th scope="col" className="px-6 py-3.5">Usuario</th>
              <th scope="col" className="px-6 py-3.5">Correo Electrónico</th>
              <th scope="col" className="px-6 py-3.5">Fecha Registro</th>
              <th scope="col" className="px-6 py-3.5">Rol Actual</th>
              <th scope="col" className="px-6 py-3.5 text-right">Cambiar Rol</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {usuarios.map((usuario) => (
              <tr 
                key={usuario.idUsuario}
                className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors"
              >
                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                  {usuario.nombreCompleto || <span className="italic text-slate-400">Sin nombre</span>}
                </td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                  {usuario.correoElectronico}
                </td>
                <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs">
                  {new Date(usuario.fechaCreacion).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                    usuario.rolUsuario === 'ADMINISTRADOR'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-400'
                      : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}>
                    {usuario.rolUsuario === 'ADMINISTRADOR' ? (
                      <Shield className="h-3.5 w-3.5" />
                    ) : (
                      <User className="h-3.5 w-3.5" />
                    )}
                    {usuario.rolUsuario}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <select
                    value={usuario.rolUsuario}
                    onChange={(e) => cambiarRol(usuario.idUsuario, usuario.rolUsuario, e.target.value as 'USUARIO' | 'ADMINISTRADOR')}
                    disabled={estaPendiente}
                    className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-sm focus:border-slate-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  >
                    <option value="USUARIO">USUARIO</option>
                    <option value="ADMINISTRADOR">ADMINISTRADOR</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}