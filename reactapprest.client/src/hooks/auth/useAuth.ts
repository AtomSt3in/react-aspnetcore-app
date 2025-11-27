import { useState, useEffect } from 'react';
import { authService } from '../../services/authService';

export const useAuth = () => {
  const [usuario, setUsuario] = useState<any>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    verificarAutenticacion();
  }, []);

  const verificarAutenticacion = async () => {
    try {
      setCargando(true);
      const { autenticado } = await authService.verificarAutenticacion();
      
      if (autenticado) {
        const usuarioData = await authService.usuarioActual();
        setUsuario(usuarioData);
        // También guardar en localStorage para persistencia
        localStorage.setItem('usuario', JSON.stringify(usuarioData));
      } else {
        setUsuario(null);
        localStorage.removeItem('usuario');
      }
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      setUsuario(null);
      localStorage.removeItem('usuario');
    } finally {
      setCargando(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUsuario(null);
      localStorage.removeItem('usuario');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return {
    usuario,
    cargando,
    verificarAutenticacion,
    logout
  };
};