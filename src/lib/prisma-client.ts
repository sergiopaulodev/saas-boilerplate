import { PrismaClient } from '@prisma/client';

// Declaración del objeto global para preservar la instancia en desarrollo
const contenedorGlobalPrisma = globalThis as unknown as {
  instanciaGlobalPrismaClient: PrismaClient | undefined;
};

// Genera la instancia reutilizando la existente o creando una nueva
export const clientePrismaBaseDatos =
  contenedorGlobalPrisma.instanciaGlobalPrismaClient ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

// Asigna la instancia al contenedor global en entornos fuera de producción
if (process.env.NODE_ENV !== 'production') {
  contenedorGlobalPrisma.instanciaGlobalPrismaClient = clientePrismaBaseDatos;
}