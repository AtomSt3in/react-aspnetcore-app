import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import type { IRegistro } from '../../interfaces/IUsuario';
import { authService } from '../../services/authService';

// Asegurar que todos los campos tengan valores por defecto
const initialRegistro: IRegistro = {
  CaUsuaTApP: '',
  CaUsuaTApM: '',
  CaUsuaTContraseña: '',
  CaUsuaTConfirmarContraseña: '',
  CaUsuaTNombre: '',
  CaUsuaTEmail: '',
};

export const useRegistro = () => {
  const [registro, setRegistro] = useState<IRegistro>(() => {
    // Asegurar que el estado inicial tenga todos los campos definidos
    return { ...initialRegistro };
  });
  
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setRegistro(prev => ({ 
      ...prev, 
      [name]: value || '' // Asegurar que nunca sea undefined
    }));
  };

  const validarFormulario = (): boolean => {
    const { CaUsuaTNombre, CaUsuaTEmail, CaUsuaTContraseña, CaUsuaTConfirmarContraseña } = registro;
    
    if (!CaUsuaTNombre?.trim()) {
      Swal.fire('Error', 'El nombre es obligatorio', 'warning');
      return false;
    }
    
    if (!CaUsuaTEmail?.trim()) {
      Swal.fire('Error', 'El email es obligatorio', 'warning');
      return false;
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(CaUsuaTEmail)) {
      Swal.fire('Error', 'El formato del email no es válido', 'warning');
      return false;
    }
    
    if (!CaUsuaTContraseña?.trim()) {
      Swal.fire('Error', 'La contraseña es obligatoria', 'warning');
      return false;
    }

    if (CaUsuaTContraseña.length < 6) {
      Swal.fire('Error', 'La contraseña debe tener al menos 6 caracteres', 'warning');
      return false;
    }

    if (CaUsuaTContraseña !== CaUsuaTConfirmarContraseña) {
      Swal.fire('Error', 'Las contraseñas no coinciden', 'warning');
      return false;
    }
    
    return true;
  };

  const registrarUsuario = async () => {
    if (!validarFormulario()) return;

    try {
      setLoading(true);
      console.log('Datos a enviar:', registro);
      
      const response = await authService.registrar(registro);
      
      Swal.fire({
        title: '¡Éxito!',
        text: response.mensaje,
        icon: 'success',
        confirmButtonColor: '#1e3a8a',
        background: '#f8fafc'
      });
      
      navigate('/login');
    } catch (error: any) {
      console.error('Error completo al registrar usuario:', error);
      Swal.fire('Error', error.message || 'No se pudo registrar el usuario', 'error');
    } finally {
      setLoading(false);
    }
  };

  const resetearFormulario = () => {
    setRegistro({ ...initialRegistro });
  };

  return {
    registro,
    loading,
    handleInputChange,
    registrarUsuario,
    resetearFormulario
  };
};