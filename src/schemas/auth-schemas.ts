import { z } from 'zod';

export const esquemaInicioSesion = z.object({
  email: z
    .string({ message: 'El correo electrónico es requerido.' })
    .email({ message: 'Ingrese una dirección de correo electrónico válida.' }),
  password: z
    .string({ message: 'La contraseña es requerida.' })
    .min(6, { message: 'La contraseña debe tener al menos 6 caracteres.' }),
});

export const esquemaRegistro = z
  .object({
    nombreCompleto: z
      .string({ message: 'El nombre completo es requerido.' })
      .min(2, { message: 'El nombre debe tener al menos 2 caracteres.' }),
    email: z
      .string({ message: 'El correo electrónico es requerido.' })
      .email({ message: 'Ingrese una dirección de correo electrónico válida.' }),
    password: z
      .string({ message: 'La contraseña es requerida.' })
      .min(6, { message: 'La contraseña debe tener al menos 6 caracteres.' }),
    confirmarPassword: z
      .string({ message: 'Debe confirmar su contraseña.' }),
  })
  .refine((datos) => datos.password === datos.confirmarPassword, {
    message: 'Las contraseñas no coinciden.',
    path: ['confirmarPassword'],
  });

export type TipoInicioSesion = z.infer<typeof esquemaInicioSesion>;
export type TipoRegistro = z.infer<typeof esquemaRegistro>;