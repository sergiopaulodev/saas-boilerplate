'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { crearClienteSupabaseServidor } from '@/lib/supabase-server';
import { clientePrismaBaseDatos } from '@/lib/prisma-client';
import {
  esquemaInicioSesion,
  esquemaRegistro,
  type TipoInicioSesion,
  type TipoRegistro,
} from '@/schemas/auth-schemas';

export type ResultadoAccionAuth = {
  exito: boolean;
  mensaje?: string;
  erroresCampos?: Record<string, string[]>;
};

/**
 * Registra un nuevo usuario en Supabase Auth y crea su PerfilUsuario en Prisma.
 */
export async function registrarUsuario(
  datosFormulario: TipoRegistro
): Promise<ResultadoAccionAuth> {
  const validacion = esquemaRegistro.safeParse(datosFormulario);

  if (!validacion.success) {
    return {
      exito: false,
      erroresCampos: validacion.error.flatten().fieldErrors,
    };
  }

  const { email, password, nombreCompleto } = validacion.data;
  const supabase = await crearClienteSupabaseServidor();

  // 1. Registro en Supabase Auth
  const { data: respuestaAuth, error: errorAuth } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        nombre_completo: nombreCompleto,
      },
    },
  });

  if (errorAuth || !respuestaAuth.user) {
    return {
      exito: false,
      mensaje: errorAuth?.message || 'Ocurrió un error al registrar el usuario.',
    };
  }

  // 2. Sincronización e inserción en la base de datos vía Prisma
  try {
    await clientePrismaBaseDatos.perfilUsuario.create({
      data: {
        idUsuarioSupabase: respuestaAuth.user.id,
        correoElectronico: email,
        nombreCompleto,
      },
    });
  } catch (errorPrisma) {
    console.error('Error al crear perfil en Prisma:', errorPrisma);
    return {
      exito: false,
      mensaje: 'Usuario creado en Auth, pero fallo la creación del perfil.',
    };
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

/**
 * Inicia sesión con credenciales de email y contraseña.
 */
export async function iniciarSesion(
  datosFormulario: TipoInicioSesion
): Promise<ResultadoAccionAuth> {
  const validacion = esquemaInicioSesion.safeParse(datosFormulario);

  if (!validacion.success) {
    return {
      exito: false,
      erroresCampos: validacion.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validacion.data;
  const supabase = await crearClienteSupabaseServidor();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      exito: false,
      mensaje: 'Credenciales inválidas o correo no verificado.',
    };
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

/**
 * Cierra la sesión activa del usuario.
 */
export async function cerrarSesion(): Promise<void> {
  const supabase = await crearClienteSupabaseServidor();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/login');
}