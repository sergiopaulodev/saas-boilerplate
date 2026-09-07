'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Loader2 } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

import { esquemaProyecto, TipoEsquemaProyecto } from '@/schemas/project-schemas';
import { crearProyecto } from '@/actions/project-actions';

interface ModalProyectoProps {
  enExitoCreacion?: () => void;
}

export function ModalCrearProyecto({ enExitoCreacion }: ModalProyectoProps) {
  const [estaAbierto, setEstaAbierto] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TipoEsquemaProyecto>({
    resolver: zodResolver(esquemaProyecto),
    defaultValues: {
      nombre: '',
      descripcion: '',
    },
  });

  const alEnviarFormulario = async (datos: TipoEsquemaProyecto) => {
    setErrorGeneral(null);

    const respuesta = await crearProyecto(datos);

    if (!respuesta.exito) {
      setErrorGeneral(respuesta.mensaje);
      return;
    }

    // Limpiar formulario y cerrar modal
    reset();
    setEstaAbierto(false);

    if (enExitoCreacion) {
      enExitoCreacion();
    }
  };

  const alCambiarEstadoModal = (abierto: boolean) => {
    setEstaAbierto(abierto);
    if (!abierto) {
      reset();
      setErrorGeneral(null);
    }
  };

  return (
    <Dialog open={estaAbierto} onOpenChange={alCambiarEstadoModal}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Proyecto
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear Proyecto</DialogTitle>
          <DialogDescription>
            Completa los detalles a continuación para registrar un nuevo proyecto en la plataforma.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(alEnviarFormulario)} className="space-y-4 pt-2">
          {errorGeneral && (
            <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive font-medium">
              {errorGeneral}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre del Proyecto</Label>
            <Input
              id="nombre"
              placeholder="Ej. Sistema de Reservas"
              disabled={isSubmitting}
              {...register('nombre')}
            />
            {errors.nombre && (
              <p className="text-xs text-destructive">{errors.nombre.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción (Opcional)</Label>
            <Textarea
              id="descripcion"
              placeholder="Describe brevemente los objetivos del proyecto..."
              className="resize-none"
              rows={3}
              disabled={isSubmitting}
              {...register('descripcion')}
            />
            {errors.descripcion && (
              <p className="text-xs text-destructive">{errors.descripcion.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setEstaAbierto(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                'Crear Proyecto'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}