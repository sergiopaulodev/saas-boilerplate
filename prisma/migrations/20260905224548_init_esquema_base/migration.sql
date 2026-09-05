-- CreateEnum
CREATE TYPE "RolUsuarioEnum" AS ENUM ('USUARIO_ESTANDAR', 'ADMINISTRADOR');

-- CreateTable
CREATE TABLE "perfiles_usuarios" (
    "idPerfilUsuario" TEXT NOT NULL,
    "idUsuarioSupabase" TEXT NOT NULL,
    "correoElectronico" TEXT NOT NULL,
    "nombreCompleto" TEXT NOT NULL,
    "rolUsuario" "RolUsuarioEnum" NOT NULL DEFAULT 'USUARIO_ESTANDAR',
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "perfiles_usuarios_pkey" PRIMARY KEY ("idPerfilUsuario")
);

-- CreateTable
CREATE TABLE "proyectos" (
    "idProyecto" TEXT NOT NULL,
    "tituloProyecto" TEXT NOT NULL,
    "descripcionProyecto" TEXT,
    "estaActivo" BOOLEAN NOT NULL DEFAULT true,
    "idPerfilUsuario" TEXT NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "proyectos_pkey" PRIMARY KEY ("idProyecto")
);

-- CreateIndex
CREATE UNIQUE INDEX "perfiles_usuarios_idUsuarioSupabase_key" ON "perfiles_usuarios"("idUsuarioSupabase");

-- CreateIndex
CREATE UNIQUE INDEX "perfiles_usuarios_correoElectronico_key" ON "perfiles_usuarios"("correoElectronico");

-- AddForeignKey
ALTER TABLE "proyectos" ADD CONSTRAINT "proyectos_idPerfilUsuario_fkey" FOREIGN KEY ("idPerfilUsuario") REFERENCES "perfiles_usuarios"("idPerfilUsuario") ON DELETE CASCADE ON UPDATE CASCADE;
