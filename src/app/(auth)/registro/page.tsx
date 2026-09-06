'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { registrarUsuario, type ResultadoAccionAuth } from '@/actions/auth-actions';

export default function PaginaRegistro() {
  const [estaPendiente, iniciarTransicion] = useTransition();
  const [resultado, setResultado] = useState<ResultadoAccionAuth | null>(null);

  const manejarEnvio = (datosFormulario: FormData) => {
    setResultado(null);
    const nombreCompleto = datosFormulario.get('nombreCompleto') as string;
    const email = datosFormulario.get('email') as string;
    const password = datosFormulario.get('password') as string;
    const confirmarPassword = datosFormulario.get('confirmarPassword') as string;

    iniciarTransicion(async () => {
      const respuesta = await registrarUsuario({
        nombreCompleto,
        email,
        password,
        confirmarPassword,
      });
      if (respuesta) {
        setResultado(respuesta);
      }
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-900">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-md dark:bg-slate-800">
        <div>
          <h2 className="mt-2 text-center text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Crear Cuenta
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
            Regístrate para comenzar a utilizar la plataforma
          </p>
        </div>

        {resultado?.mensaje && (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
            {resultado.mensaje}
          </div>
        )}

        <form action={manejarEnvio} className="mt-8 space-y-4">
          <div>
            <label
              htmlFor="nombreCompleto"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Nombre Completo
            </label>
            <input
              id="nombreCompleto"
              name="nombreCompleto"
              type="text"
              required
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white sm:text-sm"
              placeholder="Juan Pérez"
            />
            {resultado?.erroresCampos?.nombreCompleto && (
              <p className="mt-1 text-xs text-red-600">
                {resultado.erroresCampos.nombreCompleto[0]}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Correo Electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white sm:text-sm"
              placeholder="tu@ejemplo.com"
            />
            {resultado?.erroresCampos?.email && (
              <p className="mt-1 text-xs text-red-600">
                {resultado.erroresCampos.email[0]}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white sm:text-sm"
              placeholder="••••••••"
            />
            {resultado?.erroresCampos?.password && (
              <p className="mt-1 text-xs text-red-600">
                {resultado.erroresCampos.password[0]}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmarPassword"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Confirmar Contraseña
            </label>
            <input
              id="confirmarPassword"
              name="confirmarPassword"
              type="password"
              required
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white sm:text-sm"
              placeholder="••••••••"
            />
            {resultado?.erroresCampos?.confirmarPassword && (
              <p className="mt-1 text-xs text-red-600">
                {resultado.erroresCampos.confirmarPassword[0]}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={estaPendiente}
            className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {estaPendiente ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <div className="text-center text-sm">
          <span className="text-slate-600 dark:text-slate-400">
            ¿Ya tienes una cuenta?{' '}
          </span>
          <Link
            href="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
          >
            Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  );
}