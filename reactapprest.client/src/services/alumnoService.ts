/* eslint-disable @typescript-eslint/no-explicit-any */
import { appsettings } from "../settings/appsettings";
import type { IAlumno } from "../interfaces/IAlumno";

export const alumnoService = {
  //Obtener la lista de los alumnos
  async obtenerTodos(): Promise<IAlumno[]> {
    const response = await fetch(`${appsettings.apiUrl}Alumnos/Lista`);
    if (!response.ok) throw new Error("Error al obtener alumnos");
    const alumnos = await response.json();

    //Traer la descripcion del grado para cada alumno
    try {
      const gradosResponse = await fetch(`${appsettings.apiUrl}Grados/Obtener`);
      if (gradosResponse.ok) {
        const grados = await gradosResponse.json();

        return alumnos.map((alumno: IAlumno) => ({
          ...alumno,
          gradoDescripcion:
            grados.find((grado: any) => grado.caGradoNId === alumno.caGradNId)
              ?.caGradoTDescripcion || "Grado no encontrado",
        }));
      }
    } catch (error) {
      console.error("Error al cargar grados:", error);
    }

    return alumnos;
  },

  //Obtener un alumno por su ID
  async obtenerPorId(id: number): Promise<IAlumno> {
    const response = await fetch(`${appsettings.apiUrl}Alumnos/Obtener/${id}`);
    if (!response.ok) throw new Error("Error al obtener alumno");
    return await response.json();
  },

  //Crear un nuevo alumno
  async crear(alumno: IAlumno): Promise<Response> {
    const response = await fetch(`${appsettings.apiUrl}Alumnos/Nuevo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(alumno),
    });
    if (!response.ok) throw new Error("Error al crear alumno");
    return response;
  },

  //Editar un alumno
  async editar(alumno: IAlumno): Promise<Response> {
    const response = await fetch(`${appsettings.apiUrl}Alumnos/Editar`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(alumno),
    });
    if (!response.ok) throw new Error("Error al editar alumno");
    return response;
  },

  //Eliminar un alumno mediante su ID
  async eliminar(id: number): Promise<void> {
    const response = await fetch(
      `${appsettings.apiUrl}Alumnos/Eliminar/${id}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) throw new Error("Error al eliminar alumno");
  },

  //Crear múltiples alumnos en lote
  async crearMultiple(alumnos: IAlumno[]): Promise<Response> {
    const response = await fetch(`${appsettings.apiUrl}Alumnos/Bulk`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(alumnos),
    });
    if (!response.ok) throw new Error("Error al crear alumnos en lote");
    return response;
  },

  async generarReporte(): Promise<Blob> {
    const response = await fetch(`${appsettings.apiUrl}Alumnos/Reporte`, {
      method: "GET",
    });

    if (!response.ok) throw new Error("No se pudo generar el reporte");

    return await response.blob();
  },
};
