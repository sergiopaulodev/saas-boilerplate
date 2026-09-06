'use server';

import { revalidatePath } from 'next/cache';
import { crearClienteSupabaseServidor } from '@/lib/supabase-server';
import { clientePrismaBaseDatos } from '@/lib/prisma-client';
import { esquemaProyecto, TipoEsquemaProyecto } from '@/schemas/project-schemas';

export interface RespuestaAccionProyecto {
  exito: boolean;
  mensaje: string;
  erroresCampos?: Record<string, string[]>;
}

/**
 * Obtener todos los proyectos pertenecientes al usuario autenticado.
 */
export async function obtenerProyectosUsuario() {
  try {
    const supabase = await crearClienteSupabaseServidor();
    const {
      data: { user: usuarioAutenticado },
    } = await supabase.auth.getUser();

    if (!usuarioAutenticado) {
      return { exito: false, mensaje: 'Usuario no autenticado', datos: [] };
    }

    const perfil = await clientePrismaBaseDatos.perfilUsuario.findUnique({
      where: { idUsuarioSupabase: usuarioAutenticado.id },
    });

    if (!perfil) {
      return { exito: false, mensaje: 'Perfil no encontrado', datos: [] };
    }

    const proyectos = await clientePrismaBaseDatos.proyecto.findMany({
      where: { idPerfilUsuario: perfil.idPerfilUsuario },
      orderBy: { fechaCreacion: 'desc' },
    });

    return { exito: true, datos: proyectos };
  } catch (error) {
    console.error('Error al obtener proyectos:', error);
    return { exito: false, mensaje: 'Ocurrió un error al obtener la lista de proyectos.', datos: [] };
  }
}

/**
 * Crear un nuevo proyecto vinculado al perfil del usuario actual.
 */
export async function crearProyecto(
  datosFormulario: TipoEsquemaProyecto
): Promise<RespuestaAccionProyecto> {
  const validacion = esquemaProyecto.safeParse(datosFormulario);

  if (!validacion.success) {
    return {
      exito: false,
      mensaje: 'Errores en los datos ingresados.',
      erroresCampos: validacion.error.flatten().fieldErrors,
    };
  }

  try {
    const supabase = await crearClienteSupabaseServidor();
    const {
      data: { user: usuarioAutenticado },
    } = await supabase.auth.getUser();

    if (!usuarioAutenticado) {
      return { exito: false, mensaje: 'Sesión no válida o expirada.' };
    }

    const perfil = await clientePrismaBaseDatos.perfilUsuario.findUnique({
      where: { idUsuarioSupabase: usuarioAutenticado.id },
    });

    if (!perfil) {
      return { exito: false, mensaje: 'Perfil de usuario no existente.' };
    }

    await clientePrismaBaseDatos.proyecto.create({
      data: {
        tituloProyecto: validacion.data.nombre,
        descripcionProyecto: validacion.data.descripcion || null,
        idPerfilUsuario: perfil.idPerfilUsuario,
      },
    });

    revalidatePath('/proyectos');
    return { exito: true, mensaje: 'Proyecto creado exitosamente.' };
  } catch (error) {
    console.error('Error al crear proyecto:', error);
    return { exito: false, mensaje: 'No se pudo crear el proyecto en la base de datos.' };
  }
}

/**
 * Eliminar un proyecto existente verficando la autoría del usuario.
 */
export async function eliminarProyecto(idProyecto: string): Promise<RespuestaAccionProyecto> {
  try {
    const supabase = await crearClienteSupabaseServidor();
    const {
      data: { user: usuarioAutenticado },
    } = await supabase.auth.getUser();

    if (!usuarioAutenticado) {
      return { exito: false, mensaje: 'Sesión no válida o expirada.' };
    }

    const perfil = await clientePrismaBaseDatos.perfilUsuario.findUnique({
      where: { idUsuarioSupabase: usuarioAutenticado.id },
    });

    if (!perfil) {
      return { exito: false, mensaje: 'Perfil de usuario no existente.' };
    }

    // Verificar que el proyecto pertenezca al usuario antes de eliminar
    const proyectoExistente = await clientePrismaBaseDatos.proyecto.findFirst({
      where: {
        idProyecto,
        idPerfilUsuario: perfil.idPerfilUsuario,
      },
    });

    if (!proyectoExistente) {
      return { exito: false, mensaje: 'El proyecto no existe o no tienes permisos para eliminarlo.' };
    }

    await clientePrismaBaseDatos.proyecto.delete({
      where: { idProyecto },
    });

    revalidatePath('/proyectos');
    return { exito: true, mensaje: 'Proyecto eliminado correctamente.' };
  } catch (error) {
    console.error('Error al eliminar proyecto:', error);
    return { exito: false, mensaje: 'Error al procesar la eliminación del proyecto.' };
  }
}