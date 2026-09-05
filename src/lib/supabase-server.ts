import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Obtención de variables de entorno públicas
const urlSupabasePublica = process.env.NEXT_PUBLIC_SUPABASE_URL;
const llaveAnonimaSupabasePublica = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validación básica de presencia de variables de entorno requeridas
if (!urlSupabasePublica || !llaveAnonimaSupabasePublica) {
  throw new Error(
    'Error de configuración: Faltan las variables de entorno públicas de Supabase (NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY).'
  );
}

/**
 * Función encargada de instanciar el cliente de Supabase para el servidor.
 * 
 * @returns Instancia asíncrona del cliente de Supabase adaptada al manejo de cookies del App Router.
 */
export async function crearClienteSupabaseServidor() {
  const almacenCookies = await cookies();

  return createServerClient(
    urlSupabasePublica!,
    llaveAnonimaSupabasePublica!,
    {
      cookies: {
        getAll() {
          return almacenCookies.getAll();
        },
        setAll(cookiesParaEstablecer) {
          try {
            cookiesParaEstablecer.forEach(({ name: nombreCookie, value: valorCookie, options: opcionesCookie }) => {
              almacenCookies.set(nombreCookie, valorCookie, opcionesCookie);
            });
          } catch {
            // El método setAll puede ser invocado desde un Server Component donde las cookies son de solo lectura.
            // Se ignora el error si es llamado desde un contexto que no permite mutación directa.
          }
        },
      },
    }
  );
}