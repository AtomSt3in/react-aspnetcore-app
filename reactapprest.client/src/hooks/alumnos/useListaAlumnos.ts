import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import type { IAlumno } from '../../interfaces/IAlumno';
import { alumnoService } from '../../services/alumnoService';

export const useAlumnoList = () => {
  const [alumnos, setAlumnos] = useState<IAlumno[]>([]);
  const [loading, setLoading] = useState(true);

  const obtenerAlumnos = async () => {
    try {
      setLoading(true);
      const data = await alumnoService.obtenerTodos();
      setAlumnos(data);
    } catch (error) {
      Swal.fire("Error", "No se pudieron cargar los alumnos", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id: number, nombre: string) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `Estás por eliminar al alumno ${nombre}. Esta acción no se puede deshacer.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1e3a8a",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await alumnoService.eliminar(id);
        await obtenerAlumnos();
        Swal.fire(
          "¡Eliminado!",
          "El alumno ha sido eliminado correctamente.",
          "success"
        );
      } catch (error) {
        Swal.fire("Error", "No se pudo eliminar el alumno", "error");
      }
    }
  };

  useEffect(() => {
    obtenerAlumnos();
  }, []);

  const handleGenerarReporte = async () => {
  try {
    const blob = await alumnoService.generarReporte();

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "Reporte_Alumnos.pdf";
    a.click();

    URL.revokeObjectURL(url);
  } catch {
    Swal.fire("Error", "No se pudo generar el reporte", "error");
  }
};

  return {
    alumnos,
    loading,
    obtenerAlumnos,
    handleEliminar,
    handleGenerarReporte
  };
};