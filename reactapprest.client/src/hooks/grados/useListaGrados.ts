import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import type { IGrado } from '../../interfaces/IGrado';
import { gradoService } from '../../services/gradoService';

export const useGradoList = () => {
  const [grados, setGrados] = useState<IGrado[]>([]);
  const [loading, setLoading] = useState(true);

  const obtenerGrados = async () => {
    try {
      setLoading(true);
      const data = await gradoService.obtenerTodos();
      setGrados(data);
    } catch (error) {
      console.error('Error al cargar grados:', error);
      Swal.fire('Error', 'No se pudieron cargar los grados', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id: number, descripcion: string) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `Estás por eliminar el grado "${descripcion}". Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1e3a8a',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      try {
        await gradoService.eliminar(id);
        await obtenerGrados();
        Swal.fire(
          '¡Eliminado!',
          'El grado ha sido eliminado correctamente.',
          'success'
        );
      } catch (error) {
        console.error('Error al eliminar grado:', error);
        Swal.fire('Error', 'No se pudo eliminar el grado', 'error');
      }
    }
  };

  useEffect(() => {
    obtenerGrados();
  }, []);

  return {
    grados,
    loading,
    obtenerGrados,
    handleEliminar
  };
};