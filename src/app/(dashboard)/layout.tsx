import { redirect } from 'next/navigation';
import { crearClienteSupabaseServidor } from '@/lib/supabase-server';
import { clientePrismaBaseDatos } from '@/lib/prisma-client';
import { AppSidebar } from '@/components/dashboard/app-sidebar';
import { AppNavbar } from '@/components/dashboard/app-navbar';

export default async function LayoutDashboard({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await crearClienteSupabaseServidor();

  const {
    data: { user: usuarioAutenticado },
  } = await supabase.auth.getUser();

  if (!usuarioAutenticado) {
    redirect('/login');
  }

  // Consultar datos del perfil en Prisma usando idUsuarioSupabase
  const perfil = await clientePrismaBaseDatos.perfilUsuario.findUnique({
    where: {
      idUsuarioSupabase: usuarioAutenticado.id,
    },
  });

  return (
    <div className="flex min-h-screen bg-slate-100 dark:bg-slate-900">
      <AppSidebar />
      <div className="flex flex-1 flex-col">
        <AppNavbar
          nombreUsuario={perfil?.nombreCompleto || usuarioAutenticado.email}
          emailUsuario={perfil?.correoElectronico || usuarioAutenticado.email}
        />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}