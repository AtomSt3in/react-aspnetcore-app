import { appsettings } from '../settings/appsettings';
import type { IGrado } from '../interfaces/IGrado';

export const gradoService = {
  //Obtener todos los grados
  async obtenerTodos(): Promise<IGrado[]> {
    const response = await fetch(`${appsettings.apiUrl}Grados/Obtener`);
    if (!response.ok) throw new Error('Error al obtener grados');
    return await response.json();
  },

  //Obtener un grado por ID
  async obtenerPorId(id: number): Promise<IGrado> {
    const response = await fetch(`${appsettings.apiUrl}Grados/Obtener/${id}`);
    if (!response.ok) throw new Error('Error al obtener grado');
    return await response.json();
  },

  //Crear un nuevo grado
  async crear(grado: Omit<IGrado, 'caGradoNId'>): Promise<Response> {
    const response = await fetch(`${appsettings.apiUrl}Grados/Nuevo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(grado),
    });
    if (!response.ok) throw new Error('Error al crear grado');
    return response;
  },

  //Editar un grado existente
  async editar(grado: IGrado): Promise<Response> {
    const response = await fetch(`${appsettings.apiUrl}Grados/Editar`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(grado),
    });
    if (!response.ok) throw new Error('Error al editar grado');
    return response;
  },

  //Eliminar un grado por ID
  async eliminar(id: number): Promise<void> {
    const response = await fetch(`${appsettings.apiUrl}Grados/Eliminar/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Error al eliminar grado');
  }
};