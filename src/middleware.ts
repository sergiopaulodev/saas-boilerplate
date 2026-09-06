import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const urlSupabasePublica = process.env.NEXT_PUBLIC_SUPABASE_URL;
const llaveAnonimaSupabasePublica = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function middleware(request: NextRequest) {
  let respuestaInicial = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  if (!urlSupabasePublica || !llaveAnonimaSupabasePublica) {
    return respuestaInicial;
  }

  const supabase = createServerClient(
    urlSupabasePublica,
    llaveAnonimaSupabasePublica,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesParaEstablecer) {
          cookiesParaEstablecer.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          respuestaInicial = NextResponse.next({
            request,
          });
          cookiesParaEstablecer.forEach(({ name, value, options }) =>
            respuestaInicial.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refrescar el token de sesión si ha expirado
  const {
    data: { user: usuarioAutenticado },
  } = await supabase.auth.getUser();

  const rutaActual = request.nextUrl.pathname;

  // Definición de grupos de rutas
  const esRutaAutenticacion =
    rutaActual.startsWith('/login') || rutaActual.startsWith('/registro');
  const esRutaProtegida =
    rutaActual.startsWith('/dashboard') || rutaActual.startsWith('/proyectos');

  // Redirecciones basadas en estado de sesión
  if (usuarioAutenticado && esRutaAutenticacion) {
    const urlRedireccion = request.nextUrl.clone();
    urlRedireccion.pathname = '/dashboard';
    return NextResponse.redirect(urlRedireccion);
  }

  if (!usuarioAutenticado && esRutaProtegida) {
    const urlRedireccion = request.nextUrl.clone();
    urlRedireccion.pathname = '/login';
    return NextResponse.redirect(urlRedireccion);
  }

  return respuestaInicial;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};