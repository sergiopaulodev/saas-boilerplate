import { createBrowserClient } from '@supabase/ssr';

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
 * Función encargada de instanciar el cliente de Supabase para el navegador.
 * 
 * @returns Instancia del cliente de Supabase optimizada para Client Components.
 */
export function crearClienteSupabaseNavegador() {
  return createBrowserClient(
    urlSupabasePublica!,
    llaveAnonimaSupabasePublica!
  );
}