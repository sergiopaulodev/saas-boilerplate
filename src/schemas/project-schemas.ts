import { z } from 'zod';

export const esquemaProyecto = z.object({
  nombre: z
    .string({ message: 'El nombre del proyecto es obligatorio.' })
    .min(3, { message: 'El nombre debe tener al menos 3 caracteres.' })
    .max(100, { message: 'El nombre no puede superar los 100 caracteres.' }),
  descripcion: z
    .string()
    .max(500, { message: 'La descripción no puede superar los 500 caracteres.' })
    .optional()
    .or(z.literal('')),
});

export type TipoEsquemaProyecto = z.infer<typeof esquemaProyecto>;