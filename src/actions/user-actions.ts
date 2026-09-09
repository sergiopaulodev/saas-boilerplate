'use me'

'use server';

import { revalidatePath } from 'next/cache';
import { RolUsuarioEnum } from '@prisma/client';
import { clientePrismaBaseDatos } from '@/lib/prisma-client';
import { crearClienteSupabaseServidor } from '@/lib/supabase-server';

export interface RespuestaAccionUsuario {
  exito: boolean;
  mensaje: string;
  datos?: any;
}

/**
 * Verifica si el usuario actual tiene sesión activa y rol de ADMINISTRADOR.
 */
async function validarAdminActual() {
  const supabase = await crearClienteSupabaseServidor();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return { autorizado: false, error: 'No hay una sesión activa.' };
  }

  const perfil = await clientePrismaBaseDatos.perfilUsuario.findUnique({
    where: { idPerfilUsuario: user.id },
  });

  if (!perfil || perfil.rolUsuario !== 'ADMINISTRADOR') {
    return { autorizado: false, error: 'Acceso denegado: Se requieren permisos de Administrador.' };
  }

  return { autorizado: true, idAdminActual: user.id };
}

/**
 * Obtiene la lista completa de usuarios registrados.
 */
export async function obtenerUsuarios(): Promise<RespuestaAccionUsuario> {
  try {
    const validacion = await validarAdminActual();
    if (!validacion.autorizado) {
      return { exito: false, mensaje: validacion.error || 'No autorizado.' };
    }

    const usuarios = await clientePrismaBaseDatos.perfilUsuario.findMany({
      orderBy: { fechaCreacion: 'desc' },
      select: {
        idUsuario: true,
        nombreCompleto: true,
        correoElectronico: true,
        rolUsuario: true,
        fechaCreacion: true,
      },
    });

    return { exito: true, mensaje: 'Usuarios obtenidos con éxito.', datos: usuarios };
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return { exito: false, mensaje: 'Error interno al consultar la lista de usuarios.' };
  }
}

/**
 * Actualiza el rol de un usuario específico.
 */
export async function actualizarRolUsuario(
  idUsuarioObjetivo: string,
  nuevoRol: RolUsuarioEnum
): Promise<RespuestaAccionUsuario> {
  try {
    const validacion = await validarAdminActual();
    if (!validacion.autorizado) {
      return { exito: false, mensaje: validacion.error || 'No autorizado.' };
    }

    // Regla de seguridad: Un admin no puede quitarse su propio rol de administrador
    if (idUsuarioObjetivo === validacion.idAdminActual && nuevoRol !== 'ADMINISTRADOR') {
      return {
        exito: false,
        mensaje: 'No puedes revocar tu propio rol de Administrador.',
      };
    }

    await clientePrismaBaseDatos.perfilUsuario.update({
      where: { idPerfilUsuario: idUsuarioObjetivo },
      data: { rolUsuario: nuevoRol },
    });

    revalidatePath('/admin');
    return { exito: true, mensaje: 'Rol actualizado exitosamente.' };
  } catch (error) {
    console.error('Error al actualizar el rol:', error);
    return { exito: false, mensaje: 'Error al cambiar el rol del usuario.' };
  }
}