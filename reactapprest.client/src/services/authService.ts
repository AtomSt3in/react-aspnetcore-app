/* eslint-disable @typescript-eslint/no-explicit-any */
import { appsettings } from "../settings/appsettings";
import type { ILogin, IRegistro, IUsuario } from "../interfaces/IUsuario";

export const authService = {
  async login(credenciales: ILogin): Promise<{ mensaje: string; usuario: IUsuario }> {
    const response = await fetch(`${appsettings.apiUrl}Acceso/Login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      body: JSON.stringify(credenciales),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ mensaje: 'Error desconocido' }));
      throw new Error(errorData.mensaje || `Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  },

  async registrar(usuario: IRegistro): Promise<{ mensaje: string }> {
    const response = await fetch(`${appsettings.apiUrl}Acceso/Registrar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      body: JSON.stringify(usuario),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ mensaje: 'Error desconocido' }));
      throw new Error(errorData.mensaje || `Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  },

  async logout(): Promise<{ mensaje: string }> {
    const response = await fetch(`${appsettings.apiUrl}Acceso/Logout`, {
      method: "POST",
      credentials: 'include',
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ mensaje: 'Error desconocido' }));
      throw new Error(errorData.mensaje || `Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  },

  async usuarioActual(): Promise<any> {
    const response = await fetch(`${appsettings.apiUrl}Acceso/UsuarioActual`, {
      credentials: 'include',
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ mensaje: 'Error desconocido' }));
      throw new Error(errorData.mensaje || `Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  },

  async verificarAutenticacion(): Promise<{ autenticado: boolean }> {
    const response = await fetch(`${appsettings.apiUrl}Acceso/VerificarAutenticacion`, {
      credentials: 'include',
    });
    
    
    return await response.json();
  }
};