# SaaS Boilerplate - Núcleo de Aplicación y Gestión de Usuarios

Boilerplate modular para aplicaciones SaaS desarrollado con **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **Shadcn UI**, **Supabase Auth** y **Prisma ORM**.

---

## 🛠️ Stack Tecnológico

- **Framework:** Next.js (App Router)
- **Lenguaje:** TypeScript (Strict Mode)
- **Estilos:** Tailwind CSS v4 + PostCSS
- **Componentes UI:** Shadcn UI (Radix UI + Lucide React)
- **Base de Datos & Auth:** Supabase + PostgreSQL
- **ORM:** Prisma v6
- **Validación:** Zod + React Hook Form

---

## 📋 Requisitos de Entorno

Asegúrate de tener instalado en tu equipo local:
- **Node.js**: v18.17.0 o superior
- **npm**: v9.0.0 o superior
- **Git**
- Una cuenta en [Supabase](https://supabase.com/) para obtener la base de datos PostgreSQL y las llaves de autenticación.

---

## 🚀 Instalación y Configuración Local

### 1. Clonar el repositorio
```Bash
git clone [https://github.com/sergiopaulodev/saas-boilerplate.git](https://github.com/sergiopaulodev/saas-boilerplate.git)
cd saas-boilerplate
```
2. Instalar dependencias
```Bash
npm install
```

3. Configurar variables de entorno
Copia la plantilla de variables de entorno y completa los valores correspondientes en .env:

```Bash
cp .env.example .env
Configura en tu .env:

Fragmento de código
NEXT_PUBLIC_SUPABASE_URL="[https://tu-proyecto.supabase.co](https://tu-proyecto.supabase.co)"
NEXT_PUBLIC_SUPABASE_ANON_KEY="tu-llave-anonima-publica"
DATABASE_URL="postgresql://usuario:contrasena@host:6543/nombre_base_datos?schema=public&pgbouncer=true"
DIRECT_URL="postgresql://postgres.id:contrasena@host:5432/postgres?schema=public"
```

4. Generar cliente y sincronizar la base de datos con Prisma
```Bash
npx prisma generate
npx prisma migrate dev
```
5. Iniciar el servidor de desarrollo
```Bash
npm run dev
```
Abre http://localhost:3000 en tu navegador para ver la aplicación.

## Arquitectura y Estado Actual
El proyecto está diseñado sobre Next.js App Router aplicando principios de Clean Code, desarrollo atómico y arquitecturas basadas en capas:

#### Capa de Datos (`src/lib/`):

- Instancia Singleton de Prisma Client (`prisma-client.ts`).

- Cliente Supabase optimizado para Client Components (`supabase-client.ts`).

- Cliente Supabase para Server Components y Server Actions con gestión de cookies (`supabase-server.ts`).

- Helper auxiliar de estilos `cn` fusionando `clsx` y `tailwind-merge` (`utils.ts`).

#### Base de datos(`prisma/`):
- Esquema relacional con entidades `PerfilUsuario` y `Proyecto`.

- Sistema de migraciones controlado (`prisma/migrations/`).

- Soporte dual para Transaction Pooler (`DATABASE_URL`) y Conexión Directa en Supabase (`DIRECT_URL`).

#### Autenticación y lógica de negocio (`src/actions/`, `src/schemas/`, `src/middleware.ts`)
- **Módulo de Autenticación**: Esquemas Zod (`auth-schemas.ts`) y Server Actions (`auth-actions.ts`) sincronizando Supabase Auth con el perfil en Prisma.

- **Módulo de Administración**: Server Actions (`user-actions.ts`) para consulta de usuarios y actualización de roles (`RolUsuarioEnum`) con protección contra autorevocación.

- **Módulo de Proyectos**: Esquema Zod con contratos de validación (`project-schemas.ts`) y Server Actions para operaciones CRUD de lectura, creación y eliminación (`project-actions.ts`).

- **Middleware Global**: Refresco automático de tokens de sesión y protección de rutas autenticadas/públicas (`src/middleware.ts`).

#### Vistas, Componentes e Interfaz (`src/app/`, `src/components/`)

- **Layout Raíz Global** (`src/app/layout.tsx`): Estructura HTML global con carga de estilos Tailwind CSS v4 (`globals.css`).

- **Módulo de Autenticación**: páginas de inicio de sesión (`/login`) y registro (`/registro`) con manejo de estados de carga y validación.

- **Módulo de Administración (`/admin`)**: Vista protegida para administradores y tabla interactiva (`user-table.tsx`) con actualización reactiva de roles mediante `useTransition`.

- **Scaffolding de Dashboard** (`src/app/(dashboard)/`): Layout protegido (`layout.tsx`), barra superior de usuario (`AppNavbar`), barra de navegación lateral (`AppSidebar`), pantalla de acceso denegado (`src/app/forbidden.tsx`) y vista principal con resumen del usuario (`/dashboard`).

- **Módulo de Proyectos UI (`/proyectos`)**: Interfaz funcional construida con componentes atómicos de Shadcn UI (`button`, `dialog`, `input`, `textarea`, `label`), tabla de proyectos con confirmación de borrado (`project-table.tsx`) y modal de creación (`project-modal.tsx`).

#### Control de Versiones: 
- Commits atómicos guiados por el estándar Conventional Commits.