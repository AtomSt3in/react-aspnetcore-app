import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import type { ILogin } from '../../interfaces/IUsuario';
import { authService } from '../../services/authService';

const initialLogin: ILogin = {
  CaUsuaTEmail: '',
  CaUsuaTContraseña: '',
};

export const useLogin = () => {
  const [login, setLogin] = useState<ILogin>(() => {
    return { ...initialLogin };
  });
  
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setLogin(prev => ({ 
      ...prev, 
      [name]: value || '' // Asegurar que nunca sea undefined
    }));
  };

  const validarFormulario = (): boolean => {
    const { CaUsuaTEmail, CaUsuaTContraseña } = login;
    
    if (!CaUsuaTEmail?.trim()) {
      Swal.fire('Error', 'El email es obligatorio', 'warning');
      return false;
    }
    
    if (!CaUsuaTContraseña?.trim()) {
      Swal.fire('Error', 'La contraseña es obligatoria', 'warning');
      return false;
    }
    
    return true;
  };

  const iniciarSesion = async () => {
    if (!validarFormulario()) return;

    try {
      setLoading(true);
      const response = await authService.login(login);
      
      Swal.fire({
        title: '¡Éxito!',
        text: response.mensaje,
        icon: 'success',
        confirmButtonColor: '#1e3a8a',
        background: '#f8fafc'
      });
      
      // Guardar información del usuario en localStorage para estado global
      localStorage.setItem('usuario', JSON.stringify(response.usuario));
      
      navigate('/');
    } catch (error: any) {
      console.error('Error al iniciar sesión:', error);
      Swal.fire('Error', error.message || 'No se pudo iniciar sesión', 'error');
    } finally {
      setLoading(false);
    }
  };

  const resetearFormulario = () => {
    setLogin({ ...initialLogin });
  };

  return {
    login,
    loading,
    handleInputChange,
    iniciarSesion,
    resetearFormulario
  };
};